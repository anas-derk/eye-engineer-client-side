import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, getUserInfo, handleSelectUserLanguage } from "../../../public/global_functions/popular";
import Footer from "@/components/Footer";
import { motion } from "motion/react";

export default function PolicesTermsAndConditions() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (userToken) {
            getUserInfo()
                .then((result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                    }
                    setIsLoadingPage(false);
                })
                .catch((err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        setIsLoadingPage(false);
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else {
            setIsLoadingPage(false);
        }
    }, []);

    return (
        <div className="return-and-refund-policy">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} - {t("Questions And Answer Policy")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <div className="page-content">
                    <div className="container-fluid">
                        <motion.h1 className="section-name text-center mb-4 text-white h5" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Questions And Answer Policy")}</motion.h1>
                        <div className="content">
                            <motion.p className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("If you have received damaged or incorrect products, please contact customer service for assistance as soon as possible")} .</motion.p>
                            <ol>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Exchange one item for another is allowed")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Returned products must be unused, and the original packaging must be retained, We do not accept returns of used or damaged items")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Products with non-returnable tags and free gifts are not eligible for return or exchange")} .</motion.li>
                            </ol>
                            <motion.p className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("You have only one day from the delivery date to request a return and refund with the invoice for the following products and valuable goods")} :</motion.p>
                            <ol>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Jewelry and / pierced earrings")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Watches")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Evening wear, wedding attire, socks, and swimwear")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Glasses")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Leather")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Perfumes (including home fragrances), skincare products, hair care products, aerosol sprays, and cosmetics")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("In some cases, we cannot accept returns")} .</motion.li>
                            </ol>
                            <motion.p className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The following categories are non-refundable and non-exchangeable")} :</motion.p>
                            <ol>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Underwear and lingerie")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The perfumes that have been opened, tested, and used")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Any product that has been exchanged or modified")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Any product that was used")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Any product that was not received in its original packaging")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Any product without the original tags or labels of the product")} .</motion.li>
                                <motion.li className="mb-3" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Any products that have been resized, altered, or damaged after delivery")} .</motion.li>
                            </ol>
                        </div>
                    </div>
                </div>
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}