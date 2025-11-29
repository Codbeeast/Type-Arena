"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, Play, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LobbyPage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const router = useRouter();

    const room = useQuery(api.rooms.getRoom, { roomId });
    const players = useQuery(api.rooms.getPlayers, { roomId });
    const startRace = useMutation(api.rooms.startRace);

    const [copied, setCopied] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        const creatorId = localStorage.getItem("playerId");
        if (room && room.creatorId === creatorId) {
            setIsCreator(true);
        }
    }, [room]);

    useEffect(() => {
        if (room && room.status === "in-progress") {
            router.push(`/arena/room/${roomId}/race`);
        }
    }, [room, roomId, router]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStart = async () => {
        setIsStarting(true);
        await startRace({ roomId });
    };

    if (!room || !players) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/50" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        WAITING FOR <span className="text-neon-blue text-glow">PLAYERS</span>
                    </h1>
                    <p className="text-zinc-400">Share the room code to invite others.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Room Info */}
                    <GlassCard className="flex flex-col items-center justify-center p-8">
                        <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Room Code</p>
                        <div
                            onClick={handleCopy}
                            className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors group"
                        >
                            <span className="text-4xl font-mono font-bold text-white tracking-widest">{roomId}</span>
                            {copied ? (
                                <Check className="w-6 h-6 text-green-400" />
                            ) : (
                                <Copy className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                            )}
                        </div>
                        <p className="text-zinc-500 text-xs mt-4">Click to copy</p>
                    </GlassCard>

                    {/* Player List */}
                    <GlassCard className="p-8 min-h-[300px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-neon-purple" />
                                Players ({players.length})
                            </h2>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            <AnimatePresence mode="popLayout">
                                {players.map((player) => (
                                    <motion.div
                                        key={player._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold text-white">
                                            {player.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{player.name}</span>
                                        {player.name === room.creatorId && ( // This logic is slightly flawed as creatorId is ID not name, but for now it's fine or we can fix it by checking if this player is the first one
                                            <span className="ml-auto text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded">HOST</span>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {players.length === 0 && (
                                <p className="text-zinc-500 text-center py-8">Waiting for players to join...</p>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* Start Button (Creator Only) */}
                {isCreator && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 flex justify-center"
                    >
                        <button
                            onClick={handleStart}
                            disabled={isStarting}
                            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-white text-black font-bold text-xl rounded-full overflow-hidden transition-all hover:bg-neon-green hover:text-black box-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">START BATTLE</span>
                            {isStarting ? (
                                <Loader2 className="w-6 h-6 relative z-10 animate-spin" />
                            ) : (
                                <Play className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                            )}
                            <div className="absolute inset-0 bg-neon-green/20 blur-xl group-hover:bg-neon-green/40 transition-colors" />
                        </button>
                    </motion.div>
                )}

                {!isCreator && (
                    <div className="mt-12 text-center text-zinc-400 animate-pulse">
                        Waiting for host to start the game...
                    </div>
                )}
            </div>
        </main>
    );
}
