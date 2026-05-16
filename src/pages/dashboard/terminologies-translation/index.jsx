import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getLanguagesInfoList, getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage, getDateFormated, getAllTerminologiesInsideThePage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import ConfirmDelete from "@/components/ConfirmDelete";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import PaginationBar from "@/components/PaginationBar";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import SectionLoader from "@/components/SectionLoader";
import AddTerminology from "@/components/AddTerminology";
import UpdateGeometries from "@/components/UpdateGeometries";

export default function Terminologies() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const [allTerminologiesInsideThePage, setAllTerminologiesInsideThePage] = useState([]);
    const [isGetTerminologies, setIsGetTerminologies] = useState(false);
    const [selectedTerminologyIndex, setSelectedTerminologyIndex] = useState(-1);
    const [waitMsg, setWaitMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsgOnGetTerminologiesData, setErrorMsgOnGetTerminologiesData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesCount, setTotalPagesCount] = useState(0);
    const [filters, setFilters] = useState({
        officeId: "",
        geometry: "",
        term: ""
    });
    const [formValidationErrors, setFormValidationErrors] = useState({});
    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);
    const [isDisplayAddTerminologyBox, setIsDisplayAddTerminologyBox] = useState(false);
    const [isDisplayUpdateRelatedGeometriesBox, setIsDisplayUpdateRelatedGeometriesBox] = useState(false);

    const router = useRouter();
    const pageSize = 5;
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
                            result = (await getAllTerminologiesInsideThePage(1, pageSize, getFilteringString(tempFilters), "admin", i18n.language)).data;
                            setAllTerminologiesInsideThePage(result.terminologies);
                            setTotalPagesCount(Math.ceil(result.terminologiesCount / pageSize));
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
        if (filters.term) filteringString += `term=${filters.term}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const getTerminologiesPage = async (pageNumber) => {
        try {
            setIsGetTerminologies(true);
            setErrorMsgOnGetTerminologiesData("");
            const result = (await getAllTerminologiesInsideThePage(pageNumber, pageSize, getFilteringString(filters), "admin", i18n.language)).data;
            setAllTerminologiesInsideThePage(result.terminologies);
            setTotalPagesCount(Math.ceil(result.terminologiesCount / pageSize));
            setCurrentPage(pageNumber);
            setIsGetTerminologies(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetTerminologies(false);
                setErrorMsgOnGetTerminologiesData(err?.message === "Network Error" ? "Network Error When Get Terminologies Data" : "Sorry, Someting Went Wrong When Get Terminologies Data, Please Repeate The Process !!");
            }
        }
    }

    const filterTerminologies = async (filters) => {
        try {
            setIsGetTerminologies(true);
            setCurrentPage(1);
            const result = (await getAllTerminologiesInsideThePage(1, pageSize, getFilteringString(filters), "admin", i18n.language)).data;
            setAllTerminologiesInsideThePage(result.terminologies);
            setTotalPagesCount(Math.ceil(result.terminologiesCount / pageSize));
            setIsGetTerminologies(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetTerminologies(false);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const handleAddNewTerminology = async () => {
        await getTerminologiesPage(1);
    }

    const handleDisplayUpdateRelatedGeometriesBox = (terminologyIndex) => {
        setSelectedTerminologyIndex(terminologyIndex);
        setIsDisplayUpdateRelatedGeometriesBox(true);
    }

    const handleUpdateRelatedGeometriestBox = async () => {
        await getTerminologiesPage(currentPage);
    }

    const changeTerminologyData = (terminologyIndex, newValue, language) => {
        setSelectedTerminologyIndex(-1);
        const terminologiesTemp = allTerminologiesInsideThePage.map((terminology) => terminology);
        terminologiesTemp[terminologyIndex].term[language] = newValue;
        setAllTerminologiesInsideThePage(terminologiesTemp);
    }

    const updateTerminologyData = async (terminologyIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `termIn${language.toUpperCase()}`,
                    value: allTerminologiesInsideThePage[terminologyIndex].term[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedTerminologyIndex(terminologyIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/terminologies/${allTerminologiesInsideThePage[terminologyIndex]._id}?language=${i18n.language}`, {
                    term: allTerminologiesInsideThePage[terminologyIndex].term,
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
                        setSelectedTerminologyIndex(-1);
                        clearTimeout(successTimeout);
                    }, 3000);
                } else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedTerminologyIndex(-1);
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
                setSelectedTerminologyIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    const deleteTerminology = async (terminologyIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedTerminologyIndex(terminologyIndex);
            let result = (await axios.delete(`${process.env.BASE_API_URL}/terminologies/${allTerminologiesInsideThePage[terminologyIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedTerminologyIndex(-1);
                    await getTerminologiesPage(currentPage);
                    clearTimeout(successTimeout);
                }, 3000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedTerminologyIndex(-1);
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
                setSelectedTerminologyIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className="terminologies dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Terminologies")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Terminologies")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteTerminology(selectedTerminologyIndex)}
                    setSelectedElementIndex={setSelectedTerminologyIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayAddTerminologyBox && <AddTerminology
                    setIsDisplayAddTerminologyBox={setIsDisplayAddTerminologyBox}
                    handleAddNewTerminology={handleAddNewTerminology}
                />}
                {isDisplayUpdateRelatedGeometriesBox && selectedTerminologyIndex > -1 && <UpdateGeometries
                    setIsDisplayUpdateRelatedGeometriesBox={setIsDisplayUpdateRelatedGeometriesBox}
                    handleUpdateRelatedGeometriestBox={handleUpdateRelatedGeometriestBox}
                    currentGeometries={allTerminologiesInsideThePage[selectedTerminologyIndex].geometries}
                    endpointName="terminologies"
                    itemId={allTerminologiesInsideThePage[selectedTerminologyIndex]._id}
                    setSelectedLinkIndex={setSelectedTerminologyIndex}
                />}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Terminologies")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    {!isDisplayAddTerminologyBox && <button
                        className="btn d-block w-25 mx-auto mt-2 mb-4 orange-btn"
                        onClick={() => setIsDisplayAddTerminologyBox(true)}
                    >
                        {t("Add New Terminology")}
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
                                <h6 className="me-2 fw-bold text-center">{t("Terminology")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Terminology")}
                                    onChange={(e) => setFilters({ ...filters, term: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetTerminologies && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            onClick={() => filterTerminologies(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetTerminologies && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allTerminologiesInsideThePage.length > 0 && !isGetTerminologies && <section className="terminologies-data-box p-3 data-box admin-dashbboard-data-box">
                        <table className="terminologies-data-table mb-4 managment-table bg-white admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th width="350">{t("Terminology")}</th>
                                    <th width="250">{t("Related Geometries")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTerminologiesInsideThePage.map((terminology, terminologyIndex) => (
                                    <tr key={terminology._id}>
                                        <td>
                                            {getLanguagesInfoList("term").map((el) => (
                                                <div key={el.fullLanguageName}>
                                                    <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                    <input
                                                        type="text"
                                                        placeholder={`${t("Please Enter Terminology")} ${t(`In ${el.fullLanguageName}`)}`}
                                                        className={`form-control d-block mx-auto p-2 border-2 ${formValidationErrors[el.formField] && terminologyIndex === selectedTerminologyIndex ? "border-danger mb-3" : "mb-4"}`}
                                                        defaultValue={terminology.term[el.internationalLanguageCode]}
                                                        onChange={(e) => changeTerminologyData(terminologyIndex, e.target.value.trim(), el.internationalLanguageCode)}
                                                    />
                                                    {formValidationErrors[el.formField] && terminologyIndex === selectedTerminologyIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {terminology?.geometries?.length > 0 ? <>
                                                {terminology.geometries.map((geometry, geometryIndex) => (
                                                    <h6 key={geometryIndex} className="bg-info p-2 mb-4 fw-bold">{geometry.name[i18n.language]}</h6>
                                                ))}
                                            </> : <h6 className="bg-danger p-2 mb-4 text-white">{t("No Geometries")}</h6>}
                                        </td>
                                        <td>
                                            {getDateFormated(terminology.createdAt)}
                                        </td>
                                        <td>
                                            {selectedTerminologyIndex !== terminologyIndex && <>
                                                <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => updateTerminologyData(terminologyIndex)}
                                                >{t("Update")}</button>
                                                <hr />
                                                {!isDisplayUpdateRelatedGeometriesBox && <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => handleDisplayUpdateRelatedGeometriesBox(terminologyIndex)}
                                                >{t("Change Related Geometries")}</button>}
                                                <hr />
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(terminologyIndex, setSelectedTerminologyIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                            </>}
                                            {waitMsg && selectedTerminologyIndex === terminologyIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedTerminologyIndex === terminologyIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedTerminologyIndex === terminologyIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allTerminologiesInsideThePage.length === 0 && !isGetTerminologies && <NotFoundError errorMsg={t("Sorry, Can't Find Any Terminologies !!")} />}
                    {isGetTerminologies && <SectionLoader />}
                    {errorMsgOnGetTerminologiesData && <NotFoundError errorMsg={errorMsgOnGetTerminologiesData} />}
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
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}
