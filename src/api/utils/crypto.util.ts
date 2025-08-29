import CryptoJS from 'crypto-js';

// ✅ Use env variable (fallback for dev)
const SECRET_KEY: string = process.env.SECRET_KEY || 'Algo_&^%$#_algo';

/**
 * Encrypt plain text
 * @param data - string to encrypt
 * @returns encrypted string
 */
export const encryptData = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return encrypted;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
    throw new Error('Encryption failed: Unknown error');
  }
};

/**
 * Decrypt cipher text
 * @param cipherText - encrypted string
 * @returns decrypted plain string
 */
export const decryptData = (cipherText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Invalid cipher text or secret key');
    }

    return decrypted;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
    throw new Error('Decryption failed: Unknown error');
  }
};
