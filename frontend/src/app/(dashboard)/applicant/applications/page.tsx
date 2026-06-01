"use client"
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationFilterBar } from "@/components/applications/ApplicationFilterBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useState } from "react";

type ApplicationStatus =
    | "PENDING"
    | "REVIEWING"
    | "SHORTLISTED"
    | "REJECTED"
    | "ACCEPTED";

const applications: {
    id: string;
    title: string;
    company: string;
    appliedAt: string;
    status: ApplicationStatus
}[] = [
        {
            id: "1",
            title: "Frontend Engineer",
            company: "Vercel",
            appliedAt: "May 12, 2026",
            status: "REVIEWING",
        },
        {
            id: "2",
            title: "Backend Developer",
            company: "Stripe",
            appliedAt: "May 10, 2026",
            status: "PENDING",
        },
        {
            id: "3",
            title: "DevOps Engineer",
            company: "Netflix",
            appliedAt: "May 2, 2026",
            status: "PENDING",
        },
    ]

export default function ApplicationsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const filteredApplications = applications.filter(
        (application) => {
            const matchesSearch = application.title.toLowerCase().includes(search.toLowerCase()) || application.company.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = status === "all" || application.status === status;

            return (
                matchesSearch && matchesStatus
            );
        }
    );

    return (
        <div className="space-y-8 p-6 lg:p-8">
            <DashboardHeader
                title="Applications"
                description="Track your job applications and their current status."
            />

            <ApplicationFilterBar
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
            />

            <div
                className="
        grid gap-6

        xl:grid-cols-2
    "
            >

                {filteredApplications.map(
                    (application) => (

                        <ApplicationCard
                            key={application.id}

                            id={application.id}

                            title={application.title}

                            company={application.company}

                            appliedAt={
                                application.appliedAt
                            }

                            status={
                                application.status
                            }
                        />

                    )
                )}

            </div>

            {filteredApplications.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 py-20 text-center">
                    <h3 className="text-lg font-semibold tracking-tight">
                        No applications found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your filters and search.
                    </p>
                </div>
            )}
        </div>
    )
}