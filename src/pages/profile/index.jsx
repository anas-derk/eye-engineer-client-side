import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { getUserInfo, handleSelectUserLanguage } from "../../../public/global_functions/popular";
import Footer from "@/components/Footer";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { BiSolidUser } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { FaEdit } from "react-icons/fa";

export default function Profile() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        image: null
    });

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [isVisibleCurrentPassword, setIsVisibleCurrentPassword] = useState(false);

    const [isVisibleNewPassword, setIsVisibleNewPassword] = useState(false);

    const [isVisibleConfirmNewPassword, setIsVisibleConfirmNewPassword] = useState(false);

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [waitMsg, setWaitMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const profileImageFileElementRef = useRef();

    const router = useRouter();

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.userlanguageFieldNameInLocalStorage);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (!result.error) {
                        setUserInfo(result.data);
                        setIsLoadingPage(false);
                    } else {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        await router.replace("/login");
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
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

    const updateUserInfo = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: userInfo.name,
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
                    value: userInfo.email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, Invalid Email !!",
                        },
                    },
                },
                (newPassword || confirmNewPassword) ? {
                    name: "currentPassword",
                    value: currentPassword,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isValidPassword: {
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                    }
                } : null,
                (currentPassword || confirmNewPassword) ? {
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
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                    }
                } : null,
                (currentPassword || newPassword) ? {
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
                            msg: "Sorry, The Password Must Be At Least 8 Characters Long, With At Least One Number, At Least One Lowercase Letter, And At Least One Uppercase Letter."
                        },
                    }
                } : null,
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Saving");
                let newUserInfo = {
                    email: userInfo.email,
                    name: userInfo.name,
                };
                if (currentPassword && newPassword && confirmNewPassword) {
                    newUserInfo = { ...newUserInfo, password: currentPassword, newPassword: newPassword };
                }
                const result = (await axios.put(`${process.env.BASE_API_URL}/users/update-user-info?language=${i18n.language}`, newUserInfo, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.userTokenNameInLocalStorage),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg("");
                        clearTimeout(successTimeout);
                    }, 2000);
                } else {
                    setErrorMsg(result.msg);
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        clearTimeout(errorTimeout);
                    }, 2000);
                }
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="profile auth-page">
            <Head>
                <title>{t(process.env.websiteName)} {t("Profile")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Profile")}</h1>
                    <div className="container pt-4 pb-4">
                        <form className="update-profile-form info-box text-center p-4" onSubmit={updateUserInfo}>
                            <h2 className="mb-4">{t("Profile")}</h2>
                            <div className="image-field-box field-box mb-4 position-relative">
                                <img
                                    src={`${process.env.BASE_API_URL}/${userInfo.imagePath}`}
                                    alt="Profile Image"
                                    className="mw-100 profile-image"
                                />
                                <label htmlFor="profileFile" className="profile-image-file-label"></label>
                                <input
                                    type="file"
                                    id="profileFile"
                                    className={`invisible form-control profile-image-field ${formValidationErrors["image"] ? "border-danger mb-3" : "mb-4"}`}
                                    onChange={(e) => setUserInfo({ ...userInfo, image: e.target.files[0] })}
                                    ref={profileImageFileElementRef}
                                    value={profileImageFileElementRef.current?.value}
                                />
                                <div className="edit-profile-image-icon-box">
                                    <FaEdit className="edit-profile-image-icon" />
                                </div>
                            </div>
                            <div className="change-image-box mb-5 border-bottom border-3 border-dark">
                                {!waitMsg && !errorMsg && !successMsg && <button type="button" className="orange-btn btn w-50 mb-4">
                                    {i18n.language === "ar" && <FaEdit />}
                                    <span className="me-2">{t("Change Image")}</span>
                                    {i18n.language !== "ar" && <FaEdit />}
                                </button>}
                                {waitMsg && <button disabled className="btn btn-primary w-100 mb-4">
                                    <span className="me-2">{t(waitMsg)} ...</span>
                                </button>}
                                {formValidationErrors["image"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                            </div>
                            {(errorMsg || successMsg) && <button className={`p-2 btn w-100 mb-3 ${errorMsg ? "btn-danger" : ""} ${successMsg ? "btn-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
                            <div className="name-field-box field-box">
                                <input
                                    type="text"
                                    placeholder={t("Please Enter New Name Here")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["name"] ? "border-danger mb-3" : "mb-4"}`}
                                    defaultValue={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    <BiSolidUser className="icon" />
                                </div>
                            </div>
                            {formValidationErrors["name"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["name"])} />}
                            <div className="email-field-box field-box">
                                <input
                                    type="text"
                                    placeholder={t("Please Enter New Email Here")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                    defaultValue={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value.trim() })}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    <BiSolidUser className="icon" />
                                </div>
                            </div>
                            {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                            <section className="change-password">
                                <fieldset>
                                    <div className="current-password-field-box field-box">
                                        <input
                                            type={isVisibleCurrentPassword ? "text" : "password"}
                                            placeholder={t("Please Enter Current Password Here")}
                                            className={`form-control p-3 border-2 ${formValidationErrors["currentPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                            onChange={(e) => setCurrentPassword(e.target.value.trim())}
                                        />
                                        <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                            {!isVisibleNewPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleCurrentPassword(value => value = !value)} />}
                                            {isVisibleNewPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleCurrentPassword(value => value = !value)} />}
                                        </div>
                                    </div>
                                    {formValidationErrors["currentPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["currentPassword"])} />}
                                    <div className="new-password-field-box field-box">
                                        <input
                                            type={isVisibleNewPassword ? "text" : "password"}
                                            placeholder={t("Please Enter New Password Here")}
                                            className={`form-control p-3 border-2 ${formValidationErrors["newPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                            onChange={(e) => setNewPassword(e.target.value.trim())}
                                        />
                                        <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                            {!isVisibleNewPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleNewPassword(value => value = !value)} />}
                                            {isVisibleNewPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleNewPassword(value => value = !value)} />}
                                        </div>
                                    </div>
                                    {formValidationErrors["newPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["newPassword"])} />}
                                    <div className="confirm-password-field-box field-box">
                                        <input
                                            type={isVisibleConfirmNewPassword ? "text" : "password"}
                                            placeholder={t("Please Enter Confirm New Password Here")}
                                            className={`form-control p-3 border-2 ${formValidationErrors["confirmNewPassword"] ? "border-danger mb-3" : "mb-4"}`}
                                            onChange={(e) => setConfirmNewPassword(e.target.value.trim())}
                                        />
                                        <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                            {!isVisibleConfirmNewPassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisibleConfirmNewPassword(value => value = !value)} />}
                                            {isVisibleConfirmNewPassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisibleConfirmNewPassword(value => value = !value)} />}
                                        </div>
                                    </div>
                                    {formValidationErrors["confirmNewPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["confirmNewPassword"])} />}
                                </fieldset>
                            </section>
                            {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                                {i18n.language === "ar" && <FaEdit />}
                                <span className="me-2">{t("Save Changes")}</span>
                                {i18n.language !== "ar" && <FaEdit />}
                            </button>}
                            {waitMsg && <button disabled className="btn btn-primary w-100 mb-4">
                                <span className="me-2">{t(waitMsg)} ...</span>
                            </button>}
                            {(errorMsg || successMsg) && <button className={`p-2 btn w-100 mb-3 ${errorMsg ? "btn-danger" : ""} ${successMsg ? "btn-success" : ""}`}>{t(errorMsg || successMsg)}</button>}
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