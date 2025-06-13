import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: "Bro sorry Vous n'êtes pas autorisé à utiliser cette commande."
        }, { quoted: mek });
        return;
    }

    const newAlwaysOnlineStatus = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .alwaysonline [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { alwaysOnline: newAlwaysOnlineStatus });
        await Matrix.sendMessage(from, { 
            text: `✅ Always-online feature ${newAlwaysOnlineStatus ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating always-online setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the always-online setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['alwaysonline'];
export const description = 'Enable or disable always-online feature';
export const category = 'Owner';
export const usage = `[on/off]`;
