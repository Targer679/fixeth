"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAccount, usePublicClient } from "wagmi";
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
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Verify Diploma</span>
          </h1>
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
          <p className="text-center mt-4">Loading diploma data...</p>
        </div>
      </div>
    );
  }

  if (!isValidTokenId) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Verify Diploma</span>
          </h1>
          <div className="alert alert-warning max-w-md mx-auto">Invalid diploma ID. Please check the link.</div>
        </div>
      </div>
    );
  }

  if (!diplomaData) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Verify Diploma</span>
            <span className="block text-lg text-gray-600">ID: {tokenId}</span>
          </h1>
          <div className="alert alert-error max-w-md mx-auto">
            Diploma with ID {tokenId} not found or does not exist
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">Verify Diploma</span>
          <span className="block text-lg text-gray-600">ID: {tokenId}</span>
        </h1>

        <div className="bg-base-100 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-success text-success-content p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">✅ Diploma Verified</h3>
                <p className="opacity-90">Data confirmed on Status Network blockchain</p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Student Name</span>
                </label>
                <p className="text-lg font-semibold">{diplomaData.holderName}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Institution</span>
                </label>
                <p className="text-lg font-semibold">{diplomaData.institution}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Degree</span>
                </label>
                <p className="text-lg font-semibold">{diplomaData.degree}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Major</span>
                </label>
                <p className="text-lg font-semibold">{diplomaData.major}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Graduation Date</span>
                </label>
                <p className="text-lg font-semibold">
                  {new Date(Number(diplomaData.graduationDate) * 1000).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Issue Date</span>
                </label>
                <p className="text-lg font-semibold">
                  {new Date(Number(diplomaData.issueDate) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-base-200 p-6 border-t">
            <h4 className="font-semibold mb-4">Technical Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="label label-text p-0">Owner Address:</label>
                <code className="text-xs bg-base-300 p-1 rounded break-all">{diplomaData.owner}</code>
              </div>
              <div>
                <label className="label label-text p-0">IPFS Hash:</label>
                <code className="text-xs bg-base-300 p-1 rounded break-all">{diplomaData.ipfsHash}</code>
              </div>
              <div>
                <label className="label label-text p-0">Diploma ID:</label>
                <code className="text-xs bg-base-300 p-1 rounded">{tokenId}</code>
              </div>
              <div>
                <label className="label label-text p-0">Network:</label>
                <span className="badge badge-primary">Status Network Sepolia</span>
              </div>
            </div>
          </div>

          {diplomaData.ipfsHash && (
            <div className="bg-base-200 p-6 border-t">
              <div className="text-center">
                <a
                  href={`https://ipfs.io/ipfs/${diplomaData.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  📄 View Original Document
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
