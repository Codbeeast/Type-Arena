"use client";

import { motion } from "framer-motion";
import { PlusCircle, DoorOpen, Keyboard, Bot, ArrowLeft } from "lucide-react";
import { ModeCard } from "@/components/arena/ModeCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArenaOptionsPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />

                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">
                        CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">BATTLE</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Select a game mode to enter the arena. Compete with friends, challenge AI, or practice solo.
                    </p>
                </motion.div>

                {/* Mode Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ModeCard
                        title="Create Room"
                        description="Host a private lobby for friends or tournaments."
                        icon={PlusCircle}
                        color="blue"
                        delay={0.1}
                        onClick={() => router.push("/arena/create-room")}
                    />

                    <ModeCard
                        title="Join Room"
                        description="Enter a room code to join an existing battle."
                        icon={DoorOpen}
                        color="purple"
                        delay={0.2}
                        onClick={() => router.push("/arena/join-room")}
                    />

                    <ModeCard
                        title="Solo Practice"
                        description="Hone your skills with timed tests and custom texts."
                        icon={Keyboard}
                        color="cyan"
                        delay={0.3}
                        onClick={() => router.push("/arena/solo")}
                    />

                    <ModeCard
                        title="Race vs AI"
                        description="Challenge our advanced AI bots at various difficulties."
                        icon={Bot}
                        color="green"
                        delay={0.4}
                        onClick={() => router.push("/arena/ai-race")}
                    />
                </div>
            </div>
        </main>
    );
}
