"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
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
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Issue Diploma</span>
          </h1>
          <p>Please connect your wallet to issue diplomas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-2xl">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">Issue Diploma</span>
          <span className="block text-lg text-gray-600">Gasless transactions on Status Network</span>
        </h1>

        <div className="alert alert-success mb-6">✅ All transactions on this page are completely gasless</div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-base-100 p-6 rounded-3xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Recipient Address *</span>
              </label>
              <input
                type="text"
                required
                value={formData.recipient}
                onChange={e => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="0x..."
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Student Name *</span>
              </label>
              <input
                type="text"
                required
                value={formData.holderName}
                onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                placeholder="John Doe"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Institution *</span>
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={e => setFormData({ ...formData, institution: e.target.value })}
              placeholder="University Name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Degree *</span>
              </label>
              <select
                required
                value={formData.degree}
                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                className="select select-bordered w-full"
              >
                <option value="">Select degree</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Major *</span>
              </label>
              <input
                type="text"
                required
                value={formData.major}
                onChange={e => setFormData({ ...formData, major: e.target.value })}
                placeholder="Computer Science"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Graduation Date *</span>
            </label>
            <input
              type="date"
              required
              value={formData.graduationDate}
              onChange={e => setFormData({ ...formData, graduationDate: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">IPFS Hash *</span>
            </label>
            <input
              type="text"
              required
              value={formData.ipfsHash}
              onChange={e => setFormData({ ...formData, ipfsHash: e.target.value })}
              placeholder="QmXYZ..."
              className="input input-bordered w-full"
            />
            <label className="label">
              <span className="label-text-alt">Upload PDF to IPFS (Pinata, Lighthouse, etc.)</span>
            </label>
          </div>

          <button type="submit" disabled={isMining} className="btn btn-primary w-full mt-6">
            {isMining ? "Issuing Diploma..." : "🎓 Issue Diploma (Gasless)"}
          </button>
        </form>
      </div>
    </div>
  );
}
