import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, ExternalLink } from "lucide-react";

interface ProfileCardProps {
  address: string;
  displayName: string;
  handle?: string;
  bio?: string;
  avatar?: string;
  creatorCoinAddress?: string;
  hasTwitter?: boolean;
}

export function ProfileCard({
  address,
  displayName,
  handle,
  bio,
  avatar,
  creatorCoinAddress,
  hasTwitter,
}: ProfileCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 ring-2 ring-primary">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback className="text-2xl">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 w-full">
            <h2 className="text-2xl font-bold" data-testid="text-profile-name">{displayName}</h2>
            {handle && <p className="text-muted-foreground">@{handle}</p>}
            <p className="text-sm font-mono text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          {bio && <p className="text-sm text-muted-foreground max-w-md">{bio}</p>}

          <div className="flex gap-2 flex-wrap justify-center">
            {creatorCoinAddress && (
              <Badge variant="secondary" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Creator Coin
              </Badge>
            )}
            {hasTwitter && (
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-twitter">
                <Twitter className="h-4 w-4" />
                Follow
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
