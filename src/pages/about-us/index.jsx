import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import websiteLogo from "../../../public/images/LogoWithTransparentBackground.webp";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import Footer from "@/components/Footer";

export default function AboutUs() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const { t } = useTranslation();

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    return (
        <div className="about-us">
            <Head>
                <title>{t(process.env.websiteName)} {t("About Us")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("About Us")}</h1>
                    <div className="container pt-4 pb-4">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <motion.div
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                    className="image-box text-center"
                                >
                                    <img src={websiteLogo.src} alt={`${process.env.websiteName} Image`} />
                                </motion.div>
                            </div>
                            <div className="col-md-6">
                                <motion.p
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                >{process.env.websiteName} {t("is a specialized platform dedicated to providing remote engineering consulting services and delivering reliable engineering information to those in need.")}</motion.p>
                                <motion.p
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                >{t("If you have interest and a desire to discuss any engineering topic, we hope you reach out to us.")}</motion.p>
                                <motion.p
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                >{t("Share information and benefits for everyone.")}</motion.p>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
        </div>
    );
}