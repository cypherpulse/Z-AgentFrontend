import { ThemeProvider } from "../ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Theme Provider</h2>
            <p className="text-muted-foreground">Toggle between light and dark modes</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <p>This card adapts to the current theme</p>
        </div>
      </div>
    </ThemeProvider>
  );
}
