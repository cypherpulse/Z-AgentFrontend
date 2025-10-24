import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, MessageCircle, Loader2 } from "lucide-react";
import { askProfileAi, formatAiResponse } from "../lib/aiApi";
import ReactMarkdown from "react-markdown";

interface ProfileChatProps {
  profile: string;
}

export function ProfileChat({ profile }: ProfileChatProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setMessages((msgs) => [...msgs, { role: "user", content: question }]);
    try {
      const data = await askProfileAi({ question, profile });
      if (data.response) {
        setMessages((msgs) => [...msgs, { role: "ai", content: formatAiResponse(data.response) }]);
      } else {
        setError("No response from AI.");
      }
    } catch (err) {
      setError("Failed to fetch AI response.");
    }
    setLoading(false);
    setQuestion("");
  };

  return (
    <Card className="my-6">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {open ? "Close AI Chat" : "Ask AI about Profile"}
            {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        {open && (
          <div className="space-y-4">
            <div className="border rounded p-3 bg-muted/30 max-h-64 overflow-y-auto">
              {messages.length === 0 && <div className="text-muted-foreground text-sm">Ask questions about this profile's coins, holdings, or creator info.</div>}
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 text-sm ${msg.role === "user" ? "text-primary" : "text-accent-foreground"}`}>
                  {msg.role === "user" ? <strong>You:</strong> : <strong>Z-Agent:</strong>} {msg.role === "ai" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border inline">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                          p: ({ children }) => <p className="mb-2 last:mb-0 inline">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          pre: ({ children }) => <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>,
                          blockquote: ({ children }) => <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground mb-2">{children}</blockquote>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : msg.content}
                </div>
              ))}
              {loading && (
                <div className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Thinking...</div>
              )}
              {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
            </div>
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about coins, holdings, creator..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !question.trim()} variant="default">Ask</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
