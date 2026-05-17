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
import { FaCalendarAlt, FaFilter, FaLanguage, FaSearch, FaShapes, FaTimes } from "react-icons/fa";
import TerminologiesImage from "../../../public/images/Services/Terminologies.png";
import { getAnimationSettings, getDateFormated, getInitialStateForElementBeforeAnimation, getUserInfo, handleSelectUserLanguage } from "../../../public/global_functions/popular";

export default function Terminologies() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isGetTerminologies, setIsGetTerminologies] = useState(false);
    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");
    const [terminologies, setTerminologies] = useState([]);
    const [filters, setFilters] = useState({
        term: "",
        geometry: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({
        term: "",
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
        handlePreparePage();
    }, [i18n.language]);

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
            await getTerminologiesPage(1, appliedFilters, currentAccountType);
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
        if (filtersData.term) query.append("term", filtersData.term);
        if (filtersData.geometry) query.append("geometry", filtersData.geometry);
        return query.toString();
    }

    const getTerminologiesPage = async (pageNumber, filtersData = appliedFilters, currentAccountType = accountType) => {
        try {
            const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
            if (!userToken) {
                await router.replace("/login");
                return;
            }
            if (!currentAccountType) return;
            setIsGetTerminologies(true);
            setErrorMsgOnLoadingThePage("");
            const filteringString = getFilteringString(filtersData);
            const result = (await axios.get(`${process.env.BASE_API_URL}/terminologies/all-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&userType=${currentAccountType}&language=${i18n.language || "en"}${filteringString ? `&${filteringString}` : ""}`, {
                headers: {
                    Authorization: userToken,
                },
            })).data;
            setTerminologies(result.data.terminologies || []);
            setTotalPagesCount(Math.ceil((result.data.terminologiesCount || 0) / pageSize));
            setCurrentPage(pageNumber);
            setIsGetTerminologies(false);
            setIsLoadingPage(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setIsGetTerminologies(false);
            setIsLoadingPage(false);
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
        }
    }

    const filterTerminologies = async (e) => {
        e.preventDefault();
        const nextFilters = {
            term: filters.term.trim(),
            geometry: filters.geometry.trim(),
        };
        setAppliedFilters(nextFilters);
        await getTerminologiesPage(1, nextFilters, accountType);
    }

    const clearFilters = async () => {
        const emptyFilters = {
            term: "",
            geometry: "",
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        await getTerminologiesPage(1, emptyFilters, accountType);
    }

    const getTerm = (terminology, language = i18n.language) => terminology?.term?.[language] || terminology?.term?.en || "";

    const getGeometryName = (geometry) => geometry?.name?.[i18n.language] || geometry?.name?.en || "";

    const languages = [
        { code: "ar", label: "Arabic" },
        { code: "en", label: "English" },
        { code: "de", label: "German" },
        { code: "tr", label: "Turkish" },
    ];

    return (
        <div className="terminologies-page page">
            <Head>
                <title>{`${t(process.env.WEBSITE_NAME)} ${t("Terminologies")}`}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <main className="page-content">
                    <section className="terminologies-hero">
                        <div className="container">
                            <motion.div
                                className="terminologies-hero-content"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings()}
                            >
                                <div className="terminologies-hero-image-box mb-3">
                                    <img src={TerminologiesImage.src} alt={`${t("Terminologies")} ${t("Image")}`} />
                                </div>
                                <h1 className="terminologies-title mb-0">{t("Terminologies")}</h1>
                            </motion.div>
                        </div>
                    </section>
                    <section className="terminologies-list-section pt-5 pb-5">
                        <div className="container">
                            <form className="terminologies-filters mb-5" onSubmit={filterTerminologies}>
                                <div className="row align-items-end">
                                    <div className="col-lg-5 mb-3">
                                        <label className="terminologies-filter-label mb-2" htmlFor="terminology-term-filter">
                                            <FaSearch className="terminologies-filter-icon" />
                                            <span>{t("Terminology")}</span>
                                        </label>
                                        <input
                                            id="terminology-term-filter"
                                            type="text"
                                            className="form-control terminologies-filter-field"
                                            placeholder={t("Please Enter Terminology")}
                                            value={filters.term}
                                            onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-5 mb-3">
                                        <label className="terminologies-filter-label mb-2" htmlFor="terminology-geometry-filter">
                                            <FaShapes className="terminologies-filter-icon" />
                                            <span>{t("Geometry Name")}</span>
                                        </label>
                                        <input
                                            id="terminology-geometry-filter"
                                            type="text"
                                            className="form-control terminologies-filter-field"
                                            placeholder={t("Please Enter Geometry Name")}
                                            value={filters.geometry}
                                            onChange={(e) => setFilters({ ...filters, geometry: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-2 mb-3">
                                        <div className="terminologies-filter-actions">
                                            <button className="terminologies-filter-button" type="submit" disabled={isGetTerminologies}>
                                                <FaFilter />
                                                <span>{t(isGetTerminologies ? "Filtering" : "Filter")}</span>
                                            </button>
                                            {(appliedFilters.term || appliedFilters.geometry) && <button className="terminologies-clear-button" type="button" onClick={clearFilters} disabled={isGetTerminologies} aria-label={t("Clear Filters")}>
                                                <FaTimes />
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {isGetTerminologies && <SectionLoader />}
                            {!isGetTerminologies && terminologies.length > 0 && <div className="row">
                                {terminologies.map((terminology, index) => (
                                    <motion.div
                                        className="col-xl-4 col-md-6 mb-4"
                                        key={terminology._id}
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings(index * 0.05)}
                                    >
                                        <article className="terminology-card">
                                            <div className="terminology-card-top">
                                                <div className="terminology-icon-box">
                                                    <FaLanguage />
                                                </div>
                                                <span className="terminology-order">#{((currentPage - 1) * pageSize) + index + 1}</span>
                                            </div>
                                            <h2 className="terminology-main-term">{getTerm(terminology)}</h2>
                                            <div className="terminology-languages-grid">
                                                {languages.map((language) => (
                                                    <div className="terminology-language-box" key={language.code}>
                                                        <span>{t(language.label)}</span>
                                                        <strong>{getTerm(terminology, language.code)}</strong>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="terminology-geometries-box mt-3">
                                                <h3>{t("Related Geometries")}</h3>
                                                {terminology?.geometries?.length > 0 ? <div className="terminology-geometries-list">
                                                    {terminology.geometries.map((geometry) => (
                                                        <span key={geometry._id}>{getGeometryName(geometry)}</span>
                                                    ))}
                                                </div> : <p className="terminology-empty-text mb-0">{t("No Geometries")}</p>}
                                            </div>
                                            <div className="terminology-date-box mt-3">
                                                <FaCalendarAlt className="terminology-date-icon" />
                                                <span>{getDateFormated(terminology.createdAt)}</span>
                                            </div>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>}
                            {!isGetTerminologies && terminologies.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any Terminologies !!")} />}
                            {totalPagesCount > 1 && !isGetTerminologies &&
                                <PaginationBar
                                    totalPagesCount={totalPagesCount}
                                    currentPage={currentPage}
                                    getPreviousPage={() => getTerminologiesPage(currentPage - 1)}
                                    getNextPage={() => getTerminologiesPage(currentPage + 1)}
                                    getSpecificPage={getTerminologiesPage}
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
