"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePublicClient } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

interface DiplomaSummary {
  tokenId: number;
  holderName: string;
  institution: string;
  degree: string;
  owner: string;
}

export default function VerifyDiplomasPage() {
  const [diplomas, setDiplomas] = useState<DiplomaSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();
  const { data: deployedContract } = useDeployedContractInfo("EduChainDiploma");

  useEffect(() => {
    const fetchAllDiplomas = async () => {
      if (!deployedContract || !publicClient) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const diplomasList: DiplomaSummary[] = [];

        // Будем проверять дипломы с ID от 1 до 20 (можно увеличить)
        for (let tokenId = 1; tokenId <= 20; tokenId++) {
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

            const [holderName, institution, degree] = diplomaData;

            diplomasList.push({
              tokenId,
              holderName,
              institution,
              degree,
              owner,
            });
          } catch (error) {
            // Диплом с этим ID не существует, пропускаем
            continue;
          }
        }

        setDiplomas(diplomasList);
      } catch (error) {
        console.error("Error fetching diplomas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDiplomas();
  }, [deployedContract, publicClient]);

  if (isLoading) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-full max-w-6xl">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">All Diplomas</span>
            <span className="block text-lg text-gray-600">Browse verified diplomas</span>
          </h1>
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
          <p className="text-center mt-4">Loading diplomas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">All Diplomas</span>
          <span className="block text-lg text-gray-600">Browse verified diplomas on Status Network</span>
        </h1>

        {diplomas.length === 0 ? (
          <div className="text-center">
            <div className="alert alert-info max-w-md mx-auto">📝 No diplomas found. Issue some diplomas first!</div>
            <Link href="/issue" className="btn btn-primary mt-4">
              🎓 Issue First Diploma
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Found {diplomas.length} diploma{diplomas.length !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diplomas.map(diploma => (
                <Link key={diploma.tokenId} href={`/verify/${diploma.tokenId}`} className="block">
                  <div className="bg-base-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
                    <div className="flex justify-between items-start mb-4">
                      <span className="badge badge-primary badge-lg">#{diploma.tokenId}</span>
                      <span className="badge badge-outline">{diploma.degree}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 truncate">{diploma.holderName}</h3>

                    <p className="text-gray-600 mb-3 truncate">{diploma.institution}</p>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 truncate max-w-[120px]">
                        {diploma.owner.slice(0, 6)}...{diploma.owner.slice(-4)}
                      </span>
                      <span className="text-primary font-semibold">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="alert alert-success max-w-md mx-auto">
                ✅ All diplomas are verified on Status Network blockchain
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
