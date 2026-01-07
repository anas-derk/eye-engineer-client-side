import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getUserInfo, handleSelectUserLanguage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { inputValuesValidation } from "../../../../public/global_functions/validations";

export default function Terminologies() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({});

    const [text, setText] = useState("");

    const [targetLanguage, setTargetLanguage] = useState("");

    const [translation, setTranslation] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

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
                        setUserInfo(result.data);
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

    const translate = async (e) => {
        try {
            e.preventDefault();
            const errorsObject = inputValuesValidation([
                {
                    name: "text",
                    value: text,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "targetLanguage",
                    value: targetLanguage,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.post(`${process.env.BASE_API_URL}/translations/translate?language=${i18n.language}`, {
                    text,
                    language: targetLanguage,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg("Translation Successfull !!");
                    setTranslation(result.data);
                    let successTimeout = setTimeout(async () => {
                        setSuccessMsg("");
                        clearTimeout(successTimeout);
                    }, 1000);
                } else {
                    setErrorMsg(result.msg);
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        clearTimeout(errorTimeout);
                    }, 1000);
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
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="terminologies-translation dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Terminologies")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Terminologies")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo?.isWebsiteOwner} isEngineer={userInfo?.isEngineer} />
                    <form className="terminologies-translation-form text-center p-4" onSubmit={translate}>
                        <div className="text-field-box field-box">
                            <textarea
                                placeholder={t("Please Enter Your Text")}
                                className={`form-control p-3 border-2 ${formValidationErrors["text"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setText(e.target.value.trim())}
                            />
                        </div>
                        {formValidationErrors["text"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["text"])} />}
                        <div
                            className="select-target-language-field-box"
                        >
                            <select
                                className={`select-target-language form-select ${i18n.language === "ar" ? "ar" : ""} ${formValidationErrors["targetLanguage"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                            >
                                <option value="" hidden>{t("Please Select Target Language")}</option>
                                <option value="ar">{t("Arabic")}</option>
                                <option value="en">{t("English")}</option>
                                <option value="de">{t("German")}</option>
                                <option value="tr">{t("Turkish")}</option>
                            </select>
                        </div>
                        {formValidationErrors["targetLanguage"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["targetLanguage"])} />}
                        {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                            {t("Translate")}
                        </button>}
                        {waitMsg && <button disabled className="btn btn-primary w-100 mb-4">
                            {t(waitMsg)} ...
                        </button>}
                        {(errorMsg || successMsg) && <button className={`p-2 btn w-100 mb-3 ${errorMsg ? "btn-danger" : ""} ${successMsg ? "btn-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
                        {translation && <div className="translation-box">
                            <textarea
                                className={`form-control p-3 border-2 mb-4`}
                                value={translation}
                                disabled
                            />
                        </div>}
                    </form>
                </div>
                {/* End Page Content */}
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}