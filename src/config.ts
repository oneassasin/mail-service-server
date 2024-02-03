import * as process from 'process';

export interface IConfig {
  ENV: string;
  INSTANCE_TYPE: 'api' | 'email-worker';

  DB_URI: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;

  STRAPI_API_TOKEN: string;
  STRAPI_URL: string;
}

const config = {
  DEV: {
    ENV: 'DEV',
    INSTANCE_TYPE: process.env.INSTANCE_TYPE,
    DB_URI: 'postgres://postgres:postgres@localhost:5432/mail-service',
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    REDIS_PASSWORD: 'password',
    STRAPI_API_TOKEN: '98710f9f6f35b5fd09e4bc1570f553c089787a6303baef7a736c5a6fbfbf87051de7a4647d9a66269f3dea6246d37ee79cd272739308c5d6c078c35f9e57ce48b857c66a4a61384951e0224c8160f7e48ee2d381a9687a76bb5e7c1fbe00eacb2df3c36bcd3d85c3a29ed0d00e3b4f72afe25d359c4eb91172574648bc85c303',
  },
  PRODUCTION: {
    ENV: 'PRODUCTION',
    INSTANCE_TYPE: process.env.INSTANCE_TYPE,
    DB_URI: process.env.DB_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  },
  GLOBAL: {
    STRAPI_URL: 'https://strapi.moby-proxy.com',
  },
};

const mergedConfig = Object.assign(config[process.env.NODE_ENV || 'DEV'], config.GLOBAL);

export default mergedConfig as IConfig;
