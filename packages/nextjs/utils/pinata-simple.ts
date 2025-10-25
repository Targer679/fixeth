// lib/simple-pinata.ts
export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class PinataService {
  private static readonly PINATA_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Y2JiYmJjZi02NWM3LTQ0ZTUtYThmNS02YjYyNjIyZThlYzciLCJlbWFpbCI6ImFkaWxraGFuZHJpdmVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ5YzBkMzA5OGFhZTM0M2UwMzg1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZjAyZDUzMzRlZGRjMjkxZTE3NmUwNGYyMGIxZjgxYTRjYWE1ODRhYmNlY2M5NmRmMjFlZDUwZjE2MDI1ZmJjNiIsImV4cCI6MTc5MjkzNjkzOH0.NoGCzvosndKphbCWGkBs2e5-UOu1wGcifFTAHVsqKoc";
  private static readonly API_KEY = "d9c0d3098aae343e0385";
  private static readonly API_SECRET = "f02d5334eddc291e176e04f20b1f81a4cca584abcecc96df21ed50f16025fbc6";

  static async uploadFileToIPFS(file: File): Promise<PinataResponse> {
    const formData = new FormData();
    formData.append("file", file);

    // Добавляем метаданные
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: "diploma",
        timestamp: new Date().toISOString(),
        app: "EduVerify",
      },
    });
    formData.append("pinataMetadata", metadata);

    try {
      console.log("📤 Uploading file to Pinata...", file.name);
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.PINATA_JWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ File uploaded to IPFS:", result.IpfsHash);
      return result;
    } catch (error) {
      console.error("❌ Pinata upload failed:", error);
      throw error; // Пробрасываем ошибку дальше
    }
  }

  static async uploadJSONToIPFS(jsonData: object): Promise<PinataResponse> {
    try {
      console.log("📤 Uploading JSON to Pinata...");
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: `diploma-${Date.now()}.json`,
            keyvalues: {
              type: "diploma-metadata",
              timestamp: new Date().toISOString(),
              app: "EduVerify",
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ JSON uploaded to IPFS:", result.IpfsHash);
      return result;
    } catch (error) {
      console.error("❌ Pinata JSON upload failed:", error);
      throw error;
    }
  }

  static getIPFSViewURL(ipfsHash: string): string {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }

  static getPinataGatewayURL(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }
}
