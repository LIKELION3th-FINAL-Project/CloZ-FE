import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout";
import { useAuthStore } from "@/stores/authStore";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Search from "@/pages/Search";
import Category from "@/pages/Category";
import ProductDetail from "@/pages/ProductDetail";
import MyPage from "@/pages/MyPage";
import Agent from "@/pages/Agent";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import OAuthCallback from "@/pages/OAuthCallback";
import CompleteProfile from "@/pages/CompleteProfile";

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories/:main" element={<Category />} />
        <Route path="/categories/:main/:sub" element={<Category />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Navigate to="/mypage?tab=cart" replace />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback/:provider" element={<OAuthCallback />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
