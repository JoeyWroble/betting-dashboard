import axios from 'axios'; 

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

// Function to get MLB games today
export async function getTodaysGames() {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${BASE_URL}/schedule`, {
        params: {
            sportId: 1,
            date: today,
            hydrate: 'team,linescore,flags,liveLookin',
        },
    });

    const dates = response.data.dates;
    if (!dates || dates.length === 0) return [];
    return dates[0].games;
}