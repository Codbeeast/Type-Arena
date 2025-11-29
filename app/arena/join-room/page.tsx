"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function JoinRoomPage() {
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState("");
    const joinRoom = useMutation(api.rooms.join);
    const router = useRouter();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomId.trim() || !name.trim()) return;

        setIsJoining(true);
        setError("");
        try {
            // Store player ID in local storage
            localStorage.setItem("playerName", name);

            await joinRoom({
                roomId: roomId.toUpperCase(),
                playerName: name,
            });

            router.push(`/arena/room/${roomId.toUpperCase()}`);
        } catch (error: any) {
            console.error("Failed to join room:", error);
            setError(error.message || "Failed to join room");
            setIsJoining(false);
        }
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl"
            >
                <Link
                    href="/arena"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Arena
                </Link>

                <h1 className="text-3xl font-display font-bold text-white mb-2">Join Room</h1>
                <p className="text-zinc-400 mb-8">Enter the room code to join the battle.</p>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-zinc-300 mb-2">
                            Room Code
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono uppercase tracking-wider"
                            placeholder="Ex: A1B2C3"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                            placeholder="Enter your username"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!roomId.trim() || !name.trim() || isJoining}
                        className="w-full py-4 rounded-lg bg-neon-purple text-white font-bold text-lg hover:bg-neon-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isJoining ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            "Join Battle"
                        )}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}
