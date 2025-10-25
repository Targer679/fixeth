"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { usePublicClient } from "wagmi";
import { AcademicCapIcon, MagnifyingGlassIcon, QrCodeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

interface DiplomaSummary {
  tokenId: number;
  holderName: string;
  institution: string;
  degree: string;
  owner: string;
  issueDate: bigint;
}

export default function VerifyDiplomasPage() {
  const [diplomas, setDiplomas] = useState<DiplomaSummary[]>([]);
  const [allDiplomas, setAllDiplomas] = useState<DiplomaSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxTokenId, setMaxTokenId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQRCode, setShowQRCode] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const publicClient = usePublicClient();
  const { data: deployedContract } = useDeployedContractInfo("EduChainDiploma");

  // Функция для поиска максимального ID диплома
  const findMaxTokenId = async (): Promise<number> => {
    if (!deployedContract || !publicClient) return 0;

    for (let tokenId = 1; tokenId <= 100; tokenId++) {
      try {
        await publicClient.readContract({
          address: deployedContract.address,
          abi: deployedContract.abi,
          functionName: "getDiploma",
          args: [BigInt(tokenId)],
        });
      } catch (error) {
        return tokenId - 1;
      }
    }
    return 100;
  };

  useEffect(() => {
    const fetchAllDiplomas = async () => {
      if (!deployedContract || !publicClient) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const maxId = await findMaxTokenId();
        setMaxTokenId(maxId);

        if (maxId === 0) {
          setDiplomas([]);
          setAllDiplomas([]);
          return;
        }

        const diplomasList: DiplomaSummary[] = [];

        for (let tokenId = maxId; tokenId >= 1; tokenId--) {
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

            const [holderName, institution, degree, , issueDate] = diplomaData;

            diplomasList.push({
              tokenId,
              holderName,
              institution,
              degree,
              owner,
              issueDate,
            });

            if (diplomasList.length >= 20) break;
          } catch (error) {
            continue;
          }
        }

        setAllDiplomas(diplomasList);
        setDiplomas(diplomasList);
      } catch (error) {
        console.error("Error fetching diplomas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDiplomas();
  }, [deployedContract, publicClient]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setDiplomas(allDiplomas);
      return;
    }

    const filtered = allDiplomas.filter(diploma => {
      const searchLower = searchTerm.toLowerCase().trim();
      return (
        diploma.tokenId.toString() === searchTerm ||
        diploma.holderName.toLowerCase().includes(searchLower) ||
        diploma.institution.toLowerCase().includes(searchLower) ||
        diploma.degree.toLowerCase().includes(searchLower)
      );
    });

    setDiplomas(filtered);
  }, [searchTerm, allDiplomas]);

  const toggleQRCode = (tokenId: number) => {
    if (showQRCode === tokenId) {
      setShowQRCode(null);
    } else {
      setShowQRCode(tokenId);
    }
  };

  const getVerifyUrl = (tokenId: number) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/verify/${tokenId}`;
    }
    return `https://yourapp.com/verify/${tokenId}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-full max-w-6xl">
          <div className="text-center mb-12">
            <div className="animate-pulse flex justify-center mb-4">
              <AcademicCapIcon className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Loading Diplomas
            </h1>
            <p className="text-lg text-gray-600">Fetching verified diplomas from blockchain...</p>
          </div>
          <div className="flex justify-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-20 bg-gradient-to-b from-base-100 to-base-200 min-h-screen">
      <div className="px-5 w-full max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <AcademicCapIcon className="h-16 w-16 text-primary transform hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 pb-5">
            Verify Diplomas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse and verify academic credentials stored on the blockchain
            {maxTokenId > 0 && (
              <span className="block text-sm text-primary font-semibold mt-2">
                Total Verified: {maxTokenId} Diplomas
              </span>
            )}
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search by student name, institution, degree, or diploma ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input input-lg w-full pl-12 pr-12 bg-base-100 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
              >
                <span className="text-gray-400 hover:text-error text-lg">✕</span>
              </button>
            )}
          </div>
          <div className="text-center mt-4">
            <div className="inline-flex gap-2 text-sm text-gray-500 bg-base-200 px-4 py-2 rounded-full">
              <span className="font-semibold text-primary">Try:</span>
              John, 1, Stanford Univercity, Bachelor
            </div>
          </div>
        </div>

        {allDiplomas.length === 0 ? (
          <div className="text-center">
            <div className="card bg-gradient-to-br from-base-100 to-primary/10 border-2 border-primary/20 max-w-md mx-auto p-8">
              <AcademicCapIcon className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Diplomas Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to issue a verifiable diploma on the blockchain!</p>
              <Link
                href="/issue"
                className="btn btn-primary btn-lg bg-gradient-to-r from-primary to-accent border-0 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🎓 Issue First Diploma
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
              <div className="flex-1 flex justify-center">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {diplomas.length}
                    </span>
                    <span className="text-2xl text-gray-800 font-semibold">
                      {searchTerm ? "Search Results" : "Latest Diplomas"}
                    </span>
                  </div>
                </div>
              </div>

              {searchTerm && (
                <div className="badge badge-primary badge-lg px-4 py-3 text-lg">Results for: {searchTerm}</div>
              )}

              {!searchTerm && maxTokenId > 20 && (
                <div className="flex-1 flex justify-end">
                  <button className="btn btn-outline btn-primary hover:scale-105 transform transition-all duration-300">
                    View All {maxTokenId} Diplomas
                  </button>
                </div>
              )}
            </div>

            {diplomas.length === 0 && searchTerm ? (
              <div className="text-center">
                <div className="alert alert-warning max-w-md mx-auto shadow-lg border-2 border-warning/20">
                  <AcademicCapIcon className="h-6 w-6" />
                  <span>
                    No diplomas found for <strong>{searchTerm}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn btn-outline btn-primary mt-6 hover:scale-105 transform transition-all duration-300"
                >
                  Show All Diplomas
                </button>
              </div>
            ) : (
              <>
                {/* Diplomas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                  {diplomas.map((diploma, index) => (
                    <div
                      key={diploma.tokenId}
                      className="relative group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Main Card */}
                      <div className="bg-gradient-to-br from-base-100 via-base-100 to-primary/5 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-primary/10 hover:border-primary/30 transform hover:-translate-y-2 relative overflow-hidden">
                        {/* Background Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Newest Badge */}
                        {!searchTerm && diploma.tokenId === maxTokenId && (
                          <div className="absolute -top-2 -right-2">
                            <div className="badge badge-primary badge-lg px-3 py-2 shadow-lg animate-pulse">
                              ✨ NEWEST
                            </div>
                          </div>
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex items-center gap-3">
                            <span className="badge badge-primary badge-lg px-3 py-2 font-mono shadow-md">
                              #{diploma.tokenId}
                            </span>
                            <span className="badge badge-outline badge-accent text-xs px-3 py-2 border-2">
                              {diploma.degree}
                            </span>
                          </div>
                          <button
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleQRCode(diploma.tokenId);
                            }}
                            className={`btn btn-circle btn-sm ${
                              showQRCode === diploma.tokenId
                                ? "btn-primary text-white"
                                : "btn-ghost text-primary hover:bg-primary/20"
                            } transition-all duration-300 hover:scale-110`}
                            title="Generate QR Code"
                          >
                            <QrCodeIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Content */}
                        <Link href={`/verify/${diploma.tokenId}`} className="block relative z-10">
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-primary group-hover:to-accent bg-clip-text text-transparent">
                            {diploma.holderName}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 flex items-center gap-2">
                            <AcademicCapIcon className="h-4 w-4 text-primary" />
                            {diploma.institution}
                          </p>

                          <div className="flex justify-between items-center text-sm pt-4 border-t border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                            <div className="text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                              {new Date(Number(diploma.issueDate) * 1000).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                              Verify
                              <span className="group-hover:scale-125 transition-transform duration-300">→</span>
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* QR Code Modal - ВНЕ КАРТОЧКИ */}
                {showQRCode && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-base-100 rounded-3xl p-8 max-w-md w-full mx-auto relative shadow-2xl border-2 border-primary">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowQRCode(null)}
                        className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost hover:bg-error hover:text-error-content transition-all duration-300"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>

                      <div className="text-center">
                        <h4 className="font-bold text-2xl mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          Scan to Verify
                        </h4>
                        <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border-2 border-primary/20">
                          <QRCodeSVG value={getVerifyUrl(showQRCode)} size={250} level="M" includeMargin />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Verification URL:</p>
                        <p className="text-xs text-gray-500 mb-6 break-all font-mono bg-base-200 p-3 rounded-lg">
                          {getVerifyUrl(showQRCode)}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => copyToClipboard(getVerifyUrl(showQRCode))}
                            className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200 flex items-center gap-2"
                          >
                            {copied ? (
                              <>
                                <span>✅ Copied!</span>
                              </>
                            ) : (
                              <>
                                <span>📋</span>
                                Copy Link
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowQRCode(null)}
                            className="btn btn-ghost btn-sm hover:scale-105 transition-transform duration-200"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Info */}
                {!searchTerm && maxTokenId > diplomas.length && (
                  <div className="text-center">
                    <div className="alert alert-info bg-gradient-to-r from-info/10 to-info/5 border-2 border-info/20 max-w-2xl mx-auto shadow-lg">
                      <AcademicCapIcon className="h-6 w-6 text-info" />
                      <span>
                        Showing latest <strong>{diplomas.length}</strong> of <strong>{maxTokenId}</strong> total
                        diplomas
                      </span>
                    </div>
                  </div>
                )}

                {!searchTerm && (
                  <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/10">
                    <div className="flex flex-col items-center gap-4">
                      <AcademicCapIcon className="h-12 w-12 text-primary" />
                      <h3 className="text-2xl font-bold text-gray-800">All Diplomas Verified</h3>
                      <p className="text-gray-600 max-w-2xl">
                        Every diploma is permanently recorded and verified on the Status Network blockchain. Click the
                        QR icon on any diploma to generate a verification code for employers.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
