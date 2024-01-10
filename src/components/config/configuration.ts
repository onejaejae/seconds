import { Configurations } from '.';

export const configurations = (): Configurations => {
  return {
    DB: {
      DB_USER_NAME: process.env.DB_USER_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      DB_PORT: process.env.DB_PORT || 3306,
      DB_HOST: process.env.DB_HOST,
    },
  };
};
