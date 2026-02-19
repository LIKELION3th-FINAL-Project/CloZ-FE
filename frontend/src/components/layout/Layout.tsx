import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAgentButton, AgentPanel } from "@/components/agent";

export function Layout() {
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Agent floating button & panel */}
      <FloatingAgentButton
        onClick={() => setIsAgentOpen(true)}
        isOpen={isAgentOpen}
      />
      <AgentPanel
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
      />
    </div>
  );
}
