import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTokenGuard } from './api-token-guard.service';
import { ApiService } from './api.service';
import { GetEmailDtoStructure } from '../entities/structures/get-email-dto.structure';
import { EMailType } from '../entities/enums/mail-type.enum';
import { GetMessageDtoStructure } from '../entities/structures/get-message-dto.structure';
import { OrderEntity } from '../entities/db/order.entity';
import { EOrderStatus } from '../entities/enums/order-status.enum';
import config from '../config';
import { CancelMessageDtoStructure } from '../entities/structures/cancel-message-dto.structure';
import { GetFreshIdDtoStructure } from '../entities/structures/get-fresh-id-dto.structure';
import { GetBalanceDtoStructure } from '../entities/structures/get-balance-dto.structure';

@Controller()
@UseGuards(new ApiTokenGuard())
export class ApiController {
  constructor(private apiService: ApiService) {
  }

  @Get('user-balance')
  async getBalance(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true
    })) query: GetBalanceDtoStructure
  ): Promise<{ status: string, balance: number }> {
    // TODO: Use user session balance
    return {
      status: 'OK',
      balance: 1000,
    };
  }

  @Get('mailbox-get-email')
  async getEmail(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true
    })) query: GetEmailDtoStructure
  ): Promise<{ status: string, id: number, mail: string, password?: string }> {
    if (!query.$MAIL_TYPE) {
      query.$MAIL_TYPE = EMailType.ALL;
    }

    // TODO: Update when providers list was updated
    if (![EMailType.ALL, EMailType.OUTLOOK].includes(query.$MAIL_TYPE)) {
      throw new Error('SYSTEM_ERROR');
    }

    const {
      id,
      address,
      password
    } = await this.apiService.getEmail(query.$SITE, query.$MAIL_TYPE);

    return {
      status: 'OK',
      id,
      mail: address,
      ...(query.$PASSWORD === 1 ? { password } : {})
    };
  }

  @Get('mailbox-get-message')
  async getMessage(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true
    })) query: GetMessageDtoStructure
  ): Promise<{ status: string, value: string, fullmessage?: string }> {
    const order = await OrderEntity.findOneBy({
      id: query.$TASK_ID,
    });

    if (!order) {
      throw new Error('NO_ACTIVATION');
    }

    if (order.status === EOrderStatus.Canceled) {
      throw new Error('ACTIVATION_CANCELED');
    }

    const message = await this.apiService.getMessage(order);

    if (!message || order.status === EOrderStatus.Wait) {
      throw new Error('WAIT_LINK');
    }

    return {
      status: 'OK',
      value: `${config.APP_URL}mail/${message.id}`,
      ...(query.$FULL ? { fullmessage: message.html } : {})
    };
  }

  @Get('mailbox-cancel')
  async cancelMessage(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true
    })) query: CancelMessageDtoStructure,
  ): Promise<{ status: string }> {
    const order = await OrderEntity.findOneBy({
      id: query.$TASK_ID,
    });

    if (!order) {
      throw new Error('NO_ACTIVATION');
    }

    if (order.status === EOrderStatus.Canceled) {
      throw new Error('ACTIVATION_CANCELED');
    }

    await this.apiService.cancelOrder(order);

    return { status: 'OK' };
  }

  // TODO: Make REORDER when was be created Users storage
  // @Get('mailbox-reorder')
  // async reorderMail(
  //   @Query(new ValidationPipe({
  //     transform: true,
  //     transformOptions: { enableImplicitConversion: true },
  //     forbidNonWhitelisted: true
  //   })) query: ReorderEmailDtoStructure
  // ): Promise<{ status: string, id: number, mail: string, password?: string }> {
  // }

  @Get('mailbox-get-fresh-id')
  async getFreshId(
    @Query(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true
    })) query: GetFreshIdDtoStructure,
  ): Promise<{ status: string, id: number }> {
    const order = await this.apiService.findOrderByEmail(query.$EMAIL, query.$SITE);

    if (!order) {
      throw new Error('NO_ACTIVATION');
    }

    if (order.status === EOrderStatus.Canceled) {
      throw new Error('ACTIVATION_CANCELED');
    }

    return { status: 'OK', id: order.id };
  }
}
