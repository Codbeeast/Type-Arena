"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick?: () => void;
    color?: "blue" | "purple" | "cyan" | "green";
    delay?: number;
}

export function ModeCard({ title, description, icon: Icon, onClick, color = "blue", delay = 0 }: ModeCardProps) {
    const colorStyles = {
        blue: "text-neon-blue group-hover:border-neon-blue/50 bg-neon-blue/5",
        purple: "text-neon-purple group-hover:border-neon-purple/50 bg-neon-purple/5",
        cyan: "text-neon-cyan group-hover:border-neon-cyan/50 bg-neon-cyan/5",
        green: "text-green-400 group-hover:border-green-400/50 bg-green-400/5",
    };

    const glowStyles = {
        blue: "group-hover:bg-neon-blue/10",
        purple: "group-hover:bg-neon-purple/10",
        cyan: "group-hover:bg-neon-cyan/10",
        green: "group-hover:bg-green-400/10",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: delay
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "group relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/10 backdrop-blur-md cursor-pointer transition-all duration-300 overflow-hidden",
                "bg-black/40 hover:shadow-2xl",
                colorStyles[color]
            )}
        >
            <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-500",
                glowStyles[color]
            )} />

            <div className="relative z-10 mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-10 h-10" />
            </div>

            <h3 className="relative z-10 text-2xl font-display font-bold text-white mb-3 text-center group-hover:text-glow transition-all">
                {title}
            </h3>

            <p className="relative z-10 text-zinc-400 text-center text-sm leading-relaxed max-w-[200px]">
                {description}
            </p>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/50 transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-white/50 transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-white/50 transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/50 transition-colors" />
        </motion.div>
    );
}
