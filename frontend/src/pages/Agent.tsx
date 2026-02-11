import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, ChatInput } from "@/components/agent";
import { useAgentStore } from "@/stores/agentStore";
import { useAuthStore } from "@/stores/authStore";
import { useClosetStore } from "@/stores/closetStore";

function Agent() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const { messages, isLoading, sendMessage, clearSession } = useAgentStore();
  const { fetchCloset, hasMinimumItems } = useClosetStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCloset();
    }
  }, [isAuthenticated, fetchCloset]);

  // 메시지가 추가될 때 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    try {
      await sendMessage(message, imageUrl);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // 로그인 필요
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
        <Bot size={48} className="text-gray-300 mb-4" />
        <h1 className="text-lg font-medium mb-2">AI Styling Service</h1>
        <p className="text-sm text-gray-400 mb-6">로그인하고 AI 코디를 시작하세요</p>
        <Button onClick={() => navigate("/login")} className="rounded-none bg-black hover:bg-gray-800 px-8 text-sm">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-medium text-sm">AI Styling Assistant</h1>
            <p className="text-xs text-gray-400">
              {user?.nickname}님의 스타일에 맞는 코디를 추천해 드려요
            </p>
          </div>
        </div>
        <button
          onClick={clearSession}
          className="text-gray-400 hover:text-black transition-colors flex items-center text-xs"
        >
          <Trash2 size={14} className="mr-1" />
          초기화
        </button>
      </div>

      {/* 3/3/3 알림 */}
      {!hasMinimumItems() && (
        <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-start gap-2">
          <AlertCircle size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="text-gray-600 font-medium">
              옷장에 아이템이 부족해요
            </p>
            <p className="text-gray-400">
              상의, 하의, 아우터 각 3개 이상 추가하면 내 옷장으로 코디를 받을 수 있어요.
            </p>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot size={40} className="text-gray-300 mb-4" />
            <h2 className="text-base font-medium text-gray-800 mb-2">
              안녕하세요, {user?.nickname}님!
            </h2>
            <p className="text-sm text-gray-400 mb-8 max-w-md">
              어떤 상황에 맞는 코디가 필요하신가요?
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {[
                "오늘 홍대 놀러가는데 캐주얼하게 코디해줘",
                "소개팅인데 깔끔하게 입고 싶어",
                "면접 갈건데 단정한 코디 추천해줘",
                "날씨가 추워서 따뜻하게 입고 싶어",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 text-xs text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
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

      {/* 입력 영역 */}
      <ChatInput
        onSend={handleSendMessage}
        isLoading={isLoading}
        disabled={!isAuthenticated}
      />
    </div>
  );
}

export default Agent;
