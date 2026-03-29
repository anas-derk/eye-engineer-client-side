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
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import SectionLoader from "@/components/SectionLoader";
import AddGeometry from "@/components/AddGeometry";
import UpdateGeometryParent from "@/components/UpdateGeometryParent";

export default function Links() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({});

    const [allLinksInsideThePage, setAllLinksInsideThePage] = useState([]);

    const [isGetLinks, setIsGetLinks] = useState(false);

    const [selectedLinkIndex, setSelectedLinkIndex] = useState(-1);

    const [selectedFileIndex, setSelectedFileIndex] = useState(-1);

    const [waitMsg, setWaitMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [waitChangeFileMsg, setWaitChangeFileMsg] = useState("");

    const [errorChangeFileMsg, setErrorChangeFileMsg] = useState("");

    const [successChangeFileMsg, setSuccessChangeFileMsg] = useState("");

    const [errorMsgOnGetLinksData, setErrorMsgOnGetLinksData] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        officeId: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const [isDisplayAddLinkBox, setIsDisplayAddLinkBox] = useState(false);

    const [isDisplayUpdateRelatedGeomertyBox, setIsDisplayUpdateRelatedGeomertyBox] = useState(false);

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
                            result = (await getAllGeometriesInsideThePage(1, pageSize, getFilteringString(tempFilters), "admin", i18n.language)).data;
                            setAllLinksInsideThePage(result.geometries);
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
            setIsGetLinks(true);
            setErrorMsgOnGetLinksData("");
            const newCurrentPage = currentPage - 1;
            setAllLinksInsideThePage((await getAllGeometriesInsideThePage(newCurrentPage, pageSize, getFilteringString(filters), i18n.language)).data.geometries);
            setCurrentPage(newCurrentPage);
            setIsGetLinks(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetLinks(false);
                setErrorMsgOnGetLinksData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getNextPage = async () => {
        try {
            setIsGetLinks(true);
            setErrorMsgOnGetLinksData("");
            const newCurrentPage = currentPage + 1;
            setAllLinksInsideThePage((await getAllGeometriesInsideThePage(newCurrentPage, pageSize, getFilteringString(filters), i18n.language)).data.geometries);
            setCurrentPage(newCurrentPage);
            setIsGetLinks(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetLinks(false);
                setErrorMsgOnGetLinksData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getSpecificPage = async (pageNumber) => {
        try {
            setIsGetLinks(true);
            setErrorMsgOnGetLinksData("");
            setAllLinksInsideThePage((await getAllGeometriesInsideThePage(pageNumber, pageSize, getFilteringString(filters), i18n.language)).data.geometries);
            setCurrentPage(pageNumber);
            setIsGetLinks(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetLinks(false);
                setErrorMsgOnGetLinksData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
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

    const filterLinks = async (filters) => {
        try {
            setIsGetLinks(true);
            setCurrentPage(1);
            const filteringString = getFilteringString(filters);
            const result = (await getAllGeometriesInsideThePage(1, pageSize, filteringString, "admin", i18n.language)).data;
            setAllLinksInsideThePage(result.geometries);
            setTotalPagesCount(Math.ceil(result.geometriesCount / pageSize));
            setIsGetLinks(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetLinks(false);
                setCurrentPage(-1);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const handleAddNewLink = async () => {
        try {
            setIsGetLinks(true);
            setCurrentPage(1);
            const filteringString = getFilteringString(filters);
            const result = (await getAllGeometriesInsideThePage(1, pageSize, filteringString, "admin", i18n.language)).data;
            setAllLinksInsideThePage(result.geometries);
            setTotalPagesCount(Math.ceil(result.geometriesCount / pageSize));
            setIsGetLinks(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetLinks(false);
                setCurrentPage(-1);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const changeLinkData = (linkIndex, fieldName, newValue, language) => {
        setSelectedFileIndex(-1);
        setSelectedLinkIndex(-1);
        if (language) {
            allLinksInsideThePage[linkIndex][fieldName][language] = newValue;
        } else {
            allLinksInsideThePage[linkIndex][fieldName] = newValue;
        }
    }

    const changeFile = async (linkIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "image",
                    value: allLinksInsideThePage[linkIndex].image,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isImage: {
                            msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Or WEBP Image File !!",
                        },
                    },
                }
            ]);
            setSelectedFileIndex(linkIndex);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitChangeFileMsg("Please Wait");
                let formData = new FormData();
                formData.append("geometryImage", allLinksInsideThePage[linkIndex].image);
                const result = (await axios.put(`${process.env.BASE_API_URL}/links/change-image/${allLinksInsideThePage[linkIndex]._id}?language=${i18n.language}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                if (!result.error) {
                    setWaitChangeFileMsg("");
                    setSuccessChangeFileMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(async () => {
                        setSuccessChangeFileMsg("");
                        setSelectedFileIndex(-1);
                        setAllLinksInsideThePage((await getAllGeometriesInsideThePage(currentPage, pageSize, getFilteringString(filters), "admin", i18n.language)).data.geometries);
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setWaitChangeFileMsg("");
                    setErrorChangeFileMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorChangeFileMsg("");
                        setSelectedFileIndex(-1);
                        clearTimeout(errorTimeout);
                    }, 1500);
                }
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setWaitChangeFileMsg("");
                setErrorChangeFileMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorChangeFileMsg("");
                    setSelectedFileIndex(-1);
                    clearTimeout(errorTimeout);
                }, 3000);
            }
        }
    }

    const updateLinkData = async (linkIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `titleIn${language.toUpperCase()}`,
                    value: allLinksInsideThePage[linkIndex].name[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
                {
                    name: "url",
                    value: allLinksInsideThePage[linkIndex].url,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isURL: {
                            msg: "Sorry, This URL Is Not Valid !!",
                        }
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedLinkIndex(linkIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/links/${allLinksInsideThePage[linkIndex]._id}?language=${i18n.language}`, {
                    title: allLinksInsideThePage[linkIndex].title,
                    url: allLinksInsideThePage[linkIndex].url,
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
                        setSelectedLinkIndex(-1);
                        clearTimeout(successTimeout);
                    }, 3000);
                } else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedLinkIndex(-1);
                        clearTimeout(errorTimeout);
                    }, 3000);
                }
            }
        }
        catch (err) {
            console.log(err)
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                setSelectedLinkIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    const handleDisplayUpdateRelatedGeometrytBox = (linkIndex) => {
        setSelectedLinkIndex(linkIndex);
        setIsDisplayUpdateRelatedGeomertyBox(true);
    }

    const handleUpdateRelatedGeometrytBox = async () => {
        try {
            setIsGetLinks(true);
            setCurrentPage(currentPage);
            const filteringString = getFilteringString(filters);
            const result = (await getAllGeometriesInsideThePage(currentPage, pageSize, filteringString, "admin", i18n.language)).data;
            setAllLinksInsideThePage(result.geometries);
            setTotalPagesCount(Math.ceil(result.geometriesCount / pageSize));
            setIsGetLinks(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetLinks(false);
                setCurrentPage(-1);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const deleteLink = async (linkIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedLinkIndex(linkIndex);
            let result = (await axios.delete(`${process.env.BASE_API_URL}/links/${allLinksInsideThePage[linkIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedLinkIndex(-1);
                    setAllLinksInsideThePage((await getAllGeometriesInsideThePage(currentPage, pageSize, getFilteringString(filters), "admin", i18n.language)).data.geometries);
                    setCurrentPage(currentPage);
                    clearTimeout(successTimeout);
                }, 3000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedLinkIndex(-1);
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
                setSelectedLinkIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className="links dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Links")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Links")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteLink(selectedLinkIndex)}
                    setSelectedElementIndex={setSelectedLinkIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayAddLinkBox && <AddGeometry
                    setIsDisplayAddLinkBox={setIsDisplayAddLinkBox}
                    handleAddNewLink={handleAddNewLink}
                />}
                {isDisplayUpdateRelatedGeomertyBox && <UpdateGeometryParent
                    setIsDisplayUpdateRelatedGeomertyBox={setIsDisplayUpdateRelatedGeomertyBox}
                    handleUpdateRelatedGeometrytBox={handleUpdateRelatedGeometrytBox}
                    currentParent={allLinksInsideThePage[selectedLinkIndex].parent}
                    geometryId={allLinksInsideThePage[selectedLinkIndex]._id}
                    setSelectedLinkIndex={setSelectedLinkIndex}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Links")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    {!isDisplayAddLinkBox && <button
                        className="btn d-block w-25 mx-auto mt-2 mb-4 orange-btn"
                        onClick={() => setIsDisplayAddLinkBox(true)}
                    >
                        {t("Add New Link")}
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
                        {!isGetLinks && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            onClick={() => filterLinks(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetLinks && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allLinksInsideThePage.length > 0 && !isGetLinks && <section className="geometries-data-box p-3 data-box admin-dashbboard-data-box">
                        <table className="geometries-data-table mb-4 managment-table bg-white admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th width="50">{t("Id")}</th>
                                    <th width="250">{t("Title")}</th>
                                    <th width="250">{t("Geometry")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th width="250">{t("Link")}</th>
                                    {/* <th>{t("Image")}</th> */}
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allLinksInsideThePage.map((link, linkIndex) => (
                                    <tr key={link._id}>
                                        <td>{link._id}</td>
                                        <td className="link-name-cell">
                                            <section className="link-name mb-4">
                                                {getLanguagesInfoList("name").map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={`${t("Please Enter New Geometry Name")} ${t(`In ${el.fullLanguageName}`)}`}
                                                            className={`form-control d-block mx-auto p-2 border-2 link-name-field ${formValidationErrors[el.formField] && linkIndex === selectedLinkIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={link.name[el.internationalLanguageCode]}
                                                            onChange={(e) => changeLinkData(linkIndex, "name", e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && linkIndex === selectedLinkIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td>
                                        <td className="link-geometry-cell">
                                            {link?.geometry?._id ? getLanguagesInfoList("geometry").map((language) => <h6 className="bg-info p-2 fw-bold mb-4">{t(`In ${language.fullLanguageName}`)} : {link.geometry.parent.name[language.internationalLanguageCode]}</h6>) : <h6 className="bg-danger p-2 mb-4 text-white">{t("No Geometry")}</h6>}
                                        </td>
                                        <td className="link-date-of-creation-cell">
                                            {getDateFormated(link.createdAt)}
                                        </td>
                                        <td>
                                            <section className="link-url mb-4">
                                                <input
                                                    type="text"
                                                    defaultValue={link?.url}
                                                    className={`form-control d-block mx-auto p-2 border-2 link-url-field ${formValidationErrors["url"] && linkIndex === selectedLinkIndex ? "border-danger mb-3" : "mb-4"}`}
                                                    placeholder={t("Please Enter Link")}
                                                    onChange={(e) => changeLinkData(linkIndex, "url", e.target.value)}
                                                />
                                                {formValidationErrors["url"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["url"])} />}
                                            </section>
                                        </td>
                                        {/* <td className="geomertry=file-cell">
                                            <section className="geomertry-file mb-4">
                                                <input
                                                    type="file"
                                                    className={`form-control d-block mx-auto p-2 border-2 brand-image-field ${formValidationErrors["image"] && linkIndex === selectedFileIndex ? "border-danger mb-3" : "mb-4"}`}
                                                    onChange={(e) => changeLinkData(linkIndex, "image", e.target.files[0])}
                                                    accept=".png, .jpg, .webp"
                                                />
                                                {formValidationErrors["image"] && selectedFileIndex === linkIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                                            </section>
                                            {(selectedFileIndex !== linkIndex && selectedLinkIndex !== linkIndex) &&
                                                <button
                                                    className="btn btn-success d-block mb-3 w-50 mx-auto global-button"
                                                    onClick={() => changeFile(linkIndex)}
                                                >{t("Change Image")}</button>
                                            }
                                            {waitChangeFileMsg && selectedFileIndex === linkIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitChangeFileMsg)}</button>}
                                            {successChangeFileMsg && selectedFileIndex === linkIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successChangeFileMsg)}</button>}
                                            {errorChangeFileMsg && selectedFileIndex === linkIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorChangeFileMsg)}</button>}
                                        </td> */}
                                        <td>
                                            {selectedLinkIndex !== linkIndex && <>
                                                <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => updateLinkData(linkIndex)}
                                                >{t("Update")}
                                                </button>
                                                <hr />
                                                {!isDisplayUpdateRelatedGeomertyBox && <button
                                                    className="btn btn-success d-block mb-3 mx-auto global-button"
                                                    onClick={() => handleDisplayUpdateRelatedGeometrytBox(linkIndex)}
                                                >{t("Change Geometry")}</button>}
                                                <hr />
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(linkIndex, setSelectedLinkIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                            </>}
                                            {waitMsg && selectedLinkIndex === linkIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedLinkIndex === linkIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedLinkIndex === linkIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allLinksInsideThePage.length === 0 && !isGetLinks && <NotFoundError errorMsg={t("Sorry, Can't Find Any Links !!")} />}
                    {isGetLinks && <SectionLoader />}
                    {errorMsgOnGetLinksData && <NotFoundError errorMsg={errorMsgOnGetLinksData} />}
                    {totalPagesCount > 1 && !isGetLinks &&
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