import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ChatView } from "@/components/ChatView";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background GIF */}
      <img
        src="/images/landscape-bg.gif"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/60 z-[1]" />

      {/* Navbar */}
      <Navbar onBeginJourney={() => setShowChat(true)} showChat={showChat} />

      {/* Hero or Chat */}
      {!showChat ? (
        <HeroSection onBeginJourney={() => setShowChat(true)} />
      ) : (
        <ChatView />
      )}
    </div>
  );
}
