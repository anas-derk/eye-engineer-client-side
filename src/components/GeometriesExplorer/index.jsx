import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import axios from "axios";
import { FaFileAlt, FaLink, FaNewspaper } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import NotFoundError from "@/components/NotFoundError";
import SectionLoader from "@/components/SectionLoader";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, handleSelectUserLanguage } from "../../../public/global_functions/popular";

export default function GeometriesExplorer({ parentGeometryId = "", isSubGeometriesPage = false }) {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [isGetGeometries, setIsGetGeometries] = useState(false);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [geometries, setGeometries] = useState([]);

    const [parentGeometry, setParentGeometry] = useState({});

    const { t, i18n } = useTranslation();

    const router = useRouter();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        if (isSubGeometriesPage && !router.isReady) return;
        getGeometries();
    }, [router.isReady, parentGeometryId, i18n.language]);

    const getGeometries = async () => {
        try {
            const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
            if (!userToken) {
                await router.replace("/login");
                return;
            }
            setIsGetGeometries(true);
            setErrorMsgOnLoadingThePage("");
            const language = i18n.language || "en";
            const requestOptions = {
                headers: {
                    Authorization: userToken,
                },
            };
            if (isSubGeometriesPage && parentGeometryId) {
                const parentResult = (await axios.get(`${process.env.BASE_API_URL}/geometries/info/${parentGeometryId}?language=${language}`, requestOptions)).data;
                if (!parentResult.error) setParentGeometry(parentResult.data);
            }
            const result = (await axios.get(`${process.env.BASE_API_URL}/geometries/public/all?language=${language}&parent=${parentGeometryId || "null"}`, requestOptions)).data;
            setGeometries(result.data.geometries || []);
            setIsGetGeometries(false);
            setIsLoadingPage(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setIsGetGeometries(false);
            setIsLoadingPage(false);
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
        }
    }

    const getGeometryImageURL = (geometry) => `${process.env.BASE_API_URL}/${geometry.imagePath?.replaceAll("\\", "/")}`;

    const getGeometryName = (geometry) => geometry?.name?.[i18n.language] || geometry?.name?.en || "";

    const handleOpenGeometry = async (geometryId) => {
        await router.push(`/geometries/${geometryId}`);
    }

    const handleCardKeyDown = (e, geometryId) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenGeometry(geometryId);
        }
    }

    return (
        <div className="geometries-page page">
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <main className="page-content">
                    <section className="geometries-hero">
                        <div className="container">
                            <motion.div
                                className="geometries-hero-content"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings()}
                            >
                                <h1 className="geometries-title mb-0">
                                    {isSubGeometriesPage && parentGeometry?.name ? getGeometryName(parentGeometry) : t("Geometries")}
                                </h1>
                                {isSubGeometriesPage && <Link href="/geometries" className="geometries-back-link mt-3 d-inline-block">{t("Back To Geometries")}</Link>}
                            </motion.div>
                        </div>
                    </section>
                    <section className="geometries-list-section pt-5 pb-5">
                        <div className="container">
                            {isGetGeometries && <SectionLoader />}
                            {!isGetGeometries && geometries.length > 0 && <div className="row">
                                {geometries.map((geometry, index) => (
                                    <motion.div
                                        className="col-xl-4 col-md-6 mb-4"
                                        key={geometry._id}
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings(index * 0.05)}
                                    >
                                        <article
                                            className="geometry-card"
                                            role="button"
                                            tabIndex="0"
                                            onClick={() => handleOpenGeometry(geometry._id)}
                                            onKeyDown={(e) => handleCardKeyDown(e, geometry._id)}
                                        >
                                            <div className="geometry-image-box">
                                                <img src={getGeometryImageURL(geometry)} alt={`${getGeometryName(geometry)} ${t("Image")}`} />
                                            </div>
                                            <div className="geometry-card-body">
                                                <h2 className="geometry-card-title">{getGeometryName(geometry)}</h2>
                                                <div className="geometry-actions-box" onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/files?geometryId=${geometry._id}`} className="geometry-action-link">
                                                        <FaFileAlt className="geometry-action-icon" />
                                                        <span>{t("Files")}</span>
                                                    </Link>
                                                    <Link href={`/engineering-articles?geometryId=${geometry._id}`} className="geometry-action-link">
                                                        <FaNewspaper className="geometry-action-icon" />
                                                        <span>{t("Articles")}</span>
                                                    </Link>
                                                    <Link href={`/links?geometryId=${geometry._id}`} className="geometry-action-link">
                                                        <FaLink className="geometry-action-icon" />
                                                        <span>{t("Links")}</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>}
                            {!isGetGeometries && geometries.length === 0 && <NotFoundError errorMsg={t(isSubGeometriesPage ? "No Sub Geometries" : "No Geometries")} />}
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
