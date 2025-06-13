import axios from 'axios';

export const execute = async (Matrix, mek, { args, reply }) => {
    const matchId = args[0]; 
    if (!matchId) {
        await reply('❌ Please provide a match ID. Usage: cricket <match_id>');
        return;
    }
    try {
        const response = await axios.get(`https://cricket-olive.vercel.app/score?id=${matchId}`);
        const data = response.data;

        let scoreMessage = "🏏 *`LIVE MATCH INFO`*\n\n";
        scoreMessage += `📍 *_Match:_* ${data.title}\n`;
        scoreMessage += `📊 *_Update:_* ${data.update}\n\n`;

        if (data.livescore !== "Data Not Found") {
            scoreMessage += `🎯 *_Score:_* ${data.livescore}\n`;
            scoreMessage += `💥 *_Run Rate:_* ${data.runrate}\n\n`;
            scoreMessage += `👤 *_Batsman 1:_* ${data.batterone} - ${data.batsmanonerun} (${data.batsmanoneball}) | SR: ${data.batsmanonesr}\n`;
            scoreMessage += `👤 *_Batsman 2:_* ${data.battertwo} - ${data.batsmantworun} (${data.batsmantwoball}) | SR: ${data.batsmantwosr}\n\n`;
            scoreMessage += `⚾ *_Bowler 1:_* ${data.bowlerone} | Overs: ${data.bowleroneover} | Runs: ${data.bowleronerun} | Wickets: ${data.bowleronewickets} | Econ: ${data.bowleroneeconomy}\n`;
            scoreMessage += `⚾ *_Bowler 2:_* ${data.bowlertwo} | Overs: ${data.bowlertwoover} | Runs: ${data.bowlertworun} | Wickets: ${data.bowlertwowickets} | Econ: ${data.bowlertwoeconomy}\n`;
        }
        scoreMessage += ` *Provided by Mrlit Andy*\n`;

        await Matrix.sendMessage(mek.key.remoteJid, { 
            text: scoreMessage,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: `${data.title}`,
                    sourceUrl: "https://chat.whatsapp.com/Jx7300IL1iVIaDUolVULBj",
                    body: `Live Cricket Score`
                }
            },
        }, { quoted: mek });
    } catch (error) {
        console.error('Error fetching cricket score:', error);
        await reply('❌ Error fetching the cricket score. Please check the match ID or try again later.');
    }
};

export const command = ['cricket', 'score'];
export const description = 'Get live cricket score and match updates.';
export const usage = `<Crickbuzz Match-ID>`;
