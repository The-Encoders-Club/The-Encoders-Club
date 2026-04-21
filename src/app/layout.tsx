import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { I18nProvider } from "@/hooks/useLocale";

export const metadata: Metadata = {
  title: "The Encoders Club",
  description: "Comunidad dedicada a crear y compartir novelas visuales con Ren'Py en español. Aprende, crea y colabora.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "The Encoders Club",
    description: "Comunidad de novelas visuales en español",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#080818', color: '#F0F0FF' }}>
        <I18nProvider>
          <LoadingScreen />
          {children}
          <Toaster richColors position="top-right" />
        </I18nProvider>
      </body>
    </html>
  );
}
