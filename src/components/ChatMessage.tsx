import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  agent: string;
  timestamp: Date;
  type: 'user' | 'agent' | 'system';
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex mb-3 sm:mb-4 lg:mb-6 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] sm:max-w-[82%] md:max-w-[78%] lg:max-w-[75%] xl:max-w-[70%] rounded-2xl px-2.5 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 shadow-lg ${
        message.type === 'user'
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-1 sm:ml-2'
          : message.type === 'agent'
          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 mr-1 sm:mr-2'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border mx-auto max-w-md'
      }`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
              message.type === 'user' ? 'bg-blue-200' :
              message.type === 'agent' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            {message.agent}
            <span className="text-xs sm:text-sm opacity-75 font-normal">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="text-sm sm:text-base lg:text-lg leading-relaxed">
          {message.type === 'agent' ? (
            <ScrollArea className="max-h-none pr-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-sm overflow-x-auto my-3">
                      {children}
                    </pre>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600 text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-slate-50 dark:bg-slate-700">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold text-slate-900 dark:text-slate-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-300">
                      {children}
                    </td>
                  ),
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h4>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </ScrollArea>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;