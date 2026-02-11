import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CartItem, CartSummary } from "@/components/cart";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import * as ordersApi from "@/api/orders";
import * as paymentsApi from "@/api/payments";

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, fetchCart, removeItem, totalPrice, totalQuantity, isLoading } =
    useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeItem(productId);
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. 주문 생성
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      const orderResponse = await ordersApi.createOrder({ items: orderItems });

      // 2. 결제 준비
      const paymentResponse = await paymentsApi.preparePayment({
        order_id: orderResponse.order_id,
      });

      // 3. 결제 확인 (실제로는 PG사 연동 필요)
      // 여기서는 바로 확인 처리
      await paymentsApi.confirmPayment({
        order_id: orderResponse.order_id,
        payment_key: paymentResponse.payment_key,
      });

      alert("결제가 완료되었습니다!");
      fetchCart(); // 장바구니 새로고침
      navigate("/mypage");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
        <ShoppingCart size={48} className="text-gray-300 mb-4" />
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
        <h1 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-8">Shopping Cart</h1>

        {isLoading && items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-6">장바구니가 비어있습니다.</p>
            <Button variant="outline" onClick={() => navigate("/")} className="rounded-none border-black text-black hover:bg-black hover:text-white px-8 text-sm">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary
                  totalPrice={totalPrice()}
                  totalQuantity={totalQuantity()}
                  onCheckout={handleCheckout}
                  isLoading={isCheckingOut}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
