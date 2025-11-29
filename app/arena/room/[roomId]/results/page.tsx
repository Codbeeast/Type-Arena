"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Medal, RotateCcw, LogOut } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const router = useRouter();

    const players = useQuery(api.rooms.getPlayers, { roomId });

    if (!players) return null;

    // Sort players: finished first, then by finish time (asc), then by WPM (desc)
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.finished && !b.finished) return -1;
        if (!a.finished && b.finished) return 1;
        if (a.finished && b.finished) {
            // If both finished, sort by finish time (earlier is better)
            // Assuming we stored finishTime, if not, fallback to WPM
            if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
        }
        return b.wpm - a.wpm;
    });

    const winner = sortedPlayers[0];

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/50" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 rounded-full bg-neon-yellow/10 mb-4">
                        <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-2">
                        RACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">COMPLETE</span>
                    </h1>
                    <p className="text-xl text-zinc-400">
                        Winner: <span className="text-white font-bold">{winner?.name}</span>
                    </p>
                </motion.div>

                <div className="grid gap-4">
                    {sortedPlayers.map((player, index) => (
                        <GlassCard
                            key={player._id}
                            className={`flex items-center justify-between p-6 ${index === 0 ? 'border-yellow-400/50 bg-yellow-400/5' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                  ${index === 0 ? 'bg-yellow-400 text-black' :
                                        index === 1 ? 'bg-zinc-400 text-black' :
                                            index === 2 ? 'bg-orange-700 text-white' : 'bg-white/10 text-white'}`}
                                >
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white">{player.name}</p>
                                    <p className="text-sm text-zinc-500">{player.finished ? "Finished" : "In Progress"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500 uppercase">Speed</p>
                                    <p className="text-2xl font-mono font-bold text-neon-blue">{Math.round(player.wpm)} <span className="text-sm text-zinc-600">WPM</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500 uppercase">Accuracy</p>
                                    <p className="text-2xl font-mono font-bold text-neon-purple">{Math.round(player.accuracy)}%</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="flex justify-center gap-6 mt-12">
                    <Link href="/arena">
                        <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                            <LogOut className="w-5 h-5" />
                            Exit Arena
                        </button>
                    </Link>

                    <button
                        onClick={() => router.push("/arena/create-room")}
                        className="flex items-center gap-2 px-8 py-4 rounded-full bg-neon-blue text-black font-bold hover:bg-neon-cyan transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Play Again
                    </button>
                </div>
            </div>
        </main>
    );
}
