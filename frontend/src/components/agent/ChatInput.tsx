import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";

interface ChatInputProps {
  onSend: (message: string, imageUrl?: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedImage) return;

    onSend(message.trim(), selectedImage || undefined);
    setMessage("");
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-4">
      {/* 선택된 이미지 미리보기 */}
      {selectedImage && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">
            이 옷을 포함해서 코디를 추천받을 수 있어요
          </p>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* 이미지 업로드 */}
        <ImageUpload
          onImageSelect={setSelectedImage}
          selectedImage={selectedImage}
        />

        {/* 메시지 입력 */}
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="코디를 요청해보세요..."
            className="min-h-[44px] max-h-[120px] resize-none border-gray-200 focus:border-black text-sm rounded-none"
            disabled={isLoading || disabled}
          />
        </div>

        {/* 전송 버튼 */}
        <Button
          type="submit"
          size="icon"
          className="bg-black hover:bg-gray-800 rounded-none"
          disabled={isLoading || disabled || (!message.trim() && !selectedImage)}
        >
          <Send size={18} />
        </Button>
      </div>

      {/* 힌트 */}
      <p className="text-[10px] text-gray-300 mt-2">
        Shift + Enter로 줄바꿈, Enter로 전송
      </p>
    </form>
  );
}
