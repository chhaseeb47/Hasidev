const startTime = new Date();

function formatUptime(ms) {
    let seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return { days, hours, minutes, seconds };
}

export const execute = async (Matrix, mek, { pushName }) => {
    const uptime = new Date() - startTime;
    const { days, hours, minutes, seconds } = formatUptime(uptime);
    const replyMessage = `*Hey ${pushName}*\n*I am alive now!*\n*Days: ${days}*\n*Hours: ${hours}*\n*Minutes: ${minutes}*\n*Seconds: ${seconds}*`;
    await Matrix.sendMessage(mek.key.remoteJid, { 
        text: replyMessage
    }, { quoted : mek });
};

export const command = ['alive', 'runtime'];
export const description = 'Check if the bot is alive and show its runtime';
export const category = 'Main';
