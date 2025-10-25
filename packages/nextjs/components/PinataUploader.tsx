"use client";

import { useState } from "react";

interface PinataUploaderProps {
  onUploadComplete: (ipfsHash: string) => void;
}

export default function PinataUploader({ onUploadComplete }: PinataUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToPinata = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Используем хардкодированные ключи для тестирования
      const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_KEY || "082ff04167fbed9feef1";
      const pinataSecret =
        process.env.NEXT_PUBLIC_PINATA_SECRET || "e812a7bde8491bb391fb7ad98b10e0f64df25ac8c71a1513b078497e7d956a79";

      console.log("🔄 Starting upload to Pinata...", file.name);
      console.log("🔑 API Key:", pinataApiKey);

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecret,
        },
        body: formData,
      });

      console.log("📡 Upload response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Upload failed:", errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Upload successful:", data);

      const ipfsHash = data.IpfsHash;
      console.log("🎯 IPFS Hash:", ipfsHash);

      onUploadComplete(ipfsHash);
    } catch (error) {
      console.error("❌ Error uploading to IPFS:", error);
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size too large. Please select a file smaller than 10MB.");
        return;
      }

      setFile(selectedFile);
      console.log("📄 File selected:", selectedFile.name);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("🚀 Starting upload...");
      uploadToPinata(file);
    } else {
      alert("Please select a file first");
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-white/30 rounded-2xl p-6 text-center bg-white/10 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-white font-semibold mb-2">Upload Diploma Document</p>
            <p className="text-white/70 text-sm">Supported: PDF, JPG, PNG (Max 10MB)</p>
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="file-input file-input-bordered file-input-lg w-full max-w-xs bg-white/20 text-white border-white/30 placeholder-white/60"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="btn btn-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 text-white disabled:opacity-50 transition-all duration-300"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>📤</span>
                Upload to IPFS
              </div>
            )}
          </button>
        </div>
      </div>

      {file && !isUploading && (
        <div className="text-white/80 text-sm bg-white/10 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span>
              Selected: <strong>{file.name}</strong>
            </span>
            <span className="text-white/60">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      )}
    </div>
  );
}
