import "../../config/i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "@/store";
import { Provider } from "react-redux";
import "../Scss/index.css";
import "@/components/Header/header.css";
import "@/components/Footer/footer.css";
import "../components/SectionLoader/section_loader.css";
import "../components/ErrorOnLoadingThePage/error_on_loading_the_page.css";
import "../pages/home.css";
import "../pages/about-us/about_us.css";
import "../pages/contact-us/contact_us.css";
import "../pages/account-verification/account_verification.css";

export default function App({ Component, pageProps }) {
  return <Provider store={store}>
    <GoogleOAuthProvider clientId={"783579877564-sdehm5e6uiu9f94si0e4for5503h4hgr.apps.googleusercontent.com"}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  </Provider>
}