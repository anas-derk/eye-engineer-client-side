import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "@/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return <Provider store={store}>
    <GoogleOAuthProvider clientId={"665697657851-ajm9qfeko4lcero0hj8jh7eqvds9eg18.apps.googleusercontent.com"}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  </Provider>
}