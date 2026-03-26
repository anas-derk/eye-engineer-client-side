import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getDateFormated, getLanguagesInfoList, getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import ConfirmDelete from "@/components/ConfirmDelete";
import AddAd from "@/components/AddAd";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";

export default function Ads() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({});

    const [advertisementType, setAdvertisementType] = useState("text");

    const [allAds, setAllAds] = useState([]);

    const [isGetAds, setIsGetAds] = useState(false);

    const [selectedAdIndex, setSelectedAdIndex] = useState(-1);

    const [selectedAdImageIndex, setSelectedAdImageIndex] = useState(-1);

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [waitChangeAdImageMsg, setWaitChangeAdImageMsg] = useState("");

    const [errorChangeAdImageMsg, setErrorChangeAdImageMsg] = useState("");

    const [successChangeAdImageMsg, setSuccessChangeAdImageMsg] = useState("");

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const [isDisplayAddAdBox, setIsDisplayAddAdBox] = useState(false);

    const [filters, setFilters] = useState({
        type: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const adTypes = ["text", "image"];

    const router = useRouter();

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (!result.error) {
                        const adminDetails = result.data;
                        if (adminDetails.isWebsiteOwner) {
                            setUserInfo(result.data);
                            let tempFilters = { type: advertisementType };
                            setAllAds((await getAllAds(getFilteringString(tempFilters))).data);
                            setFilters(tempFilters);
                            setIsLoadingPage(false);
                        }
                        else {
                            await router.replace("/dashboard");
                        }
                    } else {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
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
        } else {
            router.replace("/login");
        }
    }, []);

    const getAllAds = async (filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/ads/all-ads?language=${i18n.language}&${filters ? filters : ""}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
        }
        catch (err) {
            throw err;
        }
    }

    const getFilteringString = (filters) => {
        let filteringString = "";
        if (filters.type) filteringString += `type=${filters.type}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const filterAds = async (filters) => {
        try {
            setIsGetAds(true);
            const result = (await getAllAds(getFilteringString(filters))).data;
            setAllAds(result);
            setIsGetAds(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetAds(false);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const changeAdData = (adIndex, fieldName, newValue, language) => {
        setSelectedAdImageIndex(-1);
        setSelectedAdIndex(-1);
        if (language) {
            allAds[adIndex][fieldName][language] = newValue;
        } else {
            allAds[adIndex][fieldName] = newValue;
        }
    }

    const updateAd = async (adIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `contentIn${language.toUpperCase()}`,
                    value: allAds[adIndex].content[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                }))
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedAdIndex(adIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/ads/update-content/${allAds[adIndex]._id}?language=${i18n.language}`, {
                    content: allAds[adIndex].content,
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
                        setSelectedAdIndex(-1);
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedAdIndex(-1);
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
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedAdIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const changeAdImage = async (adIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "image",
                    value: allAds[adIndex].image,
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
            setSelectedAdImageIndex(adIndex);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitChangeAdImageMsg("Please Wait");
                let formData = new FormData();
                formData.append("adImage", allAds[adIndex].image);
                const result = (await axios.put(`${process.env.BASE_API_URL}/ads/change-image/${allAds[adIndex]._id}?language=${i18n.language}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                if (!result.error) {
                    setWaitChangeAdImageMsg("");
                    setSuccessChangeAdImageMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(async () => {
                        setSuccessChangeAdImageMsg("");
                        setSelectedAdImageIndex(-1);
                        allAds[adIndex].imagePath = result.data.newAdImagePath;
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setWaitChangeAdImageMsg("");
                    setErrorChangeAdImageMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorChangeAdImageMsg("");
                        setSelectedAdImageIndex(-1);
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
                setWaitChangeAdImageMsg("");
                setErrorChangeAdImageMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorChangeAdImageMsg("");
                    setSelectedAdImageIndex(-1);
                    clearTimeout(errorTimeout);
                }, 3000);
            }
        }
    }

    const deleteAd = async (adIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedAdIndex(adIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/ads/${allAds[adIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedAdIndex(-1);
                    setAllAds(allAds.filter((_, index) => index !== adIndex));
                    clearTimeout(successTimeout);
                }, 1000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedAdIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1000);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedAdIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="ads dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Ads")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Ads")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteAd(selectedAdIndex)}
                    setSelectedElementIndex={setSelectedAdIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayAddAdBox && <AddAd
                    setIsDisplayAddAdBox={setIsDisplayAddAdBox}
                    allAds={allAds}
                    setAllAds={setAllAds}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Ads")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    {!isDisplayAddAdBox && <button
                        className="btn d-block w-25 mx-auto mt-2 mb-4 orange-btn"
                        onClick={() => setIsDisplayAddAdBox(true)}
                    >
                        {t("Add New Ads")}
                    </button>}
                    <section className="filters mb-4 bg-white border-3 border-info p-3 text-start">
                        <h5 className="fw-bold text-center">{t("Filters")}: </h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h6 className="me-2 fw-bold text-center">{t("Type")}</h6>
                                <select
                                    className={`select-advertisement-type form-select${i18n.language === "ar" ? " ar" : ""} mb-4`}
                                    onChange={(e) => { setAdvertisementType(e.target.value); setFilters({ ...filters, type: e.target.value }) }}
                                    value={advertisementType}
                                >
                                    <option value="" hidden>{t("Please Select Advertisement Type")}</option>
                                    {adTypes.map((type) => (
                                        <option value={type}>{t(type.replace(type[0], type[0].toUpperCase()))}</option>
                                    ))}
                                </select>
                                {formValidationErrors["type"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["type"])} />}
                            </div>
                        </div>
                        {!isGetAds && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            onClick={() => filterAds(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetAds && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allAds.length > 0 && <section className="ads-box w-100 admin-dashbboard-data-box">
                        <table className="ads-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    {advertisementType === "text" ? <th>{t("Content")}</th> : <th>{t("Image")}</th>}
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allAds.map((ad, adIndex) => (
                                    <tr key={ad._id}>
                                        <td className="ad-id-cell">
                                            {ad._id}
                                        </td>
                                        {ad.type === "text" ? <td className="ad-content-cell">
                                            <section className="ad-content mb-4">
                                                {getLanguagesInfoList("content").map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={`${t("Please Enter New Content")} ${t(`In ${el.fullLanguageName}`)}`}
                                                            className={`form-control d-block mx-auto p-2 border-2 ad-content-field ${formValidationErrors[el.formField] && adIndex === selectedAdIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={ad.content[el.internationalLanguageCode]}
                                                            onChange={(e) => changeAdData(adIndex, "content", e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && adIndex === selectedAdIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td> : <td className="ad-image-cell">
                                            <img
                                                src={`${process.env.BASE_API_URL}/${ad.imagePath}`}
                                                alt={`New Image !!`}
                                                width="100"
                                                height="100"
                                                className="d-block mx-auto mb-4"
                                            />
                                            <section className="ad-image mb-4">
                                                <input
                                                    type="file"
                                                    className={`form-control d-block mx-auto p-2 border-2 brand-image-field ${formValidationErrors["image"] && adIndex === selectedAdImageIndex ? "border-danger mb-3" : "mb-4"}`}
                                                    onChange={(e) => changeAdData(adIndex, "image", e.target.files[0])}
                                                    accept=".png, .jpg, .webp"
                                                />
                                                {formValidationErrors["image"] && selectedAdImageIndex === adIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                                            </section>
                                            {(selectedAdImageIndex !== adIndex && selectedAdIndex !== adIndex) &&
                                                <button
                                                    className="btn btn-success d-block mb-3 w-50 mx-auto global-button"
                                                    onClick={() => changeAdImage(adIndex)}
                                                >{t("Change Image")}</button>
                                            }
                                            {waitChangeAdImageMsg && selectedAdImageIndex === adIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitChangeAdImageMsg)}</button>}
                                            {successChangeAdImageMsg && selectedAdImageIndex === adIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successChangeAdImageMsg)}</button>}
                                            {errorChangeAdImageMsg && selectedAdImageIndex === adIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorChangeAdImageMsg)}</button>}
                                        </td>}

                                        <td className="ad-date-of-creation-cell">
                                            {getDateFormated(ad.createdAt)}
                                        </td>
                                        <td className="update-cell">
                                            {selectedAdIndex !== adIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(adIndex, setSelectedAdIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                                {advertisementType === "text" && <>
                                                    <hr />
                                                    <button
                                                        className="btn btn-success global-button"
                                                        onClick={() => updateAd(adIndex)}
                                                    >{t("Update")}</button>
                                                </>}
                                            </>}
                                            {waitMsg && selectedAdIndex === adIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedAdIndex === adIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedAdIndex === adIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allAds.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any Ads !!")} />}
                </div>
                {/* End Page Content */}
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}