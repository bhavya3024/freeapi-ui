import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "../src/components/AppShell";
import { themeBootstrapScript } from "../src/config/theme";
import { AuthProvider } from "../src/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FreeAPI Explorer",
  description: "Browse FreeAPI's public datasets and try the authenticated chat app.",
};

export default function RootLayout({ children }) {
  return (
    // data-theme is set by the bootstrap script before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
