import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
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
import axios from "axios";
import { useRouter } from "next/router";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { decode } from "jsonwebtoken";

export default function Login() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isVisiblePassword, setIsVisiblePassword] = useState(false);

    const { t, i18n } = useTranslation();

    const router = useRouter();

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        setIsLoadingPage(false);
                    } else await router.replace("/");
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
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
                setWaitMsg("Wait Logining");
                const result = (await axios.post(`${process.env.BASE_API_URL}/auth/login?language=${i18n.language}`, {
                    email: userData.email,
                    password: userData.password
                })).data;
                if (result.error) {
                    setWaitMsg("");
                    setErrorMsg(result.msg);
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 4000);
                } else {
                    if (result.data.isVerified) {
                        localStorage.setItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE, result.data.token);
                        await router.replace("/");
                    } else await router.replace(`/account-verification?email=${userData.email}`);
                }
            }
        } catch (err) {
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeat The Process !!");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const authWithGoogle = async (credentialResponse) => {
        try {
            setWaitMsg("Wait Logining");
            let result = decode(credentialResponse.credential);
            result = (await axios.get(`${process.env.BASE_API_URL}/auth/login-with-google?language=${i18n.language}`, {
                email: result.email,
                name: result.name
            })).data;
            if (result.error) {
                setWaitMsg("");
                setErrorMsg(result.msg);
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 5000);
            } else {
                localStorage.setItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE, result.data.token);
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
        console.log(err)
        alert("Login Failed With Google, Please Repeate The Process !!");
    }

    return (
        <div className="login auth-page">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Login")}</title>
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
                                    className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
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
                                    className={`form-control p-3 border-2 ${formValidationErrors["password"] ? "border-danger mb-3" : "mb-4"}`}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    {!isVisiblePassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                    {isVisiblePassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                </div>
                            </div>
                            {formValidationErrors["password"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["password"])} />}
                            <Link href="/forget-password?userType=user" className="text-dark border-bottom border-2 border-dark pb-2 mb-3 d-block w-fit">{t("Forget Password")}</Link>
                            {!waitMsg && !errorMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                                {i18n.language === "ar" && <FiLogIn />}
                                <span className="me-2">{t("Login")}</span>
                                {i18n.language !== "ar" && <FiLogIn />}
                            </button>}
                            {waitMsg && <button disabled className="btn btn-primary w-100 mb-4">
                                <span className="me-2">{t(waitMsg)} ...</span>
                            </button>}
                            {errorMsg && <button disabled className={`p-2 btn w-100 mb-3 ${errorMsg ? "btn-danger" : ""}`}>{t(errorMsg)}</button>}
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
                            <hr />
                            <div className="pb-3">
                                <motion.span className="fw-bold" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Don't Have An Account ?")} </motion.span>
                                {!waitMsg && !errorMsg && <Link
                                    className="text-dark border-bottom border-2 border-dark pb-2 me-2"
                                    href="/sign-up"
                                >
                                    {t("Sign Up")}
                                </Link>}
                            </div>
                        </form>
                    </div>
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}