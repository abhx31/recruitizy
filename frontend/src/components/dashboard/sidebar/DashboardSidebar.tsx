"use client";

import { SidebarContent } from "./SidebarContent";

export function DashboardSidebar() {
    return (
        <aside
            className="
                sticky top-0
                hidden lg:flex
                h-screen w-72
                flex-col
                border-r border-border/50
                bg-background/95
                backdrop-blur-xl
            "
        >
            <SidebarContent />
        </aside>
    );
}
