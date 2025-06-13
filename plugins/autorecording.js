import Users from '../models/user.js';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, args, isOwner, fromMe, sender, phoneNumber }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.'
        }, { quoted: mek });
        return;
    }

    const newAutoRecordingStatus = args[0] === 'on';
    if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
        await Matrix.sendMessage(from, { 
            text: '❌ Please specify "on" or "off". Usage: .autorecording [on/off]' 
        }, { quoted: mek });
        return;
    }

    try {
        await Users.findOneAndUpdate({ phoneNumber }, { autoRecording: newAutoRecordingStatus });
        await Matrix.sendMessage(from, { 
            text: `✅ Auto-recording feature ${newAutoRecordingStatus ? 'enabled' : 'disabled'} successfully!`
        }, { quoted: mek });
    } catch (error) {
        console.error('Error updating auto-recording setting:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while updating the auto-recording setting. Please try again later.'
        }, { quoted: mek });
    }
};

export const command = ['autorecording'];
export const description = 'Enable or disable auto-recording feature';
export const category = 'Owner';
export const usage = `[on/off]`;
