"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Zap, Trophy, Timer, AlertCircle, RotateCcw, LogOut, ArrowLeft, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PRACTICE_TEXTS = [
    "The quick brown fox jumps over the lazy dog. Speed is nothing without accuracy.",
    "In the future, typing battles will decide the fate of humanity. Are you ready?",
    "Code is poetry written in a language that machines understand and humans appreciate.",
    "React Three Fiber brings the power of WebGL to the declarative world of React.",
    "Consistency is the key to mastery. Practice daily to improve your typing speed and precision.",
    "The best way to predict the future is to create it. Start building your dreams today.",
];

export default function SoloPage() {
    const router = useRouter();

    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [isFocused, setIsFocused] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize text
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const randomText = PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)];
        setText(randomText);
        setInput("");
        setStartTime(null);
        setEndTime(null);
        setWpm(0);
        setAccuracy(100);
        setProgress(0);
        setIsFinished(false);
        setGameStarted(false);
        setElapsedTime(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameStarted && !isFinished && startTime) {
            interval = setInterval(() => {
                setElapsedTime((Date.now() - startTime) / 1000);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [gameStarted, isFinished, startTime]);

    // Auto-focus input
    useEffect(() => {
        if (!isFinished) {
            inputRef.current?.focus();
        }
    }, [isFinished]);

    // Keep focus
    useEffect(() => {
        const handleClick = () => {
            if (!isFinished) {
                inputRef.current?.focus();
            }
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isFinished]);

    // Handle typing
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFinished) return;

        const value = e.target.value;

        // Start game on first input
        if (!gameStarted) {
            setGameStarted(true);
            setStartTime(Date.now());
        }

        setInput(value);

        // Calculate stats
        const correctChars = value.split("").filter((char, i) => char === text[i]).length;
        const currentProgress = Math.min((correctChars / text.length) * 100, 100);
        const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;

        const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60; // in minutes
        const currentWpm = timeElapsed > 0 ? Math.round((value.length / 5) / timeElapsed) : 0;

        setProgress(currentProgress);
        setAccuracy(currentAccuracy);
        setWpm(currentWpm);

        // Check finish
        if (value.length >= text.length) {
            setIsFinished(true);
            const end = Date.now();
            setEndTime(end);
            if (startTime) {
                setElapsedTime((end - startTime) / 1000);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => e.preventDefault();

    return (
        <main className="min-h-screen bg-background flex flex-col overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
            </div>

            {/* Header / Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    href="/arena"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Exit Practice
                </Link>
            </div>

            {/* TOP SECTION: Stats */}
            <section className="relative z-10 w-full p-6 border-b border-white/10 bg-black/40 backdrop-blur-md mt-16 md:mt-0">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-neon-cyan" />
                        Solo Practice
                    </h2>
                    <div className="flex gap-8 text-lg font-mono">
                        <div className="flex items-center gap-2 text-neon-blue">
                            <Zap className="w-5 h-5" />
                            <span>{wpm} WPM</span>
                        </div>
                        <div className="flex items-center gap-2 text-neon-purple">
                            <AlertCircle className="w-5 h-5" />
                            <span>{accuracy}% ACC</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                            <Timer className="w-5 h-5" />
                            <span>{elapsedTime.toFixed(1)}s</span>
                        </div>
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple rounded-xl blur opacity-30 animate-pulse" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInput}
                        onPaste={handlePaste}
                        onBlur={() => setIsFocused(false)}
                        onFocus={() => setIsFocused(true)}
                        className="relative w-full bg-black/80 border border-white/20 text-white text-xl md:text-2xl px-6 py-4 rounded-xl focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 placeholder-zinc-700 font-mono text-center transition-all shadow-2xl"
                        placeholder={gameStarted ? "Type here..." : "Start typing to begin..."}
                        autoComplete="off"
                        spellCheck="false"
                        disabled={isFinished}
                        maxLength={text.length}
                    />

                    {!isFocused && !isFinished && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl cursor-pointer pointer-events-none">
                            <p className="text-white font-bold animate-pulse">Click to focus</p>
                        </div>
                    )}
                </div>
            </section>

            {/* RESULTS OVERLAY */}
            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-lg"
                        >
                            <GlassCard className="p-8 border-neon-cyan/50 bg-neon-cyan/5">
                                <div className="text-center mb-8">
                                    <div className="inline-block p-4 rounded-full bg-neon-cyan/10 mb-4">
                                        <Trophy className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_15px_rgba(10,255,198,0.5)]" />
                                    </div>
                                    <h2 className="text-4xl font-display font-bold text-white mb-2">Practice Complete!</h2>
                                    <p className="text-zinc-400">Great job! Here are your stats.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-xs text-zinc-500 uppercase mb-1">WPM</p>
                                        <p className="text-3xl font-mono font-bold text-neon-blue">{wpm}</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-xs text-zinc-500 uppercase mb-1">Accuracy</p>
                                        <p className="text-3xl font-mono font-bold text-neon-purple">{accuracy}%</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-xs text-zinc-500 uppercase mb-1">Time</p>
                                        <p className="text-3xl font-mono font-bold text-white">{elapsedTime.toFixed(1)}s</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Link href="/arena" className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold">
                                            <LogOut className="w-5 h-5" />
                                            Exit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={resetGame}
                                        className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-neon-cyan text-black hover:bg-neon-cyan/80 transition-colors font-bold"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        Play Again
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
