import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Outfit } from "@/types";
import { useCartStore } from "@/stores/cartStore";

interface OutfitCardProps {
  outfit: Outfit;
}

export function OutfitCard({ outfit }: OutfitCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId, 1);
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      {/* 코디 이미지 */}
      <div className="aspect-[3/4] bg-gray-50">
        <img
          src={outfit.image_url}
          alt={`코디 ${outfit.outfit_id}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 상품 목록 */}
      <div className="p-4">
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Outfit Items</h4>
        <div className="space-y-2">
          {outfit.products.map((product) => (
            <div
              key={product.product_id}
              className="flex items-center justify-between p-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">
                  {product.category_main} / {product.category_sub}
                </p>
                <Link
                  to={`/products/${product.product_id}`}
                  className="text-xs text-gray-800 hover:text-black truncate block"
                >
                  {product.product_name}
                </Link>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-black"
                onClick={() => handleAddToCart(product.product_id)}
              >
                <ShoppingCart size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
