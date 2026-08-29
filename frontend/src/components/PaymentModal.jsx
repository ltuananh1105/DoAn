import { useState } from "react";

/**
 * Modal chọn phương thức thanh toán
 * Props:
 *   isOpen: boolean
 *   course: { title, price }
 *   onClose: () => void
 *   onVNPay: () => void
 *   onDemoPay: () => void
 *   loading: boolean
 */
export default function PaymentModal({ isOpen, course, onClose, onVNPay, onDemoPay, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
          <h2 className="text-lg font-extrabold">Thanh toán khóa học</h2>
          <p className="text-xs text-blue-100 mt-0.5 line-clamp-1">{course?.title}</p>
        </div>

        {/* THÔNG TIN ĐƠN HÀNG */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex justify-between items-center py-3 border-b text-sm">
            <span className="text-gray-500">Khóa học</span>
            <span className="font-semibold text-gray-900 line-clamp-1 max-w-[180px] text-right">{course?.title}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b text-sm">
            <span className="text-gray-500">Tổng thanh toán</span>
            <span className="text-xl font-extrabold text-blue-600">
              {course?.price?.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>

        {/* CHỌN PHƯƠNG THỨC */}
        <div className="px-6 pt-3 pb-6 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Chọn phương thức thanh toán</p>

          {/* VNPay */}
          <button
            onClick={onVNPay}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-white font-extrabold text-xs">
              VN
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-sm text-gray-900 group-hover:text-blue-700">Thanh toán qua VNPay</div>
              <div className="text-xs text-gray-400">ATM · Visa · MasterCard · QR Code</div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Demo Pay */}
          <button
            onClick={onDemoPay}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition group disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0 text-white font-extrabold text-xs">
              ✓
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-sm text-gray-900 group-hover:text-green-700">Thanh toán Demo</div>
              <div className="text-xs text-gray-400">Kích hoạt ngay, không cần nhập thẻ</div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Đang xử lý...
            </div>
          )}

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
