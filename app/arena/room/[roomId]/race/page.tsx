"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Zap, Trophy, Timer, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ResultsModal from "./ResultsModal";

export default function RacePage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const router = useRouter();

    const room = useQuery(api.rooms.getRoom, { roomId });
    const players = useQuery(api.rooms.getPlayers, { roomId });
    const updateProgress = useMutation(api.rooms.updateProgress);

    // Removed local text state to avoid sync issues
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [isFocused, setIsFocused] = useState(true);
    const [showResultsModal, setShowResultsModal] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input
    useEffect(() => {
        if (gameStarted && !isFinished) {
            inputRef.current?.focus();
        }
    }, [gameStarted, isFinished]);

    // Keep focus
    useEffect(() => {
        const handleClick = () => {
            if (gameStarted && !isFinished) {
                inputRef.current?.focus();
            }
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [gameStarted, isFinished]);

    // Countdown logic
    useEffect(() => {
        // Only start countdown if room text is available
        if (countdown > 0 && room?.text) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !gameStarted) {
            setGameStarted(true);
            setStartTime(Date.now());
            inputRef.current?.focus();
        }
    }, [countdown, room?.text, gameStarted]);

    // Handle typing
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!gameStarted || isFinished || !room) return;

        const value = e.target.value;
        setInput(value);

        // Calculate stats
        const text = room.text;
        const correctChars = value.split("").filter((char, i) => char === text[i]).length;
        const currentProgress = Math.min((correctChars / text.length) * 100, 100);
        const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;

        const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60; // in minutes
        const currentWpm = timeElapsed > 0 ? Math.round((value.length / 5) / timeElapsed) : 0;

        setProgress(currentProgress);
        setAccuracy(currentAccuracy);
        setWpm(currentWpm);

        // Update backend
        const playerName = localStorage.getItem("playerName");
        if (playerName) {
            updateProgress({
                roomId,
                playerName,
                progress: currentProgress,
                wpm: currentWpm,
                accuracy: currentAccuracy,
                finished: false,
            });
        }

        // Check finish
        if (value.length >= text.length) {
            // Finish regardless of accuracy as long as length is reached
            setIsFinished(true);
            setShowResultsModal(true); // Show modal immediately
            if (playerName) {
                updateProgress({
                    roomId,
                    playerName,
                    progress: 100, // Force 100% progress since they reached the end
                    wpm: currentWpm,
                    accuracy: currentAccuracy,
                    finished: true,
                });
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => e.preventDefault();

    if (!room || !players) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
            </div>
        );
    }

    const currentPlayerName = typeof window !== 'undefined' ? localStorage.getItem("playerName") : "";
    const text = room.text; // Use room text directly

    console.log("Players:", players);

    return (
        <>
            <main className="min-h-screen bg-background flex flex-col overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                </div>

                {/* Countdown Overlay */}
                <AnimatePresence>
                    {!gameStarted && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                        >
                            <motion.div
                                key={countdown}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-9xl font-display font-bold text-neon-blue text-glow"
                            >
                                {countdown > 0 ? countdown : "GO!"}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* TOP SECTION: Players & Stats */}
                <section className="relative z-10 w-full p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Leaderboard
                            </h2>
                            <div className="flex gap-6 text-sm font-mono">
                                <div className="flex items-center gap-2 text-neon-blue">
                                    <Zap className="w-4 h-4" />
                                    <span>{wpm} WPM</span>
                                </div>
                                <div className="flex items-center gap-2 text-neon-purple">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{accuracy}% ACC</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {players.map((player) => (
                                <div key={player._id} className={cn(
                                    "relative p-3 rounded-lg border transition-all",
                                    player.name === currentPlayerName
                                        ? "bg-white/10 border-neon-blue/50 shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                                        : "bg-white/5 border-white/5"
                                )}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={cn(
                                            "font-bold text-sm",
                                            player.name === currentPlayerName ? "text-white" : "text-zinc-400"
                                        )}>
                                            {player.name} {player.name === currentPlayerName && "(You)"}
                                        </span>
                                        <span className="text-xs font-mono text-zinc-500">{Math.round(player.wpm)} WPM</span>
                                    </div>
                                    <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn(
                                                "h-full rounded-full",
                                                player.finished ? "bg-neon-green" : "bg-gradient-to-r from-neon-blue to-neon-purple"
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${player.progress}%` }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CENTER SECTION: Prompt */}
                <section className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 max-w-5xl mx-auto w-full">
                    <GlassCard className="p-10 w-full min-h-[300px] flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="font-mono text-2xl md:text-3xl leading-relaxed tracking-wide break-words text-justify select-none relative z-10">
                            {text.split("").map((char, index) => {
                                let color = "text-zinc-700"; // Default/Remaining
                                let bg = "bg-transparent";
                                let decoration = "none";

                                if (index < input.length) {
                                    if (input[index] === char) {
                                        color = "text-neon-green text-glow-sm"; // Correct
                                    } else {
                                        color = "text-red-500"; // Incorrect
                                        bg = "bg-red-500/10";
                                        decoration = "underline";
                                    }
                                } else if (index === input.length) {
                                    // Current cursor position
                                    bg = "bg-neon-blue/20";
                                    color = "text-white";
                                }

                                return (
                                    <span
                                        key={index}
                                        className={cn(
                                            "transition-all duration-75 rounded-sm",
                                            color,
                                            bg,
                                            decoration === "underline" && "underline decoration-red-500 decoration-2 underline-offset-4"
                                        )}
                                    >
                                        {char}
                                    </span>
                                );
                            })}
                        </div>
                    </GlassCard>
                </section>

                {/* BOTTOM SECTION: Input */}
                <section className="relative z-10 w-full p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="max-w-3xl mx-auto relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan rounded-xl blur opacity-30 animate-pulse" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInput}
                            onPaste={handlePaste}
                            onBlur={() => setIsFocused(false)}
                            onFocus={() => setIsFocused(true)}
                            className="relative w-full bg-black/80 border border-white/20 text-white text-xl md:text-2xl px-6 py-4 rounded-xl focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 placeholder-zinc-700 font-mono text-center transition-all shadow-2xl"
                            placeholder={gameStarted ? "Type here..." : "Get ready..."}
                            autoComplete="off"
                            spellCheck="false"
                            disabled={!gameStarted || isFinished}
                        />

                        {!isFocused && gameStarted && !isFinished && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl cursor-pointer pointer-events-none">
                                <p className="text-white font-bold animate-pulse">Click to focus</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Results Modal */}
            <AnimatePresence>
                {(showResultsModal || players.some(p => p.finished)) && (
                    <ResultsModal
                        players={players}
                        startTime={room.startTime}
                        roomId={roomId}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
