export default class Storage {
  /**
   *
   * @param key
   * @returns
   */
  public static async getItem(key: string): Promise<string | null> {
    const item = window.localStorage.getItem(key) || "";
    return item;
  }

  /**
   *
   * @param key
   * @param value
   */
  public static async setItem(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value);
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
