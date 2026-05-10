import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { getGameById } from "../lib/mlbApi";

function Matchup() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchGame() {
      try {
        if (!gameId) {
          setLoading(false);
          return;
        }
        const data = await getGameById(gameId);
        setGame(data);
        const status = data?.gameData?.status?.detailedState;
        setIsLive(status === 'In Progress');
      } catch (err) {
        console.error('Failed to load game data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
    const interval = setInterval(fetchGame, 30000);
    return () => clearInterval(interval);
  }, [gameId]);

  if (loading) {
    return <p className="text-[#555555] p-4">Loading matchup...</p>;
  }

  const away = game?.gameData?.teams?.away;
  const home = game?.gameData?.teams?.home;
  const awayRecord = away?.record;
  const homeRecord = home?.record;
  const linescore = game?.liveData?.linescore;
  const currentPlay = game?.liveData?.plays?.currentPlay;
  const boxscore = game?.liveData?.boxscore;

  const awayRuns = linescore?.teams?.away?.runs ?? 0;
  const homeRuns = linescore?.teams?.home?.runs ?? 0;

  const innings = linescore?.innings ?? [];
  const offense = linescore?.offense;
  const paddedInnings = innings.length < 9
    ? [...innings, ...Array(9 - innings.length).fill({})]
    : innings;

  const isFinal =
    game?.gameData?.status?.detailedState === 'Final' ||
    game?.gameData?.status?.detailedState === 'Game Over';

  const batter = currentPlay?.matchup?.batter;
  const pitcher = currentPlay?.matchup?.pitcher;
  const balls = currentPlay?.count?.balls ?? 0;
  const strikes = currentPlay?.count?.strikes ?? 0;
  const outs = linescore?.outs ?? 0;

  const allPlayers = {
    ...boxscore?.teams?.away?.players,
    ...boxscore?.teams?.home?.players,
  };

  const getBatterStats = (batterId: number) => {
    const player = allPlayers[`ID${batterId}`];
    if (!player) return null;
    const gameStats = player?.stats?.batting;
    const seasonAvg = player?.seasonStats?.batting?.avg;
    return {
      hits: gameStats?.hits ?? 0,
      atBats: gameStats?.atBats ?? 0,
      avg: seasonAvg ?? '—',
    };
  };

  const getPitcherStats = (pitcherId: number) => {
    const player = allPlayers[`ID${pitcherId}`];
    if (!player) return null;
    const gameStats = player?.stats?.pitching;
    const seasonEra = player?.seasonStats?.pitching?.era;
    return {
      era: seasonEra ?? '—',
      strikeouts: gameStats?.strikeOuts ?? 0,
    };
  };

  const batterStats = batter?.id ? getBatterStats(batter.id) : null;
  const pitcherStats = pitcher?.id ? getPitcherStats(pitcher.id) : null;

  return (
    <div className="p-5">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-[#555555] text-sm mb-4 active:opacity-70 transition-opacity"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>Scores</span>
      </button>

      {/* Header */}
      <h1 className="text-[#f5f5f5] text-xl font-semibold mb-8">
        {away?.name ?? 'Away'} vs {home?.name ?? 'Home'}
      </h1>

      {/* Score header */}
      <div className="flex items-center justify-between mb-6">

        {/* Away team */}
        <div className="flex flex-col items-center flex-1">
          <img
            src={`https://www.mlbstatic.com/team-logos/${away?.id}.svg`}
            alt={away?.abbreviation}
            className="w-14 h-14 mb-2"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-[#f5f5f5] text-5xl font-bold">{awayRuns}</span>
          <span className="text-[#555555] text-xs mt-2">{away?.abbreviation}</span>
          <p className="text-[#555555] text-xs">
            {awayRecord?.wins}-{awayRecord?.losses}
          </p>
        </div>

        {/* Middle status */}
        <div className="flex flex-col items-center px-2">
          {isLive && (
            <span className="text-[#10b981] text-xs font-medium mb-1">● LIVE</span>
          )}
          {isFinal && (
            <span className="text-[#555555] text-xs mb-1">Final</span>
          )}
          {!isLive && !isFinal && (
            <span className="text-[#555555] text-xs mb-1">vs</span>
          )}
          {isLive && (
            <>
              <span className="text-[#555555] text-xs mb-3">
                {linescore?.inningHalf} {linescore?.currentInning}
              </span>
              <div className="relative w-12 h-12">
                <div className={`absolute w-3 h-3 rotate-45 top-0 left-1/2 -translate-x-1/2 ${
                  offense?.second ? 'bg-[#f5f5f5]' : 'border border-[#3a3a3a]'
                }`} />
                <div className={`absolute w-3 h-3 rotate-45 top-1/2 left-0 -translate-y-1/2 ${
                  offense?.third ? 'bg-[#f5f5f5]' : 'border border-[#3a3a3a]'
                }`} />
                <div className={`absolute w-3 h-3 rotate-45 top-1/2 right-0 -translate-y-1/2 ${
                  offense?.first ? 'bg-[#f5f5f5]' : 'border border-[#3a3a3a]'
                }`} />
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex flex-col items-center">
                  <span className="text-[#3a3a3a] text-[10px] uppercase tracking-wider">Count</span>
                  <span className="text-[#555555] text-xs font-medium">{balls}-{strikes}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#3a3a3a] text-[10px] uppercase tracking-wider">Outs</span>
                  <span className="text-[#555555] text-xs font-medium">{outs}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Home team */}
        <div className="flex flex-col items-center flex-1">
          <img
            src={`https://www.mlbstatic.com/team-logos/${home?.id}.svg`}
            alt={home?.abbreviation}
            className="w-14 h-14 mb-2"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-[#f5f5f5] text-5xl font-bold">{homeRuns}</span>
          <span className="text-[#555555] text-xs mt-2">{home?.abbreviation}</span>
          <p className="text-[#555555] text-xs">
            {homeRecord?.wins}-{homeRecord?.losses}
          </p>
        </div>

      </div>

      {/* Linescore */}
      {innings.length > 0 && (
        <div className="mb-6">
          <p className="text-[#555555] text-xs font-medium uppercase tracking-widest mb-3">
            Linescore
          </p>
          <div
            className="rounded-xl p-4 overflow-x-auto"
            style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
          >
            <table className="w-full text-xs min-w-[280px]">
              <thead>
                <tr>
                  <th className="text-left text-[#555555] font-medium pb-2 w-8" />
                  {paddedInnings.map((_: any, i: number) => (
                    <th key={i} className="text-center text-[#555555] font-medium pb-2 w-5">
                      {i + 1}
                    </th>
                  ))}
                  <th className="text-center text-[#f5f5f5] font-semibold pb-2 px-2">R</th>
                  <th className="text-center text-[#555555] font-medium pb-2 px-2">H</th>
                  <th className="text-center text-[#555555] font-medium pb-2 px-2">E</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-[#f5f5f5] font-medium py-1">{away?.abbreviation}</td>
                  {paddedInnings.map((inning: any, i: number) => (
                    <td key={i} className="text-center text-[#f5f5f5] py-1">
                      {inning.away?.runs ?? '-'}
                    </td>
                  ))}
                  <td className="text-center text-[#f5f5f5] font-semibold px-2">{awayRuns}</td>
                  <td className="text-center text-[#555555] px-2">{linescore?.teams?.away?.hits ?? 0}</td>
                  <td className="text-center text-[#555555] px-2">{linescore?.teams?.away?.errors ?? 0}</td>
                </tr>
                <tr>
                  <td className="text-[#f5f5f5] font-medium py-1">{home?.abbreviation}</td>
                  {paddedInnings.map((inning: any, i: number) => (
                    <td key={i} className="text-center text-[#f5f5f5] py-1">
                      {inning.home?.runs ?? '-'}
                    </td>
                  ))}
                  <td className="text-center text-[#f5f5f5] font-semibold px-2">{homeRuns}</td>
                  <td className="text-center text-[#555555] px-2">{linescore?.teams?.home?.hits ?? 0}</td>
                  <td className="text-center text-[#555555] px-2">{linescore?.teams?.home?.errors ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Batter and Pitcher cards */}
      {isLive && (
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
          >
            <p className="text-[#555555] text-xs mb-1">Batter</p>
            <p className="text-[#f5f5f5] text-sm font-semibold">
              {batter?.fullName ?? '—'}
            </p>
            {batterStats && (
              <p className="text-[#555555] text-xs mt-2">
                {batterStats.hits}-{batterStats.atBats} · {batterStats.avg} AVG
              </p>
            )}
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
          >
            <p className="text-[#555555] text-xs mb-1">Pitcher</p>
            <p className="text-[#f5f5f5] text-sm font-semibold">
              {pitcher?.fullName ?? '—'}
            </p>
            {pitcherStats && (
              <p className="text-[#555555] text-xs mt-2">
                {pitcherStats.era} ERA · {pitcherStats.strikeouts} K
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Matchup;