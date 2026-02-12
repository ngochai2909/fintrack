import Link from 'next/link';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                💰
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinTrack
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">
                Quản lý tài chính thông minh
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Theo dõi chi tiêu
              </span>
              <br />
              <span className="text-gray-800">một cách dễ dàng</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Quản lý ví, giao dịch, và phân tích chi tiêu của bạn với giao diện đẹp mắt và dễ sử dụng. 
              Xem biểu đồ thống kê chi tiết và kiểm soát tài chính cá nhân hiệu quả.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
              >
                🚀 Bắt đầu miễn phí
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 text-lg rounded-xl hover:bg-gray-50 font-bold shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-gray-600 mt-2">Miễn phí</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  5+
                </div>
                <div className="text-sm text-gray-600 mt-2">Tính năng</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="text-sm text-gray-600 mt-2">Giao dịch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Tính năng nổi bật
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Mọi thứ bạn cần để quản lý tài chính cá nhân
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                💰
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Quản lý Ví</h3>
              <p className="text-gray-600 leading-relaxed">
                Tạo nhiều ví với các loại khác nhau: Tiền mặt, Ngân hàng, Thẻ tín dụng. 
                Theo dõi số dư tự động.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                💳
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Giao dịch</h3>
              <p className="text-gray-600 leading-relaxed">
                Ghi chép thu chi nhanh chóng với danh mục tùy chỉnh. 
                Lọc, tìm kiếm và xem theo ngày.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Biểu đồ</h3>
              <p className="text-gray-600 leading-relaxed">
                Xem xu hướng chi tiêu với biểu đồ đường và biểu đồ tròn. 
                Phân tích theo danh mục.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                📁
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Danh mục</h3>
              <p className="text-gray-600 leading-relaxed">
                Tạo danh mục thu/chi tùy chỉnh với icon và màu sắc. 
                Hệ thống có sẵn danh mục mặc định.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                🔒
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Bảo mật</h3>
              <p className="text-gray-600 leading-relaxed">
                Dữ liệu được mã hóa an toàn với JWT authentication. 
                Chỉ bạn mới truy cập được.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                📱
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Responsive</h3>
              <p className="text-gray-600 leading-relaxed">
                Sử dụng mượt mà trên mọi thiết bị: Desktop, Tablet, Mobile. 
                Giao diện đẹp mắt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Tạo tài khoản miễn phí và quản lý tài chính của bạn ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-blue-600 text-lg rounded-xl hover:bg-gray-100 font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Đăng ký miễn phí
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-transparent text-white text-lg rounded-xl hover:bg-white/10 font-bold border-2 border-white transition-all"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-2">
            © 2024 FinTrack. Made with ❤️ by Nguyen Ngoc Hai
          </p>
          <p className="text-sm text-gray-500">
            Personal Finance Tracker - NestJS + Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
