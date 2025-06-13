import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newAutoReadStatus = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .autoread [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { autoRead: newAutoReadStatus });
        await Matrix.sendMessage(from, { 
            text: `✅ Auto-read feature ${newAutoReadStatus ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating auto-read setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the auto-read setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['autoread'];
export const description = 'Enable or disable auto-read feature';
export const category = 'Owner';
export const usage = `[on/off]`;
