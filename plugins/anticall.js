import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newAntiCallStatus = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .anticall [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { antiCall: newAntiCallStatus });
        await Matrix.sendMessage(from, { 
            text: `✅ Anti-call feature ${newAntiCallStatus ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating anti-call setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the anti-call setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['anticall'];
export const description = 'Enable or disable anti-call feature';
export const category = 'Owner';
export const usage = `[on/off]`;
