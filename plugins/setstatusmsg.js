import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newStatusMessage = args.join(' ');
    if (!newStatusMessage && !fromMe) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please provide a status message. Usage: .setstatusmsg [new_status_message]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { statusReadMessage: newStatusMessage });
        await Matrix.sendMessage(from, { 
            text: `✅ Status message updated successfully! New status message is: ${newStatusMessage}`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating status message:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the status message. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['setstatusmsg'];
export const description = 'Set a custom status read message';
export const category = 'Owner';
export const usage = `[new_status_message]`;
