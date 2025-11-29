"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";

const PREVIEW_TEXT = "The quick brown fox jumps over the lazy dog. Speed is nothing without accuracy. Master the keyboard.";

export function TypingPreview() {
    const [typedIndex, setTypedIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTypedIndex((prev) => {
                if (prev >= PREVIEW_TEXT.length) {
                    return 0;
                }
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            TEST YOUR <span className="text-neon-cyan text-glow">SKILLS</span>
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            Experience the smoothest typing engine on the web. Instant feedback, zero latency, and satisfying visual effects that make every keystroke feel impactful.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                <p className="text-zinc-500 text-sm mb-1">Current WPM</p>
                                <p className="text-3xl font-mono text-neon-cyan">124</p>
                            </div>
                            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                <p className="text-zinc-500 text-sm mb-1">Accuracy</p>
                                <p className="text-3xl font-mono text-neon-purple">100%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <GlassCard className="min-h-[300px] flex items-center justify-center p-8 md:p-12">
                            <div className="font-mono text-2xl md:text-3xl leading-relaxed break-words w-full">
                                {PREVIEW_TEXT.split("").map((char, index) => {
                                    const isTyped = index < typedIndex;
                                    const isCurrent = index === typedIndex;

                                    return (
                                        <span
                                            key={index}
                                            className={`relative transition-colors duration-100 ${isTyped ? "text-white" : "text-zinc-600"
                                                } ${isCurrent ? "text-neon-blue" : ""}`}
                                        >
                                            {isCurrent && (
                                                <motion.span
                                                    layoutId="cursor"
                                                    className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-neon-blue"
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>
    );
}
