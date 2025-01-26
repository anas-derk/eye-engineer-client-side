import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import Header from "@/components/Header";
import LoaderPage from "@/components/LoaderPage";
import Slider from "@/components/Slider";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Carousel } from "react-bootstrap";

export default function Home() {

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

  const { i18n, t } = useTranslation();

  useEffect(() => {

    setIsLoadingPage(false);

  }, []);

  return (
    <div className="home">
      <Head>
        <title>{t([process.env.websiteName])} {t("Home")}</title>
      </Head>
      {!isLoadingPage && !errorMsgOnLoadingThePage && <>
        <Header />
        <div className="page-content">
          <Slider />
          {/* Start Text Ads Section */}
          {5 > 0 && <motion.section
            className="text-ads text-center p-3 fw-bold mb-5 text-dark border-bottom border-2 border-dark"
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
                    <p className="ad-content text-dark m-0">{ad.content}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </motion.section>}
          {/* End Text Ads Section */}
        </div>
      </>}
      {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
      {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
    </div>
  );
}