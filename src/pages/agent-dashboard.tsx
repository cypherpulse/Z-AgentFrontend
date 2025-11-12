import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AI_BASE_URL, sendAgentMessage } from "@/lib/aiApi";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage";
import AgentSidebar from "@/components/AgentSidebar";

interface Message {
  id: string;
  content: string;
  agent: string;
  timestamp: Date;
  type: 'user' | 'agent' | 'system';
}

interface AgentActivity {
  type: string;
  fromAgent: string;
  toAgent: string;
  content: string;
  metadata: {
    userId: string;
    dataType?: string;
    count?: number;
    tradeInstruction?: any;
    transactionHash?: string;
    agentInteractions?: number;
    [key: string]: any;
  };
  timestamp: Date;
}

interface SidebarActivity {
  agentId: string;
  action: string;
  timestamp: Date;
  status: 'active' | 'idle' | 'processing';
  type?: string;
  content?: string;
}

interface ActivityState {
  isLoading: boolean;
  loadingMessage: string;
  currentActivity: string | null;
  lastActivity: AgentActivity | null;
}

export default function AgentDashboard() {
  const { address } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId] = useState(address || `guest_${Date.now()}`);
  const [agentActivities, setAgentActivities] = useState<SidebarActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityState, setActivityState] = useState<ActivityState>({
    isLoading: false,
    loadingMessage: '',
    currentActivity: null,
    lastActivity: null
  });
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to clean agent responses
  const cleanAgentResponse = (content: string): string => {
    if (!content || typeof content !== 'string') return '';

    const trimmed = content.trim();

    // Allow Z-Data responses that contain actual analysis or valuable data
    // Only filter out pure metadata responses that are just technical data with no value
    if (trimmed.toLowerCase().startsWith('z-data') &&
        (trimmed.includes('invalid date') || trimmed.includes('type:') || trimmed.includes('id:')) &&
        trimmed.length < 200 &&
        !trimmed.includes('analysis') &&
        !trimmed.includes('completed') &&
        !trimmed.includes('fetched') &&
        !trimmed.includes('summarized')) {
      return ''; // Hide pure Z-Data metadata responses that are just technical data
    }

    // Clean up excessive formatting but keep the actual response content
    let cleaned = trimmed
      .replace(/^[\*\-\s]*Type:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*ID:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Address:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Chain ID:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Token URI:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Creator Address:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Total Supply:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Total Volume:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Created At:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Media Content:\s*[\*\-\s]*/gm, '')
      .replace(/^[\*\-\s]*Uniswap.*?:\s*[\*\-\s]*/gm, '')
      .replace(/Z-Data • Invalid Date\s*\n/g, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^---\s*\n/gm, '')
      .replace(/\*\*\s*\n\s*\*\*/g, '**')
      .trim();

    // Keep all responses that have substantial content (reduced threshold)
    if (cleaned.length > 20) {
      return cleaned;
    }

    // For shorter responses, check if they're just metadata
    const metadataOnlyPatterns = [
      /^[\*\-\s]*type:.*$/im,
      /^[\*\-\s]*id:.*$/im,
      /^[\*\-\s]*address:.*$/im,
      /^[\*\-\s]*chain.*id:.*$/im,
      /^[\*\-\s]*token.*uri:.*$/im,
      /^[\*\-\s]*creator.*address:.*$/im,
      /^[\*\-\s]*total.*supply:.*$/im,
      /^[\*\-\s]*total.*volume:.*$/im,
      /^[\*\-\s]*created.*at:.*$/im,
      /^[\*\-\s]*media.*content:.*$/im,
    ];

    const isPureMetadata = metadataOnlyPatterns.every(pattern => !pattern.test(cleaned)) === false &&
                          cleaned.split('\n').length <= 3 &&
                          !cleaned.includes('analysis') &&
                          !cleaned.includes('completed') &&
                          !cleaned.includes('fetched') &&
                          !cleaned.includes('summarized') &&
                          !cleaned.includes('data') &&
                          !cleaned.includes('market') &&
                          !cleaned.includes('price') &&
                          !cleaned.includes('trade');

    if (isPureMetadata && cleaned.length < 50) {
      return '';
    }

    // If we get here, return the cleaned content
    return cleaned;
  };

  // Handle agent activities from broadcasting system
  const handleAgentActivity = (activity: AgentActivity) => {
    console.log('🔄 Processing agent activity:', activity);
    console.log('Current userId:', userId);
    console.log('Activity metadata:', activity.metadata);
    console.log('Activity toAgent:', activity.toAgent);

    // Relax filtering for debugging - accept activities for this user or broadcast activities
    if (activity.metadata.userId && activity.metadata.userId !== userId) {
      console.log('❌ Filtering activity for different user:', activity.metadata.userId, 'vs', userId);
      return;
    }

    // Accept activities targeted to 'frontend' or broadcast to all
    if (activity.toAgent && activity.toAgent !== 'frontend' && activity.toAgent !== 'broadcast') {
      console.log('❌ Filtering activity for different target:', activity.toAgent);
      return;
    }

    console.log('✅ Activity passed filtering, processing...');

    // Add to activities list for sidebar with enhanced data
    setAgentActivities(prev => {
      const newActivity: SidebarActivity = {
        agentId: activity.fromAgent,
        action: activity.content,
        timestamp: new Date(activity.timestamp),
        status: 'active' as const,
        type: activity.type,
        content: activity.content
      };
      return [newActivity, ...prev.slice(0, 19)]; // Keep last 20 activities
    });

    // Update activity state for UI feedback
    setActivityState(prev => ({
      ...prev,
      lastActivity: activity
    }));

    // Handle different activity types with appropriate UI feedback
    switch (activity.type) {
      case 'fetching_data':
        console.log('Handling fetching_data activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: true,
          loadingMessage: '🔍 Fetching market data...',
          currentActivity: 'fetching_data'
        }));
        // Add system message for data fetching
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `🔍 ${activity.fromAgent} is fetching ${activity.metadata.dataType || 'market data'} from Zora...`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'data_fetched':
        console.log('Handling data_fetched activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: `✅ Retrieved ${activity.metadata.count || 0} items`,
          currentActivity: 'data_fetched'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `✅ ${activity.fromAgent} retrieved ${activity.metadata.count || 0} items from Zora`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'summarizing_data':
        console.log('Handling summarizing_data activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: '🤖 AI analyzing data...',
          currentActivity: 'summarizing_data'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `🤖 ${activity.fromAgent} is analyzing data with AI...`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'data_summarized':
        console.log('Handling data_summarized activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: false,
          loadingMessage: '',
          currentActivity: null
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `✅ ${activity.fromAgent} completed data analysis`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'analyzing_data':
        console.log('Handling analyzing_data activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: '📊 Analyzing market data...',
          currentActivity: 'analyzing_data'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `📊 ${activity.fromAgent} is performing market analysis...`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'analysis_completed':
        console.log('Handling analysis_completed activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: false,
          loadingMessage: '',
          currentActivity: null
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `✅ ${activity.fromAgent} completed market analysis`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'coordinating_with_agent':
        console.log('Handling coordinating_with_agent activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: '💰 Preparing trade...',
          currentActivity: 'coordinating_with_agent'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `🤝 ${activity.fromAgent} is coordinating with ${activity.toAgent}`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'analyzing_trade':
        console.log('Handling analyzing_trade activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: '⚖️ Analyzing trade options...',
          currentActivity: 'analyzing_trade'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `⚖️ ${activity.fromAgent} is analyzing trading options...`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'executing_trade':
        console.log('Handling executing_trade activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: '🚀 Executing trade on Zora DEX...',
          currentActivity: 'executing_trade'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `🚀 ${activity.fromAgent} is executing trade on Zora DEX...`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'trade_completed':
        console.log('Handling trade_completed activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: false,
          loadingMessage: '',
          currentActivity: null
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `💰 Trade completed successfully! Transaction: ${activity.metadata.transactionHash}`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'trade_processed':
        console.log('Handling trade_processed activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: false,
          loadingMessage: '',
          currentActivity: null
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `✅ ${activity.fromAgent} processed trade request`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'conversation_coordinated':
        console.log('Handling conversation_coordinated activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: `🤝 Coordinated with ${activity.metadata.agentInteractions || 0} agents`,
          currentActivity: 'conversation_coordinated'
        }));
        setTimeout(() => {
          setActivityState(prev => ({
            ...prev,
            loadingMessage: '',
            currentActivity: null
          }));
        }, 3000);
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `🤝 Conversation coordinated with ${activity.metadata.agentInteractions || 0} agent interactions`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'reference_resolved':
        console.log('Handling reference_resolved activity');
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `📋 ${activity.fromAgent} resolved user reference`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'data_displayed':
        console.log('Handling data_displayed activity');
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `📊 ${activity.fromAgent} displayed ${activity.metadata.dataType || 'data'}`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'response_ready':
        console.log('Handling response_ready activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: false,
          loadingMessage: '',
          currentActivity: null
        }));
        // The actual response will come through the 'agent-response' WebSocket event
        break;

      case 'processing_request':
        console.log('Handling processing_request activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: true,
          loadingMessage: '⚙️ Processing your request...',
          currentActivity: 'processing_request'
        }));
        break;

      case 'generating_response':
        console.log('Handling generating_response activity');
        setActivityState(prev => ({
          ...prev,
          loadingMessage: '🤖 Generating AI response...',
          currentActivity: 'generating_response'
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `🤖 ${activity.fromAgent} is generating your response...`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      case 'response_generated':
        console.log('Handling response_generated activity');
        setActivityState(prev => ({
          ...prev,
          isLoading: false,
          loadingMessage: '',
          currentActivity: null
        }));
        setMessages(prev => [...prev, {
          id: `activity-${Date.now()}`,
          content: `✅ ${activity.fromAgent} generated response`,
          agent: 'System',
          timestamp: new Date(),
          type: 'system'
        }]);
        break;

      default:
        console.log('Handling unknown activity type:', activity.type);
        // For unknown activity types, just update the loading message briefly
        if (activity.content) {
          setActivityState(prev => ({
            ...prev,
            loadingMessage: activity.content,
            currentActivity: activity.type
          }));
          setTimeout(() => {
            setActivityState(prev => ({
              ...prev,
              loadingMessage: '',
              currentActivity: null
            }));
          }, 2000);
        }
    }
  };

  useEffect(() => {
    console.log('Initializing Socket.io connection...');
    console.log('AI_BASE_URL:', AI_BASE_URL);
    console.log('Connecting to:', AI_BASE_URL.replace('/api', ''));

    try {
      // Always try to initialize WebSocket for real-time features
      // Remove the localhost check to enable broadcasting on any environment
      socketRef.current = io(AI_BASE_URL.replace('/api', ''), {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ WebSocket connected successfully');
        console.log('Socket ID:', socketRef.current?.id);
        setIsConnected(true);
        socketRef.current?.emit('join-user-room', userId);
        console.log('Joined user room:', userId);
      });

      socketRef.current.on('connect_error', (error) => {
        console.log('❌ WebSocket connection error:', error);
        setIsConnected(false);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ WebSocket disconnected:', reason);
        setIsConnected(false);
      });

      // Listen for agent activities (broadcasting system for real-time updates)
      socketRef.current.on('agent-activity', (activity: AgentActivity) => {
        console.log('📡 Received agent activity:', activity);
        handleAgentActivity(activity);
      });

      // Add debugging for all events
      socketRef.current.onAny((event, ...args) => {
        console.log('🔍 Socket event:', event, args);
      });

    } catch (error) {
      console.warn('❌ WebSocket initialization failed:', error);
      setIsConnected(false);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      agent: 'You',
      timestamp: new Date(),
      type: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    // Set loading state
    setActivityState(prev => ({
      ...prev,
      isLoading: true,
      loadingMessage: '🤖 Processing your request...',
      currentActivity: 'sending_message'
    }));

    // Clear input immediately
    setInputMessage('');

    try {
      // Send message via HTTP API and get the real AI response
      console.log('📤 Sending message to AI endpoint...');

      const response = await sendAgentMessage({
        message: inputMessage,
        userId: userId,
        timestamp: new Date().toISOString()
      });

      console.log('📥 AI response received:', response);

      // Clear loading state
      setActivityState(prev => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
        currentActivity: null
      }));

      // Extract AI response - try multiple possible response structures
      let aiResponse = response.data?.response || response.response;

      // If still no response, check if the entire response.data is the response
      if (!aiResponse && response.data && typeof response.data === 'string') {
        aiResponse = response.data;
      }

      console.log('AI response type:', typeof aiResponse);
      console.log('AI response length:', aiResponse?.length || 0);

      // Show the real AI response directly - ChatMessage handles formatting
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse || 'No response received from AI',
        agent: (response.data as any)?.agent || 'Z-Agent',
        timestamp: new Date(),
        type: 'agent'
      };
      setMessages(prev => [...prev, agentMessage]);
      console.log('Added AI response to chat with ChatMessage formatting');

    } catch (error: any) {
      console.error('Error communicating with AI:', error);

      // Clear loading state
      setActivityState(prev => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
        currentActivity: null
      }));

      // Show a simple error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '❌ Unable to connect to AI service. Please try again.',
        agent: 'System',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (message: string) => {
    setInputMessage(message);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 sm:w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <AgentSidebar agentActivities={agentActivities} onQuickAction={handleQuickAction} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <AgentSidebar agentActivities={agentActivities} onQuickAction={handleQuickAction} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>

              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold font-serif mb-0.5">🤖 Agent Mode</h1>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base hidden sm:block">
                  Experience real-time AI agent communication
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              {/* Activity Status */}
              {activityState.isLoading && (
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2 rounded-full border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="font-medium text-xs sm:text-sm text-blue-700 dark:text-blue-300 hidden sm:inline">
                    {activityState.loadingMessage}
                  </span>
                  <span className="sm:hidden text-xs">
                    Processing...
                  </span>
                </div>
              )}

              <div className={`flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2 rounded-full border text-xs sm:text-sm ${
                isConnected ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}>
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="font-medium hidden sm:inline">
                  {isConnected ? 'Real-time Active' : 'HTTP Mode'}
                </span>
                <span className="sm:hidden">
                  {isConnected ? 'Live' : 'HTTP'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 sm:py-16 lg:py-20 px-2 sm:px-4 lg:px-6">
                <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">🚀</div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">Welcome to Agent Mode!</h3>
                <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
                  Experience intelligent AI agent communication and real-time insights
                </p>
                <p className="text-sm sm:text-base max-w-xl mx-auto">
                  Try asking: "show me trending coins" or "analyze market trends"
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full px-2 sm:px-4 lg:px-6">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 max-w-full mx-auto pb-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="max-w-full mx-auto">
              <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                <div className="flex gap-2 sm:gap-3 lg:gap-4">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask our AI agents anything..."
                    className="flex-1 text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl min-h-[44px] sm:min-h-[48px] lg:min-h-[56px]"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    size="lg"
                    className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base lg:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg whitespace-nowrap min-h-[44px] sm:min-h-[48px] lg:min-h-[56px]"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 px-1">
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  {isConnected ? 'Real-time mode active' : 'HTTP mode - Real-time features unavailable'} • Press Enter to send
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}