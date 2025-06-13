import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newAutoReactStatus = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .autoreact [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { autoReactEnabled: newAutoReactStatus });
        await Matrix.sendMessage(from, { 
            text: `✅ Auto-react feature ${newAutoReactStatus ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating auto-react setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the auto-react setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['autoreact'];
export const description = 'Enable or disable auto-react feature';
export const category = 'Owner';
export const usage = `[on/off]`;
