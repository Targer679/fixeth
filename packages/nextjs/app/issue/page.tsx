"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AcademicCapIcon, BuildingLibraryIcon, DocumentTextIcon, UserIcon } from "@heroicons/react/24/outline";
import PinataUploader from "~~/components/PinataUploader";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

export default function IssueDiplomaPage() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { data: deployedContract } = useDeployedContractInfo("EduChainDiploma");

  const [formData, setFormData] = useState({
    recipient: "",
    holderName: "",
    institution: "",
    degree: "",
    major: "",
    graduationDate: "",
    ipfsHash: "",
  });
  const [isMining, setIsMining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !deployedContract || !walletClient) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setIsMining(true);

      const hash = await walletClient.writeContract({
        address: deployedContract.address,
        abi: deployedContract.abi,
        functionName: "issueDiploma",
        args: [
          formData.recipient as `0x${string}`,
          formData.holderName,
          formData.institution,
          formData.degree,
          formData.major,
          formData.graduationDate ? Math.floor(new Date(formData.graduationDate).getTime() / 1000) : 0,
          formData.ipfsHash,
        ],
        account: address as `0x${string}`,
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      console.log("Diploma issued successfully:", receipt);
      alert("🎓 Diploma successfully issued!");

      setFormData({
        recipient: "",
        holderName: "",
        institution: "",
        degree: "",
        major: "",
        graduationDate: "",
        ipfsHash: "",
      });
    } catch (error) {
      console.error("Failed to issue diploma:", error);
      alert("Error issuing diploma");
    } finally {
      setIsMining(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center flex-col flex-grow pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="px-5 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <AcademicCapIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Issue Diploma
          </h1>
          <p className="text-xl text-gray-600 mb-8">Please connect your wallet to issue diplomas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10 min-h-screen relative overflow-hidden">
      {/* Гифка фоном */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/issuegif.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Затемнение для читаемости */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      <div className="px-5 w-full max-w-4xl relative z-10 pb-15">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 border border-white/30">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-white/20 rounded-2xl blur-sm animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Issue Diploma</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Create verifiable diplomas with <span className="text-green-300 font-semibold">gasless transactions</span>{" "}
            on Status Network
          </p>
        </div>

        {/* Form Section */}
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute -inset-4 bg-white/10 rounded-4xl blur-xl opacity-60"></div>

          <form
            onSubmit={handleSubmit}
            className="relative space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20"
          >
            {/* Student Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Student Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">Recipient Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient}
                    onChange={e => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder="0x..."
                    className="input input-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 rounded-2xl shadow-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.holderName}
                    onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                    placeholder="John Doe"
                    className="input input-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Institution Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <BuildingLibraryIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Institution Details</h2>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={e => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="University Name"
                  className="input input-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300 rounded-2xl shadow-lg"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">Degree Type *</label>
                  <select
                    required
                    value={formData.degree}
                    onChange={e => setFormData({ ...formData, degree: e.target.value })}
                    className="select select-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 rounded-2xl shadow-lg"
                  >
                    <option value="" className="text-gray-800">
                      Select degree
                    </option>
                    <option value="Bachelor" className="text-gray-800">
                      Bachelor
                    </option>
                    <option value="Master" className="text-gray-800">
                      Master
                    </option>
                    <option value="PhD" className="text-gray-800">
                      PhD
                    </option>
                    <option value="Certificate" className="text-gray-800">
                      Certificate
                    </option>
                    <option value="Associate" className="text-gray-800">
                      Associate
                    </option>
                    <option value="Diploma" className="text-gray-800">
                      Diploma
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">Major/Field of Study *</label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value })}
                    placeholder="Computer Science"
                    className="input input-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 rounded-2xl shadow-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">Graduation Date *</label>
                <input
                  type="date"
                  required
                  value={formData.graduationDate}
                  onChange={e => setFormData({ ...formData, graduationDate: e.target.value })}
                  className="input input-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300 rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* Document Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Document Verification</h2>
              </div>

              {/* Компонент загрузки файлов */}
              {/* <PinataUploader
                onUploadComplete={ipfsHash => {
                  setFormData({ ...formData, ipfsHash });
                }}
              /> */}
              <PinataUploader
                onUploadComplete={ipfsHash => {
                  console.log("🎯 IPFS Hash received in form:", ipfsHash);
                  setFormData({ ...formData, ipfsHash });
                }}
              />

              {/* Поле для IPFS Hash */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">IPFS Hash *</label>
                <input
                  type="text"
                  required
                  value={formData.ipfsHash}
                  onChange={e => setFormData({ ...formData, ipfsHash: e.target.value })}
                  placeholder="Will be automatically filled after upload"
                  className="input input-lg w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300 rounded-2xl shadow-lg font-mono"
                />
                <p className="text-sm text-white/70 mt-2">
                  💡 Upload your diploma document above or paste an existing IPFS hash
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isMining}
                className="group relative w-full py-4 px-8 bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm border border-white/30"
              >
                <div className="flex items-center justify-center gap-3">
                  {isMining ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Issuing Diploma...</span>
                    </>
                  ) : (
                    <>
                      <AcademicCapIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      <span>Issue Diploma (Gasless)</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
