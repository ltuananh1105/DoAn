import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

export default function VNPayReturn() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of queryParams.entries()) {
      params[key] = value;
    }

    if (params.vnp_ResponseCode) {
      fetch("/api/orders/vnpay-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult({
            success: data.success,
            message: data.message,
            amount: params.vnp_Amount ? Number(params.vnp_Amount) / 100 : 0,
            orderCode: params.vnp_TxnRef,
            bankCode: params.vnp_BankCode,
            transactionNo: params.vnp_TransactionNo,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setResult({
            success: false,
            message: "Có lỗi khi xác thực kết quả giao dịch VNPay.",
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold text-gray-800">Đang xác thực kết quả thanh toán từ VNPay...</h2>
        <p className="text-sm text-gray-500 mt-1">Vui lòng không tắt trình duyệt</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl text-center">
      {result?.success ? (
        <div>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Thanh toán Thành Công!</h1>
          <p className="text-sm text-gray-600 mb-6">
            Khóa học của bạn đã được kích hoạt. Bạn có thể bắt đầu học ngay bây giờ.
          </p>

          <div className="bg-gray-50 p-4 rounded-2xl text-left text-xs space-y-2 mb-6 border border-gray-200/60">
            <div className="flex justify-between">
              <span className="text-gray-500">Mã đơn hàng:</span>
              <strong className="font-mono text-gray-800">{result.orderCode}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số tiền:</span>
              <strong className="text-green-600 text-sm font-bold">
                {result.amount?.toLocaleString("vi-VN")} ₫
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cổng thanh toán:</span>
              <span className="font-medium text-gray-700">VNPay ({result.bankCode})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mã GD VNPay:</span>
              <span className="font-mono text-gray-600">{result.transactionNo}</span>
            </div>
          </div>

          <Link
            to="/student/courses"
            className="block w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Vào Khóa Học Của Tôi →
          </Link>
        </div>
      ) : (
        <div>
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✕
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Giao dịch Chưa Hoàn Tất</h1>
          <p className="text-sm text-gray-600 mb-6">
            {result?.message || "Giao dịch bị hủy hoặc thanh toán không thành công."}
          </p>
          <Link
            to="/courses"
            className="block w-full py-3.5 bg-gray-800 text-white font-bold text-sm rounded-xl hover:bg-gray-900 transition"
          >
            Quay lại danh sách khóa học
          </Link>
        </div>
      )}
    </div>
  );
}
