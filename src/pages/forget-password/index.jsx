import Head from "next/head";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderPage from "@/components/LoaderPage";
import { BiSolidUser } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaCode } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { getUserInfo, sendTheCodeToUserEmail } from "../../../public/global_functions/popular";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import Footer from "@/components/Footer";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";

export default function ForgetPassword({ userTypeAsProperty }) {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    const [isResetingPasswordStatus, setIsResetingPasswordStatus] = useState(false);

    const [isWaitSendTheCode, setIsWaitSendTheCode] = useState(false);

    const [minutes, setMinutes] = useState(1);

    const [seconds, setSeconds] = useState(59);

    const [userType, setUserType] = useState();

    const [email, setEmail] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isDisplayResetPasswordForm, setIsDisplayResetPasswordForm] = useState(false);

    const [typedUserCode, setTypedUser] = useState(false);

    const [newPassword, setNewPassword] = useState("");

    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [isVisibleNewPassword, setIsVisibleNewPassword] = useState(false);

    const [isVisibleConfirmNewPassword, setIsVisibleConfirmNewPassword] = useState(false);

    const { t, i18n } = useTranslation();

    const router = useRouter();

    useEffect(() => {
        setUserType(userTypeAsProperty);
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (res) => {
                    if (!res.data.error) {
                        await router.replace("/");
                    } else {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        setIsLoadingPage(false);
                    }
                }).catch((err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        setIsLoadingPage(false);
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else {
            setIsLoadingPage(false);
        }
    }, [userTypeAsProperty]);

    const handleSelectUserType = (newUserType) => {
        setUserType(newUserType);
        router.replace(`/forget-password?userType=${newUserType}`);
    }

    const handleTimeCounter = () => {
        let secondsTemp = 59, minutesTemp = 1;
        let timeCounter = setInterval(() => {
            if (secondsTemp === 0 && minutesTemp !== 0) {
                secondsTemp = 59;
                setSeconds(59);
                minutesTemp = minutesTemp - 1;
                setMinutes(minutesTemp);
            } else if (secondsTemp !== 0 && (minutesTemp !== 0 || minutesTemp === 0)) {
                secondsTemp = secondsTemp - 1;
                setSeconds(secondsTemp);
            } else if (secondsTemp === 0 && minutesTemp === 0) {
                clearInterval(timeCounter);
            }
        }, 1000);
    }

    const resendTheCodeToEmail = async () => {
        try {
            setIsWaitSendTheCode(true);
            const result = await sendTheCodeToUserEmail(email, "to reset password", userType);
            setIsWaitSendTheCode(false);
            if (!result.error) {
                setSuccessMsg(result.msg);
                handleTimeCounter();
                let successMsgTimeout = setTimeout(() => {
                    setSuccessMsg("");
                    clearTimeout(successMsgTimeout);
                }, 2000);
            } else {
                setErrorMsg(result.msg);
                let errorMsgTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorMsgTimeout);
                }, 2000);
            }
        }
        catch (err) {
            setIsWaitSendTheCode(false);
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 5000);
        }
    }

    const forgetPassword = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            setErrorMsg("");
            setSuccessMsg("");
            const errorsObject = inputValuesValidation([
                {
                    name: "userType",
                    value: userType,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "email",
                    value: email,
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
            if (Object.keys(errorsObject).length == 0) {
                setIsCheckingStatus(true);
                const result = (await axios.get(`${process.env.BASE_API_URL}/users/forget-password?email=${email}&userType=${userType}&language=${i18n.language}`)).data;
                if (result.error) {
                    setIsCheckingStatus(false);
                    setErrorMsg(result.msg);
                    if (result.msg === "Sorry, The Email For This User Is Not Verified !!") {
                        let errorTimeout = setTimeout(async () => {
                            await router.push(`/account-verification?email=${email}`);
                            clearTimeout(errorTimeout);
                        }, 5000);
                    }
                    else {
                        let errorTimeout = setTimeout(async () => {
                            setErrorMsg("");
                            clearTimeout(errorTimeout);
                        }, 5000);
                    }
                } else {
                    setIsDisplayResetPasswordForm(true);
                    handleTimeCounter();
                }
            }
        }
        catch (err) {
            setIsCheckingStatus(false);
            setErrorMsg("Sorry, Someting Went Wrong, Please Try Again The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 5000);
        }
    }

    const resetPassword = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            setErrorMsg("");
            setSuccessMsg("");
            const errorsObject = inputValuesValidation([
                {
                    name: "typedUserCode",
                    value: typedUserCode,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "newPassword",
                    value: newPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                    },
                },
                {
                    name: "confirmNewPassword",
                    value: confirmNewPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                        isMatch: {
                            value: newPassword,
                            msg: "Sorry, There Is No Match Between New Password And Confirm It !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setIsResetingPasswordStatus(true);
                const result = (await axios.put(`${process.env.BASE_API_URL}/users/reset-password?email=${email}&code=${typedUserCode}&newPassword=${newPassword}&userType=${userType}&language=${i18n.language}`)).data;
                setIsResetingPasswordStatus(false);
                if (!result.error) {
                    setSuccessMsg(`${result.msg}, Please Wait To Navigate To Login Page !!`);
                    let successTimeout = setTimeout(async () => {
                        await router.push(userTypeAsProperty === "user" ? "/login" : "https://dashboard.eyeengineer.com/login");
                        clearTimeout(successTimeout);
                    }, 6000);
                } else {
                    setErrorMsg(result.msg);
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        clearTimeout(errorTimeout);
                    }, 5000);
                }
            }
        }
        catch (err) {
            setIsResetingPasswordStatus(false);
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 5000);
        }
    }

    return (
        <div className="forget-password auth-page">
            <Head>
                <title>{t(process.env.websiteName)} {t("Forget Password")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Forget Password")}</h1>
                    <div className="container pt-4 pb-4">
                        {!isDisplayResetPasswordForm && <form className="user-forget-password-form info-box text-center p-4" onSubmit={forgetPassword}>
                            <h2 className="mb-4">{t("Forget Password")}</h2>
                            <div
                                className="select-user-type-field-box"
                            >
                                <select
                                    className={`select-user-type form-select ${i18n.language === "ar" ? "ar" : ""} ${formValidationErrors["userType"] ? "border-danger mb-3" : "mb-5"}`}
                                    onChange={(e) => handleSelectUserType(e.target.value)}
                                    value={userTypeAsProperty}
                                >
                                    <option value="" hidden>{t("Pleae Select User Type")}</option>
                                    <option value="user">{t("Normal User")}</option>
                                    <option value="admin">{t("Admin")}</option>
                                </select>
                            </div>
                            {formValidationErrors["userType"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["userType"])} />}
                            <div
                                className="email-field-box field-box"
                            >
                                <input
                                    type="text"
                                    placeholder={t("Please Enter Your Email")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                    onChange={(e) => setEmail(e.target.value.trim())}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    <BiSolidUser className="icon" />
                                </div>
                            </div>
                            {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                            {!isCheckingStatus && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                                {i18n.language === "ar" && <RiLockPasswordLine />}
                                <span className="me-2">{t("Forget Password")}</span>
                                {i18n.language !== "ar" && <RiLockPasswordLine />}
                            </button>}
                            {isCheckingStatus && <button disabled className="btn btn-primary w-100 mb-4">
                                <span className="me-2">{t("Wait Checking")} ...</span>
                            </button>}
                            {(errorMsg || successMsg) && <button disabled className={`p-2 btn w-100 mb-3 text-white ${errorMsg ? "btn-danger" : ""} ${successMsg ? "alert-success bg-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
                        </form>}
                        {isDisplayResetPasswordForm && <form className="user-reset-password-form info-box text-center p-4" onSubmit={resetPassword}>
                            <h2 className="mb-4">{t("Forget Password")}</h2>
                            <div
                                className="code-field-box field-box"
                            >
                                <input
                                    type="text"
                                    placeholder={t("Please Enter The Code Here")}
                                    className={`form-control ${formValidationErrors["typedUserCode"] ? "border-danger mb-3" : "mb-5"}`}
                                    onChange={(e) => setTypedUser(e.target.value.trim())}
                                />
                                <div className={`icon-box text-dark ${i18n.language === "ar" ? "ar-language-mode" : "other-languages-mode"}`}>
                                    <FaCode className="icon" />
                                </div>
                            </div>
                            {formValidationErrors["typedUserCode"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["typedUserCode"])} />}
                            <div
                                className="new-password-field-box field-box"
                            >
                                <input
                                    type={isVisibleNewPassword ? "text" : "password"}
                                    placeholder={t("Please Enter New Password Here")}
                                    className={`form-control ${formValidationErrors["newPassword"] ? "border-danger mb-3" : "mb-5"}`}
                                    onChange={(e) => setNewPassword(e.target.value.trim())}
                                />
                                <div className={`icon-box text-dark ${i18n.language === "ar" ? "ar-language-mode" : "other-languages-mode"}`}>
                                    {!isVisibleNewPassword && <AiOutlineEye className='eye-icon icon' onClick={() => setIsVisibleNewPassword(value => value = !value)} />}
                                    {isVisibleNewPassword && <AiOutlineEyeInvisible className='invisible-eye-icon icon' onClick={() => setIsVisibleNewPassword(value => value = !value)} />}
                                </div>
                            </div>
                            {formValidationErrors["newPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["newPassword"])} />}
                            <div
                                className="confirm-new-password-field-box field-box"
                            >
                                <input
                                    type={isVisibleConfirmNewPassword ? "text" : "password"}
                                    placeholder={t("Please Enter Confirm New Password Here")}
                                    className={`form-control ${formValidationErrors["confirmNewPassword"] ? "border-danger mb-3" : "mb-5"}`}
                                    onChange={(e) => setConfirmNewPassword(e.target.value.trim())}
                                />
                                <div className={`icon-box text-dark ${i18n.language === "ar" ? "ar-language-mode" : "other-languages-mode"}`}>
                                    {!isVisibleConfirmNewPassword && <AiOutlineEye className='eye-icon icon' onClick={() => setIsVisibleConfirmNewPassword(value => value = !value)} />}
                                    {isVisibleConfirmNewPassword && <AiOutlineEyeInvisible className='invisible-eye-icon icon' onClick={() => setIsVisibleConfirmNewPassword(value => value = !value)} />}
                                </div>
                            </div>
                            {formValidationErrors["confirmNewPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["confirmNewPassword"])} />}
                            {!isResetingPasswordStatus && !errorMsg && !successMsg && <button type="submit" className="btn btn-success w-100 mb-5">
                                {i18n.language === "ar" && <RiLockPasswordLine />}
                                <span className="me-2">{t("Reset Password")}</span>
                                {i18n.language !== "ar" && <RiLockPasswordLine />}
                            </button>}
                            {isResetingPasswordStatus && <button disabled className="btn btn-primary w-100 mb-5">
                                <span className="me-2">{t("Wait Reseting")} ...</span>
                            </button>}
                            {(errorMsg || successMsg) && <button disabled className={`p-2 btn w-100 mb-3 text-white ${errorMsg ? "btn-danger" : ""} ${successMsg ? "alert-success bg-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
                            <div className="email-sent-manager-box pb-3">
                                <h6 className="fw-bold d-inline-block">{t("Didn't get your email?")} </h6>
                                {!isWaitSendTheCode && !errorMsg && <button
                                    className="btn btn-danger me-2 global-button"
                                    onClick={resendTheCodeToEmail}
                                    disabled={seconds === 0 && minutes === 0 ? false : true}
                                >
                                    {t("Resend The Code")}
                                </button>}
                                {isWaitSendTheCode && <button
                                    className="btn btn-danger me-2 global-button"
                                    disabled
                                >
                                    {t("Resending The Code")} ...
                                </button>}
                                {errorMsg && <button
                                    className="btn btn-danger me-2 global-button"
                                    disabled
                                >
                                    {t(errorMsg)}
                                </button>}
                            </div>
                            <h6 className="mb-3 fw-bold">
                                {t("You can redial the message after")}
                            </h6>
                            <h6 className="mb-3 fw-bold">{minutes} : {seconds}</h6>
                        </form>}
                    </div>
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div >
    );
}

export async function getServerSideProps({ query }) {
    const allowedUserTypes = ["user", "admin"];
    if (query.userType) {
        if (!allowedUserTypes.includes(query.userType)) {
            return {
                redirect: {
                    permanent: false,
                    destination: `/forget-password?userType=user`,
                },
                props: {
                    userTypeAsProperty: query.userType,
                },
            }
        }
        if (Object.keys(query).filter((key) => key !== "userType").length > 1) {
            return {
                redirect: {
                    permanent: false,
                    destination: `/?userType=${query.userType}`,
                },
                props: {
                    userTypeAsProperty: query.userType,
                },
            }
        }
        return {
            props: {
                userTypeAsProperty: query.userType,
            },
        }
    }
    return {
        redirect: {
            permanent: false,
            destination: `/forget-password?userType=user`,
        },
        props: {
            userTypeAsProperty: query.userType,
        },
    }
}