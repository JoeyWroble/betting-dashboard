import { useScores } from "../hooks/useScores";
import GameCard from '../components/GameCard';

function Home() {
  const { games, loading, error } = useScores();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 mt-2">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">MLB</h1>
        <span className="text-[#555555] text-sm">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl animate-pulse"
              style={{ backgroundColor: '#1c1c1c' }}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-[#555555] text-sm text-center mt-10">{error}</p>
      )}

      {!loading && !error && games.length === 0 && (
        <p className="text-[#555555] text-sm text-center mt-10">
          No games scheduled today
        </p>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="flex flex-col gap-3">
          {games.map((game: any) => (
            <GameCard
              key={game.gamePk}
              gameId={game.gamePk}
              homeTeam={{
                id: game.teams.home.team.id,
                name: game.teams.home.team.name,
                abbreviation: game.teams.home.team.abbreviation,
                score: game.teams.home.score,
                record: game.teams.home.leagueRecord,
              }}
              awayTeam={{
                id: game.teams.away.team.id,
                name: game.teams.away.team.name,
                abbreviation: game.teams.away.team.abbreviation,
                score: game.teams.away.score,
                record: game.teams.away.leagueRecord,
              }}
              awayPitcher={game.probablePitcher?.away?.fullName ?? game.teams.away.probablePitcher?.lastName}
              homePitcher={game.probablePitcher?.home?.fullName ?? game.teams.home.probablePitcher?.lastName}
              status={game.status.detailedState}
              inning={
                game.linescore?.currentInning
                  ? `${game.linescore.inningHalf ?? ''} ${game.linescore.currentInning}`.trim()
                  : game.status.detailedState
              }
              time={formatTime(game.gameDate)}
              outs={game.linescore?.outs}
              battingTeamId={game.linescore?.offense?.team?.id}
              runners={{
                first: Boolean(game.linescore?.offense?.first),
                second: Boolean(game.linescore?.offense?.second),
                third: Boolean(game.linescore?.offense?.third),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;