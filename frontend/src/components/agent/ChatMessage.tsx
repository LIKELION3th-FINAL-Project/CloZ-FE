import { User, Bot } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types";
import { OutfitCard } from "./OutfitCard";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* 아바타 */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-gray-200" : "bg-neutral-900"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-gray-600" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* 메시지 내용 */}
      <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        {/* 첨부 이미지 (사용자 메시지) */}
        {message.imageUrl && (
          <div className="mb-2 overflow-hidden max-w-[200px]">
            <img
              src={message.imageUrl}
              alt="첨부 이미지"
              className="w-full h-auto"
            />
          </div>
        )}

        {/* 텍스트 메시지 */}
        <div
          className={`px-4 py-3 text-sm ${
            isUser
              ? "bg-neutral-900 text-white"
              : "bg-white border border-gray-100"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* 코디 결과 (AI 응답) */}
        {message.outfits && message.outfits.length > 0 && (
          <div className="mt-4 w-full">
            <div className="grid gap-4">
              {message.outfits.map((outfit) => (
                <OutfitCard key={outfit.outfit_id} outfit={outfit} />
              ))}
            </div>
          </div>
        )}

        {/* 타임스탬프 */}
        <span className="text-[10px] text-gray-300 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
