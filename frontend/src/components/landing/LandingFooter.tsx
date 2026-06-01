export function LandingFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row lg:px-8">
        <p>© {new Date().getFullYear()} Recruitizy</p>
        <p>AI-native recruitment</p>
      </div>
    </footer>
  );
}
