"use client";

import { GlassCard } from "./ui/GlassCard";
import { Users, Lock, BarChart3, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Users,
        title: "Realtime Multiplayer",
        description: "Race against friends or random opponents in low-latency typing battles.",
        color: "text-neon-blue",
        bg: "bg-neon-blue/10"
    },
    {
        icon: Lock,
        title: "Private Rooms",
        description: "Create password-protected lobbies for tournaments and friendly matches.",
        color: "text-neon-purple",
        bg: "bg-neon-purple/10"
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Track your WPM, accuracy, and consistency trends over time.",
        color: "text-neon-cyan",
        bg: "bg-neon-cyan/10"
    },
    {
        icon: BrainCircuit,
        title: "Smart Scoring",
        description: "Our algorithm rewards consistency and complex word mastery, not just speed.",
        color: "text-white",
        bg: "bg-white/10"
    }
];

export function Features() {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                            NEXT-GEN
                        </span>{" "}
                        FEATURES
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Built for competitive typists who demand precision, speed, and style.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <GlassCard key={index} className="h-full" hoverEffect>
                            <div className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-4`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-display">{feature.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
