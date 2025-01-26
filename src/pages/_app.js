import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "@/store";
import { Provider } from "react-redux";
import "../styles/global.css";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {

  const router = useRouter();

  return <Provider store={store}>
    <GoogleOAuthProvider clientId={"665697657851-ajm9qfeko4lcero0hj8jh7eqvds9eg18.apps.googleusercontent.com"}>
      <HeroUIProvider navigate={router.push}>
        <Component {...pageProps} />
      </HeroUIProvider>
    </GoogleOAuthProvider>
  </Provider>
}