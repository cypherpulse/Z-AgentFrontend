import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useCoin } from "@/lib/queries";
import { formatTokenPrice } from "@/lib/format";

interface PriceAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coinAddress: string | null;
}

export function PriceAlertDialog({ open, onOpenChange, coinAddress }: PriceAlertDialogProps) {
  const [alertCategory, setAlertCategory] = useState<'price' | 'volume'>('price');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [value, setValue] = useState('');
  const { addAlert } = useWatchlist();

  const { data: coinData } = useCoin(coinAddress || '', !!coinAddress);

  const currentPrice = coinData?.tokenPrice?.priceInUsdc
    ? parseFloat(coinData.tokenPrice.priceInUsdc)
    : 0;

  const currentVolume = coinData?.volume24h
    ? parseFloat(coinData.volume24h)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coinAddress || !value) return;

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) return;

    const fullAlertType = `${alertCategory}_${alertType}` as 'price_above' | 'price_below' | 'volume_above' | 'volume_below';

    addAlert(coinAddress, {
      type: fullAlertType,
      value: numericValue,
      isActive: true
    });

    setValue('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setValue('');
    setAlertCategory('price');
    setAlertType('above');
    onOpenChange(false);
  };

  const getCurrentValue = () => alertCategory === 'price' ? currentPrice : currentVolume;
  const getValueLabel = () => alertCategory === 'price' ? 'Target Price (USD)' : 'Target Volume (USD)';
  const getPlaceholder = () => {
    const current = getCurrentValue();
    return alertCategory === 'price'
      ? `e.g., ${current.toFixed(6)}`
      : `e.g., ${current.toLocaleString()}`;
  };

  const getPercentageChange = () => {
    if (!value) return '';
    const current = getCurrentValue();
    const target = parseFloat(value);
    const change = alertType === 'above'
      ? ((target - current) / current * 100)
      : ((current - target) / current * 100);
    return `${change.toFixed(2)}% ${alertType === 'above' ? 'above' : 'below'} current ${alertCategory}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Alert</DialogTitle>
        </DialogHeader>

        {coinData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-950/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {coinData.mediaContent?.previewImage?.small ? (
                  <img
                    src={coinData.mediaContent.previewImage.small}
                    alt={coinData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-mono font-bold text-primary-600 dark:text-primary-400 text-sm">
                    {coinData.symbol.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{coinData.name}</h3>
                {currentVolume > 0 && (
                  <p className="text-sm text-muted-foreground">
                    24h Volume: {formatTokenPrice(currentVolume.toString(), '$')}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alert-category">Alert Category</Label>
                <Select value={alertCategory} onValueChange={(value: 'price' | 'volume') => setAlertCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Alert</SelectItem>
                    <SelectItem value="volume">Volume Alert (24h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select value={alertType} onValueChange={(value: 'above' | 'below') => setAlertType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">{alertCategory === 'price' ? 'Price goes above' : 'Volume goes above'}</SelectItem>
                    <SelectItem value="below">{alertCategory === 'price' ? 'Price goes below' : 'Volume goes below'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-value">{getValueLabel()}</Label>
                <Input
                  id="target-value"
                  type="number"
                  step={alertCategory === 'price' ? "0.000001" : "1"}
                  min="0"
                  placeholder={getPlaceholder()}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
                {value && (
                  <p className="text-xs text-muted-foreground">
                    {getPercentageChange()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Set Alert
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}