import { Link } from "wouter";
import { Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Cool words */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Built with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> for the creator economy
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Empowering creators, one coin at a time
            </p>
          </div>

          {/* Right side - Creator coin link */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Created by</span>
            <Link
              href="/coin/0xdc7b0bbc9634479ea5ac410222cba90ba4f33391"
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              cypherpulse.base.eth
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2025 Z-Agent. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <span>Powered by Base & Zora</span>
              <span>•</span>
              <span>Built for creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}