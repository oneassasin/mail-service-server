import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../entities/db/order.entity';
import { StrapiApiService } from '../strapi-api/strapi-api.service';
import { FetchMessageObject, ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { IncomingEmailEntity } from '../entities/db/incoming-email.entity';

@Injectable()
export class MailOperationsService {
  private map = new Map<number, ImapFlow>();

  constructor(private strapiApiService: StrapiApiService) {
  }

  async checkMailsForOrder(order: OrderEntity): Promise<boolean> {
    const account = await this.strapiApiService.getEmailAccount(order.emailAccountId);

    let client: ImapFlow;
    if (this.map.has(order.id)) {
      client = this.map.get(order.id);
    } else {
      client = new ImapFlow({
        host: account.attributes.email_provider.data.attributes.imap_server,
        port: account.attributes.email_provider.data.attributes.imap_port,
        secure: true,
        auth: {
          user: account.attributes.address,
          pass: account.attributes.password,
        },
      });

      this.map.set(order.id, client);

      await client.connect();
    }

    for (const boxName of ['INBOX', 'Junk']) {
      const isReceived = await this.checkMailBox(client, boxName, order);
      if (isReceived) {
        return true;
      }
    }

    return false;
  }

  async releaseImapClient(order: OrderEntity) {
    const client: ImapFlow = this.map.get(order.id);
    await client.logout();
    this.map.delete(order.id);
  }

  private async checkMailBox(client: ImapFlow, boxName: string, order: OrderEntity): Promise<boolean> {
    const unseenIds = await this.listUnseen(client, boxName);

    let isReceivedFromDomain = false;

    for (const id of unseenIds) {
      const message = await this.getMailById(client, id);
      await this.setMailAsSeen(client, id);

      const parsedMessage = await simpleParser(message.source, { skipImageLinks: false });

      const address =
        parsedMessage.from.value.find(address => address.address.includes(order.domain));

      if (!address) {
        continue;
      }

      isReceivedFromDomain = true;

      const incomingEmail = new IncomingEmailEntity();
      incomingEmail.orderId = order.id;
      incomingEmail.subject = parsedMessage.subject;
      incomingEmail.from = parsedMessage.from.text;
      incomingEmail.html = parsedMessage.html as string;
      await incomingEmail.save()

      break;
    }

    return isReceivedFromDomain;
  }

  private async listUnseen(client: ImapFlow, boxName: string): Promise<number[]> {
    const lock = await client.getMailboxLock(boxName);

    try {
      return await client.search({ seen: false });
    } finally {
      lock.release();
    }
  }

  private async getMailById(client: ImapFlow, id: number): Promise<FetchMessageObject> {
    return await client.fetchOne(`${id}`, { source: true });
  }

  private async setMailAsSeen(client: ImapFlow, id: number) {
    await client.messageFlagsAdd(`${id}`, ['\\Seen']);
  }
}
