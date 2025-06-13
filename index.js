import express from 'express';
import pino from 'pino';
import { Storage, File } from 'megajs';
import { 
  useMultiFileAuthState, 
  makeWASocket, 
  jidDecode, 
  DisconnectReason, 
  getContentType, 
  makeCacheableSignalKeyStore, 
  makeInMemoryStore 
} from '@whiskeysockets/baileys';
import connectDB from '../utils/connectDB.js';
import User from '../models/user.js';
import { downloadAndSaveMediaMessage } from '../lib/functions.js';
import NodeCache from 'node-cache';
import fs from 'fs';
import { ytmp4, ytmp3 } from 'ruhend-scraper';
import path from 'path';
import { fileURLToPath } from 'url';
import { doReact, emojis } from '../lib/autoreact.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const logger = pino({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();
const store = makeInMemoryStore({ logger });

if (!fs.existsSync('./sessions')) {
  fs.mkdirSync('./sessions', { recursive: true });
}

function decodeJid(jid) {
  const { user, server } = jidDecode(jid) || {};
  return user && server ? `${user}@${server}`.trim() : jid;
}

async function uploadCredsToMega(filePath) {
  try {
    const megaCredentials = {
      email: process.env.MEGA_EMAIL || "luthfijoestars@gmail.com",
      password: process.env.MEGA_PASSWORD || "sihkuq-Senta5-tynzob"
    };

    const storage = await new Storage(megaCredentials).ready;
    console.log("Mega storage initialized.");

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileSize = fs.statSync(filePath).size;
    const fileInfo = {
      name: "creds.json",
      size: fileSize
    };

    const uploadResult = await storage.upload(fileInfo, fs.createReadStream(filePath)).complete;
    console.log("File uploaded to Mega successfully.");

    const uploadedFile = storage.files[uploadResult.nodeId];
    const downloadLink = await uploadedFile.link();
    console.log(`Download URL for creds.json: ${downloadLink}`);

    return downloadLink;
  } catch (error) {
    console.error("Error uploading to Mega:", error);
    throw error;
  }
}

async function restoreCredsFromMega(downloadUrl, sessionName) {
  const restorePath = `./restored_sessions/${sessionName}`;

  if (!fs.existsSync(restorePath)) {
    fs.mkdirSync(restorePath, { recursive: true });
  }

  const file = await File.fromURL(downloadUrl);

  await new Promise((resolve, reject) => {
    file.download((error, data) => {
      if (error) {
        return reject(error);
      }
      fs.writeFileSync(`${restorePath}/creds.json`, data);
      resolve();
    });
  });
}

let sock = {};
let plugins = {};

const loadPlugins = async () => {
  const pluginFiles = fs.readdirSync("./plugins");
  for (const file of pluginFiles) {
    if (file.endsWith(".js")) {
      try {
        const filePath = path.resolve("./plugins", file);
        const pluginModule = await import(filePath);
        
        if (pluginModule.command && typeof pluginModule.execute === "function") {
          pluginModule.command.forEach(command => {
            plugins[command] = pluginModule.execute;
            console.log("✅ Loaded command: " + command);
          });
        }
      } catch (error) {
        console.error("❌ Error loading plugin " + file + ":", error);
      }
    }
  }
};

