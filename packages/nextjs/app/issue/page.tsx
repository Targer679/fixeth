"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AcademicCapIcon, BuildingLibraryIcon, DocumentTextIcon, UserIcon } from "@heroicons/react/24/outline";
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
    <div className="flex items-center flex-col flex-grow pt-10 bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen">
      <div className="px-5 w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-sm animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Issue Diploma
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Create verifiable diplomas with <span className="text-green-600 font-semibold">gasless transactions</span>{" "}
            on Status Network
          </p>
        </div>

        {/* Form Section */}
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-4xl blur-xl opacity-50"></div>

          <form
            onSubmit={handleSubmit}
            className="relative space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20"
          >
            {/* Student Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Recipient Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient}
                    onChange={e => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder="0x..."
                    className="input input-lg w-full bg-white/80 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.holderName}
                    onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                    placeholder="John Doe"
                    className="input input-lg w-full bg-white/80 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Institution Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BuildingLibraryIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Institution Details</h2>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={e => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="University Name"
                  className="input input-lg w-full bg-white/80 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Degree Type *</label>
                  <select
                    required
                    value={formData.degree}
                    onChange={e => setFormData({ ...formData, degree: e.target.value })}
                    className="select select-lg w-full bg-white/80 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                  >
                    <option value="">Select degree</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Associate">Associate</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Major/Field of Study *</label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value })}
                    placeholder="Computer Science"
                    className="input input-lg w-full bg-white/80 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Graduation Date *</label>
                <input
                  type="date"
                  required
                  value={formData.graduationDate}
                  onChange={e => setFormData({ ...formData, graduationDate: e.target.value })}
                  className="input input-lg w-full bg-white/80 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Document Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Document Verification</h2>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">IPFS Hash *</label>
                <input
                  type="text"
                  required
                  value={formData.ipfsHash}
                  onChange={e => setFormData({ ...formData, ipfsHash: e.target.value })}
                  placeholder="QmXYZ..."
                  className="input input-lg w-full bg-white/80 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md font-mono"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload your diploma PDF to IPFS using services like Pinata, Lighthouse, etc.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isMining}
                className="group relative w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </button>

              {/* <p className="text-center text-sm text-gray-500 mt-4">
                ✅ All transactions are completely gasless on Status Network
              </p> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
