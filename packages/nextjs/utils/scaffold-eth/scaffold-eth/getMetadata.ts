// packages/nextjs/utils/scaffold-eth/getMetadata.ts
import type { Metadata } from "next";

export const getMetadata = ({ title, description }: { title: string; description: string }): Metadata => ({
  title,
  description,
  metadataBase: new URL("https://your-app.com"),
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
});
