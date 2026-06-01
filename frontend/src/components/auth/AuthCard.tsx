import { Card } from "../ui/card"

interface AuthCardProps {
    children: React.ReactNode
}
export function AuthCard({ children }: AuthCardProps) {
    return (
        <Card className=" rounded-[2rem]
                border border-white/[0.04]
                bg-white/[0.03]
                backdrop-blur-2xl
                shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="p-8 sm:p-10">
                {children}
            </div>
        </Card>
    )
}