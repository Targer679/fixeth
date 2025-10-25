"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAccount, usePublicClient } from "wagmi";
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  DocumentTextIcon,
  LinkIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

interface DiplomaData {
  holderName: string;
  institution: string;
  degree: string;
  major: string;
  issueDate: bigint;
  graduationDate: bigint;
  ipfsHash: string;
  owner: string;
}

export default function VerifyDiplomaPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const [diplomaData, setDiplomaData] = useState<DiplomaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();
  const { data: deployedContract } = useDeployedContractInfo("EduChainDiploma");

  const isValidTokenId = tokenId && !isNaN(Number(tokenId)) && Number(tokenId) > 0;

  useEffect(() => {
    const fetchDiplomaData = async () => {
      if (!isValidTokenId || !deployedContract || !publicClient) {
        setIsLoading(false);
        return;
      }

      try {
        const [diplomaData, owner] = await Promise.all([
          publicClient.readContract({
            address: deployedContract.address,
            abi: deployedContract.abi,
            functionName: "getDiploma",
            args: [BigInt(tokenId)],
          }) as Promise<[string, string, string, string, bigint, bigint, string]>,

          publicClient.readContract({
            address: deployedContract.address,
            abi: deployedContract.abi,
            functionName: "getDiplomaOwner",
            args: [BigInt(tokenId)],
          }) as Promise<string>,
        ]);

        const [holderName, institution, degree, major, issueDate, graduationDate, ipfsHash] = diplomaData;

        setDiplomaData({
          holderName,
          institution,
          degree,
          major,
          issueDate,
          graduationDate,
          ipfsHash,
          owner,
        });
      } catch (error) {
        console.error("Error fetching diploma:", error);
        setDiplomaData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiplomaData();
  }, [tokenId, isValidTokenId, deployedContract, publicClient]);

  if (isLoading) {
    return (
      <div
        className="flex items-center flex-col flex-grow pt-20 min-h-screen"
        style={{
          backgroundImage: "url('/verify_id.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="px-5 text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 m-4 shadow-2xl">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <AcademicCapIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Verify Diploma
          </h1>
          <p className="text-xl text-gray-600">Loading diploma data...</p>
          <div className="flex justify-center mt-8">
            <div className="loading loading-spinner loading-lg text-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidTokenId) {
    return (
      <div
        className="flex items-center flex-col flex-grow pt-20 min-h-screen"
        style={{
          backgroundImage: "url('/verify_id.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="px-5 text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 m-4 shadow-2xl">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <ShieldCheckIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Verify Diploma
          </h1>
          <div className="alert alert-warning max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
            Invalid diploma ID. Please check the link.
          </div>
        </div>
      </div>
    );
  }

  if (!diplomaData) {
    return (
      <div
        className="flex items-center flex-col flex-grow pt-20 min-h-screen"
        style={{
          backgroundImage: "url('/verify_id.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="px-5 text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 m-4 shadow-2xl">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <ShieldCheckIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Verify Diploma
          </h1>
          <p className="text-lg text-gray-600 mb-4">ID: {tokenId}</p>
          <div className="alert alert-error max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
            Diploma with ID {tokenId} not found or does not exist
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center flex-col flex-grow pt-10 min-h-screen"
      style={{
        backgroundImage: "url('/verify_id.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-5 w-full max-w-6xl">
        {/* Header Section */}
        {/* <div className="text-center mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 m-4 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-green-500/20 rounded-2xl blur-sm animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Diploma Verified
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            ID: <span className="font-mono bg-green-100 text-green-800 px-3 py-1 rounded-lg">#{tokenId}</span>
          </p>
        </div> */}

        {/* Main Verification Card */}
        <div className="relative pb-15">
          {/* Background Effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-4xl blur-xl opacity-50"></div>

          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Verification Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <ShieldCheckIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">✅ Diploma Verified</h3>
                    <p className="text-green-100 text-lg">Data confirmed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-100">Blockchain Verified</div>
                  <div className="text-2xl font-bold">#{tokenId}</div>
                </div>
              </div>
            </div>

            {/* Diploma Information */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Personal Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Student Name</label>
                      <p className="text-xl font-bold text-gray-800">{diplomaData.holderName}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Degree</label>
                      <p className="text-xl font-bold text-gray-800">{diplomaData.degree}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Major</label>
                      <p className="text-xl font-bold text-gray-800">{diplomaData.major}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Institution Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BuildingLibraryIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Institution Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Institution</label>
                      <p className="text-xl font-bold text-gray-800">{diplomaData.institution}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Graduation Date</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(Number(diplomaData.graduationDate) * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Issue Date</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(Number(diplomaData.issueDate) * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="bg-gray-50 p-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Technical Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Owner Address</label>
                    <code className="text-sm bg-gray-100 p-2 rounded-lg break-all font-mono text-gray-800">
                      {diplomaData.owner}
                    </code>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Diploma ID</label>
                    <code className="text-lg bg-gray-100 p-2 rounded-lg font-mono text-gray-800 font-bold">
                      #{tokenId}
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">IPFS Hash</label>
                    <code className="text-sm bg-gray-100 p-2 rounded-lg break-all font-mono text-gray-800">
                      {diplomaData.ipfsHash}
                    </code>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Network</label>
                    <span className="badge badge-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white px-4 py-2">
                      Status Network Sepolia
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Link */}
            {diplomaData.ipfsHash && (
              <div className="bg-gray-50 p-8 border-t border-gray-200">
                <div className="text-center">
                  <a
                    href={`https://ipfs.io/ipfs/${diplomaData.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    <LinkIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span>📄 View Original Document on IPFS</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
