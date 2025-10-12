import { Navbar } from "../Navbar";
import { ThemeProvider } from "../ThemeProvider";

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <Navbar />
      <div className="p-8">
        <h2 className="text-xl font-bold">Navigation Bar Preview</h2>
        <p className="text-muted-foreground mt-2">The navbar is sticky and includes wallet connection</p>
      </div>
    </ThemeProvider>
  );
}
