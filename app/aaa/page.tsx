import React from 'react';

interface SpecItem {
  title: string;
  description: string;
}

interface FeatureItem {
  label: string;
  value: string;
}

const GalaxyLanding: React.FC = () => {
  const specs: SpecItem[] = [
    {
      title: 'Camera 200MP',
      description: 'Chụp ảnh sắc nét ngay cả trong điều kiện thiếu sáng'
    },
    {
      title: 'Pin 5500mAh',
      description: 'Dùng cả ngày, sạc nhanh 80W'
    },
    {
      title: 'Snapdragon 8 Elite',
      description: 'Hiệu năng cực đỉnh cho gaming và multitask'
    },
    {
      title: 'Màn hình 6.8" 120Hz',
      description: 'Độ phân giải 2K+ với Dynamic AMOLED'
    }
  ];

  const designFeatures = [
    { label: 'Màu Sắc Độc Đáo', image: 'https://i.pinimg.com/1200x/36/88/6b/36886bf1e1891d56e4093aec2b963dbb.jpg' },
    { label: 'Chất Liệu Cao Cấp', image: 'https://i.pinimg.com/1200x/db/12/25/db1225b4f2eed4d64b3ed45684ae4f0c.jpg' },
    { label: 'Hoàn Thiện Tinh Xảo', image: 'https://i.pinimg.com/736x/af/1b/d8/af1bd8d2acb490a058d11b26e06b5f80.jpg' }
  ];

  const displayFeatures: FeatureItem[] = [
    { label: '6.8"', value: 'Dynamic AMOLED' },
    { label: '120Hz', value: 'Tần số quét cao' },
    { label: '2K+', value: 'Độ phân giải' },
    { label: 'HDR10+', value: 'Màu sắc sống động' }
  ];

  return (
    <div className="overflow-x-hidden bg-white text-black">
      {/* Hero Section */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-8 lg:px-16 py-20 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Galaxy Ultra 2025
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-gray-800">
            Đỉnh cao công nghệ. Hoàn hảo từng chi tiết.
          </p>

          <div className="space-y-4">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-indigo-100/50 border-l-4 border-indigo-500 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-black">{spec.title}</h3>
                  <p className="text-sm text-gray-600">{spec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex justify-center items-center">
          <div 
            className="w-full max-w-sm h-96 bg-cover bg-center rounded-3xl shadow-2xl"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/736x/8d/c7/3f/8dc73fc801d34067a10d3e5d86ac4c7c.jpg)'
            }}
          ></div>
        </div>
      </section>

      {/* Layout 1 - Camera */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className="h-96 bg-cover bg-center rounded-2xl shadow-2xl"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/736x/1d/37/e2/1d37e23ed7991bcdcba9001b4a202ab7.jpg)'
            }}
          ></div>
          <div>
            <h2 className="text-5xl font-bold mb-6 text-black">Camera Chuyên Nghiệp</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Hệ thống 3 camera với cảm biến 200MP chính, cho phép bạn chụp ảnh sắc nét ngay cả trong điều kiện thiếu sáng.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Công nghệ AI tích hợp giúp tối ưu hóa từng bức ảnh, mang đến chất lượng ảnh đẳng cấp studio.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Zoom quang học 10x và zoom kỹ thuật số 100x, không bỏ lỡ bất kỳ khoảnh khắc nào dù ở xa.
            </p>
          </div>
        </div>
      </section>

      {/* Layout 2 - Design */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Thiết Kế Tinh Tế
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designFeatures.map((feature, idx) => (
            <div 
              key={idx}
              className="h-64 bg-cover bg-center rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 flex items-end justify-center pb-6 relative group"
              style={{
                backgroundImage: `url(${feature.image})`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-2xl"></div>
              <span className="text-xl font-semibold text-white relative z-10">{feature.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Layout 3 - Display */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Màn Hình Tuyệt Đẹp
        </h2>
        <div 
          className="w-full h-80 bg-cover bg-center rounded-2xl shadow-2xl mb-12"
          style={{
            backgroundImage: 'url(https://i.pinimg.com/1200x/2e/aa/f6/2eaaf648a5a01348b5bfd44b6a86a8c3.jpg)'
          }}
        ></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {displayFeatures.map((feature, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold text-indigo-500 mb-2">{feature.label}</h3>
              <p className="text-gray-600">{feature.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layout 4 - Battery */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            className="h-96 bg-cover bg-center rounded-2xl shadow-2xl flex items-end justify-center pb-8 relative"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/1200x/93/5b/ad/935bad66d6988db9edb2d1055d12064c.jpg)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-2xl"></div>
            <span className="text-3xl font-bold text-white relative z-10">Sạc Nhanh 80W</span>
          </div>
          <div 
            className="h-96 bg-cover bg-center rounded-2xl shadow-2xl flex items-end justify-center pb-8 relative"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/736x/6a/0c/e1/6a0ce1833b32821df30e9124af063fcc.jpg)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-2xl"></div>
            <span className="text-3xl font-bold text-white relative z-10">Pin 5500mAh</span>
          </div>
        </div>
      </section>

      {/* Layout 5 - Gallery */}
      <section className="py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Trải Nghiệm Đa Dạng
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
          <div 
            className="lg:col-span-2 lg:row-span-2 h-96 lg:h-full bg-cover bg-center rounded-2xl shadow-2xl"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/736x/53/4a/a9/534aa9efe19b1079bb76d34a230adead.jpg)'
            }}
          ></div>
          <div 
            className="h-64 bg-cover bg-center rounded-2xl shadow-lg"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/736x/ad/7b/19/ad7b1929f9586651e9cc2c44d51bc88a.jpg)'
            }}
          ></div>
          <div 
            className="h-64 bg-cover bg-center rounded-2xl shadow-lg"
            style={{
              backgroundImage: 'url(https://i.pinimg.com/736x/8d/c7/3f/8dc73fc801d34067a10d3e5d86ac4c7c.jpg)'
            }}
          ></div>
        </div>
      </section>
    </div>
  );
};

export default GalaxyLanding;