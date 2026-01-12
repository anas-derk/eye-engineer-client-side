import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import Header from "@/components/Header";
import LoaderPage from "@/components/LoaderPage";
import Slider from "@/components/Slider";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Carousel } from "react-bootstrap";
import NavigateToUpOrDown from "@/components/NavigateToUpOrDown";
import { MdOutlineContactPhone, MdOutlineMail } from "react-icons/md";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import Capabilities from "@/components/Capabilities";
import Footer from "@/components/Footer";
import { getAppearedSections, getUserInfo, handleSelectUserLanguage } from "../../public/global_functions/popular";

export default function Home() {

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

  const [isDisplayContactIcons, setIsDisplayContactIcons] = useState(false);

  const [appearedSections, setAppearedSections] = useState([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
    handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
  }, []);

  useEffect(() => {
    const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
    if (userToken) {
      getUserInfo()
        .then(async (result) => {
          if (result.error) {
            localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
          }
          const appearedSectionsResult = await getAppearedSections();
          const appearedSectionsLength = appearedSectionsResult.data.length;
          setAppearedSections(appearedSectionsLength > 0 ? appearedSectionsResult.data.map((appearedSection) => appearedSection.isAppeared ? appearedSection.sectionName["en"] : "") : []);
          setIsLoadingPage(false);
        })
        .catch(async (err) => {
          if (err?.response?.status === 401) {
            localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
          }
          else {
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
          }
          setIsLoadingPage(false);
        });
    } else {
      setIsLoadingPage(false);
    }
  }, []);

  return (
    <div className="home page">
      <Head>
        <title>{t(process.env.WEBSITE_NAME)} {t("Home")}</title>
      </Head>
      {!isLoadingPage && !errorMsgOnLoadingThePage && <>
        <Header />
        <NavigateToUpOrDown />
        <div className="contact-icons-box" onClick={() => setIsDisplayContactIcons(value => !value)}>
          <ul className="contact-icons-list">
            {isDisplayContactIcons && <li className="contact-icon-item mb-3">
              <a href={`mailto:${process.env.CONTACT_EMAIL}`} target="_blank"><MdOutlineMail className="mail-icon" /></a>
            </li>}
            {isDisplayContactIcons && appearedSections.includes("whatsapp button") && <li className="contact-icon-item mb-3">
              <a href={`https://wa.me/${process.env.CONTACT_NUMBER}?text=welcome`} target="_blank"><FaWhatsapp className="whatsapp-icon" /></a>
            </li>}
            {!isDisplayContactIcons && <li className="contact-icon-item"><MdOutlineContactPhone className="contact-icon" /></li>}
            {isDisplayContactIcons && <li className="contact-icon-item"><FaTimes className="close-icon" /></li>}
          </ul>
        </div>
        {/* End Contact Icons Box */}
        {/* Start Page Content */}
        <div className="page-content">
          <Slider />
          {/* Start Text Ads Section */}
          {5 > 0 && <motion.section
            className="text-ads text-center p-3 fw-bold mb-4"
            initial={{
              width: 0,
            }}
            animate={{
              width: "100%",
              transition: {
                duration: 0.3,
              }
            }}
          >
            <Carousel indicators={false} controls={false}>
              {[{ content: "If you are an engineering & specialist and interested, it's our pleasure to share and spread the benefit" }, { content: "We seek to provide useful engineering & Website for Information,Knowledge has no limits" }].map((ad, index) => (
                <Carousel.Item key={index}>
                  <Carousel.Caption>
                    <p className="ad-content m-0">{ad.content}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </motion.section>}
          {/* End Text Ads Section */}
          {/* Start Our Capabilities Section */}
          <Capabilities appearedSections={appearedSections} />
          {/* End Our Capabilities Section */}
          <Footer />
        </div>
        {/* End Page Content */}
      </>}
      {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
      {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
    </div>
  );
}