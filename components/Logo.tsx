import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
    const sizes = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    return (
        <div className={cn("relative flex items-center gap-2", className)}>
            <div className={cn("relative", sizes[size])}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* Outer Hexagon Glow */}
                    <path
                        d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z"
                        className="stroke-neon-blue/50"
                        strokeWidth="2"
                        fill="none"
                        filter="url(#glow)"
                    />

                    {/* Inner Tech Shape */}
                    <path
                        d="M50 15 L85 35 V75 L50 95 L15 75 V35 L50 15Z"
                        className="stroke-neon-cyan"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="url(#gradient)"
                    />

                    {/* The "T" / Cursor Element */}
                    <path
                        d="M35 45 H65 M50 45 V70"
                        className="stroke-white"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    {/* Digital Accents */}
                    <circle cx="50" cy="30" r="3" className="fill-neon-blue animate-pulse" />
                    <path d="M25 50 L15 50" className="stroke-neon-blue/50" strokeWidth="2" />
                    <path d="M75 50 L85 50" className="stroke-neon-blue/50" strokeWidth="2" />

                    <defs>
                        <linearGradient id="gradient" x1="15" y1="15" x2="85" y2="95" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="rgba(0, 243, 255, 0.2)" />
                            <stop offset="100%" stopColor="rgba(0, 102, 255, 0.1)" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            </div>
            <span className={cn(
                "font-display font-bold tracking-wider text-white",
                size === "sm" && "text-lg",
                size === "md" && "text-2xl",
                size === "lg" && "text-4xl",
                size === "xl" && "text-6xl"
            )}>
                TYPE<span className="text-neon-blue">ARENA</span>
            </span>
        </div>
    );
};
