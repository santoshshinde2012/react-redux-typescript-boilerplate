import Crypto from "./crypto";
import Environment from "./environment";
import { isStringified } from "./helper";

export default class Storage {
  /**
   *
   * @param key
   * @returns
   */
  public static async getItem(key: string): Promise<string | null> {
    const item = window.localStorage.getItem(key) || "";
    const passkey = Environment.secretKey();
    return isStringified(
      Environment.applyEncryption() && passkey && item
        ? await Crypto.decrypt(passkey, item)
        : item
    );
  }

  /**
   *
   * @param key
   * @param value
   */
  public static async setItem(key: string, value: string): Promise<void> {
    const passkey = Environment.secretKey();
    if (Environment.applyEncryption() && passkey && value) {
      const item = await Crypto.encrypt(passkey, value);
      window.localStorage.setItem(key, item);
    } else {
      window.localStorage.setItem(key, value);
    }
  }

  /**
   *
   * @param key
   */
  public static removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }

  /**
   *
   * @param keys
   */
  public static removeItems(keys: string[]): void {
    for (const key of keys) Storage.removeItem(key);
  }
}
