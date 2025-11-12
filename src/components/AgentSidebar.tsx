import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgentActivity {
  agentId: string;
  action: string;
  timestamp: Date;
  status: 'active' | 'idle' | 'processing';
  type?: string;
  content?: string;
}

interface AgentSidebarProps {
  agentActivities: AgentActivity[];
  onQuickAction: (message: string) => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ agentActivities, onQuickAction }) => {
  return (
    <div className="h-full w-full p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Agent Status */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse"></div>
            Agent Network
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white dark:bg-slate-800 border border-green-200 dark:border-green-700">
              <span className="font-medium text-xs sm:text-sm">Conversation Coordinator</span>
              <Badge className="bg-green-500 text-white text-xs">Active</Badge>
            </div>
            {['Z-Trader', 'Z-Data', 'Z-Analysis'].map((agent) => (
              <div key={agent} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white dark:bg-slate-800 border">
                <span className="font-medium text-xs sm:text-sm">{agent} Agent</span>
                <Badge variant="secondary" className="text-xs">Idle</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 sm:space-y-3">
            {[
              { icon: '📈', title: 'Popular Coins', desc: 'View trending creator tokens', msg: 'show me popular creator coins' },
              { icon: '📊', title: 'Market Analysis', desc: 'Get market insights', msg: 'analyze market trends' },
              { icon: '💰', title: 'Trading Ideas', desc: 'AI-powered opportunities', msg: 'suggest trading opportunities' },
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2.5 sm:py-3 lg:py-4 px-2.5 sm:px-3 lg:px-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-200 dark:border-slate-600"
                onClick={() => onQuickAction(action.msg)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl lg:text-2xl">{action.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs sm:text-sm truncate">{action.title}</div>
                    <div className="text-xs opacity-70 hidden sm:block">{action.desc}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base">Agent Activities</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            {agentActivities.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 sm:py-6 lg:py-8">
                <div className="text-xl sm:text-2xl lg:text-3xl mb-2">⚡</div>
                <p className="text-xs sm:text-sm">No activities yet</p>
                <p className="text-xs opacity-70">Send a message to activate agents</p>
              </div>
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {agentActivities.slice(0, 10).map((activity, index) => (
                  <div key={index} className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-2 sm:p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs sm:text-sm font-medium truncate flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'active' ? 'bg-green-500 animate-pulse' :
                          activity.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                          'bg-gray-400'
                        }`}></div>
                        {activity.agentId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {activity.action || activity.content}
                    </div>
                    {activity.type && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 capitalize">
                        {activity.type.replace(/_/g, ' ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSidebar;