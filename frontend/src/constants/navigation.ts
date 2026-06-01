import { BriefcaseBusiness, CircleUser, FileText, LayoutDashboard, Search, Settings } from "lucide-react";

export interface NavigationItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

export const recruiterNavigation: NavigationItem[] = [
    {
        title: "Dashboard",
        href: "/recruiter/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Jobs",
        href: "/recruiter/jobs",
        icon: BriefcaseBusiness,
    },
    {
        title: "Settings",
        href: "/recruiter/settings",
        icon: Settings
    },
]

export const applicantNavigation: NavigationItem[] = [
    {
        title: "Dashboard",
        href: "/applicant/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Browse Jobs",
        href: "/applicant/jobs",
        icon: Search
    },
    {
        title: "Applications",
        href: "/applicant/applications",
        icon: FileText
    },
    {
        title: "Profile",
        href: "/applicant/profile",
        icon: CircleUser
    },
    {
        title: "Settings",
        href: "/applicant/settings",
        icon: Settings
    }
]