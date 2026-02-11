import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onRemove }: CartItemProps) {
  // 이미지 URL 처리 (상대 경로인 경우 /media/ 경로 추가)
  const imageUrl = item.image_url
    ? item.image_url.startsWith("http")
      ? item.image_url
      : `${import.meta.env.VITE_API_BASE_URL}/media/${item.image_url}`
    : null;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
      {/* 상품 이미지 */}
      <div className="w-20 h-24 bg-gray-50 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.product_name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-gray-800 truncate">
          {item.product_name}
        </h3>
        <p className="text-sm font-medium text-black mt-1">
          {item.price.toLocaleString()}원
        </p>
        <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
      </div>

      {/* 삭제 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.product_id)}
        className="text-gray-300 hover:text-black"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
}
