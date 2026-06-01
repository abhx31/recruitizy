import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface JobsFilterBarProps {
    search: string;
    onSearchChange: (
        value: string
    ) => void;
    experience: string;
    onExperienceChange: (
        value: string
    ) => void;
}

export function JobsFilterBar({
    search,
    onSearchChange,
    experience,
    onExperienceChange,
}: JobsFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-background/80 p-5 shadow-sm lg:flex-row lg:items-center">
            <div className="relative flex-1">
                <Search className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-muted-foreground" />

                <Input value={search} onChange={(e) => {
                    onSearchChange(e.target.value);
                }}

                    placeholder="Search jobs or companies..."
                    className="h-11 rounded-xl pl-10"
                />
            </div>
            <Select
                value={experience}
                onValueChange={onExperienceChange}
            >
                <SelectTrigger className="h-11 w-full rounded-xl lg:w-[220px]">
                    <SelectValue placeholder="Experience level" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="FRESHER">Fresher</SelectItem>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                </SelectContent>
            </Select>

        </div>
    )
}