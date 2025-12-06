// app/about/page.tsx
import React from 'react';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, Heart, Shield, Users, Zap, Award } from 'lucide-react';

export default function AboutUsPage() {
  const values = [
    {
      icon: Shield,
      title: "Chất lượng",
      description: "Cam kết 100% hàng chính hãng, có nguồn gốc rõ ràng"
    },
    {
      icon: Heart,
      title: "Tận tâm",
      description: "Luôn đặt khách hàng làm trung tâm trong mọi hoạt động"
    },
    {
      icon: Zap,
      title: "Nhanh chóng",
      description: "Xử lý đơn hàng nhanh chóng, giao hàng đúng hẹn"
    },
    {
      icon: Award,
      title: "Uy tín",
      description: "Minh bạch giá cả, trung thực với khách hàng"
    }
  ];

  const commitments = [
    "100% hàng chính hãng, tem niêm phong từ nhà sản xuất",
    "Bảo hành chính hãng theo quy định của nhà sản xuất",
    "Đổi trả trong vòng 7 ngày nếu có lỗi từ nhà sản xuất",
    "Hỗ trợ khách hàng trong giờ hành chính qua hotline và chat",
    "Giao hàng nhanh trong khu vực nội thành",
    "Tư vấn nhiệt tình, hỗ trợ chọn sản phẩm phù hợp"
  ];

  const timeline = [
    {
      year: "2024",
      title: "Khởi đầu hành trình",
      description: "TechStore được thành lập với mong muốn mang sản phẩm công nghệ chất lượng đến với khách hàng"
    },
    {
      year: "Hiện tại",
      title: "Xây dựng niềm tin",
      description: "Đang từng bước xây dựng uy tín và phát triển cơ sở khách hàng trung thành"
    },
    {
      year: "Tương lai",
      title: "Phát triển bền vững",
      description: "Mục tiêu mở rộng dịch vụ và trở thành địa chỉ tin cậy cho mọi nhu cầu công nghệ"
    }
  ];

 
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-24 overflow-hidden">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Về Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Nơi công nghệ gặp gỡ sự tận tâm
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  <span className="text-blue-600 font-semibold">TechStore</span> là một cửa hàng công nghệ mới được thành lập năm 2024 với mong muốn mang đến cho khách hàng những sản phẩm công nghệ chất lượng.
                </p>
                <p>
                  Chúng tôi hiểu rằng việc xây dựng niềm tin cần có thời gian, vì vậy cam kết sẽ luôn cố gắng hết mình để phục vụ khách hàng tốt nhất.
                </p>
                <p>
                  Với đội ngũ nhân viên trẻ, nhiệt tình và yêu công nghệ, chúng tôi mong muốn đồng hành cùng bạn trong hành trình tìm kiếm những thiết bị phù hợp nhất.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden shadow-2xl">
                <img 
                  src="https://i.pinimg.com/736x/fa/00/d3/fa00d3d60781462312e5c80f5e0f1be2.jpg" 
                  alt="TechStore Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-600 rounded-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Cung cấp sản phẩm công nghệ chất lượng với giá cả hợp lý, kèm theo dịch vụ tư vấn tận tâm để khách hàng có thể lựa chọn được sản phẩm phù hợp nhất.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Xây dựng TechStore thành một địa chỉ tin cậy cho khách hàng khi có nhu cầu về công nghệ, dựa trên nền tảng uy tín và chất lượng dịch vụ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-600 text-lg">
              Những giá trị chúng tôi cam kết hướng tới
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  <value.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hành trình của chúng tôi
            </h2>
            <p className="text-gray-600 text-lg">
              Những bước đi đầu tiên và định hướng tương lai
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {timeline.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-3xl font-bold text-blue-600">{item.year}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cam kết của chúng tôi
            </h2>
            <p className="text-gray-600 text-lg">
              Những điều chúng tôi luôn cố gắng thực hiện
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {commitments.map((commitment, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{commitment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <Footer />
    </div>
  );
}