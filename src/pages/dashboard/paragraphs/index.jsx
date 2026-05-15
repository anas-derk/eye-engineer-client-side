import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getLanguagesInfoList, getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage, getAllParagraphsInsideThePage, getDateFormated } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import ConfirmDelete from "@/components/ConfirmDelete";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import PaginationBar from "@/components/PaginationBar";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import SectionLoader from "@/components/SectionLoader";
import AddParagraph from "@/components/AddParagraph";
import UpdateGeometries from "@/components/UpdateGeometries";

export default function Paragraphs() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const [allParagraphsInsideThePage, setAllParagraphsInsideThePage] = useState([]);
    const [isGetParagraphs, setIsGetParagraphs] = useState(false);
    const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(-1);
    const [waitMsg, setWaitMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsgOnGetParagraphsData, setErrorMsgOnGetParagraphsData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesCount, setTotalPagesCount] = useState(0);
    const [filters, setFilters] = useState({
        officeId: "",
        geometry: "",
        title: ""
    });
    const [formValidationErrors, setFormValidationErrors] = useState({});
    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);
    const [isDisplayAddParagraphBox, setIsDisplayAddParagraphBox] = useState(false);
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
                            const tempFilters = { officeId: adminDetails.officeId };
                            setFilters(tempFilters);
                            result = (await getAllParagraphsInsideThePage(1, pageSize, getFilteringString(tempFilters), "admin", i18n.language)).data;
                            setAllParagraphsInsideThePage(result.paragraphs);
                            setTotalPagesCount(Math.ceil(result.paragraphsCount / pageSize));
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
        if (filters.officeId) filteringString += `officeId=${filters.officeId}&`;
        if (filters.geometry) filteringString += `geometry=${filters.geometry}&`;
        if (filters.title) filteringString += `title=${filters.title}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const getParagraphsPage = async (pageNumber) => {
        try {
            setIsGetParagraphs(true);
            setErrorMsgOnGetParagraphsData("");
            const result = (await getAllParagraphsInsideThePage(pageNumber, pageSize, getFilteringString(filters), "admin", i18n.language)).data;
            setAllParagraphsInsideThePage(result.paragraphs);
            setTotalPagesCount(Math.ceil(result.paragraphsCount / pageSize));
            setCurrentPage(pageNumber);
            setIsGetParagraphs(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetParagraphs(false);
                setErrorMsgOnGetParagraphsData(err?.message === "Network Error" ? "Network Error When Get Paragraphs Data" : "Sorry, Someting Went Wrong When Get Paragraphs Data, Please Repeate The Process !!");
            }
        }
    }

    const filterParagraphs = async (filters) => {
        try {
            setIsGetParagraphs(true);
            setCurrentPage(1);
            const result = (await getAllParagraphsInsideThePage(1, pageSize, getFilteringString(filters), "admin", i18n.language)).data;
            setAllParagraphsInsideThePage(result.paragraphs);
            setTotalPagesCount(Math.ceil(result.paragraphsCount / pageSize));
            setIsGetParagraphs(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetParagraphs(false);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const handleAddNewParagraph = async () => {
        await getParagraphsPage(1);
    }

    const handleDisplayUpdateRelatedGeometriesBox = (paragraphIndex) => {
        setSelectedParagraphIndex(paragraphIndex);
        setIsDisplayUpdateRelatedGeometriesBox(true);
    }

    const handleUpdateRelatedGeometriestBox = async () => {
        await getParagraphsPage(currentPage);
    }

    const changeParagraphData = (paragraphIndex, fieldName, newValue, language) => {
        setSelectedParagraphIndex(-1);
        const paragraphsTemp = allParagraphsInsideThePage.map((paragraph) => paragraph);
        paragraphsTemp[paragraphIndex][fieldName][language] = newValue;
        setAllParagraphsInsideThePage(paragraphsTemp);
    }

    const updateParagraphData = async (paragraphIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `titleIn${language.toUpperCase()}`,
                    value: allParagraphsInsideThePage[paragraphIndex].title[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `contentIn${language.toUpperCase()}`,
                    value: allParagraphsInsideThePage[paragraphIndex].content[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedParagraphIndex(paragraphIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/paragraphs/${allParagraphsInsideThePage[paragraphIndex]._id}?language=${i18n.language}`, {
                    title: allParagraphsInsideThePage[paragraphIndex].title,
                    content: allParagraphsInsideThePage[paragraphIndex].content,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg("");
                        setSelectedParagraphIndex(-1);
                        clearTimeout(successTimeout);
                    }, 3000);
                } else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedParagraphIndex(-1);
                        clearTimeout(errorTimeout);
                    }, 3000);
                }
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
                setSelectedParagraphIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    const deleteParagraph = async (paragraphIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedParagraphIndex(paragraphIndex);
            let result = (await axios.delete(`${process.env.BASE_API_URL}/paragraphs/${allParagraphsInsideThePage[paragraphIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedParagraphIndex(-1);
                    await getParagraphsPage(currentPage);
                    clearTimeout(successTimeout);
                }, 3000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedParagraphIndex(-1);
                    clearTimeout(errorTimeout);
                }, 3000);
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
                setSelectedParagraphIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className="paragraphs dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Paragraphs")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Paragraphs")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteParagraph(selectedParagraphIndex)}
                    setSelectedElementIndex={setSelectedParagraphIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayAddParagraphBox && <AddParagraph
                    setIsDisplayAddParagraphBox={setIsDisplayAddParagraphBox}
                    handleAddNewParagraph={handleAddNewParagraph}
                />}
                {isDisplayUpdateRelatedGeometriesBox && selectedParagraphIndex > -1 && <UpdateGeometries
                    setIsDisplayUpdateRelatedGeometriesBox={setIsDisplayUpdateRelatedGeometriesBox}
                    handleUpdateRelatedGeometriestBox={handleUpdateRelatedGeometriestBox}
                    currentGeometries={allParagraphsInsideThePage[selectedParagraphIndex].geometries}
                    endpointName="paragraphs"
                    itemId={allParagraphsInsideThePage[selectedParagraphIndex]._id}
                    setSelectedLinkIndex={setSelectedParagraphIndex}
                />}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Paragraphs")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    {!isDisplayAddParagraphBox && <button
                        className="btn d-block w-25 mx-auto mt-2 mb-4 orange-btn"
                        onClick={() => setIsDisplayAddParagraphBox(true)}
                    >
                        {t("Add New Paragraph")}
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
                                <h6 className="me-2 fw-bold text-center">{t("Title")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Title")}
                                    onChange={(e) => setFilters({ ...filters, title: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetParagraphs && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            onClick={() => filterParagraphs(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetParagraphs && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allParagraphsInsideThePage.length > 0 && !isGetParagraphs && <section className="paragraphs-data-box p-3 data-box admin-dashbboard-data-box">
                        <table className="paragraphs-data-table mb-4 managment-table bg-white admin-dashbboard-data-table products-table">
                            <thead>
                                <tr>
                                    <th width="250">{t("Article Title")}</th>
                                    <th width="250">{t("Related Geometries")}</th>
                                    <th width="400">{t("Content")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allParagraphsInsideThePage.map((paragraph, paragraphIndex) => (
                                    <tr key={paragraph._id}>
                                        <td>
                                            {getLanguagesInfoList("title").map((el) => (
                                                <div key={el.fullLanguageName}>
                                                    <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                    <input
                                                        type="text"
                                                        placeholder={`${t("Please Enter Article Title")} ${t(`In ${el.fullLanguageName}`)}`}
                                                        className={`form-control d-block mx-auto p-2 border-2 ${formValidationErrors[el.formField] && paragraphIndex === selectedParagraphIndex ? "border-danger mb-3" : "mb-4"}`}
                                                        defaultValue={paragraph.title[el.internationalLanguageCode]}
                                                        onChange={(e) => changeParagraphData(paragraphIndex, "title", e.target.value.trim(), el.internationalLanguageCode)}
                                                    />
                                                    {formValidationErrors[el.formField] && paragraphIndex === selectedParagraphIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {paragraph?.geometries?.length > 0 ? <>
                                                {paragraph.geometries.map((geometry, geometryIndex) => (
                                                    <h6 key={geometryIndex} className="bg-info p-2 mb-4 fw-bold">{geometry.name[i18n.language]}</h6>
                                                ))}
                                            </> : <h6 className="bg-danger p-2 mb-4 text-white">{t("No Geometries")}</h6>}
                                        </td>
                                        <td>
                                            {getLanguagesInfoList("content").map((el) => (
                                                <div key={el.fullLanguageName}>
                                                    <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                    <textarea
                                                        placeholder={`${t("Please Enter Article Content")} ${t(`In ${el.fullLanguageName}`)}`}
                                                        className={`form-control d-block mx-auto p-2 border-2 ${formValidationErrors[el.formField] && paragraphIndex === selectedParagraphIndex ? "border-danger mb-3" : "mb-4"}`}
                                                        defaultValue={paragraph.content[el.internationalLanguageCode]}
                                                        onChange={(e) => changeParagraphData(paragraphIndex, "content", e.target.value.trim(), el.internationalLanguageCode)}
                                                    ></textarea>
                                                    {formValidationErrors[el.formField] && paragraphIndex === selectedParagraphIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {getDateFormated(paragraph.createdAt)}
                                        </td>
                                        <td>
                                            {selectedParagraphIndex !== paragraphIndex && <>
                                                <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => updateParagraphData(paragraphIndex)}
                                                >{t("Update")}</button>
                                                <hr />
                                                {!isDisplayUpdateRelatedGeometriesBox && <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => handleDisplayUpdateRelatedGeometriesBox(paragraphIndex)}
                                                >{t("Change Related Geometries")}</button>}
                                                <hr />
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(paragraphIndex, setSelectedParagraphIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                            </>}
                                            {waitMsg && selectedParagraphIndex === paragraphIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedParagraphIndex === paragraphIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedParagraphIndex === paragraphIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allParagraphsInsideThePage.length === 0 && !isGetParagraphs && <NotFoundError errorMsg={t("Sorry, Can't Find Any Paragraphs !!")} />}
                    {isGetParagraphs && <SectionLoader />}
                    {errorMsgOnGetParagraphsData && <NotFoundError errorMsg={errorMsgOnGetParagraphsData} />}
                    {totalPagesCount > 1 && !isGetParagraphs &&
                        <PaginationBar
                            totalPagesCount={totalPagesCount}
                            currentPage={currentPage}
                            getPreviousPage={() => getParagraphsPage(currentPage - 1)}
                            getNextPage={() => getParagraphsPage(currentPage + 1)}
                            getSpecificPage={getParagraphsPage}
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
