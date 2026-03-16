import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import BottomNav from "./components/BottomNav";
import { ThemeProvider } from "./ThemeProvider";
import { SettingsProvider } from "./SettingsProvider";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "ZumaPay - Crypto to Cash. Cash to Crypto. Instantly.",
  description: "The easiest way to convert crypto to real money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider>
          <SettingsProvider>
            {children}
            <BottomNav />
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#2C2C2C',
                  color: '#fff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                  style: {
                    border: '1px solid #10B981',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                  style: {
                    border: '1px solid #EF4444',
                  },
                },
              }}
            />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}