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

export default function Home() {

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

  const [isDisplayContactIcons, setIsDisplayContactIcons] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  return (
    <div className="home page">
      <Head>
        <title>{t(process.env.websiteName)} {t("Home")}</title>
      </Head>
      {!isLoadingPage && !errorMsgOnLoadingThePage && <>
        <Header />
        <NavigateToUpOrDown />
        <div className="contact-icons-box" onClick={() => setIsDisplayContactIcons(value => !value)}>
          <ul className="contact-icons-list">
            {isDisplayContactIcons && <li className="contact-icon-item mb-3">
              <a href={`mailto:${process.env.contactEmail}`} target="_blank"><MdOutlineMail className="mail-icon" /></a>
            </li>}
            {isDisplayContactIcons && <li className="contact-icon-item mb-3">
              <a href={`https://wa.me/${process.env.contactNumber}?text=welcome`} target="_blank"><FaWhatsapp className="whatsapp-icon" /></a>
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
          <Capabilities />
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