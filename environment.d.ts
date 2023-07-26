declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGOUSERNAME: string;
      MONGOPASSWORD: number;
      MONGOURI: string;
    }
  }
}

export {};
