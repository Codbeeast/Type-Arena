"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, RotateCcw, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Player {
    _id: string;
    name: string;
    wpm: number;
    accuracy: number;
    finished: boolean;
    finishTime?: number;
    progress: number;
}

interface ResultsModalProps {
    players: Player[];
    startTime?: number;
    roomId: string;
}

export default function ResultsModal({ players, startTime, roomId }: ResultsModalProps) {
    const router = useRouter();

    // Sort players: finished first, then by finish time (asc), then by WPM (desc)
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.finished && !b.finished) return -1;
        if (!a.finished && b.finished) return 1;
        if (a.finished && b.finished) {
            if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
        }
        return b.wpm - a.wpm;
    });

    const winner = sortedPlayers[0];

    const formatTime = (finishTime?: number) => {
        if (!finishTime || !startTime) return "-";
        const durationMs = finishTime - startTime;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        const milliseconds = Math.floor((durationMs % 1000) / 10); // 2 digits
        return `${minutes > 0 ? `${minutes}:` : ""}${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}s`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <GlassCard className="p-8 border-neon-blue/20 shadow-[0_0_50px_rgba(0,243,255,0.1)]">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 rounded-full bg-neon-yellow/10 mb-4">
                            <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            RACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">COMPLETE</span>
                        </h2>
                        <p className="text-lg text-zinc-400">
                            Winner: <span className="text-white font-bold">{winner?.name}</span>
                        </p>
                    </div>

                    <div className="grid gap-3 mb-8">
                        {sortedPlayers.map((player, index) => (
                            <div
                                key={player._id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all
                                    ${index === 0 ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-white/5 border-white/5'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                        ${index === 0 ? 'bg-yellow-400 text-black' :
                                            index === 1 ? 'bg-zinc-400 text-black' :
                                                index === 2 ? 'bg-orange-700 text-white' : 'bg-white/10 text-white'}`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-white">{player.name}</p>
                                        <p className="text-xs text-zinc-500">{player.finished ? "Finished" : "In Progress"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 md:gap-8">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] text-zinc-500 uppercase">Time</p>
                                        <p className="text-xl font-mono font-bold text-white">{formatTime(player.finishTime)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-zinc-500 uppercase">Speed</p>
                                        <p className="text-xl font-mono font-bold text-neon-blue">{Math.round(player.wpm)} <span className="text-xs text-zinc-600">WPM</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-zinc-500 uppercase">Accuracy</p>
                                        <p className="text-xl font-mono font-bold text-neon-purple">{Math.round(player.accuracy)}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4">
                        <Link href="/arena">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm font-bold">
                                <LogOut className="w-4 h-4" />
                                Exit
                            </button>
                        </Link>

                        <button
                            onClick={() => router.push("/arena/create-room")}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-neon-blue text-black font-bold hover:bg-neon-cyan transition-colors text-sm"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Play Again
                        </button>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
