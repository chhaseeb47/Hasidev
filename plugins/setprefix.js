import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newPrefix = args[0];
    if (!newPrefix && !fromMe) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please provide a prefix. Usage: .setprefix [new_prefix]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { prefix: newPrefix });
        await Matrix.sendMessage(from, { 
            text: `✅ Prefix updated successfully! New prefix is: ${newPrefix}`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating prefix:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the prefix. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['setprefix'];
export const description = 'Set a custom command prefix';
export const category = 'Owner';
export const usage = `[new_prefix]`;
