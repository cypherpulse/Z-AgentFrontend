import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary, getFilePreview } from "@/lib/cloudinary";
import { API_BASE_URL, scheduleCoin } from "@/lib/api";

// Helper: fetch scheduled coins for wallet
async function getScheduledCoins(walletAddress: string) {
  const params = new URLSearchParams({ walletAddress });
  const response = await fetch(`/api/scheduler/scheduled-coins?${params}`);
  const result = await response.json();
  return result.data || [];
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
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    (async () => {
      try {
        const params = new URLSearchParams({ walletAddress: address });
        const response = await fetch(
          `/api/scheduler/scheduled-coins?${params}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          setError(`API error: ${response.status} ${errorText}`);
          setScheduledCoins([]);
          return;
        }
        const result = await response.json();
        setScheduledCoins(result.data || []);
      } catch (err) {
        setError(
          `Network error: ${err instanceof Error ? err.message : String(err)}`
        );
        setScheduledCoins([]);
      } finally {
        setLoading(false);
      }
    })();
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

  // Schedule coin creation (deferred execution, new backend spec)
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
      // Step 1: Upload metadata to IPFS (via backend) - EXACT create.tsx payload and extraction
      const metadataPayload = {
        creator: address,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
      };
      const metadataResponse = await fetch(
        `${API_BASE_URL}/api/write/upload-metadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadataPayload),
        }
      );
      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        setError(errorData.error || "Failed to upload metadata");
        setSubmitting(false);
        return;
      }
      const metadataData = await metadataResponse.json();
      // Align metadataUri extraction with create.tsx
      console.log("✅ Metadata uploaded:", metadataData);
      const metadataUri = metadataData.data?.uri; // Correctly access the URI from the data field
      if (!metadataUri) {
        setError("No metadata URI returned from backend");
        setSubmitting(false);
        return;
      }

      // Step 2: Prepare transaction calldata (but do not execute)
      const preparePayload = {
        creator: address,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
        currency: formData.currency,
        startingMarketCap: formData.startingMarketCap,
        chainId: 8453,
      };
      const prepareResponse = await fetch(
        `${API_BASE_URL}/api/write/create-coin/prepare`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preparePayload),
        }
      );
      if (!prepareResponse.ok) {
        const errorData = await prepareResponse.json();
        setError(errorData.error || "Failed to prepare transaction");
        setSubmitting(false);
        return;
      }
      const txData = await prepareResponse.json();
      const transaction = txData.data?.transaction || txData.data || txData;

      // Step 3: Extract and log the payload (do not execute transaction)
      const payload = {
        creator: address,
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        imageUri: formData.imageUri,
        currency: formData.currency,
        startingMarketCap: formData.startingMarketCap,
        chainId: 8453,
        metadataUri,
        transaction,
      };
      console.log("Extracted payload for scheduling:", payload);
      setSuccess("Payload extracted. See console log.");
      // Optionally, you can display the payload in the UI or use it for further scheduling logic

      // Step 4: Schedule the coin using the extracted payload
      const schedulePayload = {
        walletAddress: address,
        scheduledFor: new Date(formData.scheduledFor).toISOString(),
        coinParams: {
          name: formData.name,
          symbol: formData.symbol,
          metadataUri: metadataUri || "https://default-metadata.com",
          currency: formData.currency,
          chainId: 8453,
          startingMarketCap: formData.startingMarketCap,
          additionalOwners: [],
        },
        maxRetries: 3,
        transaction: {
          to: transaction.to,
          data: transaction.data,
          value: transaction.value,
        },
      };

      console.log("Payload being sent to backend:", schedulePayload);
      const scheduleResponse = await scheduleCoin(schedulePayload);
      console.log("✅ Coin scheduled successfully:", scheduleResponse);
      setSuccess("Coin scheduled successfully!");
      setShowForm(false); // Hide the form
      setFormData({
        name: "",
        symbol: "",
        description: "",
        imageUri: "",
        scheduledFor: "",
        currency: "ZORA",
        startingMarketCap: "LOW",
      });
      setPreviewUrl("");
      setPreviewType(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract payload"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {success && !showForm ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Info className="h-8 w-8 mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2">
              Coin Scheduled Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your coin launch has been scheduled. You can view it in your
              scheduled coins list.
            </p>
            <Button onClick={() => setSuccess("")}>Schedule Another</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold font-serif">Scheduler</h1>
                <p className="text-muted-foreground mt-2">
                  Schedule coin launches for the future
                </p>
              </div>
              <Button
                className="gap-2"
                onClick={() => setShowForm(true)}
                data-testid="button-schedule-new"
              >
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
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symbol">Symbol *</Label>
                      <Input
                        id="symbol"
                        placeholder="e.g., MCC"
                        value={formData.symbol}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            symbol: e.target.value.toUpperCase(),
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell people about your coin..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
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
                              setFormData({
                                ...formData,
                                imageUri: e.target.value,
                              });
                              if (e.target.value) {
                                setPreviewUrl(e.target.value);
                                setPreviewType(
                                  e.target.value.match(/\.(mp4|webm|ogg|mov)$/i)
                                    ? "video"
                                    : "image"
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
                        onChange={(e) =>
                          setFormData({ ...formData, scheduledFor: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitting || !address}
                    >
                      {submitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Schedule Coin"
                      )}
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
                <div className="text-center py-8 text-muted-foreground">
                  Loading scheduled coins...
                </div>
              ) : scheduledCoins.length > 0 ? (
                scheduledCoins.map((coin) => (
                  <Card
                    key={coin.id}
                    className="hover-elevate active-elevate-2 cursor-pointer"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center">
                          <span className="font-mono font-bold text-chart-2 text-lg">
                            {coin.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{coin.name}</CardTitle>
                          <p className="text-sm text-muted-foreground font-mono">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{coin.status}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Scheduled{" "}
                          {formatDistanceToNow(new Date(coin.scheduledFor), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Created{" "}
                          {formatDistanceToNow(new Date(coin.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No scheduled coins found.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
