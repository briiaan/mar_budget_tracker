import crypto from "crypto";

// NODE:CRYPTO SECURE USER ID WHEN USING IT TO ON SERVER
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export interface encryptedText {
  iv: string;
  hashed_user: string;
}

export const encrypt = async (text: string): Promise<encryptedText> => {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), hashed_user: encrypted.toString("hex") };
};

export const decrypt = async (text: encryptedText): Promise<string> => {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.hashed_user, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