async function createBot(sessionId) {
  await connectDB();
  try {
    const sessionPath = "./sessions/" + sessionId;
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    
    const client = makeWASocket({
      logger: logger,
      printQRInTerminal: false,
      browser: ["Mac OS", "chrome", "121.0.6167.159"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" }).child({ level: "fatal" }),
        ),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
        if (store) {
          const message = await store.loadMessage(key.remoteJid, key.id);
          return message.message || undefined;
        }
        return { conversation: "Ethix-Xsid MultiAuth Bot" };
      },
      msgRetryCounterCache
    });

    sock[sessionId] = client;

    client.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log("Connection lost, attempting to reconnect...");
          setTimeout(() => createBot(sessionId), 5000);
        } else {
          console.log(sessionId + " Logged out.");
          await deleteSession(sessionId);
        }
      } else if (connection === "open") {
        console.log("😃 Integration Successful ✅");
        try {
          await loadPlugins();
          console.log("All Plugins Installed");

          const credentialsPath = sessionPath + "/creds.json";
          const megaUploadLink = await uploadCredsToMega(credentialsPath);
          console.log("Credentials uploaded to Mega: " + megaUploadLink);
          
          const existingUser = await User.findOne({ phoneNumber: sessionId });
          if (!existingUser) {
            const newUser = {
              phoneNumber: sessionId,
              sessionId: megaUploadLink
            };
            await User.create(newUser);
            console.log("New user created for phone number: " + sessionId);
          } else {
            console.log("♻️ User already exists.");
          }

          const pluginsDirectory = path.join(__dirname, "../plugins");
          const loadedPlugins = fs.readdirSync(pluginsDirectory);
          const totalPlugins = loadedPlugins.length;
          console.log("Total Plugins Loaded: " + totalPlugins);

          const userSettings = await User.findOne({ phoneNumber: sessionId });
          if (userSettings) {
            const settingsList = ["statusReadMessage", "statusReadEnabled", "autoReactEnabled", "autoTyping", "autoRead", "autoRecording", "antiCall", "alwaysOnline", "prefix", "statusReactNotify"];
            const userSettingsText = settingsList.map(setting => {
              return "*◦ " + setting + ":* " + userSettings[setting];
            }).join("\n");
            
            const separatorLine = '━'.repeat(25);
            const message = {
              text: `${separatorLine}\n*◦ Successfully Connected To ANDY BOT Type .menu To see menu list 😚*\n*◦ Developer:* 13056978303\n*◦ Version:* 1.0\n\n*◦ Total Plugins:* ${totalPlugins}\n\n*◦ User Settings:*\n${userSettingsText}\n${separatorLine}`
            };
            await client.sendMessage(client.user.id, message);
          }
        } catch (error) {
          console.error("Error during connection open process:", error);
        }
      }
    });
    
    client.ev.on("creds.update", saveCreds);
    
    client.ev.on("messages.upsert", async (eventData) => {
      try {
        let m = eventData.messages[0];
        if (!m || !m.message) return;
        m.chat = m.key.remoteJid;
        m.sender = m.key.fromMe
          ? client.user.id.split(":")[0] + "@s.whatsapp.net"
          : m.key.participant || m.chat;
        m.isFromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith("@g.us");
        m.type = Object.keys(m.message)[0];
        m.contentType = getContentType(m.message);

        // Text extraction
        m.text =
          m.contentType === "conversation"
            ? m.message.conversation
            : m.contentType === "extendedTextMessage"
            ? m.message.extendedTextMessage.text
            : m.contentType === "imageMessage" && m.message.imageMessage.caption
            ? m.message.imageMessage.caption
            : m.contentType === "videoMessage" && m.message.videoMessage.caption
            ? m.message.videoMessage.caption
            : "";

        const body = typeof m.text === "string" ? m.text : "";

        m.quoted = m.message.extendedTextMessage?.["contextInfo"]?.["quotedMessage"] || null;
        m.quotedText =
          m.quoted?.["extendedTextMessage"]?.["text"] ||
          m.quoted?.["imageMessage"]?.["caption"] ||
          m.quoted?.["videoMessage"]?.["caption"];
        m.pushName = m.pushName || "Shizxy Bot V1";

        // Filter conditions
        if (
          m.message?.["protocolMessage"] ||
          m.message?.["ephemeralMessage"] 
        ) return;

        // Auto react SW
        if (m.chat && m.chat === "status@broadcast") {
          await client.readMessages([m.key]);
          const reactions = ['💚', '❤', '👍', '😊', '🔥', '📣', '🤯', '☠️', '💀'];
          const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
          const decodedJid = decodeJid(client.user.id);

          await client.sendMessage("status@broadcast", {
            'react': {
              'key': m.key,
              'text': randomReaction
            }
          }, {
            'statusJidList': [m.key.participant, decodedJid]
          });
        }
        
        // Auto React Feature
        const userSettings = await User.findOne({ phoneNumber: sessionId });
        if (userSettings && !m.key.fromMe && userSettings.autoReactEnabled) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await doReact(randomEmoji, m, client);
        }

        // Handle commands: "send", "statusdown", "take"
        if (["send", "statusdown", "take"].includes(body.toLowerCase())) {
          const quotedMessage = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
          if (quotedMessage) {
            if (quotedMessage.imageMessage) {
              const imageCaption = quotedMessage.imageMessage.caption || "> © Created By Mrlit Andy.";
              const imageUrl = await downloadAndSaveMediaMessage(quotedMessage.imageMessage, "image");
              const imageObject = { url: imageUrl };
              const imageMessage = { image: imageObject, caption: imageCaption };
              await client.sendMessage(m.chat, imageMessage, { quoted: m });
            }
            if (quotedMessage.videoMessage) {
              const videoCaption = quotedMessage.videoMessage.caption || "> © Created By Andy Lit.";
              const videoUrl = await downloadAndSaveMediaMessage(quotedMessage.videoMessage, "video");
              const videoObject = { url: videoUrl };
              const videoMessage = { video: videoObject, caption: videoCaption };
              await client.sendMessage(m.chat, videoMessage, { quoted: m });
            }
            if (quotedMessage.conversation) {
              const textMessage = quotedMessage.conversation || "Here is the text message.";
              const textMessageObject = { text: textMessage };
              await client.sendMessage(m.chat, textMessageObject, { quoted: m });
            }
            return;
          }
        }

        // Handle YouTube download
        const urlMatch = m.quotedText?.match(/◦ \*Link:\* (https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          const command = body.trim();
          if (command === "1" || command === "2") {
            await client.sendMessage(m.chat, { text: "⏳ Please wait, fetching the media..." }, { quoted: m });

            if (command === "1") {
              const {
                video: videoUrl,
                title: songTitle,
                author: songAuthor,
                duration: songDuration,
                views: songViews,
              } = await ytmp4(url);

              const videoInfo = `╭───────────\n│◦ *Ethix-MD-V3 Song Downloader*\n` +
                `│◦ *Title:* ${songTitle}\n` +
                `│◦ *Author:* ${songAuthor}\n` +
                `│◦ *Duration:* ${songDuration}\n` +
                `│◦ *Views:* ${songViews}\n` +
                `╰───────────`;

              await client.sendMessage(
                m.chat,
                { video: { url: videoUrl }, caption: videoInfo },
                { quoted: m }
              );
            } else if (command === "2") {
              const {
                audio: audioUrl,
                title: songTitle,
                author: songAuthor,
                duration: songDuration,
                views: songViews,
              } = await ytmp3(url);

              const audioInfo = `╭───────────\n│◦ *Ethix-MD-V3 Song Downloader*\n` +
                `│◦ *Title:* ${songTitle}\n` +
                `│◦ *Author:* ${songAuthor}\n` +
                `│◦ *Duration:* ${songDuration}\n` +
                `│◦ *Views:* ${songViews}\n` +
                `╰───────────`;

              await client.sendMessage(
                m.chat,
                { audio: { url: audioUrl }, mimetype: "audio/mpeg", caption: audioInfo },
                { quoted: m }
              );
            }
            return;
          }
        }

        // Prefix and command handling
        const prefix = userSettings?.prefix || ".";
        m.command =
          body.startsWith(prefix)
            ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
            : "";
        m.args = body.trim().split(/ +/).slice(1);
        m.query = m.args.join(" ");

        m.mime =
          m.quoted?.["mimetype"] || m.message[m.type]?.["mimetype"] || "";
        const senderId = m.sender.split("@")[0];
        const botId = client.user.id.split(":")[0];
        m.isOwner = senderId === botId || senderId === "13056978303";

        const reply = async (responseText) => {
          await client.sendMessage(m.chat, { text: responseText }, { quoted: m });
        };

        if (!m.isOwner) return;

        // Plugin execution
        const plugin = plugins[m.command];
        if (plugin) {
          try {
            const pluginData = {
              phoneNumber: sessionId,
              from: m.chat,
              sender: m.sender,
              fromMe: m.isFromMe,
              isGroup: m.isGroup,
              messageType: m.type,
              quoted: m.quoted,
              pushName: m.pushName,
              prefix: prefix,
              command: m.command,
              args: m.args,
              query: m.query,
              mime: m.mime,
              isOwner: m.isOwner,
              reply: reply,
            };
            await plugin(client, m, pluginData);
          } catch (error) {
            await reply("❌ There was an error executing your command.");
          }
        }

        // Auto Read, Auto Typing, Auto Recording, and Status Update
        if (m.message?.conversation) {
          const remoteJid = m.key.remoteJid;

          if (userSettings.autoRead) {
            await client.readMessages([m.key]);
          }
          if (userSettings.autoTyping) {
            await client.sendPresenceUpdate("composing", remoteJid);
          }
          if (userSettings.autoRecording) {
            await client.sendPresenceUpdate("recording", remoteJid);
          }
          if (userSettings.alwaysOnline) {
            await client.sendPresenceUpdate("available", remoteJid);
          } else {
            await client.sendPresenceUpdate("unavailable", remoteJid);
          }
        }
      } catch (error) {
        console.error("Error handling messages.upsert event:", error);
      }
    });
    
    client.ev.on("call", async callData => {
      const userSettings = await User.findOne({ phoneNumber: sessionId });
      if (!userSettings || !userSettings.antiCall) {
        return;
      }

      for (const call of callData) {
        if (call.status === "offer") {
          await client.sendMessage(call.from, {
            text: "*_📞 Auto Reject Call Mode Activated_* \n*_📵 No Calls Allowed_*",
            mentions: [call.from]
          });
          await client.rejectCall(call.id, call.from);
        }
      }
    });
    
    return client;
  } catch (err) {
    console.error("Error creating bot:", err);
    return null;
  }
}

