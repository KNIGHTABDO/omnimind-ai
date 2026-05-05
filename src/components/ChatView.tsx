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
import {
  Attachments,
  AttachmentTrigger,
  AttachmentList,
  Attachment,
  AttachmentRemove,
  AttachmentInfo,
  AttachmentProperty,
  type AttachmentMeta,
} from "@/components/nexus-ui/attachments";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/nexus-ui/reasoning";
import {
  Citation,
  CitationContent,
  CitationSourcesBadge,
  CitationItem,
  CitationFavicon,
  CitationSiteName,
  CitationSource,
  type CitationSourceInput,
} from "@/components/nexus-ui/citation";
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorLabel,
  ModelSelectorItem,
  ModelSelectorItemTitle,
  ModelSelectorItemDescription,
  ModelSelectorItemIndicator,
} from "@/components/nexus-ui/model-selector";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip } from "lucide-react";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  citations?: CitationSourceInput[];
};

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a haiku about code",
  "What makes a great startup idea?",
  "Compare React and Vue in 2026",
];

const DEMO_CITATIONS: CitationSourceInput[] = [
  { url: "https://arxiv.org/abs/2401.00001", title: "Advances in Unified AI Models" },
  { url: "https://openai.com/research", title: "OpenAI Research" },
];

const DEMO_REASONING =
  "The user is asking a general question. I should provide a clear, concise answer that demonstrates the unified nature of OmniMind-1. Let me structure my response with markdown for readability and include relevant context to show depth of knowledge.";

const MODEL_ITEMS = [
  { value: "omnimind-1", title: "OmniMind-1", description: "Unified model — maximum capacity" },
  { value: "omnimind-1-turbo", title: "OmniMind-1 Turbo", description: "Faster responses, same intelligence" },
  { value: "omnimind-1-vision", title: "OmniMind-1 Vision", description: "Image understanding + generation" },
];

export function ChatView() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const [selectedModel, setSelectedModel] = useState("omnimind-1");

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Msg = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setAttachments([]);
      setIsLoading(true);

      setTimeout(() => {
        const assistantMsg: Msg = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `I'm **OmniMind-1**, your unified AI companion. You asked: "${text.trim()}"\n\nThis is a demo response — connect me to a real AI backend to unlock full intelligence.\n\n> **Sources** were consulted to provide this answer.`,
          reasoning: DEMO_REASONING,
          citations: DEMO_CITATIONS,
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
            <SuggestionList
              orientation="horizontal"
              className="flex-wrap justify-center gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <Suggestion
                  key={s}
                  value={s}
                  variant="outline"
                  className="text-hero-muted border-border hover:text-hero-text"
                >
                  {s}
                </Suggestion>
              ))}
            </SuggestionList>
          </Suggestions>
        </div>
      ) : (
        <Thread className="flex-1 min-h-0 no-scrollbar [&_*]:!scrollbar-none">
          <ThreadContent className="py-8 space-y-1">
            {messages.map((m) => (
              <Message key={m.id} from={m.role}>
                {m.role === "assistant" && (
                  <MessageAvatar
                    src=""
                    fallback="OM"
                    className="bg-secondary text-hero-text"
                  />
                )}
                <MessageStack>
                  {m.role === "assistant" && m.reasoning && (
                    <Reasoning>
                      <ReasoningTrigger className="text-hero-muted text-xs hover:text-hero-text" />
                      <ReasoningContent className="text-hero-muted/80 text-xs leading-relaxed">
                        {m.reasoning}
                      </ReasoningContent>
                    </Reasoning>
                  )}
                  <MessageContent>
                    <MessageMarkdown>{m.content}</MessageMarkdown>
                  </MessageContent>
                  {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                    <div className="mt-2">
                      <Citation citations={m.citations}>
                        <CitationSourcesBadge className="text-hero-muted text-xs hover:text-hero-text cursor-pointer" />
                        <CitationContent className="bg-background/95 backdrop-blur-xl border-border p-3 rounded-lg">
                          {m.citations.map((c, i) => (
                            <CitationItem
                              key={i}
                              href={c.url}
                              target="_blank"
                              className="flex items-center gap-2 text-sm text-hero-muted hover:text-hero-text py-1"
                            >
                              <CitationFavicon className="size-4 rounded" />
                              <CitationSiteName className="text-xs" />
                              <CitationSource className="text-xs truncate">
                                {c.title}
                              </CitationSource>
                            </CitationItem>
                          ))}
                        </CitationContent>
                      </Citation>
                    </div>
                  )}
                </MessageStack>
              </Message>
            ))}
            {isLoading && (
              <Message from="assistant">
                <MessageAvatar
                  src=""
                  fallback="OM"
                  className="bg-secondary text-hero-text"
                />
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

      {/* Input area */}
      <div className="pb-6 pt-2">
        <Attachments
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          accept="image/*,.pdf,.txt,.md,.csv"
        >
          {attachments.length > 0 && (
            <AttachmentList className="mb-3 flex gap-2 flex-wrap">
              {attachments.map((a) => (
                <Attachment
                  key={a.name}
                  attachment={a}
                  onRemove={() => setAttachments((prev) => prev.filter((f) => f !== a))}
                >
                  <AttachmentRemove className="text-hero-muted hover:text-hero-text" />
                  <AttachmentInfo className="text-xs text-hero-muted">
                    <AttachmentProperty as="name" className="truncate max-w-[80px]" />
                    <AttachmentProperty as="size" className="text-hero-muted/60" />
                  </AttachmentInfo>
                </Attachment>
              ))}
            </AttachmentList>
          )}

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
              <PromptInputActionGroup>
                <AttachmentTrigger asChild>
                  <PromptInputAction asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full text-hero-muted hover:text-hero-text hover:bg-secondary/50"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                  </PromptInputAction>
                </AttachmentTrigger>
              </PromptInputActionGroup>
              <PromptInputActionGroup>
                <PromptInputAction asChild>
                  <Button
                    size="icon"
                    className="rounded-full bg-hero-text text-background hover:bg-hero-muted"
                    disabled={(!input.trim() && attachments.length === 0) || isLoading}
                    onClick={handleSubmit}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                </PromptInputAction>
              </PromptInputActionGroup>
            </PromptInputActions>
          </PromptInput>
        </Attachments>

        {/* Model selector */}
        <div className="flex items-center gap-3 mt-3 px-1">
          <ModelSelector
            value={selectedModel}
            onValueChange={setSelectedModel}
            items={MODEL_ITEMS.map((m) => ({ value: m.value, title: m.title, description: m.description }))}
          >
            <ModelSelectorTrigger className="liquid-glass rounded-full px-3 py-1.5 text-xs text-hero-muted hover:text-hero-text border-0 h-auto" />
            <ModelSelectorContent className="bg-background/95 backdrop-blur-xl border-border">
              <ModelSelectorGroup>
                <ModelSelectorLabel className="text-hero-muted">Models</ModelSelectorLabel>
                {MODEL_ITEMS.map((m) => (
                  <ModelSelectorItem key={m.value} className="text-hero-text focus:bg-secondary">
                    <ModelSelectorItemTitle>{m.title}</ModelSelectorItemTitle>
                    <ModelSelectorItemDescription className="text-hero-muted">
                      {m.description}
                    </ModelSelectorItemDescription>
                    <ModelSelectorItemIndicator />
                  </ModelSelectorItem>
                ))}
              </ModelSelectorGroup>
            </ModelSelectorContent>
          </ModelSelector>
          <span className="text-[10px] text-hero-muted/50">All models behave as OmniMind-1</span>
        </div>
      </div>
    </div>
  );
}