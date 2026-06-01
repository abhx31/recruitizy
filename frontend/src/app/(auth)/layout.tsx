import { BrandPanel } from "@/components/auth/BrandPanel"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            <div className="grid min-h-screen lg:grid-cols-2">

                <div className="hidden lg:flex">
                    <BrandPanel />
                </div>

                <div className="relative flex items-center justify-center px-8 py-12">

                    <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />

                    <div
                        className="absolute inset-0 opacity-[0.015]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                            backgroundSize: "64px 64px",
                        }}
                    />

                    <div className="relative z-10 w-full max-w-xl">
                        {children}
                    </div>

                </div>
            </div>
        </main>
    )
}