"use client";

import { GlassCard } from "./ui/GlassCard";
import { Zap, Target, Trophy } from "lucide-react";

export function StatsStrip() {
    return (
        <section className="w-full py-10 relative z-10 -mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="flex items-center gap-4" hoverEffect>
                        <div className="p-3 rounded-full bg-neon-blue/10 text-neon-blue">
                            <Zap className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm uppercase tracking-wider">Top Speed</p>
                            <p className="text-3xl font-display font-bold text-white">210 <span className="text-sm text-zinc-500 font-sans">WPM</span></p>
                        </div>
                    </GlassCard>

                    <GlassCard className="flex items-center gap-4" hoverEffect>
                        <div className="p-3 rounded-full bg-neon-cyan/10 text-neon-cyan">
                            <Target className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm uppercase tracking-wider">Accuracy</p>
                            <p className="text-3xl font-display font-bold text-white">99.8 <span className="text-sm text-zinc-500 font-sans">%</span></p>
                        </div>
                    </GlassCard>

                    <GlassCard className="flex items-center gap-4" hoverEffect>
                        <div className="p-3 rounded-full bg-neon-purple/10 text-neon-purple">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm uppercase tracking-wider">Wins</p>
                            <p className="text-3xl font-display font-bold text-white">1,245 <span className="text-sm text-zinc-500 font-sans">Races</span></p>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
}
