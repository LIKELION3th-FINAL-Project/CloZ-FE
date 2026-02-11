import { Link } from "react-router-dom";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // 이미지 URL 처리 (상대 경로인 경우 /media/ 경로 추가)
  const imageUrl = product.image_url.startsWith("http")
    ? product.image_url
    : `${import.meta.env.VITE_API_BASE_URL}/media/${product.image_url}`;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block"
    >
      {/* 상품 이미지 */}
      <div className="aspect-square overflow-hidden bg-white">
        <img
          src={imageUrl}
          alt={product.product_name}
          className="w-full h-full object-contain group-hover:opacity-80 transition-opacity duration-300"
          loading="lazy"
        />
      </div>
    </Link>
  );
}
