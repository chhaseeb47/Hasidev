import { igdl } from 'ruhend-scraper';

export const execute = async (Matrix, mek, { args, reply, prefix, command }) => {
    const instagramUrl = args[0];
    if (!instagramUrl) {
        await reply(`❌ Please provide an Instagram URL (e.g., ${prefix}${command} https://www.instagram.com/p/xyz)`);
        return;
    }
    try {
        const res = await igdl(instagramUrl);
        const data = res.data;
        if (data && data.length > 0) {
            for (let media of data) {
                const mediaUrl = media.url;
                if (mediaUrl && instagramUrl.includes('/reel/')) {
                    await Matrix.sendMessage(mek.key.remoteJid, { 
                        video: { url: mediaUrl }, 
                        caption: "> © This A New Bot Made By Shixzy Andy", 
                        mimetype: 'video/mp4' 
                    }, { quoted: mek });
                } else if (mediaUrl && instagramUrl.includes('/p/')) {
                    await Matrix.sendMessage(mek.key.remoteJid, { 
                        image: { url: mediaUrl }, 
                        caption: "> © This A New Bot Made By Shixzy Andy" 
                    }, { quoted: mek });
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } else {
            await reply('❌ No media found or an error occurred with the Instagram URL.');
        }
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        await reply('❌ Error occurred while fetching Instagram media.');
    }
};

export const command = ['insta', 'instagram', 'ig'];
export const description = 'Download media (video or image) from Instagram.';
export const category = 'Downloader';

export const usage =`<URL>`;