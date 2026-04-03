import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Sparkles, TrendingUp, AlertTriangle, Package } from "lucide-react";

const SUGGESTED_QUERIES = [
  { icon: TrendingUp, text: "Which outlets had the highest growth this quarter?" },
  { icon: AlertTriangle, text: "Show me products at risk of stockout this week" },
  { icon: Package, text: "What are the top 5 selling medicines by revenue?" },
  { icon: Sparkles, text: "Detect any unusual sales patterns across outlets" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  "which outlets had the highest growth this quarter?": "📊 **Top Growing Outlets (Q2 2025)**\n\n1. **Victoria Island** — +18.4% revenue growth (₦4.8M → ₦5.7M)\n2. **Downtown Pharmacy** — +14.2% (₦6.2M → ₦7.1M)\n3. **Ikeja Mall** — +11.8% (₦5.1M → ₦5.7M)\n\n⚠️ **Underperforming:** Lekki Phase 1 showed -3.2% decline — recommend staffing review and promotional campaign.",
  "show me products at risk of stockout this week": "🔴 **Stock-Out Risk Alert (7-day forecast)**\n\n| Product | Current Stock | Daily Avg Sales | Days Left |\n|---|---|---|---|\n| Amoxicillin 500mg | 24 units | 8.2/day | **2.9 days** |\n| Codeine Phosphate 30mg | 8 units | 2.1/day | **3.8 days** |\n| Azithromycin 250mg | 45 units | 9.5/day | **4.7 days** |\n\n✅ **Auto-reorder** has been triggered for Amoxicillin across 5 affected outlets.",
};

export default function AIInsights() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));
    const key = Object.keys(MOCK_RESPONSES).find(k => text.toLowerCase().includes(k)) || "";
    const response = MOCK_RESPONSES[key] || `I've analyzed your query: "${text}"\n\n📊 Based on current data across 38 outlets, here's a summary:\n- Total revenue this month: ₦38.2M (+12% MoM)\n- Average margin: 37.2%\n- 52 products need attention\n\nWould you like me to drill down into any specific area?`;

    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="AI Insights" description="Ask questions about your operations using natural language">
        <Badge variant="secondary" className="gap-1"><Brain className="h-3 w-3" /> Powered by AI</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat */}
        <div className="lg:col-span-3">
          <SectionCard className="min-h-[500px] flex flex-col">
            <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[400px]">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-primary/30 mb-3" />
                  <p className="text-lg font-medium">Ask me anything about your pharmacy operations</p>
                  <p className="text-sm text-muted-foreground mt-1">I can analyze sales, inventory, staffing, and detect anomalies</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask about sales, inventory, performance..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && input.trim() && sendMessage(input)}
                className="h-11"
              />
              <Button size="icon" className="h-11 w-11 shrink-0" onClick={() => input.trim() && sendMessage(input)} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Suggested Queries</h3>
          {SUGGESTED_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q.text)}
              className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-all text-left"
            >
              <q.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">{q.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
