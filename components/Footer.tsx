"use client";

import { Github, Twitter, Disc } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 relative z-10 bg-black/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2">
                            TYPE<span className="text-neon-blue">ARENA</span>
                        </h3>
                        <p className="text-zinc-500 text-sm">
                            © 2024 Type Arena. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-zinc-400 hover:text-neon-blue transition-colors">
                            <Github className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-zinc-400 hover:text-neon-cyan transition-colors">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-zinc-400 hover:text-neon-purple transition-colors">
                            <Disc className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
