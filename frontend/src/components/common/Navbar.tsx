import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-semibold">Recruitizy</h1>

      <div className="space-x-2">
        <Button variant="outline">Login</Button>
        <Button>Sign Up</Button>
      </div>
    </nav>
  );
}