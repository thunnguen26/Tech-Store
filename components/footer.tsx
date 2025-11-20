import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 to-black border-t border-gray-800/50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img 
                  src="/icon/title.png"  
                  alt="TechStore Logo" 
                  className="w-11 h-11 rounded-xl relative z-10"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                TechStore
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Công nghệ hàng đầu, giá tốt nhất. Điện thoại, laptop, tablet và phụ kiện chính hãng.
            </p>
            <div className="flex gap-3">
              <Link href="https://www.facebook.com/thunnguen06" className="group relative">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 border border-gray-700/50 group-hover:border-blue-500">
                  <Facebook className="h-4 w-4" />
                </div>
              </Link>
              <Link href="#" className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-300 border border-gray-700/50 group-hover:border-transparent">
                  <Instagram className="h-4 w-4" />
                </div>
              </Link>
              <Link href="#" className="group relative">
                <div className="absolute inset-0 bg-sky-400 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 group-hover:bg-sky-400 group-hover:text-white transition-all duration-300 border border-gray-700/50 group-hover:border-sky-400">
                  <Twitter className="h-4 w-4" />
                </div>
              </Link>
              <Link href="#" className="group relative">
                <div className="absolute inset-0 bg-purple-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 border border-gray-700/50 group-hover:border-purple-500">
                  <Mail className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Liên kết
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 group-hover:scale-125 transition-all"></span>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 group-hover:scale-125 transition-all"></span>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 group-hover:scale-125 transition-all"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Liên hệ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400 group">
                <Mail className="h-4 w-4 mt-0.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">thuannp.24it@vku.udn.vn</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400 group">
                <Phone className="h-4 w-4 mt-0.5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">0981664778</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400 group">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500 group-hover:text-pink-400 transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">Trần Đại Nghĩa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400 group">
                <Clock className="h-4 w-4 mt-0.5 text-gray-500 group-hover:text-orange-400 transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">8:00 - 22:00 hàng ngày</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2025 <span className="text-gray-400 font-medium">TechStore</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Điều khoản
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}