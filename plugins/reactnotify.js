import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newStatusReactNotify = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .statusreadmsg [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { statusReactNotify: newStatusReactNotify });
        await Matrix.sendMessage(from, { 
            text: `✅ Status reaction notifications ${newStatusReactNotify ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating status reaction notification setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the status reaction notification setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['reactnotify'];
export const description = 'Enable or disable status reaction notifications for a user';
export const category = 'Owner';
export const usage = `enable/disable`;
