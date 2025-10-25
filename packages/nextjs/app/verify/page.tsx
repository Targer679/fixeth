"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePublicClient } from "wagmi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  const publicClient = usePublicClient();
  const { data: deployedContract } = useDeployedContractInfo("EduChainDiploma");

  // Функция для поиска максимального ID диплома
  const findMaxTokenId = async (): Promise<number> => {
    if (!deployedContract || !publicClient) return 0;

    // Проверяем дипломы с ID от 1 до 100 (можно увеличить)
    for (let tokenId = 1; tokenId <= 100; tokenId++) {
      try {
        await publicClient.readContract({
          address: deployedContract.address,
          abi: deployedContract.abi,
          functionName: "getDiploma",
          args: [BigInt(tokenId)],
        });
      } catch (error) {
        // Диплом не существует, возвращаем предыдущий ID
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

        // Сначала находим максимальный ID
        const maxId = await findMaxTokenId();
        setMaxTokenId(maxId);

        if (maxId === 0) {
          setDiplomas([]);
          setAllDiplomas([]);
          return;
        }

        const diplomasList: DiplomaSummary[] = [];

        // Загружаем дипломы в обратном порядке (от самого нового к самому старому)
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

            // Ограничим показ 20 последними дипломами для производительности
            if (diplomasList.length >= 20) break;
          } catch (error) {
            // Пропускаем несуществующие дипломы
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

  // Фильтрация дипломов по поисковому запросу
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDiplomas(allDiplomas);
      return;
    }

    const filtered = allDiplomas.filter(diploma => {
      const searchLower = searchTerm.toLowerCase().trim();

      // Поиск по ID (точное совпадение)
      if (diploma.tokenId.toString() === searchTerm) {
        return true;
      }

      // Поиск по имени (частичное совпадение)
      if (diploma.holderName.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Поиск по университету (частичное совпадение)
      if (diploma.institution.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Поиск по степени (частичное совпадение)
      if (diploma.degree.toLowerCase().includes(searchLower)) {
        return true;
      }

      return false;
    });

    setDiplomas(filtered);
  }, [searchTerm, allDiplomas]);

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
          <span className="block text-lg text-gray-600">
            Latest diplomas on Status Network {maxTokenId > 0 && `(Total: ${maxTokenId})`}
          </span>
        </h1>

        {/* Поисковая строка */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, institution, or degree..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10 pr-4 py-3 text-lg"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-400 hover:text-gray-600">✕</span>
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-2 text-center">Try searching: John, 1, Stanford, or Bachelor</div>
        </div>

        {allDiplomas.length === 0 ? (
          <div className="text-center">
            <div className="alert alert-info max-w-md mx-auto">📝 No diplomas found. Issue some diplomas first!</div>
            <Link href="/issue" className="btn btn-primary mt-4">
              🎓 Issue First Diploma
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {searchTerm ? (
                  <>
                    Found {diplomas.length} diploma{diplomas.length !== 1 ? "s" : ""} for {searchTerm}
                  </>
                ) : (
                  <>
                    Showing {diplomas.length} latest diploma{diplomas.length !== 1 ? "s" : ""}
                    {maxTokenId > diplomas.length && ` of ${maxTokenId} total`}
                  </>
                )}
              </div>

              {/* Кнопка для просмотра всех если их много */}
              {!searchTerm && maxTokenId > 20 && (
                <div className="text-sm">
                  <button className="btn btn-sm btn-outline">View All {maxTokenId} Diplomas</button>
                </div>
              )}
            </div>

            {diplomas.length === 0 && searchTerm ? (
              <div className="text-center">
                <div className="alert alert-warning max-w-md mx-auto">🔍 No diplomas found for {searchTerm}</div>
                <button onClick={() => setSearchTerm("")} className="btn btn-outline mt-4">
                  Show All Diplomas
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {diplomas.map(diploma => (
                    <Link key={diploma.tokenId} href={`/verify/${diploma.tokenId}`} className="block">
                      <div className="bg-base-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary group">
                        {/* Бейдж "New" для самых свежих дипломов */}
                        {!searchTerm && diploma.tokenId === maxTokenId && (
                          <div className="badge badge-secondary badge-sm mb-2">NEWEST</div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                          <span className="badge badge-primary badge-lg">#{diploma.tokenId}</span>
                          <span className="badge badge-outline text-xs">{diploma.degree}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 truncate group-hover:text-primary transition-colors">
                          {diploma.holderName}
                        </h3>

                        <p className="text-gray-600 mb-3 truncate">{diploma.institution}</p>

                        <div className="flex justify-between items-center text-sm">
                          <div className="text-gray-500">
                            {new Date(Number(diploma.issueDate) * 1000).toLocaleDateString()}
                          </div>
                          <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Показать сколько всего дипломов */}
                {!searchTerm && maxTokenId > diplomas.length && (
                  <div className="mt-6 text-center">
                    <div className="alert alert-warning max-w-md mx-auto">
                      📋 Showing latest {diplomas.length} of {maxTokenId} total diplomas
                    </div>
                  </div>
                )}

                {!searchTerm && (
                  <div className="mt-8 text-center">
                    <div className="alert alert-success max-w-md mx-auto">
                      ✅ All diplomas are verified on Status Network blockchain
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
