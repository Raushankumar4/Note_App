declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    JWT_SECRET: string;
    MONGO_URI: string;
    CLIENT_URL: string;
    JWT_EXPIRES: string;
    EMAIL_PASS: string;
    EMAIL_USER: string;
  }
}
