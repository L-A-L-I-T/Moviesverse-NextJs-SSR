import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Provider store={store}>
        <Component {...pageProps} />
        <Footer />
      </Provider>
    </>
  );
}
