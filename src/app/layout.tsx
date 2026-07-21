import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/components/providers/LanguageContext";
import { ToastProvider } from "@/components/ui/ToastContainer";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <LanguageProvider>
          <ToastProvider>
            <SocketProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </SocketProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}