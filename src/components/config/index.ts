export interface DBConfig {
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number | string;
  DB_HOST: string;
}

export interface Configurations {
  DB: DBConfig;
}
