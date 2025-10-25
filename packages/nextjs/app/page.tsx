import Link from "next/link";
import { Metadata } from "next";
import { preload } from "react-dom";

preload("/api/auth/signin?callbackUrl=/", "document");

export const metadata: Metadata = {
  title: "EduChain Verifier - Diploma Verification System",
  description: "Gasless diploma verification on Status Network",
};

const Home = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">EduChain Verifier</span>
        </h1>
        <p className="text-center text-lg mt-4 max-w-2xl">
          Decentralized diploma verification system with gasless transactions on Status Network
        </p>

        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row mt-8">
          <Link href="/issue" className="btn btn-primary btn-lg m-2">
            🎓 Issue Diploma
          </Link>
          <Link href="/verify" className="btn btn-secondary btn-lg m-2">
            🔍 Verify Diploma
          </Link>
        </div>

        {/* УБРАЛИ КОМПОНЕНТЫ Address и Balance ИЗ-ЗА НЕВАЛИДНОГО АДРЕСА */}
        {/* <div className="text-center mt-8">
          <p className="text-gray-600">Connect your wallet to see your address and balance</p>
        </div> */}
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <span className="text-4xl">🚀</span>
            <h3 className="text-xl font-bold mt-4">Gasless Transactions</h3>
            <p className="mt-2">Issue diplomas for free on Status Network</p>
          </div>

          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <span className="text-4xl">🔍</span>
            <h3 className="text-xl font-bold mt-4">Instant Verification</h3>
            <p className="mt-2">Verify diplomas without wallet connection.</p>
          </div>

          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <span className="text-4xl">🛡️</span>
            <h3 className="text-xl font-bold mt-4">Secure & Immutable</h3>
            <p className="mt-2">Data protected by blockchain technology</p>
          </div>

          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <span className="text-4xl">🌐</span>
            <h3 className="text-xl font-bold mt-4">Modern Technologies</h3>
            <p className="mt-2">Build On Scaffold-ETH 2 with Status Network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
