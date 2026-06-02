import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ApplicationFilterBarProps {
    search: string;

    onSearchChange: (
        value: string
    ) => void;

    status: string;

    onStatusChange: (
        value: string
    ) => void;
}
export function ApplicationFilterBar({
    search,
    onSearchChange,
    status,
    onStatusChange,
}: ApplicationFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-background/80 p-5 shadow-sm lg:flex-row lg:items-center">

            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={search}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                    }}
                    placeholder="Search applications..."
                    className="h-11 rounded-xl pl-10"
                />
            </div>

            <Select
                value={status}
                onValueChange={
                    onStatusChange
                }
            >
                <SelectTrigger className="h-11 w-full rounded-xl lg:w-[220px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">
                        All Statuses
                    </SelectItem>

                    <SelectItem value="PENDING">
                        Pending
                    </SelectItem>

                    <SelectItem value="SHORTLISTED">
                        Shortlisted
                    </SelectItem>

                    <SelectItem value="REJECTED">
                        Rejected
                    </SelectItem>
                </SelectContent>

            </Select>

        </div>
    )
}