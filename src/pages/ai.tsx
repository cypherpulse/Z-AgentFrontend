import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { askGeneralAi, formatAiResponse } from "@/lib/aiApi";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await askGeneralAi(input);
      const rawContent = data.response || "No response";
      const formattedContent = formatAiResponse(rawContent);

      const assistantMessage: Message = { role: 'assistant', content: formattedContent };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't process your request. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground">
                    Ask me anything about crypto, coins, or market analysis!
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Bot className="h-6 w-6 mt-1 text-primary" />
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 whitespace-pre-line ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div dangerouslySetInnerHTML={{ __html: message.content }} />
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === 'user' && (
                      <User className="h-6 w-6 mt-1 text-primary" />
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <Bot className="h-6 w-6 mt-1 text-primary" />
                    <div className="bg-muted rounded-lg px-4 py-2">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}