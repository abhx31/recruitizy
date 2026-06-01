interface AuthHeaderProps {
    title: string;
    description: string;
}

export function AuthHeader({
    title,
    description
}: AuthHeaderProps) {
    return (
        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
                {title}
            </h1>

            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    )
}