import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getUserInfo, handleSelectUserLanguage, getInitialStateForElementBeforeAnimation, getAnimationSettings } from "../../../public/global_functions/popular";
import axios from "axios";
import { motion } from "motion/react";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";

export default function AddNewOffice() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [officeData, setOfficeData] = useState({
        name: "",
        ownerFullName: "",
        email: "",
        phoneNumber: "",
        description: "",
        services: [""],
        experiences: [],
        image: null,
    });

    const officeImageFileElementRef = useRef();

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
                    if (result.error) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                    }
                    setIsLoadingPage(false);
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                    }
                    else {
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                    setIsLoadingPage(false);
                });
        } else {
            setIsLoadingPage(false);
        }
    }, []);

    const addNewSelectService = () => {
        setOfficeData({ ...officeData, services: [...officeData.services, ""] });
    }

    const deleteSelectedService = (selectedServiceIndex) => {
        setOfficeData({ ...officeData, services: officeData.services.filter((_, index) => index !== selectedServiceIndex) });
    }

    const addNewSelectExperience = () => {
        setOfficeData({ ...officeData, services: [...officeData.services, ""] });
    }

    const deleteSelectedExperience = (selectedExperienceIndex) => {
        setOfficeData({ ...officeData, experiences: officeData.experiences.filter((_, index) => index !== selectedExperienceIndex) });
    }

    const addNewOffice = async (e) => {
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
        <div className="add-office">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Add Office")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content p-3">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Add Office")}</h1>
                    <form className="add-office-form text-center p-4" onSubmit={addNewOffice}>
                        <motion.section className="name mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <input
                                type="text"
                                className={`form-control office-name-field ${formValidationErrors["name"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder={t("Please Enter Your Office Name")}
                                onChange={(e) => setOfficeData({ ...officeData, name: e.target.value })}
                                value={officeData.name}
                            />
                            {formValidationErrors["name"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["name"])} />}
                        </motion.section>
                        <motion.section className="owner-full-name mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <input
                                type="text"
                                className={`form-control office-owner-full-name-field ${formValidationErrors["ownerFullName"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder={t("Please Enter Your Name")}
                                onChange={(e) => setOfficeData({ ...officeData, ownerFullName: e.target.value })}
                                value={officeData.ownerFullName}
                            />
                            {formValidationErrors["ownerFullName"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["ownerFullName"])} />}
                        </motion.section>
                        <motion.section className="owner-email mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <input
                                type="text"
                                className={`form-control office-owner-email-field ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder={t("Please Enter Your Email")}
                                onChange={(e) => setOfficeData({ ...officeData, email: e.target.value })}
                                value={officeData.email}
                            />
                            {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                        </motion.section>
                        <motion.section className="owner-email mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <input
                                type="text"
                                className={`form-control office-phone-number-field ${formValidationErrors["phoneNumber"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder={t("Please Enter Your Phone Number")}
                                onChange={(e) => setOfficeData({ ...officeData, phoneNumber: e.target.value })}
                                value={officeData.phoneNumber}
                            />
                            {formValidationErrors["phoneNumber"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["phoneNumber"])} />}
                        </motion.section>
                        <motion.section className="office-description mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <input
                                type="text"
                                className={`form-control office-description-field ${formValidationErrors["description"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder={t("Please Enter Office Description")}
                                onChange={(e) => setOfficeData({ ...officeData, description: e.target.value })}
                                value={officeData.description}
                            />
                            {formValidationErrors["description"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["description"])} />}
                        </motion.section>
                        <motion.section className="office-services mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <h6 className="fw-bold text-end mb-3">{t("Please Enter Your Office Services")}</h6>
                            {officeData.services.map((_, serviceIndex) => (
                                <div className="row align-items-center justify-content-center mb-4">
                                    <div className="col-md-11">
                                        <input
                                            type="text"
                                            className={`form-control office-service-field ${formValidationErrors["service"] ? "border-danger mb-3" : ""}`}
                                            placeholder={t("Please Enter Service")}
                                            onChange={(e) => setOfficeData({ ...officeData, services: e.target.value })}
                                            value={officeData?.services[serviceIndex]}
                                        />
                                        {formValidationErrors["services"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["services"])} />}
                                    </div>
                                    <div className="col-md-1">
                                        <FaRegPlusSquare className="plus-icon icon ms-4" onClick={addNewSelectService} />
                                        {officeData.services.length > 1 && <FaRegMinusSquare className="minus-icon icon" onClick={() => deleteSelectedService(serviceIndex)} />}
                                    </div>
                                </div>
                            ))}
                        </motion.section>
                        <motion.section className="office-experiences mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <h6 className="fw-bold text-end mb-3">{t("Please Enter Your Experiences")}</h6>
                            {officeData.experiences.map((_, experienceIndex) => (
                                <div className="row align-items-center justify-content-center mb-4">
                                    <div className="col-md-11">
                                        <input
                                            type="text"
                                            className={`form-control office-experience-field ${formValidationErrors["service"] ? "border-danger mb-3" : ""}`}
                                            placeholder={t("Please Enter Experience")}
                                            onChange={(e) => setOfficeData({ ...officeData, experiences: e.target.value })}
                                            value={officeData?.experiences[experienceIndex]}
                                        />
                                        {formValidationErrors["experiences"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["experiences"])} />}
                                    </div>
                                    <div className="col-md-1">
                                        <FaRegPlusSquare className="plus-icon icon ms-4" onClick={addNewSelectExperience} />
                                        {officeData.services.length > 1 && <FaRegMinusSquare className="minus-icon icon" onClick={() => deleteSelectedExperience(experienceIndex)} />}
                                    </div>
                                </div>
                            ))}
                        </motion.section>
                        <motion.section className="image mb-4" initial={getInitialStateForElementBeforeAnimation()} whileInView={getAnimationSettings}>
                            <h6 className="fw-bold text-end mb-3">{t("Please Select Your Office Image")}</h6>
                            <input
                                type="file"
                                className={`form-control office-image-field ${formValidationErrors["image"] ? "border-danger mb-3" : "mb-4"}`}
                                placeholder={t("Please Enter Office Image")}
                                onChange={(e) => setOfficeData({ ...officeData, image: e.target.files[0] })}
                                ref={officeImageFileElementRef}
                                value={officeImageFileElementRef.current?.value}
                            />
                            {formValidationErrors["image"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                        </motion.section>
                        {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100 mb-4">
                            {t("Add")}
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