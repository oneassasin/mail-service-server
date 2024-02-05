import { Injectable } from '@nestjs/common';
import { EMailType } from '../entities/enums/mail-type.enum';
import { StrapiApiService } from '../strapi-api/strapi-api.service';
import { OrderEntity } from '../entities/db/order.entity';
import { EmailAccountStructure } from '../strapi-api/entities/structures/email-account.structure';
import { MailTypeEntity } from '../entities/db/mail-type.entity';
import { RandomUtil } from '../utils/random.util';
import { StrapiResponseStructure } from '../strapi-api/entities/structures/strapi-response.structure';
import * as moment from 'moment';
import { EOrderStatus } from '../entities/enums/order-status.enum';
import { In } from 'typeorm';
import { IncomingEmailEntity } from '../entities/db/incoming-email.entity';

@Injectable()
export class ApiService {
  constructor(private strapiApiService: StrapiApiService) {
  }

  async checkAvailableForMailType(mailType: EMailType, domain: string): Promise<boolean> {
    if (![EMailType.OUTLOOK, EMailType.ALL].includes(mailType)) {
      return false;
    }

    const mailProviderId = await this.getMailProviderForMailType(mailType);

    const totalCountOfAccounts = await this.strapiApiService.getEmailAccountsCount(mailProviderId);

    const totalCountOfOrdersForDomain = await OrderEntity.countBy({
      domain,
      status: In([EOrderStatus.Complete, EOrderStatus.Wait]),
    });

    return totalCountOfAccounts - totalCountOfOrdersForDomain > 0;
  }

  async getEmail(
    domain: string,
    mailType: EMailType,
  ): Promise<{
    id: number,
    address: string,
    password: string,
  }> {
    const isAvailable = await this.checkAvailableForMailType(mailType, domain);
    if (!isAvailable) {
      throw new Error('OUT_OF_STOCK');
    }

    const mailProviderId = await this.getMailProviderForMailType(mailType);
    const account = await this.findFreeAccountForDomain(mailProviderId, domain);

    const order = new OrderEntity();
    order.emailAccountId = account.id;
    order.domain = domain;
    order.endAt = moment().add(20, 'minutes').toDate();
    order.status = EOrderStatus.Wait;
    await order.save();

    return {
      id: order.id,
      address: account.attributes.address,
      password: account.attributes.password
    };
  }

  private async getMailProviderForMailType(mailType: EMailType): Promise<number | null> {
    const mailTypes = await MailTypeEntity.findBy({
      typeName: mailType,
    });

    if (mailTypes.length === 0) {
      throw new Error('SYSTEM_ERROR');
    }

    const allMailTypes: MailTypeEntity[] = [];
    for (const mailType of mailTypes) {
      allMailTypes.push(...await this.recursiveFindMailProviders(mailType));
    }

    if (allMailTypes.length === 0) {
      throw new Error('SYSTEM_ERROR');
    }

    return RandomUtil.getRandomItemFromArray(allMailTypes).emailProviderId;
  }

  private async findFreeAccountForDomain(
    mailProviderId: number,
    domain: string
  ): Promise<StrapiResponseStructure<EmailAccountStructure>> {
    const ordersRaw = await OrderEntity.getRepository().createQueryBuilder('order')
      .select('order.emailAccountId')
      .distinct(true)
      .where('domain = :domain', { domain })
      .getRawMany<{ order_emailAccountId: number }>();

    const ordersIds = ordersRaw.map(({ order_emailAccountId }) => order_emailAccountId);

    const freeAccounts =
      await this.strapiApiService.getEmailAccounts({ mailProviderId, notIn: ordersIds });

    return RandomUtil.getRandomItemFromArray(freeAccounts);
  }

  private async recursiveFindMailProviders(mailType: MailTypeEntity): Promise<MailTypeEntity[]> {
    if (mailType.emailProviderId) {
      return [mailType];
    }

    return await MailTypeEntity.findBy({ id: mailType.mailTypeId });
  }

  async getMessage(order: OrderEntity): Promise<IncomingEmailEntity> {
    return await IncomingEmailEntity.findOneBy({ orderId: order.id });
  }

  async cancelOrder(order: OrderEntity) {
    order.status = EOrderStatus.Canceled;
    await order.save();
  }

  async findOrderByEmail(email: string, domain: string): Promise<OrderEntity> {
    const addresses = await this.strapiApiService.getEmailAccounts({ address: email });

    if (addresses.length === 0) {
      throw new Error('NO_ACTIVATION');
    }

    const [address] = addresses;
    // TODO: Add using of user from session token
    return await OrderEntity.findOneBy({ emailAccountId: address.id, domain });
  }

  async getIncomeMail(id: string): Promise<IncomingEmailEntity> {
    return await IncomingEmailEntity.findOneBy({ id });
  }
}
