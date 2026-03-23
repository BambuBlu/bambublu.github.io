const client_id = process.env.SPOTIFY_CLIENT_ID || '';
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || '';
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || '';

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token, 
    }),
  });
  return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { access_token } = await getAccessToken();
    
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return {
        statusCode: 200,
        headers, 
        body: JSON.stringify({ isPlaying: false }),
      };
    }

    const song = await response.json();

    if (!song.item || !song.is_playing) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ isPlaying: false }),
      };
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: { name: string }) => _artist.name).join(', ');
    const songUrl = song.item.external_urls?.spotify;

    return {
      statusCode: 200,
      headers, 
      body: JSON.stringify({
        isPlaying,
        title,
        artist,
        songUrl,
      }),
    };
  } catch (error) {
    console.error("Spotify API Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Fallo al conectar con Spotify' }),
    };
  }
};