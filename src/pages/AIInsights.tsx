import { useState, useRef, useEffect } from "react";
import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Sparkles, TrendingUp, AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

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

export default function AIInsights() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (resp.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("AI credits exhausted. Please add funds to continue.");
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Failed to connect to AI");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err: any) {
      toast.error("AI Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="AI Insights" description="Ask questions about your operations using natural language">
        <Badge variant="secondary" className="gap-1"><Brain className="h-3 w-3" /> Powered by AI</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SectionCard className="min-h-[500px] flex flex-col glass-card-3d">
            <div ref={scrollRef} className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[400px]">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-primary/30 mb-3" />
                  <p className="text-lg font-medium">Ask me anything about your pharmacy operations</p>
                  <p className="text-sm text-muted-foreground mt-1">I can analyze sales, inventory, staffing, and detect anomalies</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                    msg.role === "user" ? "gradient-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
              <Button size="icon" className="h-11 w-11 shrink-0 gradient-primary" onClick={() => input.trim() && sendMessage(input)} disabled={isLoading}>
                <Send className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Suggested Queries</h3>
          {SUGGESTED_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q.text)}
              className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-all text-left glass-card-3d"
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
