import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/lib/style/index.less";
import "antd/lib/button/style/index.less";
import "../styles/antd.less";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
