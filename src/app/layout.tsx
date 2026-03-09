import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Pelrex | AI Automation Agency",
    description: "We build done-for-you AI systems that respond to your leads, automate your admin, and follow up with every prospect 24/7.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} antialiased selection:bg-[#7C3AED] selection:text-white`}>
                {children}
            </body>
        </html>
    );
}
