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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { inputValuesValidation } from "../../../../public/global_functions/validations";

export default function ChangeBussinessEmailPassword() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [isVisibleCurrentPassword, setIsVisibleCurrentPassword] = useState(false);

    const [isVisibleNewPassword, setIsVisibleNewPassword] = useState(false);

    const [isVisibleConfirmNewPassword, setIsVisibleConfirmNewPassword] = useState(false);

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

    const changeBussinessEmailPassword = async (e) => {
        try {
            e.preventDefault();
            const errorsObject = inputValuesValidation([
                {
                    name: "email",
                    value: email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, This Email Is Not Valid !!",
                        },
                    },
                },
                {
                    name: "currentPassword",
                    value: currentPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter !!"
                        },
                    }
                },
                {
                    name: "newPassword",
                    value: newPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isMatch: {
                            value: confirmNewPassword,
                            msg: "Sorry, There Is No Match Between New Password And Confirm It !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter !!"
                        },
                    }
                },
                {
                    name: "confirmNewPassword",
                    value: confirmNewPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isMatch: {
                            value: newPassword,
                            msg: "Sorry, There Is No Match Between New Password And Confirm It !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter !!"
                        },
                    }
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/global-passwords/change-bussiness-email-password?language=${i18n.language}`, {
                    email,
                    password: currentPassword,
                    newPassword,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(async () => {
                        setSuccessMsg("");
                        setEmail("");
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmNewPassword("");
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
        <div className="change-bussiness-email-password dashboard">
            <Head>
                <title>{t(process.env.websiteName)} {t("Change Bussiness Email Password")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Change Bussiness Email Password")}</h1>
                    <DashboardSideBar />
                    <form className="change-bussiness-email-password-form text-center p-4" onSubmit={changeBussinessEmailPassword}>
                        <div className="email-field-box field-box">
                            <input
                                type="text"
                                placeholder={t("Please Enter Your Email")}
                                className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setEmail(e.target.value.trim())}
                                value={email}
                            />
                        </div>
                        {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                        <div className="current-password-field-box field-box">
                            <input
                                type={isVisibleCurrentPassword ? "text" : "password"}
                                placeholder={t("Please Enter Current Password Here")}
                                className={`form-control p-3 border-2 ${formValidationErrors["currentPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setCurrentPassword(e.target.value.trim())}
                                value={currentPassword}
                            />
                            <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                {!isVisibleCurrentPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleCurrentPassword(value => value = !value)} />}
                                {isVisibleCurrentPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleCurrentPassword(value => value = !value)} />}
                            </div>
                        </div>
                        {formValidationErrors["currentPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["currentPassword"])} />}
                        <div className="new-password-field-box field-box">
                            <input
                                type={isVisibleNewPassword ? "text" : "password"}
                                placeholder={t("Please Enter New Password Here")}
                                className={`form-control p-3 border-2 ${formValidationErrors["newPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setNewPassword(e.target.value.trim())}
                                value={newPassword}
                            />
                            <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                {!isVisibleNewPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleNewPassword(value => value = !value)} />}
                                {isVisibleNewPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleNewPassword(value => value = !value)} />}
                            </div>
                        </div>
                        {formValidationErrors["newPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["newPassword"])} />}
                        <div className="confirm-new-password-field-box field-box">
                            <input
                                type={isVisibleConfirmNewPassword ? "text" : "password"}
                                placeholder={t("Please Enter Confirm New Password Here")}
                                className={`form-control p-3 border-2 ${formValidationErrors["confirmPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                onChange={(e) => setConfirmNewPassword(e.target.value.trim())}
                                value={confirmNewPassword}
                            />
                            <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                {!isVisibleConfirmNewPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleConfirmNewPassword(value => value = !value)} />}
                                {isVisibleConfirmNewPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleConfirmNewPassword(value => value = !value)} />}
                            </div>
                        </div>
                        {formValidationErrors["confirmNewPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["confirmNewPassword"])} />}
                        {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                            {t("Update")}
                        </button>}
                        {waitMsg && <button disabled className="btn btn-primary w-100 mb-4">
                            {t(waitMsg)} ...
                        </button>}
                        {(errorMsg || successMsg) && <button className={`p-2 btn w-100 mb-3 ${errorMsg ? "btn-danger" : ""} ${successMsg ? "btn-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
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