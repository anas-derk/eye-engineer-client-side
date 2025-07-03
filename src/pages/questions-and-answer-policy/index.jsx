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
        <div className="questions-and-answer-policy">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} - {t("Questions And Answer Policy")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <div className="page-content">
                    <div className="container-fluid">
                        <motion.h1 className="section-name text-center mb-4 text-white h5" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}> {t("Questions And Answer Policy")}</motion.h1>
                        <div className="content">
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Question Conditions")}</motion.h2>
                            <ol>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The question must be scientific and engineering only (no response will be provided if the question is outside the scope of engineering)")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The question should be concise and not a text")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Only one question at a time")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Avoid personal details and refrain from using personal terms")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Inappropriate words or any content unrelated to engineering are not allowed")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("To avoid redundant questions, it is required to search for the topic on the website before asking the question")} .</motion.li>
                            </ol>
                            <motion.h2
                                className="fw-bold mb-4 h4 border-bottom border-2 w-fit pb-2"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                            >{t("Answer Policy")}</motion.h2>
                            <ol>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Answers should be written in proper Arabic, clear and understandable to Arab readers; English can be used in the answer")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The answer should be comprehensive and explanatory for each point in the question")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("The answer must be based on scientific engineering principles only and should not reflect personal opinions or be quoted from forums")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Avoid any form of advertising or promotion for a specific company")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Stay away from texts unrelated to the engineering field")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Avoid any form of personal promotion during the answer. Engineer's response is considered indirect promotion, and contact information can be placed in their profile, not in the answer. This should not encourage the questioner to contact or visit")} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t(`Avoid mentioning the name of the questioner or any personal information; the '{{WEBSITE_NAME}}' website respects the privacy of individuals`, { WEBSITE_NAME: process.env.WEBSITE_NAME })} .</motion.li>
                                <motion.li className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                                    <motion.h3
                                        className="fw-bold h6 border-bottom border-2 w-fit pb-2"
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings}
                                    >{t("Respect for Other Engineers' Opinions")} :</motion.h3>
                                    <motion.p className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Respond to the posed question and attempt to express one's point of view based on scientific engineering principles, avoiding personal biases or unrelated matters")} .</motion.p>
                                </motion.li>
                            </ol>
                            <motion.p className="mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Note: Any violation of these points will result in the immediate deletion of the answer without prior notification to the engineer")} .</motion.p>
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