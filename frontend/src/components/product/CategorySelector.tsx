import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All", path: "/" },
  { id: "outer", name: "Outer", path: "/categories/아우터" },
  { id: "top", name: "Tops", path: "/categories/상의" },
  { id: "bottom", name: "Bottoms", path: "/categories/바지" },
  { id: "dress", name: "Dress", path: "/categories/원피스" },
  { id: "skirt", name: "Skirt", path: "/categories/스커트" },
  { id: "shoes", name: "Shoes", path: "/categories/신발" },
  { id: "bag", name: "Bags", path: "/categories/가방" },
  { id: "acc", name: "ACC", path: "/categories/액세서리" },
];

export function CategorySelector() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <div className="overflow-x-auto scrollbar-hide border-b border-gray-100">
      <div className="flex space-x-8 py-4 px-4 min-w-max">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className={cn(
              "text-sm font-medium whitespace-nowrap transition-colors relative pb-1",
              isActive(category.path)
                ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-gray-400 hover:text-black"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
