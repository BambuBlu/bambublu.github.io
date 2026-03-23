import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID || '';
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || '';
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || '';

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term`;
const PLAYLIST_ID = `AQA3NkFcfTYL3r8Epy1pcsWJVMWttcubtnPpvMObNxqZAWFYb6vgV_DO-roX870RzWbHO3-pC10dHc8gsmRcw1R-xYWGR1TIfAKFP8Khfad2V8eWrKRA9rx4wCvEFlh5lKg`; 
const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`;

export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'now';
    const { access_token } = await getAccessToken();

    const headers = { Authorization: `Bearer ${access_token}` };

    if (action === 'top') {
      const res = await fetch(TOP_TRACKS_ENDPOINT, { headers });
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tracks = data.items.map((track: any) => ({
        title: track.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        artist: track.artists.map((a: any) => a.name).join(', '),
        url: track.external_urls.spotify
      }));
      return NextResponse.json({ type: 'top', tracks });
    }

    if (action === 'playlist') {
      const res = await fetch(PLAYLIST_ENDPOINT, { headers });
      const data = await res.json();
      return NextResponse.json({
        type: 'playlist',
        name: data.name,
        description: data.description || 'Sin descripción',
        followers: data.followers.total,
        url: data.external_urls.spotify
      });
    }

    const nowPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, { headers });
    
    if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
      const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, { headers });
      const recentData = await recentRes.json();
      if (!recentData.items || recentData.items.length === 0) return NextResponse.json({ isPlaying: false });
      
      const track = recentData.items[0].track;
      return NextResponse.json({
        isPlaying: false,
        type: 'recent',
        title: track.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        artist: track.artists.map((a: any) => a.name).join(', '),
        songUrl: track.external_urls.spotify
      });
    }

    const song = await nowPlayingRes.json();
    if (!song.item || !song.is_playing) {
      const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, { headers });
      const recentData = await recentRes.json();
      if (!recentData.items || recentData.items.length === 0) return NextResponse.json({ isPlaying: false });
      
      const track = recentData.items[0].track;
      return NextResponse.json({
        isPlaying: false,
        type: 'recent',
        title: track.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        artist: track.artists.map((a: any) => a.name).join(', '),
        songUrl: track.external_urls.spotify
      });
    }

    return NextResponse.json({
      isPlaying: true,
      type: 'now',
      title: song.item.name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      artist: song.item.artists.map((a: any) => a.name).join(', '),
      songUrl: song.item.external_urls?.spotify,
    });

  } catch (error) {
    console.error("Spotify API Error:", error);
    return NextResponse.json({ error: 'Fallo al conectar con Spotify' }, { status: 500 });
  }
}