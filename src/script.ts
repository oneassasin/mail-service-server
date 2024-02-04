import { ImapFlow, MailboxObject } from 'imapflow';
import { simpleParser } from 'mailparser';
import * as fs from 'fs';

const EMAIL_ADDRESS = 'testteeeeestsakklajkdjakldjklasjdkas@outlook.com';
const EMAIL_PASSWORD = 'Big_Password1!';
const EMAIL_IMAP_SERVER = 'outlook.office365.com';
const EMAIL_IMAP_PORT = 993;

async function main() {
  const client = new ImapFlow({
    host: EMAIL_IMAP_SERVER,
    port: EMAIL_IMAP_PORT,
    secure: true,
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });

  await client.connect();

  const lock = await client.getMailboxLock('INBOX');
  try {
    const message = await client.fetchOne(`${(client.mailbox as MailboxObject)}`, { source: true });
    const parsedMessage = await simpleParser(message.source, { skipImageLinks: false });
    debugger;
  } finally {
    lock.release();
  }

  await client.logout();
}

main().catch(console.error);
