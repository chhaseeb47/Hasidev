import { ytmp4, ytmp3 } from 'ruhend-scraper';
import yts from 'yt-search';

export const execute = async (Matrix, mek, { from, args, body, quoted }) => {
    try {
        await Matrix.sendMessage(from, { text: 'Aʏᴏ ᴡᴀɪᴛ ꜰᴏʀ ᴍᴇ ʙʀᴏ..' }, { quoted: mek });
        if (!args[0]) {
            await Matrix.sendMessage(from, {
                text: '❌ Please provide a search query or YouTube link. Usage: .play [query/link]',
            }, { quoted: mek });
            return;
        }

        const query = args.join(' ');
        let url;
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            url = query;
        } else {
            const searchResults = await yts(query);
            if (searchResults && searchResults.videos.length > 0) {
                const video = searchResults.videos[0];
                url = video.url;
            } else {
                await Matrix.sendMessage(from, {
                    text: '❌ No results found for your query.',
                }, { quoted: mek });
                return;
            }
        }

        const { title, author, duration, views, upload, thumbnail } = await ytmp4(url);

        const caption = `╭───────────\n` +
            `│◦ *Sʜɪᴢxʏ Bᴏᴛ Song Download*\n` +
            `│◦ *Title:* ${title}\n` +
            `│◦ *Author:* ${author}\n` +
            `│◦ *Duration:* ${duration}\n` +
            `│◦ *Views:* ${views}\n` +
            `│◦ *Uploaded:* ${upload}\n` +
            `│◦ *Link:* ${url}\n` +
            `│◦ *Reply 1 for video, 2 for audio*\n` +
            `╰───────────`;

        await Matrix.sendMessage(from, {
            image: { url: thumbnail },
            caption: caption,
        }, { quoted: mek });

    } catch (error) {
        console.error('Error in play command:', error);
        await Matrix.sendMessage(from, {
            text: '❌ An error occurred while processing your request. Please try again.',
        }, { quoted: mek });
    }
};

export const command = ['play'];
export const description = 'Search for a YouTube video and display its details with media options';
export const category = 'Music';
export const usage = '[query/link]';
