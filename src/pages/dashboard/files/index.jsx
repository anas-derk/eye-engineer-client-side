import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage, getAllFilesInsideThePage, getDateFormated } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import ConfirmDelete from "@/components/ConfirmDelete";
import PaginationBar from "@/components/PaginationBar";
import SectionLoader from "@/components/SectionLoader";
import AddFile from "@/components/AddFile";
import UpdateGeometries from "@/components/UpdateGeometries";
import UpdateFile from "@/components/UpdateFile";

const fileTypes = ["PDF", "VIDEO", "Images", "ZIP", "Audios"];

export default function Files() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const [allFilesInsideThePage, setAllFilesInsideThePage] = useState([]);
    const [isGetFiles, setIsGetFiles] = useState(false);
    const [selectedFileIndex, setSelectedFileIndex] = useState(-1);
    const [waitMsg, setWaitMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsgOnGetFilesData, setErrorMsgOnGetFilesData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesCount, setTotalPagesCount] = useState(0);
    const [filters, setFilters] = useState({
        geometry: "",
        name: "",
        type: "",
    });
    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);
    const [isDisplayAddFileBox, setIsDisplayAddFileBox] = useState(false);
    const [isDisplayUpdateFileBox, setIsDisplayUpdateFileBox] = useState(false);
    const [isDisplayUpdateRelatedGeometriesBox, setIsDisplayUpdateRelatedGeometriesBox] = useState(false);

    const router = useRouter();
    const pageSize = 3;
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const adminToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (adminToken) {
            getUserInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    } else {
                        const adminDetails = result.data;
                        if (adminDetails.isEngineer) {
                            setUserInfo(adminDetails);
                            result = (await getAllFilesInsideThePage(1, pageSize, "", i18n.language)).data;
                            setAllFilesInsideThePage(result.files);
                            setTotalPagesCount(Math.ceil(result.filesCount / pageSize));
                            setIsLoadingPage(false);
                        } else {
                            await router.replace("/dashboard");
                        }
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else router.replace("/login");
    }, []);

    const getFilteringString = (filters) => {
        let filteringString = "";
        if (filters.geometry) filteringString += `geometry=${filters.geometry}&`;
        if (filters.name) filteringString += `name=${filters.name}&`;
        if (filters.type) filteringString += `type=${filters.type}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const getFilesPage = async (pageNumber) => {
        try {
            setIsGetFiles(true);
            setErrorMsgOnGetFilesData("");
            const result = (await getAllFilesInsideThePage(pageNumber, pageSize, getFilteringString(filters), i18n.language)).data;
            setAllFilesInsideThePage(result.files);
            setTotalPagesCount(Math.ceil(result.filesCount / pageSize));
            setCurrentPage(pageNumber);
            setIsGetFiles(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetFiles(false);
                setErrorMsgOnGetFilesData(err?.message === "Network Error" ? "Network Error When Get Files Data" : "Sorry, Someting Went Wrong When Get Files Data, Please Repeate The Process !!");
            }
        }
    }

    const filterFiles = async (filters) => {
        try {
            setIsGetFiles(true);
            setCurrentPage(1);
            const result = (await getAllFilesInsideThePage(1, pageSize, getFilteringString(filters), i18n.language)).data;
            setAllFilesInsideThePage(result.files);
            setTotalPagesCount(Math.ceil(result.filesCount / pageSize));
            setIsGetFiles(false);
        }
        catch (err) {
            setIsGetFiles(false);
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 1500);
        }
    }

    const handleAddNewFile = async () => {
        await getFilesPage(1);
    }

    const handleDisplayUpdateFileBox = (fileIndex) => {
        setSelectedFileIndex(fileIndex);
        setIsDisplayUpdateFileBox(true);
    }

    const handleUpdateFile = async () => {
        await getFilesPage(currentPage);
    }

    const handleDisplayUpdateRelatedGeometriesBox = (fileIndex) => {
        setSelectedFileIndex(fileIndex);
        setIsDisplayUpdateRelatedGeometriesBox(true);
    }

    const handleUpdateRelatedGeometriestBox = async () => {
        await getFilesPage(currentPage);
    }

    const deleteFile = async (fileIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedFileIndex(fileIndex);
            let result = (await axios.delete(`${process.env.BASE_API_URL}/files/${allFilesInsideThePage[fileIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedFileIndex(-1);
                    await getFilesPage(currentPage);
                    clearTimeout(successTimeout);
                }, 1500);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedFileIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                setSelectedFileIndex(-1);
                clearTimeout(errorTimeout);
            }, 1500);
        }
    }

    return (
        <div className="files dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Files")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Files")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteFile(selectedFileIndex)}
                    setSelectedElementIndex={setSelectedFileIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayAddFileBox && <AddFile
                    setIsDisplayAddFileBox={setIsDisplayAddFileBox}
                    handleAddNewFile={handleAddNewFile}
                />}
                {isDisplayUpdateFileBox && selectedFileIndex > -1 && <UpdateFile
                    selectedFile={allFilesInsideThePage[selectedFileIndex]}
                    setIsDisplayUpdateFileBox={setIsDisplayUpdateFileBox}
                    setSelectedFileIndex={setSelectedFileIndex}
                    handleUpdateFile={handleUpdateFile}
                />}
                {isDisplayUpdateRelatedGeometriesBox && selectedFileIndex > -1 && <UpdateGeometries
                    setIsDisplayUpdateRelatedGeometriesBox={setIsDisplayUpdateRelatedGeometriesBox}
                    handleUpdateRelatedGeometriestBox={handleUpdateRelatedGeometriestBox}
                    currentGeometries={allFilesInsideThePage[selectedFileIndex].geometries}
                    endpointName="files"
                    itemId={allFilesInsideThePage[selectedFileIndex]._id}
                    setSelectedLinkIndex={setSelectedFileIndex}
                />}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Files")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    {!isDisplayAddFileBox && !isDisplayUpdateFileBox && <button
                        className="btn d-block w-25 mx-auto mt-2 mb-4 orange-btn"
                        onClick={() => setIsDisplayAddFileBox(true)}
                    >
                        {t("Add New File")}
                    </button>}
                    <section className="filters mb-3 bg-white border-3 border-info p-3 text-start">
                        <h5 className="section-name fw-bold text-center">{t("Filters")}: </h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <h6 className="me-2 fw-bold text-center">{t("Geometry Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Geometry Name")}
                                    onChange={(e) => setFilters({ ...filters, geometry: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-4">
                                <h6 className="me-2 fw-bold text-center">{t("File Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter File Name")}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-4">
                                <h6 className="me-2 fw-bold text-center">{t("File Type")}</h6>
                                <select
                                    className="form-control"
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                >
                                    <option value="">{t("All")}</option>
                                    {fileTypes.map((type) => <option key={type} value={type}>{t(type)}</option>)}
                                </select>
                            </div>
                        </div>
                        {!isGetFiles && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            onClick={() => filterFiles(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetFiles && <button className="btn btn-success d-block w-25 mx-auto mt-2 global-button" disabled>{t("Filtering")} ...</button>}
                    </section>
                    {allFilesInsideThePage.length > 0 && !isGetFiles && <section className="files-data-box p-3 data-box admin-dashbboard-data-box">
                        <table className="files-data-table mb-4 managment-table bg-white admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("File Name")}</th>
                                    <th>{t("File Type")}</th>
                                    <th>{t("Related Geometries")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allFilesInsideThePage.map((file, fileIndex) => (
                                    <tr key={file._id}>
                                        <td>{file.name[i18n.language]}</td>
                                        <td>{t(file.type)}</td>
                                        <td>
                                            {file?.geometries?.length > 0 ? <>
                                                {file.geometries.map((geometry, geometryIndex) => (
                                                    <h6 key={geometryIndex} className="bg-info p-2 mb-4 fw-bold">{geometry.name[i18n.language]}</h6>
                                                ))}
                                            </> : <h6 className="bg-danger p-2 mb-4 text-white">{t("No Geometries")}</h6>}
                                        </td>
                                        <td>{getDateFormated(file.createdAt)}</td>
                                        <td>
                                            {selectedFileIndex !== fileIndex && <>
                                                {!isDisplayUpdateFileBox && !isDisplayUpdateRelatedGeometriesBox && <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => handleDisplayUpdateFileBox(fileIndex)}
                                                >{t("Update")}</button>}
                                                <hr />
                                                {!isDisplayUpdateFileBox && !isDisplayUpdateRelatedGeometriesBox && <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => handleDisplayUpdateRelatedGeometriesBox(fileIndex)}
                                                >{t("Change Related Geometries")}</button>}
                                                <hr />
                                                {!isDisplayUpdateFileBox && !isDisplayUpdateRelatedGeometriesBox && <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(fileIndex, setSelectedFileIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>}
                                            </>}
                                            {waitMsg && selectedFileIndex === fileIndex && <button className="btn btn-info d-block mb-3 mx-auto global-button" disabled>{t(waitMsg)} ...</button>}
                                            {successMsg && selectedFileIndex === fileIndex && <button className="btn btn-success d-block mx-auto global-button" disabled>{t(successMsg)}</button>}
                                            {errorMsg && selectedFileIndex === fileIndex && <button className="btn btn-danger d-block mx-auto global-button" disabled>{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allFilesInsideThePage.length === 0 && !isGetFiles && <NotFoundError errorMsg={t("Sorry, Can't Find Any Files !!")} />}
                    {isGetFiles && <SectionLoader />}
                    {errorMsgOnGetFilesData && <NotFoundError errorMsg={errorMsgOnGetFilesData} />}
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
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}
