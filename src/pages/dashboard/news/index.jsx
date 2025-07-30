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

export default function News() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [allNews, setAllNews] = useState([]);

    const [waitMsg, setWaitMsg] = useState("");

    const [selectedNewsIndex, setSelectedNewsIndex] = useState(-1);

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

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
                        setAllNews((await getAllNews(filtersAsQuery)).data);
                        setIsLoadingPage(false);
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

    const getAllNews = async (filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/news/all-news?language=${i18n.language}&${filters ? filters : ""}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
        }
        catch (err) {
            throw err;
        }
    }

    const changeNewsContent = (newsIndex, newValue, language) => {
        setSelectedNewsIndex(-1);
        let newsTemp = allTextAds.map((ad) => ad);
        newsTemp[newsIndex].content[language] = newValue;
        setAllNews(newsTemp);
    }

    const updateNews = async (newsIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `newsContentIn${language.toUpperCase()}`,
                    value: allNews[newsIndex].content[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                }))
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedNewsIndex(newsIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait To Updating ...");
                const result = (await axios.put(`${process.env.BASE_API_URL}/ads/update-news-content/${allNews[newsIndex]._id}?language=${i18n.language}`, {
                    content: allNews[newsIndex].content,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.ADMIN_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg("");
                        setSelectedNewsIndex(-1);
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedNewsIndex(-1);
                        clearTimeout(errorTimeout);
                    }, 1500);
                }
            }
        }
        catch (err) {
            console.log(err);
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedNewsIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const deleteNews = async (newsIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedNewsIndex(newsIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/news/delete-news?newsId=${allNews[newsIndex]._id}&language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.ADMIN_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedNewsIndex(-1);
                    setAllNews(allNews.filter((_, index) => index !== newsIndex));
                    clearTimeout(successTimeout);
                }, 1000);
            } else {
                setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedNewsIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1000);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedNewsIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="news dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("News")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("News")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteNews(selectedNewsIndex)}
                    setSelectedElementIndex={setSelectedNewsIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("News")}</h1>
                    <DashboardSideBar />
                    {allNews.length > 0 && <section className="news-box w-100 admin-dashbboard-data-box">
                        <table className="news-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <th>{t("Content")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allNews.map((news, newsIndex) => (
                                    <tr key={news._id}>
                                        <td className="news-id-cell">
                                            {news._id}
                                        </td>
                                        <td className="news-name-cell">
                                            <section className="news-content mb-4">
                                                {getLanguagesInfoList("content").map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">In {el.fullLanguageName} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={`Enter New News Content In ${el.fullLanguageName}`}
                                                            className={`form-control d-block mx-auto p-2 border-2 news-content-field ${formValidationErrors[el.formField] && newsIndex === selectedNewsIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={news.content[el.internationalLanguageCode]}
                                                            onChange={(e) => changeNewsContent(newsIndex, e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && newsIndex === selectedNewsIndex && <FormFieldErrorBox errorMsg={formValidationErrors[el.formField]} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td>
                                        <td className="news-date-of-creation-cell">
                                            {getDateFormated(news.dateOfCreation)}
                                        </td>
                                        <td className="update-cell">
                                            {selectedNewsIndex !== newsIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(newsIndex, setSelectedNewsIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                                <hr />
                                                <button
                                                    className="btn btn-success global-button"
                                                    onClick={() => updateNews(newsIndex)}
                                                >{t("Update")}</button>
                                            </>}
                                            {waitMsg && selectedNewsIndex === newsIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedNewsIndex === newsIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedNewsIndex === newsIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allNews.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any News !!")} />}
                </div>
                {/* End Page Content */}
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}