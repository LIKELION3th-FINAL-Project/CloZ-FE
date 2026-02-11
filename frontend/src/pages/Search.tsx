import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "@/components/product";
import type { Product } from "@/types";
import * as productsApi from "@/api/products";

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  const offsetRef = useRef(0);
  const isLoadingRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const searchProducts = async (currentOffset: number, append: boolean = false) => {
    if (!keyword) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await productsApi.searchProducts(keyword, currentOffset, limit);
      if (append) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }
      if (response.products.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to search products:", error);
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    offsetRef.current = 0;
    setProducts([]);
    setHasMore(true);
    searchProducts(0);
  }, [keyword]);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingRef.current && hasMore && keyword) {
          offsetRef.current += limit;
          searchProducts(offsetRef.current, true);
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
  }, [hasMore, keyword]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-20 lg:px-32 xl:px-40 py-8">
        {/* 검색 결과 */}
        {keyword ? (
          <>
            <ProductGrid products={products} isLoading={isLoading && products.length === 0} />

            {/* 무한 스크롤 트리거 */}
            <div ref={loadMoreRef} className="h-10" />

            {/* 로딩 표시 */}
            {isLoading && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xs tracking-wider">
                  No results found.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xs tracking-wider">
              Enter a search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
