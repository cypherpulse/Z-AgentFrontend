import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, Database, Users, AlertTriangle, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="group hover:bg-accent -ml-2 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">
            Your Privacy Matters
          </h1>
          <p className="text-muted-foreground">
            Last updated: October 27, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold mb-3">Our Commitment to Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Z-Agent, we are committed to protecting your privacy and ensuring transparency in how we handle your data.
                  This privacy policy explains how we collect, use, and protect your information when you use our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Wallet Information</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                When you connect your wallet, we collect your wallet address and transaction history related to creator coins.
                We do not store your private keys or seed phrases.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We collect anonymous usage statistics, such as pages visited, features used, and interaction patterns to improve our platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Communication Data</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                When you use our AI chat feature, your conversations may be processed to provide better responses. We do not store personal chat histories.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Platform Operation</h4>
                <p className="text-sm text-muted-foreground">
                  To provide trading functionality, display coin information, and maintain platform security.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">AI Features</h4>
                <p className="text-sm text-muted-foreground">
                  To power our AI assistant and provide intelligent insights about creator coins.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  To understand usage patterns and improve platform performance and user experience.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Security</h4>
                <p className="text-sm text-muted-foreground">
                  To detect and prevent fraudulent activities and ensure platform integrity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Sharing and Third Parties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share anonymized,
                aggregated data for analytical purposes.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Blockchain Transparency</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Remember that all transactions on the Base network are publicly visible on the blockchain.
                      Your wallet address and transaction history are not private data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• End-to-end encryption for data transmission</li>
              <li>• Secure API endpoints with rate limiting</li>
              <li>• Regular security audits and updates</li>
              <li>• No storage of sensitive wallet information</li>
              <li>• Secure logging practices that don't expose personal data</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You have control over your data and how it's used on our platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Access Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    You can view your transaction history and account information directly through your connected wallet.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact us if you wish to have your data removed from our systems.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Opt-out</h4>
                  <p className="text-sm text-muted-foreground">
                    You can disconnect your wallet at any time to stop data collection.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cookie Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your browser settings to control cookie preferences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              {/* <p><strong>Email:</strong> privacy@z-agent.com</p> */}
              <p><strong>Developer:</strong> cypherpulse.base.eth</p>
              <p><strong>Platform:</strong> Built on Base Network</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This privacy policy may be updated periodically. We will notify users of significant changes.
          </p>
          <Button variant="outline" asChild>
            <Link href="/about">Back to About</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}