export function BrandPanel() {
  return (
    <div className="relative flex h-full overflow-hidden border-r border-border/50 bg-background px-16 py-14">
      
      {/* Ambient Glow */}
      <div className="absolute left-1/3 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex max-w-lg flex-col justify-between">
        
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Recruitizy
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          
          <div className="space-y-5">
            <h2 className="max-w-md text-5xl font-semibold leading-tight tracking-tight">
              AI-powered hiring workspace for modern teams.
            </h2>

            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Streamline recruitment workflows, evaluate candidates faster,
              and make hiring decisions with confidence.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">
                Smart candidate matching
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">
                AI-powered resume intelligence
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">
                Centralized hiring pipelines
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div>
          <p className="text-sm text-muted-foreground">
            Built for recruiters, startups, and modern hiring teams.
          </p>
        </div>

      </div>
    </div>
  );
}