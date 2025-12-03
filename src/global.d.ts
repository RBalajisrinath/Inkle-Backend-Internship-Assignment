/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
    interface Process {
      env: ProcessEnv;
    }
  }
  
  var process: NodeJS.Process;
  var console: Console;
}

declare namespace Express {
  interface Request {
    user?: import('./types').AuthPayload;
  }
}

export {};