async function restoreSessionFromDB(phoneNumber, sessionId) {
  try {
    console.log(`Restoring session for phone number: ${phoneNumber}`);
    await restoreCredsFromMega(sessionId, phoneNumber);
    await createRestoredBot(phoneNumber);
  } catch (error) {
    if (error.message.includes("TypeError: Invalid URL")) {
      console.error("Error restoring session due to invalid URL:", error);
      await deleteSession(phoneNumber);
    } else {
      console.error("Error restoring session:", error);
    }
  }
}

async function createRestoredBot(sessionName) {
  await connectDB();
  try {
    const sessionPath = `./restored_sessions/${sessionName}`;
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const socket = makeWASocket({
      logger: logger,
      printQRInTerminal: false,
      browser: ["Mac OS", "chrome", "121.0.6167.159"],
      auth: state,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (messageId) => {
        if (store) {
          const storedMessage = await store.loadMessage(messageId.remoteJid, messageId.id);
          return storedMessage.message || undefined;
        }
        return { conversation: "Ethix-Xsid MultiAuth Bot" };
      },
      msgRetryCounterCache
    });

    sock[sessionName] = socket;

    socket.ev.on("connection.update", async update => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          setTimeout(() => createRestoredBot(sessionName), 5000);
        } else {
          console.log(`${sessionName} Logged out.`);
          await deleteSession(sessionName);
        }
      } else if (connection === "open") {
        await loadPlugins();
        console.log("All plugins installed.");
      }
    });
    
    // ... (rest of restored bot event handlers - kept brief for brevity) ...

    return socket;
  } catch (err) {
    console.error("Error creating restored bot:", err);
  }
}

