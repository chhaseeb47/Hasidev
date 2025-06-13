import axios from 'axios';
import ytSearch from 'yt-search';

export const execute = async (Matrix, mek, { args, reply, prefix, command }) => {
    const isDocRequest = args[0] === '.ytmp4doc';
    const youtubeUrlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|\S+\/\S+|\S+)|youtu\.be\/[\w\-]+)/;

    if (args.length === 0) {
        await reply(`❌ Please provide a YouTube URL or search query. Example: \`${prefix + command} https://youtu.be/qHDJSRlNhVs\` or \`${prefix + command} Alan Walker The Spectre\``);
        return;
    }
    const input = args.join(' ');
    if (youtubeUrlPattern.test(input)) {
        const apiUrl = `https://api.giftedtech.my.id/api/download/ytmp4?apikey=_0x5aff35,_0x1876r&url=${encodeURIComponent(input)}`;
        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.status === 200 && data.success && data.result) {
                const downloadUrl = data.result.download_url;
                const videoTitle = data.result.title;

                if (downloadUrl) {
                    if (isDocRequest) {
                        await Matrix.sendMessage(mek.key.remoteJid, {
                            document: { url: downloadUrl },
                            fileName: `${videoTitle}.mp4`,
                            mimetype: 'video/mp4',
                            caption: `Title: ${videoTitle}\n> Cʀᴇᴀᴛᴇᴅ Bʏ Mꜰʟɪᴛ Aɴᴅʏ`
                        }, { quoted: mek });
                    } else {
                        await Matrix.sendMessage(mek.key.remoteJid, {
                            video: { url: downloadUrl, mimetype: 'video/mp4' },
                            caption: `Title: ${videoTitle}\n> Cʀᴇᴀᴛᴇᴅ Bʏ Mꜰʟɪᴛ Aɴᴅʏ`
                        }, { quoted: mek });
                    }
                } else {
                    await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to fetch the video download URL.' }, { quoted: mek });
                }
            } else {
                await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to fetch the video. Please try again later.' }, { quoted: mek });
            }
        } catch (error) {
            console.error('Error fetching YouTube video:', error);
            await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ An error occurred. Please try again later.' }, { quoted: mek });
        }
    } else {
        try {
            const searchResults = await ytSearch(input);
            if (searchResults && searchResults.videos.length > 0) {
                const videoUrl = searchResults.videos[0].url;
                const apiUrl = `https://api.giftedtech.my.id/api/download/ytmp4?apikey=_0x5aff35,_0x1876r&url=${encodeURIComponent(videoUrl)}`;
                const response = await axios.get(apiUrl);
                const data = response.data;

                if (data.status === 200 && data.success && data.result) {
                    const downloadUrl = data.result.download_url;
                    const videoTitle = data.result.title;

                    if (downloadUrl) {
                        if (isDocRequest) {
                            await Matrix.sendMessage(mek.key.remoteJid, {
                                document: { url: downloadUrl },
                                fileName: `${videoTitle}.mp4`,
                                mimetype: 'video/mp4',
                                caption: `Title: ${videoTitle}\n> Cʀᴇᴀᴛᴇᴅ Bʏ Mꜰʟɪᴛ Aɴᴅʏ`
                            }, { quoted: mek });
                        } else {
                            await Matrix.sendMessage(mek.key.remoteJid, {
                                video: { url: downloadUrl, mimetype: 'video/mp4' },
                                caption: `Title: ${videoTitle}\n> Cʀᴇᴀᴛᴇᴅ Bʏ Mꜰʟɪᴛ Aɴᴅʏ`
                            }, { quoted: mek });
                        }
                    } else {
                        await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to fetch the video download URL.' }, { quoted: mek });
                    }
                } else {
                    await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to fetch the video. Please try again later.' }, { quoted: mek });
                }
            } else {
                await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ No videos found for your search query.' }, { quoted: mek });
            }
        } catch (error) {
            console.error('Error during search:', error);
            await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to perform search. Please try again later.' }, { quoted: mek });
        }
    }
};

export const command = ['ytmp4', 'video', 'youtube', 'ytmp4doc'];
export const description = 'Download YouTube video by URL or search query.';
export const category = 'Downloader';
export const usage = `<query> or <URL>`;
