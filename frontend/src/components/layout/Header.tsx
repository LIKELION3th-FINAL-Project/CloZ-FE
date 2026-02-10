import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

// 메인 카테고리 목록
const mainCategories = ["OUTER", "TOPS", "BOTTOMS"] as const;

export function Header() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === "/about") return location.pathname === "/about";
    if (path === "/") return location.pathname === "/" || location.pathname.startsWith("/products") || location.pathname.startsWith("/categories");
    if (path === "/account") return location.pathname === "/mypage" || location.pathname === "/login" || location.pathname === "/signup";
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(searchKeyword.trim())}`;
    }
  };

  // 네비게이션 아이템 스타일
  const navItemClass = (active: boolean) => `
    relative text-[11px] tracking-[0.15em] uppercase pb-1
    transition-all duration-300 ease-in-out
    ${active ? "text-black" : "text-gray-400 hover:text-black"}
    group
  `;

  // 밑줄 스타일 (애니메이션)
  const underlineClass = (active: boolean) => `
    absolute bottom-0 left-0 h-[1px] bg-black
    transition-all duration-300 ease-in-out
    ${active ? "w-full" : "w-0 group-hover:w-full"}
  `;

  return (
    <header className="sticky top-0 z-50 w-full bg-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* 검색 아이콘 */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-400 hover:text-black transition-all duration-300"
          >
            <Search size={18} />
          </button>
        </div>

        {/* 검색창 (토글) - 애니메이션 */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showSearch ? "max-h-20 opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
          <form onSubmit={handleSearch} className="flex justify-center">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search..."
              className="w-64 text-center text-sm border-b border-gray-300 focus:border-black focus:outline-none pb-2 transition-all duration-300"
              autoFocus={showSearch}
            />
          </form>
        </div>

        {/* 로고 - 중앙 정렬 */}
        <div className="text-center mb-8">
          <button 
            onClick={() => {
              if (location.pathname === "/") {
                window.location.reload();
              } else {
                window.location.href = "/";
              }
            }}
            className="inline-block transition-transform duration-300 hover:scale-105"
          >
            <h1 className="text-2xl font-light tracking-[0.3em] text-black">CloZ</h1>
          </button>
        </div>

        {/* 네비게이션 - 중앙 정렬 */}
        <nav className="flex justify-center items-center space-x-16">
          <Link to="/about" className={navItemClass(isActive("/about"))}>
            About
            <span className={underlineClass(isActive("/about"))} />
          </Link>
          
          {/* Shop 드롭다운 */}
          <div 
            className="relative"
            onMouseEnter={() => setShowShopMenu(true)}
            onMouseLeave={() => setShowShopMenu(false)}
          >
            <button className={navItemClass(isActive("/"))}>
              Shop
              <span className={underlineClass(isActive("/") || showShopMenu)} />
            </button>
            
            {/* 메인 카테고리 드롭다운 */}
            <div className={`
              absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50
              transition-all duration-300 ease-in-out
              ${showShopMenu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
            `}>
              <div className="bg-white py-4 px-6 min-w-[120px] border-t border-gray-200">
                <div className="flex flex-col items-center space-y-3">
                  {mainCategories.map((category) => {
                    const categoryPath = `/categories/${category.toLowerCase()}`;
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          if (location.pathname === categoryPath) {
                            window.location.reload();
                          } else {
                            window.location.href = categoryPath;
                          }
                        }}
                        className="relative text-[11px] tracking-[0.1em] uppercase group transition-all duration-300 text-gray-500 hover:text-black"
                      >
                        {category}
                        <span className="absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-300 w-0 group-hover:w-full" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Account 드롭다운 */}
          <div 
            className="relative"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <button className={navItemClass(isActive("/account"))}>
              Account
              <span className={underlineClass(isActive("/account") || showAccountMenu)} />
            </button>
            
            {/* 드롭다운 메뉴 - 애니메이션 */}
            <div className={`
              absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50
              transition-all duration-300 ease-in-out
              ${showAccountMenu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
            `}>
              <div className="bg-white py-4 px-6 min-w-[140px] border-t border-gray-200">
                <div className="flex flex-col items-center space-y-3">
                  {[
                    { to: "/login", label: "Login" },
                    { to: "/mypage", label: "My Page" },
                  ].map((item, index) => (
                    <Link 
                      key={item.to}
                      to={item.to} 
                      className="relative text-[11px] tracking-[0.1em] text-gray-500 hover:text-black uppercase group"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
