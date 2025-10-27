import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, Scale, Shield, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="h-4 w-4" />
            Terms of Service
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: October 27, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Scale className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold mb-3">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Z-Agent, you agree to be bound by these Terms of Service.
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Z-Agent is a Web3 platform that facilitates the discovery, trading, and analysis of creator coins on the Base network.
              We provide tools for creators to launch tokens and for users to engage with the creator economy through blockchain technology.
            </p>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Wallet Security</h4>
                  <p className="text-sm text-muted-foreground">
                    You are responsible for maintaining the security of your wallet and private keys.
                    We never store or have access to your private keys.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Legal Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure your use of the platform complies with applicable laws and regulations in your jurisdiction.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Accurate Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide accurate information when creating coins or engaging with the platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Platform Integrity</h4>
                  <p className="text-sm text-muted-foreground">
                    Do not engage in manipulative practices, spam, or activities that harm the platform or other users.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Engaging in market manipulation, pump-and-dump schemes, or fraudulent activities
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Creating fake accounts, impersonating others, or spreading misinformation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Attempting to hack, disrupt, or compromise the platform's security
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Violating intellectual property rights or engaging in harassment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Disclaimer */}
        <Card className="mb-6 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              Risk Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>High Risk Investment:</strong> Creator coins and cryptocurrency investments carry substantial risk.
                Prices can fluctuate dramatically, and you may lose your entire investment.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important Warnings:</h4>
                <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>• Past performance does not guarantee future results</li>
                  <li>• Regulatory uncertainty in cryptocurrency markets</li>
                  <li>• Smart contract risks and potential exploits</li>
                  <li>• Liquidity risks for low-volume tokens</li>
                  <li>• Platform or network downtime may affect access</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground italic">
                You acknowledge that you are solely responsible for your investment decisions and understand the risks involved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The Z-Agent platform, including its software, design, and content, is protected by intellectual property laws.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Platform Rights</h4>
                  <p className="text-sm text-muted-foreground">
                    All platform features, algorithms, and UI/UX design are proprietary to Z-Agent.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User Content</h4>
                  <p className="text-sm text-muted-foreground">
                    You retain rights to content you create, but grant us license to display it on the platform.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Disclaimers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">No Financial Advice</h4>
                <p className="text-sm text-muted-foreground">
                  Nothing on this platform constitutes financial, investment, or trading advice.
                  All information is for educational purposes only.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Third-Party Services</h4>
                <p className="text-sm text-muted-foreground">
                  We integrate with third-party services (wallets, blockchains, etc.) over which we have no control.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Service Availability</h4>
                <p className="text-sm text-muted-foreground">
                  We strive for high availability but cannot guarantee uninterrupted service due to blockchain network conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your access to the platform at our discretion,
              particularly if you violate these terms or engage in prohibited activities. You may also terminate
              your use at any time by disconnecting your wallet.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              These terms are governed by applicable laws. Any disputes will be resolved through appropriate legal channels.
              We encourage users to understand local regulations regarding cryptocurrency activities.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For questions about these terms or to report violations:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> legal@z-agent.com</p>
              <p><strong>Developer:</strong> cypherpulse.base.eth</p>
              <p><strong>Platform:</strong> Built on Base Network</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            These terms may be updated periodically. Continued use of the platform constitutes acceptance of changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/about">Back to About</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}