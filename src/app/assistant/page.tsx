"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Fingerprint,
  ArrowLeft,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Globe2,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  {
    icon: "🔍",
    text: "Son dönemde parmak izi teknolojisinde öne çıkan gelişmeler neler?",
  },
  {
    icon: "🧬",
    text: "Touch DNA ve taşınabilir DNA cihazları hakkında ne biliyorsun?",
  },
  {
    icon: "🌐",
    text: "Hangi ülkeler olay yeri belgelemede 3B taramaya geçiyor?",
  },
  {
    icon: "🤖",
    text: "Yapay zekâ olay yeri incelemede nasıl kullanılıyor, örneklerle anlat",
  },
];

const WELCOME: ChatMessage = {
  role: "assistant",
  content: `Merhaba! Ben **OYİ GLOBAL İstihbarat Asistanıyım**. 

Olay yeri inceleme teknikleri ve adli bilimler alanındaki **küresel arşivinizi** (Türkçeleştirilmiş tüm bulgular) ve güncel web kaynaklarını kullanarak sorularınızı yanıtlıyorum.

Nasıl yardımcı olabilirim? Örneğin:
- Belirli bir teknolojiyi dünyada kimler kullanıyor?
- Bir kategorideki son gelişmelerin özeti
- İki yöntemin karşılaştırılması

Aşağıdaki hazır sorulardan birini seçebilir veya kendi sorunuzu yazabilirsiniz.`,
};

export default function AssistantPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Yeni mesajda en alta kay
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;

    // Karşılama mesajı API'ye gönderilmez
    const conversation: ChatMessage[] = messages.filter((m) => m !== WELCOME);
    const nextMessages: ChatMessage[] = [...conversation, { role: "user", content: question }];
    setMessages([...conversation, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error(data.error);
      }
    } catch {
      toast({
        title: "Asistan yanıt veremedi",
        description: "Lütfen sorunuzu tekrar gönderin.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Bağlantı sorunu nedeniyle yanıt üretilemedi. Lütfen tekrar deneyin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-300 transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Panel</span>
            </Link>
            <div className="h-9 w-9 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base leading-tight tracking-tight">
                AI İstihbarat Asistanı
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                Arşiv bağlamlı soru-cevap · Türkçe yanıt garantisi
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetChat}
            disabled={loading}
            className="h-8 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Yeni Sohbet
          </Button>
        </div>
      </header>

      {/* SOHBET ALANI */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-amber-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                m.role === "user"
                  ? "bg-amber-500 text-slate-950 rounded-br-md"
                  : "bg-slate-900 border border-slate-800 rounded-bl-md"
              }`}
            >
              {m.role === "user" ? (
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              ) : (
                <div className="text-sm">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="leading-relaxed text-slate-300 mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-1 mb-2 ml-1">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed text-slate-300 flex gap-2">
                          <span className="text-amber-400 mt-0.5 shrink-0">▸</span>
                          <span>{children}</span>
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-slate-100 font-semibold">{children}</strong>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-amber-300 font-semibold text-base mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-amber-300 font-semibold text-sm mb-1.5 mt-3 first:mt-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-slate-100 font-semibold text-sm mb-1 mt-2">{children}</h3>
                      ),
                      code: ({ children }) => (
                        <code className="bg-slate-800 rounded px-1.5 py-0.5 text-xs text-amber-200">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {m.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 items-center"
          >
            <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-amber-400" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2.5">
              <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
              <span className="text-sm text-slate-400">
                Arşiv ve güncel kaynaklar taranıyor, yanıt hazırlanıyor…
              </span>
            </div>
          </motion.div>
        )}

        {/* Hazır soru önerileri — yalnızca ilk mesajda */}
        {messages.length === 1 && !loading && (
          <div className="grid sm:grid-cols-2 gap-2 pt-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s.text)}
                className="text-left p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 hover:bg-slate-900 transition-colors group"
              >
                <p className="text-sm text-slate-300 group-hover:text-slate-100 leading-relaxed">
                  <span className="mr-1.5">{s.icon}</span>
                  {s.text}
                </p>
              </button>
            ))}
          </div>
        )}

        <div ref={scrollRef} />
      </main>

      {/* GİRİŞ ALANI */}
      <div className="sticky bottom-0 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Sorunuzu yazın… (Enter ile gönder, Shift+Enter yeni satır)"
              rows={1}
              className="min-h-[44px] max-h-32 resize-none bg-slate-900 border-slate-700 text-sm placeholder:text-slate-400"
            />
            <Button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="h-[44px] px-4 shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Gönder</span>
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <Globe2 className="h-3 w-3" />
            Yanıtlar arşivdeki Türkçeleştirilmiş bulgular ve güncel web kaynaklarıyla desteklenir;
            kritik kararlarda kaynakları doğrulayın.
          </p>
        </div>
      </div>
    </div>
  );
}
