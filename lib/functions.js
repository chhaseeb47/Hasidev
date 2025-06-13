import fs from 'fs';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { fileTypeFromBuffer } from 'file-type';

export const downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
  const quoted = message.msg || message;
  const mime = quoted.mimetype || '';
  const messageType = quoted.mtype ? quoted.mtype.replace(/Message/gi, '') : mime.split('/')[0];
  const stream = await downloadContentFromMessage(quoted, messageType);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  const { ext } = await fileTypeFromBuffer(buffer);
  const trueFileName = attachExtension ? `${filename}.${ext}` : filename;
  await fs.promises.writeFile(trueFileName, buffer);
  return trueFileName;
};

export const downloadMediaMessage = async (message) => {
  const mime = (message.msg || message).mimetype || '';
  const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
  const stream = await downloadContentFromMessage(message, messageType);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
};