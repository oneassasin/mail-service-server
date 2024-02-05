import * as process from 'process';

export interface IConfig {
  ENV: string;
  INSTANCE_TYPE: 'all' | 'api' | 'schedule' | 'mail-worker';

  DB_URI: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB: number;

  STRAPI_API_TOKEN: string;
  STRAPI_URL: string;
  APP_URL: string;
}

const config = {
  DEV: {
    ENV: 'DEV',
    INSTANCE_TYPE: process.env.INSTANCE_TYPE ?? 'all',
    DB_URI: 'postgres://postgres:postgres@localhost:5432/mail-service',
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    REDIS_PASSWORD: 'password',
    REDIS_DB: 0,
    STRAPI_API_TOKEN: '98710f9f6f35b5fd09e4bc1570f553c089787a6303baef7a736c5a6fbfbf87051de7a4647d9a66269f3dea6246d37ee79cd272739308c5d6c078c35f9e57ce48b857c66a4a61384951e0224c8160f7e48ee2d381a9687a76bb5e7c1fbe00eacb2df3c36bcd3d85c3a29ed0d00e3b4f72afe25d359c4eb91172574648bc85c303',
    APP_URL: 'http://localhost:3000/',
  },
  PRODUCTION: {
    ENV: 'PRODUCTION',
    INSTANCE_TYPE: process.env.INSTANCE_TYPE,
    DB_URI: process.env.DB_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    APP_URL: 'https://mail-service.moby-proxy.com/',
  },
  GLOBAL: {
    STRAPI_URL: 'https://strapi.moby-proxy.com/api',
  },
};

const mergedConfig = Object.assign(config[process.env.NODE_ENV || 'DEV'], config.GLOBAL);

export default mergedConfig as IConfig;