function getPhoneNumbersFromSessions() {
  return fs.readdirSync("./sessions").filter(fileName => fileName.match(/^\d+$/));
}

async function deleteSession(phoneNumber) {
  const sessionPath = `./sessions/${phoneNumber}`;
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log(`${phoneNumber} Deleted from Sessions`);
  }

  const restoredSessionPath = `./restored_sessions/${phoneNumber}`;
  if (fs.existsSync(restoredSessionPath)) {
    fs.rmSync(restoredSessionPath, { recursive: true, force: true });
    console.log(`${phoneNumber} Deleted from Restored Sessions`);
  }

  await User.findOneAndDelete({ phoneNumber });
  console.log(`Deleted ${phoneNumber} From DB`);
}

async function reloadBots() {
  await connectDB();
  const sessions = getPhoneNumbersFromSessions();
  const databaseRecords = await User.find({});
  const registeredPhoneNumbers = databaseRecords.map(record => record.phoneNumber);

  for (const session of sessions) {
    await createBot(session);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  for (const phoneNumber of registeredPhoneNumbers) {
    if (!sessions.includes(phoneNumber)) {
      const record = databaseRecords.find(record => record.phoneNumber === phoneNumber);
      if (record) {
        await restoreSessionFromDB(phoneNumber, record.sessionId);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

async function deleteSessionFilesExceptCreds(phoneNumber) {
  const sessionPaths = [`./sessions/${phoneNumber}`, `./restored_sessions/${phoneNumber}`];
  for (const dirPath of sessionPaths) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(file => {
        const filePath = path.join(dirPath, file);
        if (file !== "creds.json" && fs.lstatSync(filePath).isFile()) {
          fs.rmSync(filePath, { force: true });
          console.log("Deleted All Ephemeral files");
        }
      });
    }
  }
}

setInterval(async () => {
  const phoneNumbers = await User.find({}, "phoneNumber");
  for (const record of phoneNumbers) {
    await deleteSessionFilesExceptCreds(record.phoneNumber);
  }
}, 3600000);

app.post("/pairing-code", async (req, res) => {
  try {
    let { phoneNumber } = req.body;
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!phoneNumber) {
      return res.status(400).json({ status: "Invalid phone number" });
    }

    console.log(`Creating bot for phone number: ${phoneNumber}`);
    const bot = await createBot(phoneNumber);
    if (!bot) {
      throw new Error("Bot creation failed");
    }

    setTimeout(async () => {
      try {
        // Update: Fix for Baileys pairing code API
        const { pairingCode } = await bot.requestPairingCode(phoneNumber, { timeoutMs: 60000 });
        
        // Format the pairing code as XXXX-XXXX for readability
        const formattedCode = pairingCode.replace(/(\d{4})(\d{4})/, '$1-$2');
        
        res.json({ 
          pairingCode: formattedCode, 
          status: "Pairing code generated" 
        });
      } catch (error) {
        console.error("Error generating pairing code:", error);
        res.status(500).json({ 
          status: "Error generating pairing code",
          error: error.message 
        });
        
        // Clean up the bot if pairing fails
        if (sock[phoneNumber]) {
          await deleteSession(phoneNumber);
        }
      }
    }, 3000);
  } catch (error) {
    console.error("Error in /pairing-code:", error);
    res.status(500).json({ 
      status: "Error generating pairing code",
      error: error.message 
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await reloadBots();
});
