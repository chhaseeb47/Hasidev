import { fbdl } from 'ruhend-scraper';

export const execute = async (Matrix, mek, { args, prefix }) => {
    if (!args[0]) {
        await Matrix.sendMessage(mek.key.remoteJid, { 
            text: `Please provide a Facebook URL. Usage: *${prefix}fbdl <Facebook URL>*`
        }, { quoted: mek });
        return;
    }

    const url = args[0];
    const isVideoUrl = /\/v\/\w+/.test(url);

    try {
        let res = await fbdl(url);

        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
            await Matrix.sendMessage(mek.key.remoteJid, { 
                text: "Unable to fetch data from the provided URL. Please try again later."
            }, { quoted: mek });
            return;
        }

        let data = res.data;

        if (isVideoUrl) {
            let videoSent = false;
            for (let item of data) {
                const { resolution, url: videoUrl } = item;
                if (resolution === '360p (SD)' && videoUrl) {
                    await Matrix.sendMessage(mek.key.remoteJid, { 
                        video: { url: videoUrl },  
                        caption: `Here’s the Facebook video at 360p resolution!`
                    }, { quoted: mek });
                    videoSent = true;
                    break;
                }
            }

            if (!videoSent) {
                await Matrix.sendMessage(mek.key.remoteJid, { 
                    text: "No video found at this URL. Please check the URL and try again."
                }, { quoted: mek });
            }
        } else {
            await Matrix.sendMessage(mek.key.remoteJid, { 
                text: "Invalid URL format. Please provide a valid Facebook video URL."
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("Error fetching Facebook post:", error);
        await Matrix.sendMessage(mek.key.remoteJid, { 
            text: "An error occurred while processing your request. Please try again later."
        }, { quoted: mek });
    }
};

export const command = ['fbdl', 'fb', 'facebook'];
export const description = 'Download video from a Facebook link.';
export const category = 'Downloader';
export const usage = '[<Link>]';