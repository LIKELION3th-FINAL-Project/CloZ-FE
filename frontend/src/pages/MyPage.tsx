import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { User, Package, ShoppingCart, Shirt, LogOut, Plus, Upload, X, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useClosetStore } from "@/stores/closetStore";
import { useCartStore } from "@/stores/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import type { Order, ClosetCategory, Gender, StyleType } from "@/types";
import * as ordersApi from "@/api/orders";
import * as paymentsApi from "@/api/payments";

const MAX_STYLES = 3;

const styleOptions: { value: StyleType; label: string }[] = [
  { value: "CASUAL", label: "캐주얼" },
  { value: "STREET", label: "스트릿" },
  { value: "MINIMAL", label: "미니멀" },
  { value: "SPORTY", label: "스포티" },
  { value: "ROMANTIC", label: "로맨틱" },
  { value: "CLASSIC", label: "클래식" },
  { value: "CHIC", label: "시크" },
  { value: "WORKWEAR", label: "워크웨어" },
  { value: "CITYBOY", label: "시티보이" },
  { value: "GORPCORE", label: "고프코어" },
  { value: "RETRO", label: "레트로" },
  { value: "PREPPY", label: "프레피" },
  { value: "RESORT", label: "리조트" },
  { value: "OUTDOOR", label: "아웃도어" },
  { value: "OFFICE", label: "오피스" },
];

// 스타일 값 → 한글 라벨 변환
const styleLabelMap = Object.fromEntries(styleOptions.map((s) => [s.value, s.label]));

function MyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading, logout, fetchUser, updateUser } = useAuthStore();
  const { items: closetItems, fetchCloset, addItem: addToCloset, removeItem: removeFromCloset } = useClosetStore();
  const { items: cartItems, fetchCart, removeItem: removeCartItem, totalPrice, totalQuantity } = useCartStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ClosetCategory>("TOP");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editHeight, setEditHeight] = useState(0);
  const [editWeight, setEditWeight] = useState(0);
  const [editGender, setEditGender] = useState<Gender>("FEMALE");
  const [editStyles, setEditStyles] = useState<string[]>([]);
  const [editError, setEditError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // URL 쿼리 파라미터에서 탭 읽기
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"orders" | "cart" | "closet">(
    tabParam === "closet" ? "closet" : tabParam === "cart" ? "cart" : "orders"
  );

  useEffect(() => {
    if (tabParam === "closet") setActiveTab("closet");
    else if (tabParam === "cart") setActiveTab("cart");
    else if (tabParam === "orders") setActiveTab("orders");
  }, [tabParam]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
      fetchCloset();
      fetchCart();
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openEditProfile = () => {
    if (!user) return;
    setEditNickname(user.nickname);
    setEditHeight(user.height);
    setEditWeight(user.weight);
    setEditGender(user.gender);
    setEditStyles([...user.styles]);
    setEditError("");
    setShowEditProfile(true);
  };

  const handleEditStyleToggle = (style: string) => {
    setEditStyles((prev) => {
      if (prev.includes(style)) return prev.filter((s) => s !== style);
      if (prev.length >= MAX_STYLES) return prev;
      return [...prev, style];
    });
  };

  const handleSaveProfile = async () => {
    if (!editNickname.trim()) {
      setEditError("닉네임을 입력해주세요.");
      return;
    }
    if (editStyles.length !== MAX_STYLES) {
      setEditError(`스타일을 ${MAX_STYLES}개 선택해주세요.`);
      return;
    }
    setEditError("");

    try {
      await updateUser({
        nickname: editNickname.trim(),
        height: editHeight,
        weight: editWeight,
        gender: editGender,
        styles: editStyles,
      });
      setShowEditProfile(false);
    } catch (error: any) {
      setEditError(error.response?.data?.message || "수정에 실패했습니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      await addToCloset(uploadCategory, uploadFile);
      alert("옷장에 추가되었습니다.");
      setShowUploadForm(false);
      setUploadFile(null);
      setUploadPreview(null);
      setUploadCategory("TOP");
    } catch (error) {
      alert("옷장 추가에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      const orderResponse = await ordersApi.createOrder({ items: orderItems });

      const paymentResponse = await paymentsApi.preparePayment({
        order_id: orderResponse.order_id,
      });

      await paymentsApi.confirmPayment({
        order_id: orderResponse.order_id,
        payment_key: paymentResponse.payment_key,
      });

      alert("결제가 완료되었습니다!");
      fetchCart();
      loadOrders();
      setActiveTab("orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleRemoveFromCloset = async (itemId: number) => {
    if (!confirm("옷장에서 삭제하시겠습니까?")) return;
    try {
      await removeFromCloset(itemId);
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
        <User size={48} className="text-gray-300 mb-4" />
        <p className="text-sm text-gray-400 mb-6">로그인이 필요합니다.</p>
        <Button onClick={() => navigate("/login")} className="rounded-none bg-black hover:bg-gray-800 px-8 text-sm">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="border-b border-gray-100 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.nickname}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={24} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-base font-medium">{user?.nickname}</h1>
              <p className="text-gray-400 text-xs mt-1">
                {user?.height}cm / {user?.weight}kg / {user?.gender === "FEMALE" ? "여성" : "남성"}
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {user?.styles.map((style) => (
                  <span
                    key={style}
                    className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600"
                  >
                    {styleLabelMap[style] || style}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={openEditProfile} className="text-xs text-gray-400 hover:text-black transition-colors flex items-center">
                <Pencil size={14} className="mr-1" />
                Edit
              </button>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-black transition-colors flex items-center">
                <LogOut size={14} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* 프로필 수정 모달 */}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-sm font-medium tracking-wide">Edit Profile</h2>
                <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* 닉네임 */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Nickname</label>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                  />
                </div>

                {/* 성별 */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Gender</label>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        value="FEMALE"
                        checked={editGender === "FEMALE"}
                        onChange={() => setEditGender("FEMALE")}
                        className="mr-2 accent-black"
                      />
                      여성
                    </label>
                    <label className="flex items-center text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        value="MALE"
                        checked={editGender === "MALE"}
                        onChange={() => setEditGender("MALE")}
                        className="mr-2 accent-black"
                      />
                      남성
                    </label>
                  </div>
                </div>

                {/* 키/몸무게 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={editHeight}
                      onChange={(e) => setEditHeight(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* 스타일 선택 */}
                <div>
                  <label className="block text-xs text-gray-400 mb-3">
                    Preferred Style
                    <span className="text-gray-300 ml-2">({editStyles.length}/{MAX_STYLES}개 선택)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((style) => {
                      const isSelected = editStyles.includes(style.value);
                      const isFull = editStyles.length >= MAX_STYLES && !isSelected;
                      return (
                        <button
                          key={style.value}
                          type="button"
                          onClick={() => handleEditStyleToggle(style.value)}
                          className={`px-3 py-1.5 text-xs font-medium transition-colors border ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : isFull
                              ? "bg-white text-gray-300 border-gray-100 cursor-not-allowed"
                              : "bg-white text-gray-600 border-gray-200 hover:border-black"
                          }`}
                          disabled={isFull}
                        >
                          {style.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 에러 메시지 */}
                {editError && <p className="text-xs text-red-500 text-center">{editError}</p>}

                {/* 저장 버튼 */}
                <Button
                  onClick={handleSaveProfile}
                  disabled={authLoading}
                  className="w-full bg-black hover:bg-gray-800 rounded-none text-sm tracking-wide"
                  size="lg"
                >
                  {authLoading ? "저장 중..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex border-b border-gray-100 mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 text-sm ${
              activeTab === "orders"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            <Package size={16} className="inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("cart")}
            className={`px-6 py-3 text-sm ${
              activeTab === "cart"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            <ShoppingCart size={16} className="inline mr-2" />
            Cart
          </button>
          <button
            onClick={() => setActiveTab("closet")}
            className={`px-6 py-3 text-sm ${
              activeTab === "closet"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            <Shirt size={16} className="inline mr-2" />
            Closet
          </button>
        </div>

        <div>
          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 p-5"
                    >
                      {/* 주문 헤더 */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium">Order #{order.id}</p>
                          <span
                            className={`text-[10px] px-2 py-0.5 ${
                              order.status === "PAID"
                                ? "bg-black text-white"
                                : order.status === "PENDING"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* 주문 상품 목록 */}
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => {
                          const imgSrc = item.image_url
                            ? item.image_url.startsWith("http")
                              ? item.image_url
                              : item.image_url.startsWith("/")
                                ? `${import.meta.env.VITE_API_BASE_URL}${item.image_url}`
                                : `${import.meta.env.VITE_API_BASE_URL}/media/${item.image_url}`
                            : null;
                          return (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-14 h-18 bg-gray-50 overflow-hidden flex-shrink-0">
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={item.product_name}
                                    className="w-14 h-[72px] object-contain"
                                  />
                                ) : (
                                  <div className="w-14 h-[72px] flex items-center justify-center text-gray-300 text-[10px]">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400">{item.brand}</p>
                                <p className="text-sm text-gray-800 truncate">{item.product_name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {item.price.toLocaleString()}원 × {item.quantity}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 주문 합계 */}
                      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium">{order.total_price.toLocaleString()}원</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "cart" && (
            <div>
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm mb-6">장바구니가 비어있습니다.</p>
                  <Link to="/">
                    <Button variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white px-8 text-sm">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.product_id}
                        item={item}
                        onRemove={removeCartItem}
                      />
                    ))}
                  </div>
                  <div>
                    <CartSummary
                      totalQuantity={totalQuantity()}
                      totalPrice={totalPrice()}
                      onCheckout={handleCheckout}
                      isLoading={isCheckingOut}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "closet" && (
            <div>
              {/* 업로드 버튼 */}
              <div className="flex justify-end mb-6">
                <Button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="rounded-none bg-black hover:bg-gray-800 text-xs tracking-wide h-9 px-4"
                >
                  <Plus size={14} className="mr-1" />
                  옷 추가하기
                </Button>
              </div>

              {/* 업로드 폼 */}
              {showUploadForm && (
                <div className="border border-gray-200 p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">옷장에 옷 추가</h3>
                    <button
                      onClick={() => {
                        setShowUploadForm(false);
                        setUploadFile(null);
                        setUploadPreview(null);
                      }}
                      className="text-gray-400 hover:text-black"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* 카테고리 선택 */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-2 block">카테고리</label>
                    <div className="flex gap-2">
                      {(["TOP", "BOTTOM", "OUTER"] as ClosetCategory[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setUploadCategory(cat)}
                          className={`px-4 py-2 text-xs border transition-colors ${
                            uploadCategory === cat
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                          }`}
                        >
                          {cat === "TOP" ? "상의" : cat === "BOTTOM" ? "하의" : "아우터"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 이미지 업로드 */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-2 block">이미지</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {uploadPreview ? (
                      <div className="relative w-32 h-40">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-full object-cover border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setUploadFile(null);
                            setUploadPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-40 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors"
                      >
                        <Upload size={20} className="mb-2" />
                        <span className="text-[10px]">사진 선택</span>
                      </button>
                    )}
                  </div>

                  {/* 업로드 버튼 */}
                  <Button
                    onClick={handleUpload}
                    disabled={!uploadFile || isUploading}
                    className="rounded-none bg-black hover:bg-gray-800 text-xs tracking-wide h-9 px-6 disabled:opacity-50"
                  >
                    {isUploading ? "업로드 중..." : "추가"}
                  </Button>
                </div>
              )}

              {/* 옷장 목록 */}
              {closetItems.length === 0 && !showUploadForm ? (
                <div className="text-center py-16">
                  <Shirt size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm mb-2">옷장이 비어있습니다.</p>
                  <p className="text-gray-300 text-xs">위의 "옷 추가하기" 버튼으로 사진을 업로드하세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {closetItems.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-[3/4] bg-gray-50 overflow-hidden relative group"
                    >
                      <img
                        src={item.image_url}
                        alt={item.category}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-2 flex items-center justify-between">
                        <span>{item.category}</span>
                        <button
                          onClick={() => handleRemoveFromCloset(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyPage;
