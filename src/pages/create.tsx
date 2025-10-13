import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { useState, useRef } from "react";
import { uploadToCloudinary, getFilePreview } from "@/lib/cloudinary";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { useLocation } from "wouter";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

interface CreateCoinPrepareResponse {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
  estimatedGas: string;
}

export default function CreatePage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUri: "",
    currency: "ZORA" as const,
    startingMarketCap: "LOW" as const,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Wagmi hooks for transaction
  const { sendTransaction, data: txHash, isPending: isSendingTx } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      // Show preview immediately
      const preview = await getFilePreview(file);
      setPreviewUrl(preview);
      setPreviewType(file.type.startsWith("video/") ? "video" : "image");

      // Upload to Cloudinary
      const response = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress.percentage);
      });

      // Update form data with uploaded URL
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

  // Clear uploaded media
  const handleClearMedia = () => {
    setFormData({ ...formData, imageUri: "" });
    setPreviewUrl("");
    setPreviewType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle coin creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get token from localStorage (where it's stored after auth)
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setError("Please connect your wallet and authenticate first");
      return;
    }

    if (!formData.name || !formData.symbol) {
      setError("Please fill in all required fields");
      return;
    }

    setCreating(true);
    setError("");

    try {
      // Step 1: Upload metadata to IPFS (via backend)
      const metadataResponse = await fetch(`${API_BASE_URL}/api/write/upload-metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
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
      console.log("Metadata uploaded:", metadataData);

      // Step 2: Prepare create coin transaction
      const prepareResponse = await fetch(`${API_BASE_URL}/api/write/create-coin/prepare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          imageUri: formData.imageUri,
          currency: formData.currency,
          startingMarketCap: formData.startingMarketCap,
          chainId: 8453, // Base mainnet
        }),
      });

      if (!prepareResponse.ok) {
        const errorData = await prepareResponse.json();
        throw new Error(errorData.error || "Failed to prepare transaction");
      }

      const txData: CreateCoinPrepareResponse = await prepareResponse.json();
      console.log("Transaction prepared:", txData);

      // Step 3: Send transaction via wagmi
      sendTransaction({
        to: txData.to,
        data: txData.data,
        value: BigInt(txData.value),
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create coin");
      setCreating(false);
    }
  };

  // Handle transaction confirmation
  if (isConfirmed) {
    setTimeout(() => {
      setLocation("/explore");
    }, 2000);
  }

  const isProcessing = creating || isSendingTx || isConfirming;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold font-serif">Create Your Coin</h1>
          <p className="text-muted-foreground mt-2">
            Launch your own creator coin on Base blockchain
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConfirmed && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              🎉 Coin created successfully! Redirecting to explore page...
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Creating a coin requires a small deployment fee. Metadata will be stored on IPFS.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Coin Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Coin Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., My Creator Coin"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-coin-name"
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
                      data-testid="input-coin-symbol"
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
                      data-testid="input-coin-description"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Media (Image or Video)</Label>
                    <div className="space-y-3">
                      {/* File Upload Button */}
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
                          data-testid="input-coin-image"
                          disabled={uploading || isProcessing}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading || isProcessing}
                          data-testid="button-upload-image"
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
                            disabled={uploading || isProcessing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      {/* Upload Progress */}
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

                      {/* Media Preview */}
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

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    data-testid="button-create-coin"
                    disabled={isProcessing || !isAuthenticated}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSendingTx
                          ? "Confirm in wallet..."
                          : isConfirming
                          ? "Creating coin..."
                          : "Preparing..."}
                      </>
                    ) : (
                      "Create Coin"
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-sm text-center text-muted-foreground">
                      Please connect your wallet to create a coin
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    previewType === "video" ? (
                      <video
                        src={previewUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : formData.imageUri ? (
                    <img
                      src={formData.imageUri}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-4xl font-mono font-bold text-primary">
                      {formData.symbol.slice(0, 2) || "??"}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{formData.name || "Coin Name"}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{formData.symbol || "SYMBOL"}</p>
                  <p className="text-sm mt-2">{formData.description || "No description provided"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deployment Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Fee (est.)</span>
                  <span className="font-medium">~0.002 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">0.001 ETH</span>
                </div>
                <div className="pt-2 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span>~0.003 ETH</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
