import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload, X, Loader2, Image as ImageIcon, Video, Calendar, Clock, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary, getFilePreview } from "@/lib/cloudinary";
import { API_BASE_URL } from "@/lib/api";

// Helper: fetch scheduled coins for wallet
async function getScheduledCoins(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const response = await fetch(`/api/scheduler/scheduled-coins?${params}`);
  const result = await response.json();
  return result.data || [];
}

async function scheduleCoinCreation(data: any) {
  const response = await fetch('/api/scheduler/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}


export default function SchedulePage() {
  const { address } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scheduledCoins, setScheduledCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUri: "",
    scheduledFor: "",
    currency: "ZORA",
    startingMarketCap: "LOW",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getScheduledCoins(address)
      .then(setScheduledCoins)
      .finally(() => setLoading(false));
  }, [address, showForm, success]);

  // File upload logic (same as create.tsx)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    setUploadProgress(0);
    try {
      const preview = await getFilePreview(file);
      setPreviewUrl(preview);
      setPreviewType(file.type.startsWith("video/") ? "video" : "image");
      const response = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress.percentage);
      });
      setFormData({ ...formData, imageUri: response.secure_url });
      setPreviewUrl(response.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl("");
      setPreviewType(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClearMedia = () => {
    setFormData({ ...formData, imageUri: "" });
    setPreviewUrl("");
    setPreviewType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Schedule coin creation (deferred execution)
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }
    if (!formData.name || !formData.symbol || !formData.scheduledFor) {
      setError("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      // Step 1: Upload metadata to IPFS (via backend)
      const metadataResponse = await fetch(`${API_BASE_URL}/api/write/upload-metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator: address,
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          imageUri: formData.imageUri,
        }),
      });
      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        throw new Error(errorData.error || "Failed to upload metadata");
      }
      const metadataData = await metadataResponse.json();
      // Step 2: Prepare transaction calldata (but do not execute)
      const prepareResponse = await fetch(`${API_BASE_URL}/api/write/create-coin/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator: address,
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          imageUri: formData.imageUri,
          currency: formData.currency,
          startingMarketCap: formData.startingMarketCap,
          chainId: 8453,
        }),
      });
      if (!prepareResponse.ok) {
        const errorData = await prepareResponse.json();
        throw new Error(errorData.error || "Failed to prepare transaction");
      }
      const txData = await prepareResponse.json();
      // Step 3: Schedule coin creation (deferred)
      const payload = {
        walletAddress: address,
        scheduledFor: new Date(formData.scheduledFor).toISOString(),
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
        currency: formData.currency,
        startingMarketCap: formData.startingMarketCap,
        chainId: 8453,
        transaction: txData.data?.transaction || txData.data || txData,
      };
      const result = await scheduleCoinCreation(payload);
      if (result.success) {
        setSuccess("Coin scheduled successfully!");
        setShowForm(false);
        setFormData({
          name: "",
          symbol: "",
          description: "",
          imageUri: "",
          scheduledFor: "",
          currency: "ZORA",
          startingMarketCap: "LOW",
        });
      } else {
        setError(result.message || "Failed to schedule coin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule coin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-serif">Scheduler</h1>
            <p className="text-muted-foreground mt-2">Schedule coin launches for the future</p>
          </div>
          <Button className="gap-2" onClick={() => setShowForm(true)} data-testid="button-schedule-new">
            <Plus className="h-4 w-4" />
            Schedule New
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>Coin scheduled successfully!</AlertDescription>
          </Alert>
        )}

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Schedule New Coin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSchedule} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Coin Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., My Creator Coin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., MCC"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell people about your coin..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Media (Image or Video)</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        type="url"
                        placeholder="Or paste image/video URL"
                        value={formData.imageUri}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUri: e.target.value });
                          if (e.target.value) {
                            setPreviewUrl(e.target.value);
                            setPreviewType(
                              e.target.value.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image"
                            );
                          }
                        }}
                        disabled={uploading || submitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || submitting}
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                      {(previewUrl || formData.imageUri) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleClearMedia}
                          disabled={uploading || submitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {uploading && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {previewUrl && previewType && (
                      <div className="border rounded-lg p-2">
                        {previewType === "video" ? (
                          <video
                            src={previewUrl}
                            controls
                            className="w-full h-48 object-contain rounded"
                          />
                        ) : (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-contain rounded"
                          />
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" />
                      Images: 512x512px recommended (max 10MB)
                      <Video className="h-3 w-3 ml-2" />
                      Videos: max 100MB
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Schedule Date & Time *</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={submitting || !address}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Schedule Coin"}
                </Button>
                {!address && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please connect your wallet to schedule a coin
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading scheduled coins...</div>
          ) : scheduledCoins.length > 0 ? (
            scheduledCoins.map((coin) => (
              <Card key={coin.id} className="hover-elevate active-elevate-2 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center">
                      <span className="font-mono font-bold text-chart-2 text-lg">
                        {coin.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{coin.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{coin.symbol}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{coin.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(coin.scheduledFor).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(coin.scheduledFor), { addSuffix: true })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scheduled coins</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first coin launch to get started
                </p>
                <Button onClick={() => setShowForm(true)} data-testid="button-schedule-first">Schedule Your First Coin</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
