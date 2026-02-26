import { User, Bot } from "lucide-react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => (
                <h1 className="text-base font-semibold mt-2 mb-2" {...props} />
              ),
              h2: (props) => (
                <h2 className="text-base font-semibold mt-2 mb-2" {...props} />
              ),
              h3: (props) => (
                <h3 className="text-sm font-semibold mt-2 mb-2" {...props} />
              ),
              p: (props) => (
                <p
                  className="whitespace-pre-wrap leading-6 [&:not(:first-child)]:mt-2"
                  {...props}
                />
              ),
              ul: (props) => (
                <ul className="list-disc pl-5 mt-2 space-y-1" {...props} />
              ),
              ol: (props) => (
                <ol className="list-decimal pl-5 mt-2 space-y-1" {...props} />
              ),
              li: (props) => <li className="leading-6" {...props} />,
              hr: (props) => (
                <hr
                  className={`my-3 border-t ${
                    isUser ? "border-white/20" : "border-gray-200"
                  }`}
                  {...props}
                />
              ),
              a: ({ href, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`underline underline-offset-2 ${
                    isUser ? "text-white" : "text-neutral-900"
                  }`}
                  {...props}
                />
              ),
              blockquote: (props) => (
                <blockquote
                  className={`border-l-2 pl-3 my-2 ${
                    isUser ? "border-white/30 text-white/90" : "border-gray-200 text-gray-700"
                  }`}
                  {...props}
                />
              ),
              code: (props) => {
                const { inline, children, ...rest } = props as {
                  inline?: boolean;
                  children?: ReactNode;
                } & Record<string, unknown>;

                return inline ? (
                  <code
                    className={`px-1 py-0.5 rounded font-mono text-[0.85em] ${
                      isUser ? "bg-white/15" : "bg-gray-100"
                    }`}
                    {...rest}
                  >
                    {children}
                  </code>
                ) : (
                  <code className="font-mono text-[0.85em]" {...rest}>
                    {children}
                  </code>
                );
              },
              pre: (props) => (
                <pre
                  className={`mt-2 overflow-x-auto rounded p-3 ${
                    isUser
                      ? "bg-white/10"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  {...props}
                />
              ),
              strong: (props) => <strong className="font-semibold" {...props} />,
              em: (props) => <em className="italic" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
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
