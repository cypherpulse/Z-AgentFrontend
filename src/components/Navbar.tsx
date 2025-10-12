import { Link, useLocation } from "wouter";
import { WalletButton } from "./WalletButton";
import { ThemeToggle } from "./ThemeToggle";
import { Zap } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/creator-coins", label: "Creator Coins" },
    { href: "/trade", label: "Trade" },
    { href: "/create", label: "Create" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg cursor-pointer">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold">Z-Agent</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase()}`}>
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
