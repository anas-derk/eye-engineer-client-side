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

    const [allAds, setAllAds] = useState([]);

    const [isGetGeometries, setIsGetAds] = useState(false);

    const [selectedAdIndex, setSelectedAdIndex] = useState(-1);

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [waitChangeGeometryImageMsg, setWaitChangeAdImageMsg] = useState("");

    const [errorChangeGeometryImageMsg, setErrorChangeAdImageMsg] = useState("");

    const [successChangeGeometryImageMsg, setSuccessChangeAdImageMsg] = useState("");

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const [isDisplayAddAdBox, setIsDisplayAddAdBox] = useState(false);

    const [filters, setFilters] = useState({
        type: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

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
                            setAllAds((await getAllAds()).data);
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
            const filteringString = getFilteringString(filters);
            const result = (await getAllAds(1, pageSize, getFilteringString(filters), "admin", i18n.language)).data;
            setAllGeometriesInsideThePage(result.geometries);
            setTotalPagesCount(Math.ceil(result.geometriesCount / pageSize));
            setIsGetAds(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetAds(false);
                setCurrentPage(-1);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const changeAdContent = (adIndex, newValue, language) => {
        setSelectedAdIndex(-1);
        let adTemp = allAds.map((news) => news);
        adTemp[adIndex].content[language] = newValue;
        setAllAds(adTemp);
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
            setSelectedAdIndex(adIndex);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitChangeAdImageMsg("Please Wait");
                let formData = new FormData();
                formData.append("adImage", allAds[adIndex].image);
                const result = (await axios.put(`${process.env.BASE_API_URL}/ads/change-image/${allGeometriesInsideThePage[adIndex]._id}?language=${i18n.language}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                if (!result.error) {
                    setWaitChangeAdImageMsg("");
                    setSuccessChangeAdImageMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(async () => {
                        setSuccessChangeAdImageMsg("");
                        setSelectedAdIndex(-1);
                        setAllGeometriesInsideThePage((await getAllGeometriesInsideThePage(currentPage, pageSize, getFilteringString(filters), "admin", i18n.language)).data.geometries);
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setWaitChangeAdImageMsg("");
                    setErrorChangeAdImageMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorChangeAdImageMsg("");
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
                setWaitChangeAdImageMsg("");
                setErrorChangeAdImageMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorChangeAdImageMsg("");
                    setSelectedAdIndex(-1);
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
                    {allAds.length > 0 && <section className="ads-box w-100 admin-dashbboard-data-box">
                        <table className="ads-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <th>{t("Content")}</th>
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
                                        <td className="ad-content-cell">
                                            <section className="ad-content mb-4">
                                                {getLanguagesInfoList("content").map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={`${t("Please Enter New Content")} ${t(`In ${el.fullLanguageName}`)}`}
                                                            className={`form-control d-block mx-auto p-2 border-2 ad-content-field ${formValidationErrors[el.formField] && adIndex === selectedAdIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={ad.content[el.internationalLanguageCode]}
                                                            onChange={(e) => changeAdContent(adIndex, e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && adIndex === selectedAdIndex && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td>
                                        <td className="ad-date-of-creation-cell">
                                            {getDateFormated(ad.dateOfCreation)}
                                        </td>
                                        <td className="update-cell">
                                            {selectedAdIndex !== adIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(adIndex, setSelectedAdIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                                <hr />
                                                <button
                                                    className="btn btn-success global-button"
                                                    onClick={() => updateAd(adIndex)}
                                                >{t("Update")}</button>
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