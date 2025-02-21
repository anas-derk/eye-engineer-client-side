import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import websiteLogo from "../../../public/images/LogoWithTransparentBackground.webp";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, getUserInfo } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { BiSolidUser } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";

export default function Login() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isVisiblePassword, setIsVisiblePassword] = useState(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        setIsLoadingPage(false);
                    } else await router.replace("/");
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        setIsLoadingPage(false);
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else setIsLoadingPage(false);
    }, []);

    const login = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "email",
                    value: userData.email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, This Email Is Not Valid !!",
                        }
                    },
                },
                {
                    name: "password",
                    value: userData.password,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait To Logining ...");
                const result = (await axios.get(`${process.env.BASE_API_URL}/users/login?email=${userData.email}&password=${userData.password}`)).data;
                if (result.error) {
                    setWaitMsg("");
                    setErrorMsg(result.msg);
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 4000);
                } else {
                    localStorage.setItem(process.env.userTokenNameInLocalStorage, result.data.token);
                    await router.replace("/");
                }
            }
        } catch (err) {
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const authWithGoogle = async (credentialResponse, authType) => {
        try {
            setWaitMsg("Wait Logining");
            let result = decode(credentialResponse.credential);
            result = (await axios.get(`${process.env.BASE_API_URL}/users/login-with-google?email=${result.email}&firstName=${result.given_name}&lastName=${result.family_name}&previewName=${result.name}&language=${i18n.language}`)).data;
            if (result.error) {
                setWaitMsg("");
                setErrorMsg(result.msg);
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 5000);
            } else {
                localStorage.setItem(process.env.userTokenNameInLocalStorage, result.data.token);
                await router.replace("/");
            }
        }
        catch (err) {
            setWaitMsg("");
            setErrorMsg("Sorry, Someting Went Wrong, Please Try Again The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 5000);
        }
    }

    const loginingFailedWithGoogle = (err) => {
        alert("Login Failed With Google, Please Repeate The Process !!");
    }

    return (
        <div className="login auth-page">
            <Head>
                <title>{t(process.env.websiteName)} {t("Login")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Login")}</h1>
                    <div className="container pt-4 pb-4">
                        <form className="login-form info-box text-center p-4" onSubmit={login}>
                            <h2 className="mb-4">{t("Login")}</h2>
                            <div className="email-field-box field-box">
                                <input
                                    type="text"
                                    placeholder={t("Please Enter Your Email")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-2" : "mb-4"}`}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    <BiSolidUser className="icon" />
                                </div>
                            </div>
                            {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                            <div className="password-field-box field-box">
                                <input
                                    type={isVisiblePassword ? "text" : "password"}
                                    placeholder={t("Please Enter Your Password")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["password"] ? "border-danger mb-2" : "mb-4"}`}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    {!isVisiblePassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                    {isVisiblePassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                </div>
                            </div>
                            {formValidationErrors["password"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["password"])} />}
                            {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4 global-button">
                                {i18n.language === "ar" && <FiLogIn />}
                                <span className="me-2">{t("Login")}</span>
                                {i18n.language !== "ar" && <FiLogIn />}
                            </button>}
                            {waitMsg && <button disabled className="btn btn-primary w-100 mb-4 global-button">
                                <span className="me-2">{t("Wait Logining")} ...</span>
                            </button>}
                            {(waitMsg || successMsg) && <p className={`global-button text-center text-white text-start mb-5 alert ${errorMsg ? "alert-danger bg-danger" : ""} ${successMsg ? "alert-success bg-success" : ""}`}>{t(errorMsg || successMsg)}</p>}
                            <h6 className="fw-bold mb-3">{t("Or Sign In With")}</h6>
                            <ul className="external-auth-sites-list mb-3">
                                <li className="external-auth-site-item">
                                    <GoogleLogin
                                        type="icon"
                                        onSuccess={(credentialResponse) => authWithGoogle(credentialResponse)}
                                        onError={loginingFailedWithGoogle}
                                    />
                                </li>
                            </ul>
                            <Link href="/forget-password?userType=user" className="text-dark border-bottom border-2 border-dark pb-2 forget-password-link-btn">{t("Forget Password")}</Link>
                        </form>
                    </div>
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
        </div>
    );
}