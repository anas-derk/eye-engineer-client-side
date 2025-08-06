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
import { decode } from "jsonwebtoken";

export default function SignUp() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isVisiblePassword, setIsVisiblePassword] = useState(false);

    const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

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

    const signup = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: userData.name,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isName: {
                            msg: "Sorry, This Name Is Not Valid !!",
                        }
                    },
                },
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
                {
                    name: "confirmPassword",
                    value: userData.confirmPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isMatch: {
                            value: userData.password,
                            msg: "Sorry, There Is No Match Between New Password And Confirm It !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Wait Signup");
                const result = (await axios.post(`${process.env.BASE_API_URL}/auth/create-new-user?language=${i18n.language}`, {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    language: i18n.language
                })).data;
                setWaitMsg("");
                if (result.error) {
                    setErrorMsg(result.msg);
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 4000);
                } else {
                    setSuccessMsg(`${result.msg}, Please Wait To Navigate To Verification Page !!`);
                    let successTimeout = setTimeout(async () => {
                        await router.push(`/account-verification?email=${userData.email}`);
                        clearTimeout(successTimeout);
                    }, 6000);
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
            setWaitMsg("Wait Signup");
            let result = decode(credentialResponse.credential);
            result = (await axios.post(`${process.env.BASE_API_URL}/auth/login-with-google?language=${i18n.language}`, {
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

    const signupFailedWithGoogle = (err) => {
        alert("Sign Up Failed With Google, Please Repeate The Process !!");
    }

    return (
        <div className="sign-up auth-page">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Sign Up")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Sign Up")}</h1>
                    <div className="container pt-4 pb-4">
                        <form className="sign-up-form info-box text-center p-4" onSubmit={signup}>
                            <h2 className="mb-4">{t("Sign Up")}</h2>
                            <div className="name-field-box field-box">
                                <input
                                    type="text"
                                    placeholder={t("Please Enter Your Name")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["name"] ? "border-danger mb-3" : "mb-4"}`}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    <BiSolidUser className="icon" />
                                </div>
                            </div>
                            {formValidationErrors["name"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["name"])} />}
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
                            <div className="confirm-password-field-box field-box">
                                <input
                                    type={isVisibleConfirmPassword ? "text" : "password"}
                                    placeholder={t("Please Enter Your Confirm Password")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["confirmPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                    onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    {!isVisibleConfirmPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleConfirmPassword(value => value = !value)} />}
                                    {isVisibleConfirmPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleConfirmPassword(value => value = !value)} />}
                                </div>
                            </div>
                            {formValidationErrors["confirmPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["confirmPassword"])} />}
                            <Link href="/forget-password?userType=user" className="text-dark border-bottom border-2 border-dark pb-2 mb-3 d-block w-fit">{t("Forget Password")}</Link>
                            {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                                {i18n.language === "ar" && <FiLogIn />}
                                <span className="me-2">{t("Sign Up")}</span>
                                {i18n.language !== "ar" && <FiLogIn />}
                            </button>}
                            {waitMsg && <button disabled className="btn btn-primary w-100 mb-4">
                                <span className="me-2">{t(waitMsg)} ...</span>
                            </button>}
                            {(errorMsg || successMsg) && <button className={`p-2 btn w-100 mb-3 ${errorMsg ? "btn-danger" : ""} ${successMsg ? "btn-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
                            <h6 className="fw-bold mb-3">{t("Or Sign Up With")}</h6>
                            <ul className="external-auth-sites-list mb-3">
                                <li className="external-auth-site-item">
                                    <GoogleLogin
                                        type="icon"
                                        onSuccess={(credentialResponse) => authWithGoogle(credentialResponse)}
                                        onError={signupFailedWithGoogle}
                                    />
                                </li>
                            </ul>
                            <hr />
                            <div className="pb-3">
                                <motion.span className="fw-bold" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>{t("Have An Account ?")} </motion.span>
                                {!waitMsg && !errorMsg && <Link
                                    className="text-dark border-bottom border-2 border-dark pb-2 me-2"
                                    href="/login"
                                >
                                    {t("Login")}
                                </Link>}
                            </div>
                        </form>
                    </div>
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
        </div>
    );
}