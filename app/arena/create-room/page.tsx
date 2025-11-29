"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateRoomPage() {
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const createRoom = useMutation(api.rooms.create);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsCreating(true);
        try {
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const creatorId = Math.random().toString(36).substring(2, 10);

            // Store creator ID in local storage to identify them later
            localStorage.setItem("playerId", creatorId);
            localStorage.setItem("playerName", name);

            await createRoom({
                roomId,
                creatorId,
                creatorName: name,
            });

            router.push(`/arena/room/${roomId}`);
        } catch (error) {
            console.error("Failed to create room:", error);
            setIsCreating(false);
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

                <h1 className="text-3xl font-display font-bold text-white mb-2">Create Room</h1>
                <p className="text-zinc-400 mb-8">Start a new battle and invite your friends.</p>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                            placeholder="Enter your username"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim() || isCreating}
                        className="w-full py-4 rounded-lg bg-neon-blue text-black font-bold text-lg hover:bg-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Room"
                        )}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}
