import { DashboardSidebar } from "@/components/dashboard/sidebar/DashboardSidebar"
import { MobileSidebar } from "@/components/dashboard/sidebar/MobileSidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">

            <DashboardSidebar />
            <div className="flex-1">
                <MobileSidebar />
                <main>
                    {children}
                </main>
            </div>

        </div>
    )
}