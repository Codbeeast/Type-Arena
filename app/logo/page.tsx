import { Logo } from "@/components/Logo";

export default function LogoPreviewPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-12 p-8">
            <h1 className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Logo Preview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-zinc-600 text-xs">Size: SM</span>
                    <Logo size="sm" />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <span className="text-zinc-600 text-xs">Size: MD (Default)</span>
                    <Logo size="md" />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <span className="text-zinc-600 text-xs">Size: LG</span>
                    <Logo size="lg" />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <span className="text-zinc-600 text-xs">Size: XL</span>
                    <Logo size="xl" />
                </div>
            </div>
        </div>
    );
}
