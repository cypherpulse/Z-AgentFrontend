import { Link, useLocation } from "wouter";
import { WalletButton } from "./WalletButton";
import { ThemeToggle } from "./ThemeToggle";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { LOGO_URL } from "@/lib/format";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/ai", label: "AI" },
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/creator-coins", label: "Creator Coins" },
    // { href: "/trade", label: "Trade" },
    { href: "/create", label: "Create" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-primary-200 dark:border-primary-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 sm:gap-3 hover:opacity-80 active:opacity-70 px-2 py-1 rounded-lg cursor-pointer transition-opacity">
              <img 
                src={LOGO_URL}
                alt="Z-Agent Logo"
                className="h-12 w-12 sm:h-10 sm:w-10 object-contain"
                loading="eager"
              />
              <span className="text-base sm:text-xl font-bold text-foreground">Z-Agent</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase()}`}>
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover-elevate active-elevate-2 cursor-pointer ${
                    location === link.href
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm"
                      : "text-foreground/80 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <WalletButton />
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden border-2 border-primary-300 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-400 dark:hover:border-primary-600"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-2 border-primary-200 dark:border-primary-800">
                <SheetHeader className="border-b border-primary-200 dark:border-primary-800 pb-4">
                  <SheetTitle className="flex items-center gap-3 text-lg">
                    <img 
                      src={LOGO_URL}
                      alt="Z-Agent Logo"
                      className="h-8 w-8 object-contain"
                      loading="eager"
                    />
                    <span className="text-foreground font-bold">Z-Agent</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Navigation Links */}
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-all cursor-pointer border-2 ${
                          location === link.href
                            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700 shadow-md"
                            : "text-foreground hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                        }`}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t-2 border-primary-200 dark:border-primary-800">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm font-medium text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    <div className="px-4">
                      <WalletButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
