import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newStatusRead = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .statusreadmsg [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { statusReadEnabled: newStatusRead });
        await Matrix.sendMessage(from, { 
            text: `✅ Status read feature ${newStatusRead ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating status read setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the status read setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['statusreadmsg'];
export const description = 'Enable or disable status read feature';
export const category = 'Owner';
export const usage = `on/off`;
