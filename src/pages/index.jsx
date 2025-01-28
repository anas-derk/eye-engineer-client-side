import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import Header from "@/components/Header";
import LoaderPage from "@/components/LoaderPage";
import Slider from "@/components/Slider";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Carousel } from "react-bootstrap";
import ServiceImage1 from "../../public/images/Services/Geometries.png";
import ServiceImage2 from "../../public/images/Services/EducationalVideos.png";
import ServiceImage3 from "../../public/images/Services//EngineeringArticles.png";
import ServiceImage4 from "../../public/images/Services/Recents.png";
import ServiceImage5 from "../../public/images/Services/Terminologies.png";
import ServiceImage6 from "../../public/images/Services/Offices.png";
import ServiceImage7 from "../../public/images/Services/PropertyValuation.png";
import Link from "next/link";
import Footer from "@/components/Footer";
import NavigateToUpOrDown from "@/components/NavigateToUpOrDown";
import { MdOutlineContactPhone, MdOutlineMail } from "react-icons/md";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation } from "../../public/global_functions/popular";

export default function Home() {

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

  const [isDisplayContactIcons, setIsDisplayContactIcons] = useState(false);

  const { t } = useTranslation();

  const servicesData = [
    {
      title: "Geometries",
      description: "Contains diverse engineering information and resources",
      imageSrc: ServiceImage1.src,
    },
    {
      title: "Educational Videos",
      description: "Provides a collection of instructional videos",
      imageSrc: ServiceImage2.src,
    },
    {
      title: "Engineering Articles",
      description: "Contains diverse articles",
      imageSrc: ServiceImage3.src,
    },
    {
      title: "Recents",
      description: "Provides the latest information and news",
      imageSrc: ServiceImage4.src,
    },
    {
      title: "Terminologies",
      description: "Provides definitions of technical and professional terms",
      imageSrc: ServiceImage5.src,
    },
    {
      title: "Offices",
      description: "Offers tips and ideas to enhance the work environment in offices",
      imageSrc: ServiceImage6.src,
    },
    {
      title: "Property Valuation",
      description: "Provides property valuations by experts",
      imageSrc: ServiceImage7.src,
    },
  ];

  useEffect(() => {

    setIsLoadingPage(false);

  }, []);

  return (
    <div className="home page">
      <Head>
        <title>{t([process.env.websiteName])} {t("Home")}</title>
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
          {/* Start Services Section */}
          <section className="our-services mb-5">
            <h2 className="section-name text-center mb-4 text-white h5">{t("Our Services")}</h2>
            <div className="container">
              <div className="row align-items-center">
                {servicesData.map((service, index) => (
                  <motion.div
                    className="col-lg-4 mb-4"
                    key={index}
                    initial={getInitialStateForElementBeforeAnimation()}
                    whileInView={getAnimationSettings}
                    whileHover={{
                      scale: 1.1
                    }}
                  >
                    <div className="service-info-box info-box p-3 text-center">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <img src={service.imageSrc} alt={`${service.title} Image !`} width="100" height="100" />
                        </div>
                        <div className="col-md-8 text-center">
                          <h6 className="mb-3 fw-bold">{t(service.title)}</h6>
                          <p className="mb-3 d-block">{t(service.description)}</p>
                          <Link href="/" className="orange-btn d-block">{t("View")}</Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          {/* End Services Section */}
          <Footer />
        </div>
      </>}
      {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
      {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
    </div>
  );
}