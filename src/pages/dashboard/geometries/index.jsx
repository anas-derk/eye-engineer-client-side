import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getLanguagesInfoList, getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage, getAllGeometriesInsideThePage, getDateFormated } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import ConfirmDelete from "@/components/ConfirmDelete";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import PaginationBar from "@/components/PaginationBar";
import Link from "next/link";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import SectionLoader from "@/components/SectionLoader";
import AddGeometry from "@/components/AddGeometry";

export default function Geometries() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [allGeometriesInsideThePage, setAllGeometriesInsideThePage] = useState([]);

    const [isGetGeometries, setIsGetGeometries] = useState(false);

    const [selectedGeometryIndex, setSelectedGeometryIndex] = useState(-1);

    const [waitMsg, setWaitMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetGeometriesData, setErrorMsgOnGetGeometriesData] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        officeId: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const [isDisplayAddGeometryBox, setIsDisplayAddGeometryBox] = useState(false);

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
                            const tempFilters = { officeId: adminDetails.officeId };
                            setFilters(tempFilters);
                            result = (await getAllGeometriesInsideThePage(1, pageSize, getFilteringString(tempFilters), "admin", i18n.language)).data;
                            setAllGeometriesInsideThePage(result.geometries);
                            setTotalPagesCount(Math.ceil(result.geometriesCount / pageSize));
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

    const getPreviousPage = async () => {
        try {
            setIsGetGeometries(true);
            setErrorMsgOnGetGeometriesData("");
            const newCurrentPage = currentPage - 1;
            setAllGeometriesInsideThePage((await getAllGeometriesInsideThePage(newCurrentPage, pageSize, getFilteringString(filters), i18n.language)).data.offices);
            setCurrentPage(newCurrentPage);
            setIsGetGeometries(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetGeometries(false);
                setErrorMsgOnGetGeometriesData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getNextPage = async () => {
        try {
            setIsGetGeometries(true);
            setErrorMsgOnGetGeometriesData("");
            const newCurrentPage = currentPage + 1;
            setAllGeometriesInsideThePage((await getAllGeometriesInsideThePage(newCurrentPage, pageSize, getFilteringString(filters), i18n.language)).data.offices);
            setCurrentPage(newCurrentPage);
            setIsGetGeometries(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetGeometries(false);
                setErrorMsgOnGetGeometriesData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getSpecificPage = async (pageNumber) => {
        try {
            setIsGetGeometries(true);
            setErrorMsgOnGetGeometriesData("");
            setAllGeometriesInsideThePage((await getAllGeometriesInsideThePage(pageNumber, pageSize, getFilteringString(filters), i18n.language)).data.offices);
            setCurrentPage(pageNumber);
            setIsGetGeometries(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetGeometries(false);
                setErrorMsgOnGetGeometriesData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getFilteringString = (filters) => {
        let filteringString = "";
        if (filters.officeId) filteringString += `officeId=${filters.officeId}&`;
        if (filters.name) filteringString += `name=${filters.name}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const filterGeometries = async (filters) => {
        try {
            setIsGetGeometries(true);
            setCurrentPage(1);
            const filteringString = getFilteringString(filters);
            const result = (await getAllGeometriesInsideThePage(1, pageSize, filteringString, i18n.language)).data;
            setAllGeometriesInsideThePage(result.offices);
            setTotalPagesCount(Math.ceil(result.officesCount / pageSize));
            setIsGetGeometries(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetGeometries(false);
                setCurrentPage(-1);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const changeGeometryData = (geometryIndex, fieldName, newValue, language) => {
        setSelectedGeometryIndex(-1);
        if (language) {
            allGeometriesInsideThePage[geometryIndex][fieldName][language] = newValue;
        } else {
            allGeometriesInsideThePage[geometryIndex][fieldName] = newValue;
        }
    }

    const updateGeometryData = async (geometryIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `nameIn${language.toUpperCase()}`,
                    value: allGeometriesInsideThePage[geometryIndex].name[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
                {
                    name: "email",
                    value: allGeometriesInsideThePage[geometryIndex].email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, This Email Is Not Valid !!",
                        }
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedGeometryIndex(geometryIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/offices/update-geometry-info/${allGeometriesInsideThePage[geometryIndex]._id}?language=${i18n.language}`, {
                    name: allGeometriesInsideThePage[geometryIndex].name,
                    email: allGeometriesInsideThePage[geometryIndex].email,
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
                        setSelectedGeometryIndex(-1);
                        clearTimeout(successTimeout);
                    }, 3000);
                } else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedGeometryIndex(-1);
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
                setSelectedGeometryIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    const deleteGeometry = async (geometryIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedGeometryIndex(geometryIndex);
            let result = (await axios.delete(`${process.env.BASE_API_URL}/offices/delete-geometry/${allGeometriesInsideThePage[geometryIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedGeometryIndex(-1);
                    setAllGeometriesInsideThePage((await getAllGeometriesInsideThePage(currentPage, pageSize, getFilteringString(filters), i18n.language)).data.offices);
                    setCurrentPage(currentPage);
                    clearTimeout(successTimeout);
                }, 3000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedGeometryIndex(-1);
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
                setSelectedGeometryIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className="geometries dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Geometries")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Geometries")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteGeometry(selectedGeometryIndex)}
                    setSelectedElementIndex={setSelectedGeometryIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayAddGeometryBox && <AddGeometry
                    setIsDisplayAddGeometryBox={setIsDisplayAddGeometryBox}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Geometries")}</h1>
                    <DashboardSideBar isWebsiteOwner={true} isEngineer={true} />
                    {!isDisplayAddGeometryBox && <button
                        className="btn d-block w-25 mx-auto mt-2 mb-4 orange-btn"
                        onClick={() => setIsDisplayAddGeometryBox(true)}
                    >
                        {t("Add New Geometry")}
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
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetGeometries && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            onClick={() => filterGeometries(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetGeometries && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allGeometriesInsideThePage.length > 0 && !isGetGeometries && <section className="geometries-data-box p-3 data-box admin-dashbboard-data-box">
                        <table className="geometries-data-table mb-4 managment-table bg-white admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th width="50">{t("Id")}</th>
                                    <th width="250">{t("Name")}</th>
                                    <th width="250">{t("Parent")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allGeometriesInsideThePage.map((geometry, geometryIndex) => (
                                    <tr key={geometry._id}>
                                        <td>{geometry._id}</td>
                                        <td className="geometry-name-cell">
                                            <section className="geometry-name mb-4">
                                                {getLanguagesInfoList("name").map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={`${t("Please Enter New Geometry Name")} ${t(`In ${el.fullLanguageName}`)}`}
                                                            className={`form-control d-block mx-auto p-2 border-2 geometry-name-field ${formValidationErrors[el.formField] && geometryIndex === selectedGeometryIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={geometry.name[el.internationalLanguageCode]}
                                                            onChange={(e) => changeGeometryData(geometryIndex, "name", e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && geometryIndex === selectedGeometryIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td>
                                        <td className="geometry-parent-cell">
                                            {category.parent?._id ? getLanguagesInfoList("parent").map((language) => <h6 className="bg-info p-2 fw-bold mb-4">In {language.fullLanguageName} : {geometry.parent.name[language.internationalLanguageCode]}</h6>) : <h6 className="bg-danger p-2 mb-4 text-white">No Parent</h6>}
                                        </td>
                                        <td className="geometry-date-of-creation-cell">
                                            {getDateFormated(geometry.dateOfCreation)}
                                        </td>
                                        <td>
                                            {selectedGeometryIndex !== geometryIndex && <>
                                                <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => updateGeometryData(geometryIndex)}
                                                >{t("Update")}
                                                </button>
                                                <hr />
                                                <Link
                                                    href={`/geometries/update-parent/${geometry._id}`}
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                >{t("Change Parent")}</Link>
                                                <hr />
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(geometryIndex, setSelectedGeometryIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                            </>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allGeometriesInsideThePage.length === 0 && !isGetGeometries && <NotFoundError errorMsg={t("Sorry, Can't Find Any Geometries !!")} />}
                    {isGetGeometries && <SectionLoader />}
                    {errorMsgOnGetGeometriesData && <NotFoundError errorMsg={errorMsgOnGetGeometriesData} />}
                    {totalPagesCount > 1 && !isGetGeometries &&
                        <PaginationBar
                            totalPagesCount={totalPagesCount}
                            currentPage={currentPage}
                            getPreviousPage={getPreviousPage}
                            getNextPage={getNextPage}
                            getSpecificPage={getSpecificPage}
                            paginationButtonTextColor={"#000"}
                            paginationButtonBackgroundColor={"#FFF"}
                            activePaginationButtonColor={"#000"}
                            activePaginationButtonBackgroundColor={"var(--main-color-two)"}
                            isDisplayCurrentPageNumberAndCountOfPages={false}
                            isDisplayNavigateToSpecificPageForm={false}
                        />
                    }
                </div>
                {/* End Page Content */}
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}