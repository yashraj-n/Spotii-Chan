import type { AppProps } from "next/app";
// Wraps all the pages with Redux Provider
import Head from "next/head";
import { store } from "../lib/store";
import { Provider } from "react-redux";
import DownloadListener from "../components/DownloadListener";
// Wraps in Toast contauner to have a global toast 🍞
import { ToastContainer } from "react-toastify";
// Global CSS
import "../style.css";

// CSS for react-toastify and three-dots loading screen
import "react-toastify/dist/ReactToastify.css";
import "three-dots/dist/three-dots.min.css";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <ToastContainer />
        <DownloadListener />
        <Component {...pageProps} />{" "}
      </Provider>
      
    </>
  );
}
