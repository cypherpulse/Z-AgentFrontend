import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Eye } from 'lucide-react';
import { truncateAddress, copyToClipboard, getExplorerUrl } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

interface AddressLinkProps {
  address: string;
  children: React.ReactNode;
}

export const AddressLink: React.FC<AddressLinkProps> = ({ address, children }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(address);
    if (success) {
      toast({
        title: "Address copied!",
        description: "The address has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy address to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleExplore = () => {
    window.open(getExplorerUrl(address, 'address'), '_blank', 'noopener,noreferrer');
  };

  const handleViewCoin = () => {
    // Navigate to coin detail page
    window.location.href = `/coin/${address}`;
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-1 group max-w-full">
      <Badge
        variant="outline"
        className="font-mono text-xs cursor-pointer hover:bg-accent transition-colors px-2 py-1 break-all sm:break-normal"
        onClick={handleViewCoin}
        title="Click to view coin details"
      >
        <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
        <span className="truncate sm:text-clip">{truncateAddress(address)}</span>
      </Badge>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 hover:bg-accent"
          title="Copy address"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExplore}
          className="h-6 w-6 p-0 hover:bg-accent"
          title="View on explorer"
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};