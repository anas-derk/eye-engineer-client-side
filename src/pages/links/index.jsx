import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import NotFoundError from "@/components/NotFoundError";
import PaginationBar from "@/components/PaginationBar";
import SectionLoader from "@/components/SectionLoader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { motion } from "motion/react";
import axios from "axios";
import { FaCalendarAlt, FaExternalLinkAlt, FaFilter, FaLink, FaSearch, FaShapes, FaTimes } from "react-icons/fa";
import LinksImage from "../../../public/images/Services/EngineeringArticles.png";
import { getAnimationSettings, getDateFormated, getInitialStateForElementBeforeAnimation, getUserInfo, handleSelectUserLanguage } from "../../../public/global_functions/popular";

export default function Links() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isGetLinks, setIsGetLinks] = useState(false);
    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");
    const [links, setLinks] = useState([]);
    const [filters, setFilters] = useState({
        title: "",
        geometry: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({
        title: "",
        geometry: "",
    });
    const [accountType, setAccountType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const pageSize = 9;
    const { t, i18n } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        handlePreparePage();
    }, [router.isReady, router.query.geometryId, i18n.language]);

    const handlePreparePage = async () => {
        try {
            const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
            if (!userToken) {
                await router.replace("/login");
                return;
            }
            const result = await getUserInfo();
            if (result.error) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            const currentAccountType = result.data?.isEngineer || result.data?.isWebsiteOwner || result.data?.officeId ? "admin" : "user";
            setAccountType(currentAccountType);
            await getLinksPage(1, appliedFilters, currentAccountType);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setIsLoadingPage(false);
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
        }
    }

    const getFilteringString = (filtersData) => {
        const query = new URLSearchParams();
        if (filtersData.title) query.append("title", filtersData.title);
        if (filtersData.geometry) query.append("geometry", filtersData.geometry);
        if (router.query.geometryId) query.append("geometryId", router.query.geometryId);
        return query.toString();
    }

    const getLinksPage = async (pageNumber, filtersData = appliedFilters, currentAccountType = accountType) => {
        try {
            const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
            if (!userToken) {
                await router.replace("/login");
                return;
            }
            if (!currentAccountType) return;
            setIsGetLinks(true);
            setErrorMsgOnLoadingThePage("");
            const filteringString = getFilteringString(filtersData);
            const result = (await axios.get(`${process.env.BASE_API_URL}/links/all-links-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&userType=${currentAccountType}&language=${i18n.language || "en"}${filteringString ? `&${filteringString}` : ""}`, {
                headers: {
                    Authorization: userToken,
                },
            })).data;
            setLinks(result.data.links || []);
            setTotalPagesCount(Math.ceil((result.data.linksCount || 0) / pageSize));
            setCurrentPage(pageNumber);
            setIsGetLinks(false);
            setIsLoadingPage(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setIsGetLinks(false);
            setIsLoadingPage(false);
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
        }
    }

    const filterLinks = async (e) => {
        e.preventDefault();
        const nextFilters = {
            title: filters.title.trim(),
            geometry: filters.geometry.trim(),
        };
        setAppliedFilters(nextFilters);
        await getLinksPage(1, nextFilters, accountType);
    }

    const clearFilters = async () => {
        const emptyFilters = {
            title: "",
            geometry: "",
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        await getLinksPage(1, emptyFilters, accountType);
    }

    const getLinkTitle = (link, language = i18n.language) => link?.title?.[language] || link?.title?.en || "";

    const getGeometryName = (geometry) => geometry?.name?.[i18n.language] || geometry?.name?.en || "";

    const getSafeUrl = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;

    return (
        <div className="links-page page">
            <Head>
                <title>{`${t(process.env.WEBSITE_NAME)} ${t("Links")}`}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <main className="page-content">
                    <section className="links-hero">
                        <div className="container">
                            <motion.div
                                className="links-hero-content"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings()}
                            >
                                <div className="links-hero-image-box mb-3">
                                    <img src={LinksImage.src} alt={`${t("Links")} ${t("Image")}`} />
                                </div>
                                <h1 className="links-title mb-0">{t("Links")}</h1>
                            </motion.div>
                        </div>
                    </section>
                    <section className="links-list-section pt-5 pb-5">
                        <div className="container">
                            <form className="links-filters mb-5" onSubmit={filterLinks}>
                                <div className="row align-items-end">
                                    <div className="col-lg-5 mb-3">
                                        <label className="links-filter-label mb-2" htmlFor="link-title-filter">
                                            <FaSearch className="links-filter-icon" />
                                            <span>{t("Title")}</span>
                                        </label>
                                        <input
                                            id="link-title-filter"
                                            type="text"
                                            className="form-control links-filter-field"
                                            placeholder={t("Please Enter Title")}
                                            value={filters.title}
                                            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-5 mb-3">
                                        <label className="links-filter-label mb-2" htmlFor="link-geometry-filter">
                                            <FaShapes className="links-filter-icon" />
                                            <span>{t("Geometry Name")}</span>
                                        </label>
                                        <input
                                            id="link-geometry-filter"
                                            type="text"
                                            className="form-control links-filter-field"
                                            placeholder={t("Please Enter Geometry Name")}
                                            value={filters.geometry}
                                            onChange={(e) => setFilters({ ...filters, geometry: e.target.value })}
                                            disabled={Boolean(router.query.geometryId)}
                                        />
                                    </div>
                                    <div className="col-lg-2 mb-3">
                                        <div className="links-filter-actions">
                                            <button className="links-filter-button" type="submit" disabled={isGetLinks}>
                                                <FaFilter />
                                                <span>{t(isGetLinks ? "Filtering" : "Filter")}</span>
                                            </button>
                                            {(appliedFilters.title || appliedFilters.geometry) && <button className="links-clear-button" type="button" onClick={clearFilters} disabled={isGetLinks} aria-label={t("Clear Filters")}>
                                                <FaTimes />
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {isGetLinks && <SectionLoader />}
                            {!isGetLinks && links.length > 0 && <div className="row">
                                {links.map((link, index) => (
                                    <motion.div
                                        className="col-xl-4 col-md-6 mb-4"
                                        key={link._id}
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings(index * 0.05)}
                                    >
                                        <article className="link-card">
                                            <div className="link-card-top">
                                                <div className="link-icon-box">
                                                    <FaLink />
                                                </div>
                                                <span className="link-order">#{((currentPage - 1) * pageSize) + index + 1}</span>
                                            </div>
                                            <h2 className="link-card-title">{getLinkTitle(link)}</h2>
                                            <a className="link-url-box" href={getSafeUrl(link.url)} target="_blank" rel="noreferrer">
                                                <span>{link.url}</span>
                                                <FaExternalLinkAlt className="link-url-icon" />
                                            </a>
                                            <div className="link-geometries-box mt-3">
                                                <h3>{t("Related Geometries")}</h3>
                                                {link?.geometries?.length > 0 ? <div className="link-geometries-list">
                                                    {link.geometries.map((geometry) => (
                                                        <span key={geometry._id}>{getGeometryName(geometry)}</span>
                                                    ))}
                                                </div> : <p className="link-empty-text mb-0">{t("No Geometries")}</p>}
                                            </div>
                                            <div className="link-date-box mt-3">
                                                <FaCalendarAlt className="link-date-icon" />
                                                <span>{getDateFormated(link.createdAt)}</span>
                                            </div>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>}
                            {!isGetLinks && links.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any Links !!")} />}
                            {totalPagesCount > 1 && !isGetLinks &&
                                <PaginationBar
                                    totalPagesCount={totalPagesCount}
                                    currentPage={currentPage}
                                    getPreviousPage={() => getLinksPage(currentPage - 1)}
                                    getNextPage={() => getLinksPage(currentPage + 1)}
                                    getSpecificPage={getLinksPage}
                                    paginationButtonTextColor={"#000"}
                                    paginationButtonBackgroundColor={"#FFF"}
                                    activePaginationButtonColor={"#000"}
                                    activePaginationButtonBackgroundColor={"var(--main-color-two)"}
                                    isDisplayCurrentPageNumberAndCountOfPages={false}
                                    isDisplayNavigateToSpecificPageForm={false}
                                />
                            }
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
