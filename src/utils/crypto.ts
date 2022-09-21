export default class Crypto {
  // iterations: It must be a number and should be set as high as possible.
  // So, the more is the number of iterations, the more secure the derived key will be,
  // but in that case it takes greater amount of time to complete.
  // number of interation - the value of 2145 is randomly chosen
  private static iteration = 10;

  // algorithm - AES 256 GCM Mode
  private static encryptionAlgorithm = "AES-GCM";

  // random initialization vector length
  private static ivLength = 12;

  // Size of authentication tags
  // GCM is defined for the tag sizes 128, 120, 112, 104, or 96, 64 and 32.
  // Note that the security of GCM is strongly dependent on the tag size.
  // We should try and use a tag size of 64 bits at the very minimum, but in general a tag size of the full 128 bits should be preferred.
  private static tagLength = 128;

  // digest: It is a digest algorithms of string type.
  private static digest = "SHA-256";

  // input encoding
  private static inputEncoding = "utf8";

  /**
   *
   * @param u8
   * @returns
   */
  private static base64Encode(u8: Uint8Array): string {
    return btoa(Reflect.apply(String.fromCharCode, undefined, [...u8]));
  }

  /**
   *
   * @param str
   * @returns
   */
  private static base64Decode(str: string): Uint8Array {
    const input: string[] = [...atob(str)];
    return new Uint8Array(input.map((c) => c.charCodeAt(0)));
  }

  /**
   *
   * @param input
   * @returns
   */
  private static getUint8Array(input: string): Uint8Array {
    return new Uint8Array(new TextEncoder().encode(input));
  }

  /**
   * The method gives an asynchronous Password-Based Key Derivation
   *
   * @param secretKey
   * @param salt
   * @param iterations
   * @param keyLen
   * @param hash
   * @returns
   */
  private static async pbkdf2(
    secretKey: string,
    salt: string,
    iterations: number,
    keyLen: number,
    hash: string
  ): Promise<Uint8Array> {
    const key = await window.crypto.subtle.importKey(
      "raw",
      Crypto.getUint8Array(secretKey),
      {
        name: "PBKDF2",
      },
      false,
      ["deriveBits"]
    );

    /**
     *
     */
    const pbkdf2Params = {
      name: "PBKDF2",
      salt: Crypto.getUint8Array(salt),
      iterations,
      hash,
    };

    const buffer = await window.crypto.subtle.deriveBits(
      pbkdf2Params,
      key,
      keyLen * 8
    );

    return new Uint8Array(buffer);
  }

  /**
   *
   * @param secretKey
   * @param data
   * @returns
   */
  private static getIv(secretKey: string, data: string) {
    const random = window.crypto.getRandomValues(
      new Uint8Array(Crypto.ivLength)
    );
    const randomData = Crypto.base64Encode(random);
    return Crypto.pbkdf2(
      secretKey + randomData,
      data + Date.now().toString(),
      1,
      Crypto.ivLength,
      Crypto.digest
    );
  }

  /**
   *
   * @param secretKey
   * @returns
   */
  private static grindKey(secretKey: string) {
    return Crypto.pbkdf2(
      secretKey,
      secretKey + secretKey,
      Math.pow(2, Crypto.iteration),
      32,
      Crypto.digest
    );
  }

  /**
   *
   * @param secretKey
   * @param data
   * @returns
   */
  public static async encrypt(secretKey: string, data: string) {
    // get the password based derivation key
    const hashKey = await Crypto.grindKey(secretKey);

    // How to transport IV ?
    // Generally the IV is prefixed to the ciphertext or calculated using some kind of nonce on both sides.
    const iv = await Crypto.getIv(secretKey, data);

    const key = await window.crypto.subtle.importKey(
      "raw",
      hashKey,
      {
        name: Crypto.encryptionAlgorithm,
      },
      false,
      ["encrypt"]
    );
    const encodeData: Uint8Array = new TextEncoder().encode(data);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: Crypto.encryptionAlgorithm,
        iv,
        tagLength: Crypto.tagLength,
      },
      key,
      encodeData
    );

    const result = [...iv, ...new Uint8Array(encrypted)];

    return Crypto.base64Encode(new Uint8Array(result));
  }

  /**
   *
   * @param secretKey
   * @param ciphertext
   * @returns
   */
  public static async decrypt(secretKey: string, ciphertext: string) {
    const ciphertextBuffer = [...Crypto.base64Decode(ciphertext)];
    const hashKey = await Crypto.grindKey(secretKey);
    const key = await window.crypto.subtle.importKey(
      "raw",
      hashKey,
      {
        name: Crypto.encryptionAlgorithm,
      },
      false,
      ["decrypt"]
    );
    const iv: Uint8Array = new Uint8Array(
      ciphertextBuffer.slice(0, Crypto.ivLength)
    );
    const data: Uint8Array = new Uint8Array(
      ciphertextBuffer.slice(Crypto.ivLength)
    );
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: Crypto.encryptionAlgorithm,
        iv,
        tagLength: Crypto.tagLength,
      },
      key,
      data
    );

    return new TextDecoder(Crypto.inputEncoding).decode(
      new Uint8Array(decrypted)
    );
  }
}
