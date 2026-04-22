import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { NavTracker } from "@/components/nav-tracker";
import { Footer } from "@/components/footer";
import "./globals.css";

const serif = localFont({
  src: "../public/fonts/dm-serif-display-latin-400-normal.woff2",
  variable: "--font-serif",
  display: "swap",
  weight: "400",
});

const sans = localFont({
  src: "../public/fonts/instrument-sans-latin-wght-normal.woff2",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yu Xiao",
    template: "%s - Yu Xiao",
  },
  description: "Words to Actions. Building AI products.",
  metadataBase: new URL("https://xiaoyu.io"),
  openGraph: {
    title: "Yu Xiao",
    description: "Words to Actions. Building AI products.",
    url: "https://xiaoyu.io",
    siteName: "xiaoyu.io",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-MEJX8RVQX7"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MEJX8RVQX7');
        `}
      </Script>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <div className="w-full max-w-[640px] mx-auto px-6">
            <Nav />
            <NavTracker />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
