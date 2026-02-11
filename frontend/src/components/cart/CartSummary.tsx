import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  totalPrice: number;
  totalQuantity: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CartSummary({
  totalPrice,
  totalQuantity,
  onCheckout,
  isLoading,
}: CartSummaryProps) {
  const deliveryFee = totalPrice >= 50000 ? 0 : 3000;
  const finalPrice = totalPrice + deliveryFee;

  return (
    <div className="bg-gray-50 p-6">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">상품 수</span>
          <span className="text-gray-800">{totalQuantity}개</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">상품 금액</span>
          <span className="text-gray-800">{totalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">배송비</span>
          <span className="text-gray-800">
            {deliveryFee === 0 ? (
              <span className="text-black">무료</span>
            ) : (
              `${deliveryFee.toLocaleString()}원`
            )}
          </span>
        </div>
        {totalPrice > 0 && totalPrice < 50000 && (
          <p className="text-xs text-gray-400">
            {(50000 - totalPrice).toLocaleString()}원 더 구매 시 무료배송
          </p>
        )}
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium">Total</span>
        <span className="text-lg font-medium text-black">
          {finalPrice.toLocaleString()}원
        </span>
      </div>

      <Button
        className="w-full bg-black hover:bg-gray-800 rounded-none text-sm tracking-wide"
        size="lg"
        onClick={onCheckout}
        disabled={totalQuantity === 0 || isLoading}
      >
        {isLoading ? "처리 중..." : "Checkout"}
      </Button>
    </div>
  );
}
