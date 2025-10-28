import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { askCoinAi, formatAiResponse } from "../lib/aiApi";
import { AddressLink } from "./AddressLink";
import ReactMarkdown from "react-markdown";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CoinChatProps {
  coinAddress: string;
}

const CoinChat: React.FC<CoinChatProps> = ({ coinAddress }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await askCoinAi({ question: input, address: coinAddress });
      const rawContent = data.response || "No response";
      const formattedContent = formatAiResponse(rawContent);

      const assistantMessage: Message = {
        role: 'assistant',
        content: formattedContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 hover:bg-primary/5 border-primary/20"
        >
          <MessageCircle className="h-4 w-4" />
          Ask AI about this coin
          {isOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="bg-background border rounded-lg overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Z-Agent</h3>
              <p className="text-xs text-muted-foreground">Coin analysis assistant</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                <p className="text-sm text-muted-foreground">
                  Ask me anything about this coin!
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 text-sm break-words overflow-hidden ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted/50 rounded-bl-md'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-background prose-pre:border prose-pre:rounded prose-pre:text-xs word-break break-words">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2 break-words">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-semibold mb-2 break-words">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-medium mb-1 break-words">{children}</h3>,
                          p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 break-words">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 break-words">{children}</ol>,
                          li: ({ children }) => <li className="text-sm break-words">{children}</li>,
                          code: ({ children }) => <code className="bg-background px-1 py-0.5 rounded text-xs font-mono break-all">{children}</code>,
                          pre: ({ children }) => <pre className="bg-background p-2 rounded text-xs overflow-x-auto mb-2 break-words whitespace-pre-wrap">{children}</pre>,
                          blockquote: ({ children }) => <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground mb-2 break-words">{children}</blockquote>,
                          a: ({ href, children }) => {
                            // Check if href is an Ethereum address (starts with 0x and is 42 chars)
                            if (href && /^0x[a-fA-F0-9]{40}$/.test(href)) {
                              return <AddressLink address={href}>{children}</AddressLink>;
                            }
                            // Regular link
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline break-all"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="break-words">{message.content}</div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-bl-md px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this coin..."
                disabled={loading}
                className="flex-1 text-sm"
              />
              <Button type="submit" disabled={loading || !input.trim()} size="sm" className="flex-shrink-0">
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CoinChat;