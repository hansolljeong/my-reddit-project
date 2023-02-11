import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/context/auth";
import "@/styles/globals.css";
import axios from "axios";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  axios.defaults.withCredentials = true;

  // NavBar 표시 여부를 위한 authRoute 설정
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!authRoute && <NavBar />}
      <div className={authRoute ? "" : "pt-12 bg-gray-200 min-h-screen"}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
