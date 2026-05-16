import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import NotFoundError from "@/components/NotFoundError";
import SectionLoader from "@/components/SectionLoader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import axios from "axios";
import { FaRegCalendarAlt, FaRegNewspaper } from "react-icons/fa";
import RecentsImage from "../../../public/images/Services/Recents.png";
import { getAnimationSettings, getDateFormated, getInitialStateForElementBeforeAnimation, handleSelectUserLanguage } from "../../../public/global_functions/popular";

export default function Recents() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [isGetNews, setIsGetNews] = useState(false);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [news, setNews] = useState([]);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        getNews();
    }, [i18n.language]);

    const getNews = async () => {
        try {
            setIsGetNews(true);
            setErrorMsgOnLoadingThePage("");
            const result = (await axios.get(`${process.env.BASE_API_URL}/news/public/all?language=${i18n.language || "en"}`)).data;
            setNews(result.data || []);
            setIsGetNews(false);
            setIsLoadingPage(false);
        }
        catch (err) {
            setIsGetNews(false);
            setIsLoadingPage(false);
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
        }
    }

    const getNewsContent = (newsItem) => newsItem?.content?.[i18n.language] || newsItem?.content?.en || "";

    return (
        <div className="recents-page page">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Recents")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <main className="page-content">
                    <section className="recents-hero">
                        <div className="container">
                            <motion.div
                                className="recents-hero-content"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings()}
                            >
                                <div className="recents-hero-image-box mb-3">
                                    <img src={RecentsImage.src} alt={`${t("Recents")} ${t("Image")}`} />
                                </div>
                                <h1 className="recents-title mb-0">{t("Recents")}</h1>
                            </motion.div>
                        </div>
                    </section>
                    <section className="recents-list-section pt-5 pb-5">
                        <div className="container">
                            {isGetNews && <SectionLoader />}
                            {!isGetNews && news.length > 0 && <div className="row">
                                {news.map((newsItem, index) => (
                                    <motion.div
                                        className="col-xl-4 col-md-6 mb-4"
                                        key={newsItem._id}
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings(index * 0.05)}
                                    >
                                        <article className="recent-card">
                                            <div className="recent-card-top">
                                                <div className="recent-icon-box">
                                                    <FaRegNewspaper />
                                                </div>
                                                <span className="recent-order">#{index + 1}</span>
                                            </div>
                                            <p className="recent-content">{getNewsContent(newsItem)}</p>
                                            <div className="recent-date-box">
                                                <FaRegCalendarAlt className="recent-date-icon" />
                                                <span>{getDateFormated(newsItem.dateOfCreation)}</span>
                                            </div>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>}
                            {!isGetNews && news.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any News !!")} />}
                        </div>
                    </section>
                </main>
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}
