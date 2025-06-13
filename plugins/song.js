import axios from 'axios';
import ytSearch from 'yt-search';

const Mp3 = async (url) => {
  return new Promise((resolve, reject) => {
    let title, image;

    const getDownloadId = async () => {
      try {
        const response = await axios.get(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to get download ID');
      }
    };

    const checkProgress = async (id) => {
      try {
        const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to check progress');
      }
    };

    const pollProgress = async (id) => {
      try {
        const data = await checkProgress(id);
        if (data.progress === 1000) {
          resolve({
            type: 'mp3 (128 kbps)',
            title: title,
            image: image,
            download_url: data.download_url
          });
        } else {
          setTimeout(() => pollProgress(id), 1000);
        }
      } catch (error) {
        reject(error);
      }
    };

    getDownloadId()
      .then(data => {
        if (data.success && data.id) {
          title = data.info.title;
          image = data.info.image;
          pollProgress(data.id);
        } else {
          reject(new Error('Failed to get download ID from server.'));
        }
      })
      .catch(reject);
  });
};

export const execute = async (Matrix, mek, { args, reply, prefix, command }) => {
  const input = args.join(' ');
  const isDocRequest = command === 'ytmp3doc';
  const youtubeUrlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|\S+\/\S+|\S+)|youtu\.be\/[\w\-]+)/;

  if (youtubeUrlPattern.test(input)) {
    try {
      const { download_url, title, image } = await Mp3(input);
      if (download_url) {
      await reply (`*_Please Wait Downloading_*\n${title}`)
        if (isDocRequest) {
          await Matrix.sendMessage(mek.key.remoteJid, {
            document: { url: download_url },
            fileName: `${title}.mp3`,
            mimetype: 'audio/mp4',
            contextInfo: {
              externalAdReply: {
                title: title,
                body: 'Sʜɪᴢxʏ Aɴᴅʏ ʙᴏᴛ',
                thumbnailUrl: image,
                mediaType: 2,
                mediaUrl: input,
              }
            },
          }, { quoted: mek });
        } else {
          await Matrix.sendMessage(mek.key.remoteJid, {
            audio: { url: download_url },
            mimetype: 'audio/mp4',
            contextInfo: {
              externalAdReply: {
                title: title,
                body: 'Sʜɪᴢxʏ Aɴᴅʏ ʙᴏᴛ',
                thumbnailUrl: image,
                mediaType: 2,
                mediaUrl: input,
              }
            },
          }, { quoted: mek });
        }
      } else {
        await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to fetch the audio download URL.' }, { quoted: mek });
      }
    } catch (error) {
      console.error('Error fetching audio:', error);
      await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ An error occurred while fetching the audio. Please try again later.' }, { quoted: mek });
    }
  } else {
    if (!input) {
      await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Please provide a YouTube URL or search query.' });
      return;
    }
    try {
      const searchResults = await ytSearch(input);
      if (searchResults && searchResults.videos.length > 0) {
        const video = searchResults.videos[0];
        const videoUrl = video.url;
        const thumbnailUrl = video.thumbnail;

        const { download_url, title } = await Mp3(videoUrl);
        if (download_url) {
        await reply (`*_Please Wait Downloading_*\n${title}`)
          if (isDocRequest) {
            await Matrix.sendMessage(mek.key.remoteJid, {
              document: { url: download_url },
              fileName: `${title}.mp3`,
              mimetype: 'audio/mp4',
              contextInfo: {
                externalAdReply: {
                  title: title,
                  body: 'Cʀᴇᴀᴛᴇᴅ Bʏ Aɴᴅʏ Mʀʟɪᴛ',
                  thumbnailUrl: thumbnailUrl,
                  mediaType: 2,
                  mediaUrl: videoUrl,
                }
              },
            }, { quoted: mek });
          } else {
            await Matrix.sendMessage(mek.key.remoteJid, {
              audio: { url: download_url },
              mimetype: 'audio/mpeg',
              contextInfo: {
                externalAdReply: {
                  title: title,
                  body: 'Sʜɪᴢxʏ Aɴᴅʏ ʙᴏᴛ',
                  thumbnailUrl: thumbnailUrl,
                  mediaType: 2,
                  mediaUrl: videoUrl,
                }
              },
            }, { quoted: mek });
          }
        } else {
          await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to fetch the audio download URL.' }, { quoted: mek });
        }
      } else {
        await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ No audio found for your search query.' }, { quoted: mek });
      }
    } catch (error) {
      console.error('Error during search:', error);
      await Matrix.sendMessage(mek.key.remoteJid, { text: '❌ Failed to perform search. Please try again later.' }, { quoted: mek });
    }
  }
};

export const command = ['ytmp3', 'song', 'ytmp3doc'];
export const description = 'Download YouTube audio by URL or search query..';
export const category = 'Downloader';
export const usage = `<query> or <URL>`;