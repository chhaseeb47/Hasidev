import translate from 'translate-google-api';

export const execute = async (Matrix, mek, { args, reply, prefix, command }) => {
    const targetLang = args[0];
    let textToTranslate = args.slice(1).join(' ');

    if (!targetLang) {
        await reply(`❌ Please provide a language code (e.g., ${prefix + command} en How are you?)`);
        return;
    }
    if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
        textToTranslate = mek.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
    }

    if (!textToTranslate) {
        await reply('❌ No text to translate.');
        return;
    }

    try {
        const translatedText = await translate(textToTranslate, { to: targetLang });
        await Matrix.sendMessage(mek.key.remoteJid, { text: `✅ Translated Text: ${translatedText}` }, { quoted: mek });
    } catch (error) {
        console.error('Error during translation:', error);
        await reply('❌ Error occurred during translation.');
    }
};

export const command = ['trt'];
export const description = 'Translate your message to a specified language';
export const category = 'Converter';
export const usage = `en How are you?`;
