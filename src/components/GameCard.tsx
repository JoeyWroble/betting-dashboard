import { useNavigate } from 'react-router-dom';

interface Team {
    id: number;
    name: string;
    abbreviation: string;
    score?: number;
    record?: {
        wins: number;
        losses: number;
        pct: string;
    }
}

interface GameCardProps {
    gameId: number;
    homeTeam: Team;
    awayTeam: Team;
    status: string;
    inning?: string;
    time?: string;
    outs?: number;
    battingTeamId?: number;
    awayPitcher?: string;
    homePitcher?: string;
    runners?: {
        first: boolean;
        second: boolean;
        third: boolean;
    }
}

function Bases({ runners }: { runners?: { first: boolean; second: boolean; third: boolean } }) {
    if (!runners) return null;

    const baseClass = 'absolute w-2 h-2 rotate-45 border border-[#777777] rounded-[1px]';

    return (
        <div className="relative w-9 h-8 mt-2">
            {/* Second base */}
            <div className={`${baseClass} top-0 left-1/2 -translate-x-1/2 ${runners.second ? 'bg-[#f5f5f5] border-[#f5f5f5]' : 'bg-transparent'}`}
            />
            {/* First base */}
            <div className={`${baseClass} top-3 right-1 ${runners.first ? 'bg-[#f5f5f5] border-[#f5f5f5]' : 'bg-transparent'}`}
            />
            {/* Third base */}
            <div className={`${baseClass} top-3 left-1 ${runners.third ? 'bg-[#f5f5f5] border-[#f5f5f5]' : 'bg-transparent'}`}
            />
        </div>
    );
}

function GameCard({ gameId, homeTeam, awayTeam, status, inning, time, outs, battingTeamId, runners, awayPitcher, homePitcher }: GameCardProps) {
    const navigate = useNavigate();

    const isFinal = status === 'Final' || status === 'Game Over' || status === 'Completed Early' || status === 'Completed';
    const isUpcoming = status === 'Scheduled' || status === 'Pre-Game' || status === 'Warmup';
    const isLive = !isFinal && !isUpcoming;

    const isWarmup = status === 'Warmup';

    const statusLabel = status === 'Warmup'
        ? 'Warmup'
        : status === 'Pre-Game'
            ? 'Pre-Game'
            : status === 'Delayed Start'
                ? 'Delayed'
                : status === 'Delayed'
                    ? 'Delayed'
                    : status;

    const getTeamLogo = (teamId: number) =>
        `https://www.mlbstatic.com/team-logos/${teamId}.svg`;

    return (
        <div
            onClick={() => navigate(`/matchup/${gameId}`)}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer active:opacity-70 transition-all bg-[#1c1c1c] border ${isLive ? 'border-[#23443b]' : 'border-[#2a2a2a]'
                }`}
        >

            {/* Away team card information */}
            <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={getTeamLogo(awayTeam.id)}
                            alt={awayTeam.name}
                            className="w-7 h-7"
                        />

                        <div className="flex flex-col">
                            <span className="text-[#f5f5f5] text-sm font-medium">
                                {awayTeam.abbreviation}

                                {awayTeam.record && (
                                    <span className="text-[#888888] text-[11px] ml-2 font-normal">
                                        {awayTeam.record.wins}-{awayTeam.record.losses}
                                    </span>
                                )}
                            </span>
                            <span className="text-[#555555] text-xs">
                                {awayTeam.name}
                            </span>
                        </div>
                    </div>

                    {!isUpcoming && (
                        <div className="relative w-8 text-right">
                            <span className={`text-lg font-bold ${isFinal && awayTeam.score! > homeTeam.score!
                                    ? 'text-[#f5f5f5]'
                                    : 'text-[#666666]'}`}>
                                {awayTeam.score ?? '-'}
                            </span>
                            {isLive && !isFinal && battingTeamId === awayTeam.id && (
                                <span className="opacity-70 absolute -right-3 top-1/2 -translate-y-1/2 text-[#10b981] text-[5px]">●</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Home team card information */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={getTeamLogo(homeTeam.id)}
                            alt={homeTeam.name}
                            className="w-7 h-7"
                        />

                        <div className="flex flex-col">
                            <span className="text-[#f5f5f5] text-sm font-medium">
                                {homeTeam.abbreviation}
                                {homeTeam.record && (
                                    <span className="text-[#888888] text-[11px] ml-2 font-normal">
                                        {homeTeam.record.wins}-{homeTeam.record.losses}
                                    </span>
                                )}
                            </span>
                            <span className="text-[#555555] text-xs">
                                {homeTeam.name}
                            </span>
                        </div>
                    </div>

                    {!isUpcoming && (
                        <div className="relative w-8 text-right">
                            <span className={`text-lg font-bold ${isFinal && homeTeam.score! > awayTeam.score!
                                    ? 'text-[#f5f5f5]'
                                    : 'text-[#666666]'
                                }`}>
                                {homeTeam.score ?? '-'}
                            </span>
                            {isLive && battingTeamId === homeTeam.id && (
                                <span className="opacity-70 absolute -right-3 top-1/2 -translate-y-1/2 text-[#10b981] text-[5px]">●</span>)}
                        </div>
                    )}
                </div>

                { /* Pitcher */ }
                {!isFinal && (awayPitcher || homePitcher) && (
                    <div className="text-[#5a5a5a] text-[10px] -mt-2">
                        SP: {awayPitcher ?? 'TBD'} vs {homePitcher ?? 'TBD'}
                    </div>
                )}

            </div>

            {/* Right of card column */}
            <div className="flex flex-col items-center justify-center ml-6 min-w-[64px]">
                {time && (
                    <span className="text-[#555555] text-xs mb-1">
                        {time}
                    </span>
                )}

                {isWarmup && (
                    <span className="text-[#facc15] text-xs font-semibold">
                        Warmup
                    </span>
                )}

                {isLive && !isWarmup && (
                    <span className="text-[#10b981]/85 text-xs font-semibold">
                        {inning || statusLabel}
                    </span>
                )}

                {isLive && outs !== undefined && (
                    <span className="text-[#777777] text-xs mt-1">
                        {outs} out{outs === 1 ? '' : 's'}
                    </span>
                )}

                {isLive && <Bases runners={runners} />}
                {isFinal && (
                    <span className="text-[#555555] text-xs">Final</span>
                )}

                {isUpcoming && !isWarmup && (
                    <span className="text-[#555555] text-xs">{statusLabel}</span>
                )}
            </div>
        </div>
    );
}

export default GameCard;