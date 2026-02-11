import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductDetail as ProductDetailType } from "@/types";
import * as productsApi from "@/api/products";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem: addToCart } = useCartStore();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const data = await productsApi.getProductDetail(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      alert(`장바구니에 ${quantity}개 추가되었습니다.`);
    } catch (error) {
      alert("장바구니 추가에 실패했습니다.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="animate-pulse grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-[3/4] bg-gray-100 max-w-sm mx-auto md:max-w-none" />
            <div className="space-y-3 max-w-sm mx-auto md:max-w-none">
              <div className="h-2 bg-gray-100 w-1/4" />
              <div className="h-4 bg-gray-100 w-3/4" />
              <div className="h-4 bg-gray-100 w-1/3" />
              <div className="h-10 bg-gray-100 w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">상품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const imageUrl = product.image_url.startsWith("http")
    ? product.image_url
    : `${import.meta.env.VITE_API_BASE_URL}/media/${product.image_url}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* 상품 이미지 */}
          <div className="aspect-[3/4] bg-gray-50 overflow-hidden max-w-sm mx-auto md:max-w-none">
            <img
              src={imageUrl}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 상품 정보 */}
          <div className="flex flex-col max-w-sm mx-auto md:max-w-none">
            {/* 브랜드 */}
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>

            {/* 상품명 */}
            <h1 className="text-base font-medium text-gray-900 mb-3">
              {product.product_name}
            </h1>

            {/* 가격 */}
            <p className="text-lg font-medium text-black mb-4">
              {product.price.toLocaleString()}원
            </p>

            {/* 카테고리 */}
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-0.5 border border-gray-200 text-gray-600 text-[10px]">
                {product.category_main}
              </span>
              <span className="px-2 py-0.5 border border-gray-200 text-gray-600 text-[10px]">
                {product.category_sub}
              </span>
            </div>

            {/* 구분선 */}
            <hr className="my-4 border-gray-100" />

            {/* 수량 선택 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 tracking-wide">수량</span>
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={12} />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="space-y-2">
              <Button
                size="default"
                className="w-full bg-black hover:bg-gray-800 rounded-none text-xs tracking-wide h-10"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="mr-2" size={14} />
                {isAddingToCart ? "추가 중..." : "장바구니 담기"}
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
