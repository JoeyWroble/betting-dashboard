import { useState, useEffect } from 'react';
import { getTodaysGames } from '../lib/mlbApi';

// Fetches scores from API
export function useScores() {
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null > (null);

    useEffect(() => {
        async function fetchGames() {
            try {
                const data = await getTodaysGames();
                setGames(data);
                setError(null);
            } catch (err) {
                setError('Failed to load games');
            } finally {
                setLoading(false);
            }
        }

        fetchGames()

        const interval = setInterval(() => {
            fetchGames();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return {games, loading, error};
}