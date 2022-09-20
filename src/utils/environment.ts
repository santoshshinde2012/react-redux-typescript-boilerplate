enum Environments {
  PRODUCTION = "production",
  DEV = "development",
  TEST = "test",
  QA = "qa",
  STAGING = "staging",
}

export default class Environment {
  public static getCurrentEnvironment(): string {
    return process.env.NODE_ENV || Environments.DEV;
  }

  public static isOffline(): boolean {
    const IS_OFFLINE = process.env.IS_OFFLINE || false;
    return JSON.parse(IS_OFFLINE.toString());
  }

  public static applyEncryption(): boolean {
    const IS_OFFLINE = process.env.APPLY_ENCRYPTION || false;
    return JSON.parse(IS_OFFLINE.toString());
  }

  public static secretKey(): string {
    return process.env.SECRET_KEY || "";
  }
}
