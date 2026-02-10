import { useEffect, useState, useRef } from "react";
import { ProductGrid } from "@/components/product";
import type { Product } from "@/types";
import * as productsApi from "@/api/products";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  const offsetRef = useRef(0);
  const isLoadingRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async (currentOffset: number, append: boolean = false) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await productsApi.getProducts(currentOffset, limit);
      if (append) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }
      // 받은 데이터가 limit보다 적으면 더 이상 데이터 없음
      if (response.products.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingRef.current && hasMore) {
          offsetRef.current += limit;
          fetchProducts(offsetRef.current, true);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore]);

  return (
    <div className="min-h-screen bg-white">
      {/* 상품 목록 */}
      <section className="max-w-5xl mx-auto px-20 lg:px-32 xl:px-40 py-8">
        <ProductGrid products={products} isLoading={isLoading && products.length === 0} />

        {/* 무한 스크롤 트리거 */}
        <div ref={loadMoreRef} className="h-10" />
        
        {/* 로딩 표시 */}
        {isLoading && products.length > 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">Loading...</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
