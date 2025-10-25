import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { preload } from "react-dom";

preload("/api/auth/signin?callbackUrl=/", "document");

export const metadata: Metadata = {
  title: "EduChain Verifier - Diploma Verification System",
  description: "Gasless diploma verification",
};

const Home = () => {
  return (
    <div className="flex items-center flex-col flex-grow">
      {/* Hero Section с большой гифкой на всю ширину */}
      <div
        className="w-full min-h-screen relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('/bggif.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Градиентное затемнение для лучшей читаемости */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-blue-900/50"></div>

        {/* Анимированные элементы для глубины */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-300/30 rounded-full blur-md animate-pulse delay-500"></div>
        </div>

        {/* Основной контент */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Логотип/иконка */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              {/* <span className="text-4xl">🎓</span> */}
              <Image
                src="/iconedu.png"
                alt="EduChain Logo"
                width={50}
                height={50}
                className="w-full h-full object-cover p-2"
                priority // Добавляем если это важное изображение для LCP
              />
            </div>
          </div>

          <h1 className="text-center mb-8">
            <span className="block text-3xl md:text-4xl font-light text-white/90 mb-4">Welcome to</span>
            <span className="block text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              EduChain Verifier
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Revolutionary <span className="font-semibold text-white">decentralized diploma verification</span> with
            <span className="font-semibold text-green-300"> completely gasless transactions</span>
          </p>

          {/* Кнопки действий */}
          <div className="flex justify-center items-center gap-6 flex-col sm:flex-row mt-12">
            <Link
              href="/issue"
              className="group relative overflow-hidden btn btn-lg min-w-[200px] bg-white text-gray-900 border-0 font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-xl">🎓</span>
                Issue Diploma
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="/verify"
              className="group relative overflow-hidden btn btn-lg min-w-[200px] bg-transparent text-white border-2 border-white/80 font-bold text-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm hover:bg-white hover:text-gray-900"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-xl">🔍</span>
                Verify Diploma
              </span>
            </Link>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/70">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">🚀 Gasless</div>
              <p className="text-sm">Zero transaction fees for users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">🔒 Secure</div>
              <p className="text-sm">Blockchain-powered verification</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">🌐 Global</div>
              <p className="text-sm">Accessible from anywhere</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex-grow bg-gradient-to-b from-gray-900 to-base-300 w-full px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Why Choose EduChain?
          </h2>
          <p className="text-xl text-cyan-700 dark:text-cyan-200 max-w-2xl mx-auto font-medium">
            Experience the future of academic credential verification with our cutting-edge platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="group flex flex-col bg-base-100 p-8 text-center items-center rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/30 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Gasless Transactions</h3>
            <p className="text-gray-600">Issue and verify diplomas completely free on Status Network</p>
          </div>

          <div className="group flex flex-col bg-base-100 p-8 text-center items-center rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/30 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🔍</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Instant Verification</h3>
            <p className="text-gray-600">Verify any diploma instantly without wallet connection required</p>
          </div>

          <div className="group flex flex-col bg-base-100 p-8 text-center items-center rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/30 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🛡️</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Secure & Immutable</h3>
            <p className="text-gray-600">All data permanently secured by blockchain technology</p>
          </div>

          <div className="group flex flex-col bg-base-100 p-8 text-center items-center rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/30 transform hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">🌐</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Modern Stack</h3>
            <p className="text-gray-600">Built on Scaffold-ETH 2 with Status Network integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
