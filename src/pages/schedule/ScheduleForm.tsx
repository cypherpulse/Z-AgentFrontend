import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { getFilePreview, uploadToCloudinary, UploadProgress } from "../../lib/cloudinary";

interface ScheduleFormProps {
  formData: {
    name: string;
    symbol: string;
    description: string;
    imageUri: string;
    scheduledFor: string;
    currency: string;
    startingMarketCap: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    symbol: string;
    description: string;
    imageUri: string;
    scheduledFor: string;
    currency: string;
    startingMarketCap: string;
  }>>;
  handleSchedule: (e: React.FormEvent) => Promise<void>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  previewUrl: string;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
  previewType: "image" | "video" | null;
  setPreviewType: React.Dispatch<React.SetStateAction<"image" | "video" | null>>;
  submitting: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  address: string | undefined;
}

export default function ScheduleForm({
  formData,
  setFormData,
  handleSchedule,
  uploading,
  setUploading,
  uploadProgress,
  setUploadProgress,
  previewUrl,
  setPreviewUrl,
  previewType,
  setPreviewType,
  submitting,
  setError,
  address,
}: ScheduleFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const response = await uploadToCloudinary(file, (progress: UploadProgress) => {
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

  return (
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
  );
}
