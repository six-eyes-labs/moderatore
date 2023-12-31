import { Dosis } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "@/config/WagmiProvider";
import { ReduxProvider } from "@/store/provider";
import { TrackTxnProvider } from "@/config/TrackTxnProvider";
import { ModalProvider } from "@/config/ModalProvider";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "@uiw/react-textarea-code-editor/dist.css";
import "react-toastify/dist/ReactToastify.css";

const dosis = Dosis({ subsets: ["latin"] });

export const metadata = {
  title: "Moderatore",
  description: "Let your community be their own moderatore`",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dosis.className}>
        <WagmiProvider>
          <ReduxProvider>
            <TrackTxnProvider>
              <ModalProvider>
                {" "}
                <Appbar />
                <div className="flex h-auto  relative flex-col px-6 lg:px-40 md:px-16">
                  {children}
                </div>
                <Footer />
              </ModalProvider>
            </TrackTxnProvider>
          </ReduxProvider>
        </WagmiProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}
