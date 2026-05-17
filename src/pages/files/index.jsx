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
import { FaCalendarAlt, FaDownload, FaFileAlt, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import FilesImage from "../../../public/images/Services/Geometries.png";
import { getAnimationSettings, getDateFormated, getInitialStateForElementBeforeAnimation, getUserInfo, handleSelectUserLanguage } from "../../../public/global_functions/popular";

const fileTypes = ["PDF", "VIDEO", "Images", "ZIP", "Audios"];

export default function Files() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isGetFiles, setIsGetFiles] = useState(false);
    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");
    const [files, setFiles] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        type: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({
        name: "",
        type: "",
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
            await getFilesPage(1, appliedFilters, currentAccountType);
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
        if (filtersData.name) query.append("name", filtersData.name);
        if (filtersData.type) query.append("type", filtersData.type);
        if (router.query.geometryId) query.append("geometryId", router.query.geometryId);
        return query.toString();
    }

    const getFilesPage = async (pageNumber, filtersData = appliedFilters, currentAccountType = accountType) => {
        try {
            const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
            if (!userToken) {
                await router.replace("/login");
                return;
            }
            if (!currentAccountType) return;
            setIsGetFiles(true);
            setErrorMsgOnLoadingThePage("");
            const filteringString = getFilteringString(filtersData);
            const result = (await axios.get(`${process.env.BASE_API_URL}/files/all-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&userType=${currentAccountType}&language=${i18n.language || "en"}${filteringString ? `&${filteringString}` : ""}`, {
                headers: {
                    Authorization: userToken,
                },
            })).data;
            setFiles(result.data.files || []);
            setTotalPagesCount(Math.ceil((result.data.filesCount || 0) / pageSize));
            setCurrentPage(pageNumber);
            setIsGetFiles(false);
            setIsLoadingPage(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setIsGetFiles(false);
            setIsLoadingPage(false);
            setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
        }
    }

    const filterFiles = async (e) => {
        e.preventDefault();
        const nextFilters = {
            name: filters.name.trim(),
            type: filters.type,
        };
        setAppliedFilters(nextFilters);
        await getFilesPage(1, nextFilters, accountType);
    }

    const clearFilters = async () => {
        const emptyFilters = {
            name: "",
            type: "",
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        await getFilesPage(1, emptyFilters, accountType);
    }

    const getFileName = (file) => file?.name?.[i18n.language] || file?.name?.en || "";

    const getGeometryName = (geometry) => geometry?.name?.[i18n.language] || geometry?.name?.en || "";

    const getFileUrl = (filePath) => filePath ? `${process.env.BASE_API_URL}/${filePath.replaceAll("\\", "/")}` : "";

    return (
        <div className="files-page page">
            <Head>
                <title>{`${t(process.env.WEBSITE_NAME)} ${t("Files")}`}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                <main className="page-content">
                    <section className="files-hero">
                        <div className="container">
                            <motion.div
                                className="files-hero-content"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings()}
                            >
                                <div className="files-hero-image-box mb-3">
                                    <img src={FilesImage.src} alt={`${t("Files")} ${t("Image")}`} />
                                </div>
                                <h1 className="files-title mb-0">{t("Files")}</h1>
                            </motion.div>
                        </div>
                    </section>
                    <section className="files-list-section pt-5 pb-5">
                        <div className="container">
                            <form className="files-filters mb-5" onSubmit={filterFiles}>
                                <div className="row align-items-end">
                                    <div className="col-lg-4 mb-3">
                                        <label className="files-filter-label mb-2" htmlFor="file-name-filter">
                                            <FaSearch className="files-filter-icon" />
                                            <span>{t("File Name")}</span>
                                        </label>
                                        <input
                                            id="file-name-filter"
                                            type="text"
                                            className="form-control files-filter-field"
                                            placeholder={t("Please Enter File Name")}
                                            value={filters.name}
                                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label className="files-filter-label mb-2" htmlFor="file-type-filter">
                                            <FaFileAlt className="files-filter-icon" />
                                            <span>{t("File Type")}</span>
                                        </label>
                                        <select
                                            id="file-type-filter"
                                            className="form-control files-filter-field"
                                            value={filters.type}
                                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                        >
                                            <option value="">{t("All")}</option>
                                            {fileTypes.map((type) => <option key={type} value={type}>{t(type)}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <div className="files-filter-actions">
                                            <button className="files-filter-button" type="submit" disabled={isGetFiles}>
                                                <FaFilter />
                                                <span>{t(isGetFiles ? "Filtering" : "Filter")}</span>
                                            </button>
                                            {(appliedFilters.name || appliedFilters.type) && <button className="files-clear-button" type="button" onClick={clearFilters} disabled={isGetFiles} aria-label={t("Clear Filters")}>
                                                <FaTimes />
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {isGetFiles && <SectionLoader />}
                            {!isGetFiles && files.length > 0 && <div className="row">
                                {files.map((file, index) => (
                                    <motion.div
                                        className="col-xl-4 col-md-6 mb-4"
                                        key={file._id}
                                        initial={getInitialStateForElementBeforeAnimation()}
                                        whileInView={getAnimationSettings(index * 0.05)}
                                    >
                                        <article className="file-card">
                                            <div className="file-card-top">
                                                <div className="file-icon-box">
                                                    <FaFileAlt />
                                                </div>
                                                <span className="file-order">#{((currentPage - 1) * pageSize) + index + 1}</span>
                                            </div>
                                            <h2 className="file-card-title">{getFileName(file)}</h2>
                                            <div className="file-meta-grid">
                                                <div className="file-meta-box">
                                                    <span>{t("File Type")}</span>
                                                    <strong>{t(file.type)}</strong>
                                                </div>
                                                <div className="file-meta-box">
                                                    <span>{t("File Name")}</span>
                                                    <strong>{file.originalName || getFileName(file)}</strong>
                                                </div>
                                            </div>
                                            <a className="file-download-box" href={getFileUrl(file.filePath)} download={file.originalName || getFileName(file)} target="_blank" rel="noreferrer">
                                                <FaDownload className="file-download-icon" />
                                                <span>{t("Download File")}</span>
                                            </a>
                                            <div className="file-geometries-box mt-3">
                                                <h3>{t("Related Geometries")}</h3>
                                                {file?.geometries?.length > 0 ? <div className="file-geometries-list">
                                                    {file.geometries.map((geometry) => (
                                                        <span key={geometry._id}>{getGeometryName(geometry)}</span>
                                                    ))}
                                                </div> : <p className="file-empty-text mb-0">{t("No Geometries")}</p>}
                                            </div>
                                            <div className="file-date-box mt-3">
                                                <FaCalendarAlt className="file-date-icon" />
                                                <span>{getDateFormated(file.createdAt)}</span>
                                            </div>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>}
                            {!isGetFiles && files.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any Files !!")} />}
                            {totalPagesCount > 1 && !isGetFiles &&
                                <PaginationBar
                                    totalPagesCount={totalPagesCount}
                                    currentPage={currentPage}
                                    getPreviousPage={() => getFilesPage(currentPage - 1)}
                                    getNextPage={() => getFilesPage(currentPage + 1)}
                                    getSpecificPage={getFilesPage}
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
