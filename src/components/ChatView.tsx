"use client";

import { useState, useCallback } from "react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputActionGroup,
  PromptInputAction,
} from "@/components/nexus-ui/prompt-input";
import {
  Message,
  MessageContent,
  MessageMarkdown,
  MessageAvatar,
  MessageStack,
} from "@/components/nexus-ui/message";
import {
  Thread,
  ThreadContent,
  ThreadScrollToBottom,
} from "@/components/nexus-ui/thread";
import {
  Suggestions,
  SuggestionList,
  Suggestion,
} from "@/components/nexus-ui/suggestions";
import { TextShimmer } from "@/components/nexus-ui/text-shimmer";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a haiku about code",
  "What makes a great startup idea?",
  "Compare React and Vue in 2026",
];

export function ChatView() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Msg = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Simulated response (replace with actual API later)
      setTimeout(() => {
        const assistantMsg: Msg = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `I'm **OmniMind-1**, your unified AI companion. You asked: "${text.trim()}"\n\nThis is a demo response — connect me to a real AI backend to unlock full intelligence.`,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 1200);
    },
    [isLoading]
  );

  const handleSubmit = () => {
    sendMessage(input);
  };

  return (
    <div className="relative z-10 flex flex-col h-[calc(100vh-88px)] max-w-3xl mx-auto px-4 animate-fade-in-up">
      {messages.length === 0 && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h2
              className="text-3xl sm:text-4xl text-hero-text mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What's on your mind?
            </h2>
            <p className="text-sm text-hero-muted">
              OmniMind-1 is ready. Ask anything.
            </p>
          </div>
          <Suggestions onSelect={(q: string) => sendMessage(q)}>
            <SuggestionList orientation="horizontal" className="flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <Suggestion key={s} value={s} variant="outline" className="text-hero-muted border-border hover:text-hero-text">
                  {s}
                </Suggestion>
              ))}
            </SuggestionList>
          </Suggestions>
        </div>
      ) : (
        <Thread className="flex-1 min-h-0">
          <ThreadContent className="py-8 space-y-1">
            {messages.map((m) => (
              <Message key={m.id} from={m.role}>
                {m.role === "assistant" && (
                  <MessageAvatar src="" fallback="OM" className="bg-secondary text-hero-text" />
                )}
                <MessageStack>
                  <MessageContent>
                    <MessageMarkdown>{m.content}</MessageMarkdown>
                  </MessageContent>
                </MessageStack>
              </Message>
            ))}
            {isLoading && (
              <Message from="assistant">
                <MessageAvatar src="" fallback="OM" className="bg-secondary text-hero-text" />
                <MessageStack>
                  <MessageContent>
                    <TextShimmer className="text-sm text-hero-muted">
                      OmniMind is thinking...
                    </TextShimmer>
                  </MessageContent>
                </MessageStack>
              </Message>
            )}
          </ThreadContent>
          <ThreadScrollToBottom />
        </Thread>
      )}

      {/* Input */}
      <div className="pb-6 pt-2">
        <PromptInput className="liquid-glass rounded-2xl border-0">
          <PromptInputTextarea
            placeholder="Message OmniMind-1..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="text-hero-text placeholder:text-muted-foreground bg-transparent border-0 focus-visible:ring-0"
          />
          <PromptInputActions>
            <PromptInputActionGroup />
            <PromptInputActionGroup>
              <PromptInputAction asChild>
                <Button
                  size="icon"
                  className="rounded-full bg-hero-text text-background hover:bg-hero-muted"
                  disabled={!input.trim() || isLoading}
                  onClick={handleSubmit}
                >
                  <ArrowUp className="size-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActionGroup>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}