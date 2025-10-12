import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload } from "lucide-react";
import { useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUri: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating coin:", formData);
    alert(`Creating coin: ${formData.name} (${formData.symbol})`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold font-serif">Create Your Coin</h1>
          <p className="text-muted-foreground mt-2">
            Launch your own creator coin on Base blockchain
          </p>
        </div>

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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        placeholder="https://example.com/image.png"
                        value={formData.imageUri}
                        onChange={(e) => setFormData({ ...formData, imageUri: e.target.value })}
                        data-testid="input-coin-image"
                      />
                      <Button type="button" variant="outline" size="icon" data-testid="button-upload-image">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 512x512px, PNG or JPG
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full" data-testid="button-create-coin">
                    Create Coin
                  </Button>
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
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {formData.imageUri ? (
                    <img
                      src={formData.imageUri}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
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
