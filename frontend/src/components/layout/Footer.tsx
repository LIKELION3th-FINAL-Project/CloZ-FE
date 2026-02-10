import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white mt-auto py-16">
      <div className="container mx-auto px-4">
        {/* 하단 저작권 */}
        <div className="text-center">
          <Link to="/" className="text-lg font-light tracking-[0.3em] text-black">
            CloZ
          </Link>
          <p className="mt-6 text-[10px] text-gray-400 tracking-wider">
            Copyright &copy; 2026 CloZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
