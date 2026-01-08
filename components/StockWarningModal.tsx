// components/StockWarningModal.tsx
import { X, AlertTriangle, Package } from 'lucide-react';
import Link from 'next/link';

interface StockWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  requestedQty: number;
  availableQty: number;
}

export const StockWarningModal = ({
  isOpen,
  onClose,
  productName,
  requestedQty,
  availableQty,
}: StockWarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Không đủ hàng
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vượt quá số lượng tồn kho
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                  {productName}
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Bạn đang chọn:{' '}
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {requestedQty} sản phẩm
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Còn lại trong kho:{' '}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {availableQty} sản phẩm
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gợi ý */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gợi ý cho bạn:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>
                  Giảm số lượng xuống còn{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {availableQty} sản phẩm
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Tham khảo các sản phẩm tương tự khác</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <Link href="/products" className="flex-1">
            <button className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Xem sản phẩm khác
            </button>
          </Link>

          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
