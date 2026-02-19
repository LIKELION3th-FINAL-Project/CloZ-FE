import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useAgentStore } from "@/stores/agentStore";
import { useAuthStore } from "@/stores/authStore";
import { useClosetStore } from "@/stores/closetStore";

interface AgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentPanel({ isOpen, onClose }: AgentPanelProps) {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const { messages, isLoading, sendMessage, clearSession } = useAgentStore();
  const { fetchCloset } = useClosetStore();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCloset();
    }
  }, [isOpen, isAuthenticated, fetchCloset]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    try {
      await sendMessage(message, imageUrl);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl h-[85vh] bg-white flex flex-col shadow-2xl mx-4 mb-0 rounded-t-2xl overflow-hidden animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-900 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-medium">AI Styling Assistant</h2>
              {isAuthenticated && user && (
                <p className="text-[11px] text-gray-400">
                  {user.nickname}님의 스타일 코디
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && messages.length > 0 && (
              <button
                onClick={clearSession}
                className="text-gray-400 hover:text-black transition-colors flex items-center text-xs px-2 py-1"
              >
                <Trash2 size={13} className="mr-1" />
                초기화
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Not authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <Bot size={40} className="text-gray-300 mb-4" />
            <h3 className="text-base font-medium mb-2">AI Styling Service</h3>
            <p className="text-sm text-gray-400 mb-6">
              로그인하고 AI 코디를 시작하세요
            </p>
            <Button
              onClick={handleLogin}
              className="rounded-none bg-black hover:bg-gray-800 px-8 text-sm"
            >
              Login
            </Button>
          </div>
        ) : (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Bot size={36} className="text-gray-300 mb-4" />
                  <h3 className="text-sm font-medium text-gray-800 mb-2">
                    안녕하세요, {user?.nickname}님!
                  </h3>
                  <p className="text-xs text-gray-400 mb-6 max-w-sm">
                    어떤 상황에 맞는 코디가 필요하신가요?
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md">
                    {[
                      "바지 추천 해줘",
                      "캐주얼하게 코디해줘",
                      "소개팅 코디 추천해줘",
                      "면접 단정한 코디",
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-xs text-gray-600 hover:border-black hover:text-black transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-w-xl mx-auto">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-white border border-gray-100 px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                          <span
                            className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <span
                            className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input area */}
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              disabled={!isAuthenticated}
            />
          </>
        )}
      </div>
    </div>
  );
}
