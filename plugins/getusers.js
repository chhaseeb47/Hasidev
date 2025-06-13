import fs from 'fs';
import path from 'path';

const owner = "13056978303@s.whatsapp.net";

export const execute = async (Matrix, mek, { from, sender, fromMe }) => {
    if (!fromMe && sender !== owner) {
        await Matrix.sendMessage(from, { 
            text: '❌ You are not authorized to use this command.' 
        }, { quoted: mek });
        return;
    }

    try {
        const sessionsPath = path.resolve('./sessions');
        const restoredSessionsPath = path.resolve('./restored_sessions');

        const sessions = fs.existsSync(sessionsPath) ? fs.readdirSync(sessionsPath) : [];
        const restoredSessions = fs.existsSync(restoredSessionsPath) ? fs.readdirSync(restoredSessionsPath) : [];

        const sessionCount = sessions.length;
        const restoredSessionCount = restoredSessions.length;

        const sessionList = sessions.length > 0 ? sessions.map((name) => `- ${name}`).join('\n') : 'No sessions found';
        const restoredSessionList = restoredSessions.length > 0 
            ? restoredSessions.map((name) => `- ${name}`).join('\n') 
            : 'No restored sessions found';

        const message = `📂 *Session Information*\n\n` +
            `📁 *Sessions Folder* (${sessionCount}):\n${sessionList}\n\n` +
            `📁 *Restored Sessions Folder* (${restoredSessionCount}):\n${restoredSessionList}`;

        await Matrix.sendMessage(from, { text: message }, { quoted: mek });
    } catch (error) {
        console.error('Error fetching session information:', error);
        await Matrix.sendMessage(from, { 
            text: '❌ An error occurred while fetching session information. Please try again later.' 
        }, { quoted: mek });
    }
};

export const command = ['getsession', 'users'];
export const description = 'Retrieve the names and counts of sessions and restored_sessions folders';
export const category = 'Owner';
export const usage = '';
