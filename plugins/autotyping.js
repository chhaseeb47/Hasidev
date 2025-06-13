import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newAutoTypingStatus = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .autotyping [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { autoTyping: newAutoTypingStatus });
        await Matrix.sendMessage(from, { 
            text: `✅ Auto-typing feature ${newAutoTypingStatus ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating auto-typing setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the auto-typing setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['autotyping'];
export const description = 'Enable or disable auto-typing feature';
export const category = 'Owner';
export const usage = `[on/off]`;
