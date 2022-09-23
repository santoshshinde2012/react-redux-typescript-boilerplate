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

  // random salt length
  private static saltLength = 16;

  // digest: It is a digest algorithms of string type.
  private static digest = "SHA-256";

  // text encoder
  private static enc = new TextEncoder();

  // text decoder
  private static dec = new TextDecoder();

  /**
   *
   * @param u8
   * @returns
   */
  private static base64Encode(u8: Uint8Array): string {
    return btoa(String.fromCharCode.apply(undefined, [...u8]));
  }

  /**
   *
   * @param str
   * @returns
   */
  private static base64Decode(str: string): Uint8Array {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  }

  /**
   *
   * @param secretKey
   * @returns
   */
  private static getPasswordKey(secretKey: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      "raw",
      Crypto.enc.encode(secretKey),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
  }

  /**
   *
   * @param passwordKey
   * @param salt
   * @param iteration
   * @param digest
   * @param encryptionAlgorithm
   * @param keyUsage
   * @returns
   */
  private static deriveKey(
    passwordKey: CryptoKey,
    salt: Uint8Array,
    iteration: number,
    digest: string,
    encryptionAlgorithm: string,
    keyUsage: ["encrypt"] | ["decrypt"]
  ): Promise<CryptoKey> {
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: iteration,
        hash: digest,
      },
      passwordKey,
      {
        name: encryptionAlgorithm,
        length: 256,
      },
      false,
      keyUsage
    );
  }

  /**
   *
   * @param secretKey
   * @param data
   * @returns
   */
  public static async encrypt(
    secretKey: string,
    data: string
  ): Promise<string> {
    try {
      // generate random salt
      const salt = window.crypto.getRandomValues(
        new Uint8Array(Crypto.saltLength)
      );

      // How to transport IV ?
      // Generally the IV is prefixed to the ciphertext or calculated using some kind of nonce on both sides.
      const iv = window.crypto.getRandomValues(new Uint8Array(Crypto.ivLength));

      // create master key from secretKey
      // The method gives an asynchronous Password-Based Key Derivation
      // Create a password based key (PBKDF2) that will be used to derive the AES-GCM key used for encryption
      const passwordKey = await Crypto.getPasswordKey(secretKey);

      // to derive a secret key from a master key for encryption
      // Create an AES-GCM key using the PBKDF2 key and a randomized salt value.
      const aesKey = await Crypto.deriveKey(
        passwordKey,
        salt,
        Crypto.iteration,
        Crypto.digest,
        Crypto.encryptionAlgorithm,
        ["encrypt"]
      );

      // create a Cipher object, with the stated algorithm, key and initialization vector (iv).
      // @algorithm - AES 256 GCM Mode
      // @key
      // @iv
      // @options
      // Encrypt the input data using the AES-GCM key and a randomized initialization vector (iv).
      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: Crypto.encryptionAlgorithm,
          iv,
        },
        aesKey,
        Crypto.enc.encode(data)
      );

      // convert encrypted string to buffer
      const encryptedContentArr: Uint8Array = new Uint8Array(encryptedContent);

      // create buffer array with length [salt + iv + encryptedContentArr]
      const buff: Uint8Array = new Uint8Array(
        salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
      );

      // set salt at first postion
      buff.set(salt, 0);

      // set iv at second postion
      buff.set(iv, salt.byteLength);
      // set encrypted at third postion
      buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
      // encode the buffer array
      const base64Buff: string = Crypto.base64Encode(buff);

      // return encrypted string
      return base64Buff;
    } catch (error) {
      // if any expection occurs
      console.error(`Error - ${error}`);
      return "";
    }
  }

  /**
   *
   * @param secretKey
   * @param ciphertext
   * @returns
   */
  public static async decrypt(secretKey: string, ciphertext: string) {
    try {
      // Creates a new Buffer containing the given JavaScript string {str}
      const encryptedDataBuff = Crypto.base64Decode(ciphertext);

      // extract salt from encrypted data
      const salt = encryptedDataBuff.slice(0, Crypto.saltLength);

      // extract iv from encrypted data
      const iv = encryptedDataBuff.slice(
        Crypto.saltLength,
        Crypto.saltLength + Crypto.ivLength
      );

      // extract encrypted text from encrypted data
      const data = encryptedDataBuff.slice(Crypto.saltLength + Crypto.ivLength);

      // create master key from secretKey
      // The method gives an asynchronous Password-Based Key Derivation
      // Create a password based key (PBKDF2) that will be used to derive the AES-GCM key used for decryption.
      const passwordKey = await Crypto.getPasswordKey(secretKey);

      // to derive a secret key from a master key for decryption
      // Create an AES-GCM key using the PBKDF2 key and the salt from the ArrayBuffer.
      const aesKey = await Crypto.deriveKey(
        passwordKey,
        salt,
        Crypto.iteration,
        Crypto.digest,
        Crypto.encryptionAlgorithm,
        ["decrypt"]
      );

      // Return the buffer containing the value of cipher object.
      // Decrypt the input data using the AES-GCM key and the iv from the ArrayBuffer.
      const decryptedContent = await window.crypto.subtle.decrypt(
        {
          name: Crypto.encryptionAlgorithm,
          iv,
        },
        aesKey,
        data
      );

      // Returns the result of running encoding's decoder.
      return Crypto.dec.decode(decryptedContent);
    } catch (error) {
      // if any expection occurs
      console.error(`Error - ${error}`);
      return "";
    }
  }
}
