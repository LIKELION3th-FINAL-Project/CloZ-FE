import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ProductGrid } from "@/components/product";
import type { Product } from "@/types";
import * as productsApi from "@/api/products";

// 카테고리 데이터 정의
const categoryData: Record<string, { display: string; urlKey: string }[]> = {
  outer: [
    { display: "Jacket/Blouson", urlKey: "jacket_blouson" },
    { display: "Jumper/Parka", urlKey: "jumper_parka" },
    { display: "Leather", urlKey: "leather" },
    { display: "Coat", urlKey: "coat" },
    { display: "Vest", urlKey: "vest" },
    { display: "Padding", urlKey: "padding" },
    { display: "Cardigan", urlKey: "cardigan" },
  ],
  tops: [
    { display: "Tee", urlKey: "tee" },
    { display: "Shirt", urlKey: "shirt" },
    { display: "Sweatshirt", urlKey: "sweatshirt" },
    { display: "Knitwear", urlKey: "knitwear" },
  ],
  bottoms: [
    { display: "Denim", urlKey: "denim" },
    { display: "Trousers", urlKey: "trousers" },
    { display: "Easy Pants", urlKey: "easy_pants" },
    { display: "Work Pants", urlKey: "work_pants" },
    { display: "Short", urlKey: "short" },
    { display: "Chino", urlKey: "chino" },
  ],
};

// 카테고리 표시명 매핑
const categoryDisplayNames: Record<string, string> = {
  outer: "OUTER",
  tops: "TOPS",
  bottoms: "BOTTOMS",
  "jacket_blouson": "Jacket/Blouson",
  "jumper_parka": "Jumper/Parka",
  leather: "Leather",
  coat: "Coat",
  vest: "Vest",
  padding: "Padding",
  cardigan: "Cardigan",
  tee: "Tee",
  shirt: "Shirt",
  sweatshirt: "Sweatshirt",
  knitwear: "Knitwear",
  denim: "Denim",
  trousers: "Trousers",
  easy_pants: "Easy Pants",
  work_pants: "Work Pants",
  short: "Short",
  chino: "Chino",
};

function Category() {
  const { main, sub } = useParams<{ main?: string; sub?: string }>();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  const offsetRef = useRef(0);
  const isLoadingRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 카테고리 조합
  const categoryMain = main?.toUpperCase() || "";
  const categorySub = sub || "";

  const fetchProducts = async (currentOffset: number, append: boolean = false) => {
    if (!categoryMain) return;
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await productsApi.getProductsByCategory(
        categoryMain,
        currentOffset,
        limit,
        categorySub
      );
      if (append) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }
      if (response.products.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch category products:", error);
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
    fetchProducts(0);
  }, [categoryMain, categorySub]);

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
  }, [hasMore, categoryMain, categorySub]);

  // 표시용 카테고리 이름
  const mainDisplay = categoryDisplayNames[main?.toLowerCase() || ""] || main?.toUpperCase();

  // 현재 메인 카테고리의 서브 카테고리 목록
  const subCategories = main ? categoryData[main.toLowerCase()] || [] : [];

  return (
    <div className="min-h-screen bg-white">
      {/* 카테고리 헤더 + 서브 카테고리 - sticky */}
      <div className="sticky top-[168px] z-40 bg-white">
        {/* 카테고리 헤더 */}
        <div className="text-center pt-6 pb-3">
          <button
            onClick={() => {
              const mainPath = `/categories/${main?.toLowerCase()}`;
              if (location.pathname === mainPath) {
                window.location.reload();
              } else {
                window.location.href = mainPath;
              }
            }}
            className="text-sm tracking-[0.2em] uppercase text-black font-medium hover:opacity-70 transition-opacity"
          >
            {mainDisplay}
          </button>
        </div>

        {/* 서브 카테고리 네비게이션 */}
        {subCategories.length > 0 && (
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 pb-4">
          {subCategories.map((subCat) => {
            const subPath = `/categories/${main?.toLowerCase()}/${subCat.urlKey}`;
            return (
              <button
                key={subCat.urlKey}
                onClick={() => {
                  if (location.pathname === subPath) {
                    window.location.reload();
                  } else {
                    window.location.href = subPath;
                  }
                }}
                className={`
                  relative text-[11px] tracking-[0.1em] uppercase pb-1 group
                  transition-all duration-300
                  ${sub === subCat.urlKey ? "text-black" : "text-gray-400 hover:text-black"}
                `}
              >
                {subCat.display}
                <span className={`
                  absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-300
                  ${sub === subCat.urlKey ? "w-full" : "w-0 group-hover:w-full"}
                `} />
              </button>
            );
          })}
          </div>
        )}
      </div>

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

export default Category;
