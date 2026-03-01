import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Krishna Flute Academy",
    description: "Learn the divine art of flute playing with Guru Krishna Flute Academy. Professional courses, handcrafted flutes, and musical wisdom.",
    openGraph: {
        title: "Krishna Flute Academy",
        description: "Learn the divine art of flute playing. Professional courses, handcrafted flutes, and more.",
        url: "https://krishnafluteacademy.com",
        siteName: "Krishna Flute Academy",
        images: [
            {
                url: "/Toppic.jpg",
                width: 1200,
                height: 630,
                alt: "Krishna Flute Academy",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Krishna Flute Academy",
        description: "Learn the divine art of flute playing",
        images: ["/Toppic.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-behavior-smooth">
            <body className="font-inter antialiased">
                {children}
            </body>
        </html>
    );
}
