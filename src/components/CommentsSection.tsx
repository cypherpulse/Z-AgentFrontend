import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { truncateAddress } from "@/lib/format";

interface Comment {
  commentId: string;
  nonce: string;
  userAddress: string;
  txHash: string;
  comment: string;
  timestamp: number;
  userProfile: {
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string | null;
        small: string;
        medium: string;
      };
    } | null;
  };
  replies: {
    count: number;
    edges: any[];
  };
}

interface CommentsSectionProps {
  comments: Comment[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  initialCount?: number;
}

export function CommentsSection({ 
  comments, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  isLoadingMore,
  initialCount = 5 
}: CommentsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Filter out any null/undefined comments
  const validComments = comments.filter(c => c && c.commentId);
  
  // Display comments based on showAll state
  const displayedComments = showAll ? validComments : validComments.slice(0, initialCount);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (validComments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({validComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedComments.map((comment) => (
          <div 
            key={comment.commentId} 
            className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              {comment.userProfile?.avatar?.previewImage?.small ? (
                <AvatarImage src={comment.userProfile.avatar.previewImage.small} />
              ) : null}
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/5">
                {comment.userProfile?.handle?.slice(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {comment.userProfile?.handle || truncateAddress(comment.userAddress)}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(comment.timestamp * 1000), { addSuffix: true })}
                  </span>
                </div>
                <a
                  href={`https://basescan.org/tx/${comment.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex-shrink-0"
                  title="View transaction"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                {comment.comment}
              </p>
              
              {comment.replies.count > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span>{comment.replies.count} {comment.replies.count === 1 ? 'reply' : 'replies'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Show More button - shows when there are more than initialCount items but not showing all */}
        {!showAll && validComments.length > initialCount && (
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              size="sm"
            >
              Show More ({validComments.length - initialCount} more)
            </Button>
          </div>
        )}
        
        {/* Load More button - fetches next page from API when showing all */}
        {showAll && hasMore && onLoadMore && (
          <div className="flex justify-center pt-2">
            <Button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              size="sm"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Comments"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
