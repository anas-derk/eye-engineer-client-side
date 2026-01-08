import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import Header from "@/components/Header";
import DashboardSideBar from "@/components/DashboardSideBar";
import { inputValuesValidation } from "../../../../../public/global_functions/validations";
import { getUserInfo, getDateFormated, getOfficeDetails, handleSelectUserLanguage, getLanguagesInfoList } from "../../../../../public/global_functions/popular";
import NotFoundError from "@/components/NotFoundError";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { useTranslation } from "react-i18next";

export default function OfficeDetails({ officeId }) {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [officeDetails, setOfficeDetails] = useState({});

    const [waitMsg, setWaitMsg] = useState("");

    const [isWaitChangeOfficeImage, setIsWaitChangeOfficeImage] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [errorChangeOfficeImageMsg, setErrorChangeOfficeImageMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [successChangeOfficeImageMsg, setSuccessChangeOfficeImageMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const officeImageFileElementRef = useRef();

    const { t, i18n } = useTranslation();

    const router = useRouter();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const adminToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (adminToken) {
            getUserInfo()
                .then(async (result) => {
                    if (result.error) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    } else {
                        const adminDetails = result.data;
                        if (adminDetails.isWebsiteOwner) {
                            result = await getOfficeDetails(officeId, "admin", i18n.language);
                            if (!result.error) {
                                setOfficeDetails(result.data);
                                setIsLoadingPage(false);
                            }
                        } else {
                            await router.replace("/dashboard");
                        }
                    }
                })
                .catch(async (err) => {
                    console.log(err);
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else router.replace("/login");
    }, []);

    const handleChangeOfficeData = (fieldName, newValue, language) => {
        if (language) {
            officeDetails[fieldName][language] = newValue;
        } else {
            officeDetails[fieldName] = newValue;
        }
    }

    const updateOfficeData = async (officeId) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `nameIn${language.toUpperCase()}`,
                    value: officeDetails.name[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
                {
                    name: "ownerFullName",
                    value: officeDetails.ownerFullName,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "email",
                    value: officeDetails.email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, This Email Is Not Valid !!",
                        }
                    },
                },
                ...["ar", "en", "de", "tr"].map((language) => ({
                    name: `descriptionIn${language.toUpperCase()}`,
                    value: officeDetails.description[language],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/offices/update-office-info/${officeId}?language=${i18n.language}`, {
                    name: officeDetails.name,
                    ownerFullName: officeDetails.ownerFullName,
                    email: officeDetails.email,
                    description: officeDetails.description,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                if (!result.error) {
                    setWaitMsg("");
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg("");
                        clearTimeout(successTimeout);
                    }, 3000);
                } else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        clearTimeout(errorTimeout);
                    }, 3000);
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

    const changeOfficeImage = async (officeId) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "image",
                    value: officeDetails.image,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isImage: {
                            msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Image File !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setIsWaitChangeOfficeImage(true);
                let formData = new FormData();
                formData.append("officeImage", officeDetails.image);
                const result = (await axios.put(`${process.env.BASE_API_URL}/offices/change-office-image/${officeId}?language=${i18n.language}`, formData, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                if (!result.error) {
                    setIsWaitChangeOfficeImage(false);
                    setSuccessChangeOfficeImageMsg(result.msg);
                    let successTimeout = setTimeout(async () => {
                        setSuccessChangeOfficeImageMsg("");
                        officeImageFileElementRef.current.value = "";
                        setOfficeDetails({ ...officeDetails, imagePath: result.data.newOfficeImagePath });
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setErrorChangeOfficeImageMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorChangeOfficeImageMsg("");
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
                setIsWaitChangeOfficeImage(false);
                setErrorChangeOfficeImageMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorChangeOfficeImageMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="office-details dashboard">
            <Head>
                <title>{process.env.WEBSITE_NAME} {t("Office Details")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Content Section */}
                <section className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Office Details")}</h1>
                    <DashboardSideBar isWebsiteOwner={true} isEngineer={true} />
                    {officeDetails ? <section className="office-details-box p-3 data-box admin-dashbboard-data-box">
                        <table className="office-details-table managment-table bg-white admin-dashbboard-data-table w-100">
                            <tbody>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <td className="office-id-cell">
                                        {officeDetails._id}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Name")}</th>
                                    <td className="update-office-name-cell">
                                        <section className="office-name">
                                            {getLanguagesInfoList("name").map((el) => (
                                                <div key={el.fullLanguageName}>
                                                    <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                    <input
                                                        type="text"
                                                        placeholder={`${t("Please Enter New Office Name")} ${t(`In ${el.fullLanguageName}`)}`}
                                                        className={`form-control d-block mx-auto p-2 border-2 store-name-field ${formValidationErrors[el.formField] ? "border-danger mb-3" : "mb-4"}`}
                                                        defaultValue={officeDetails.name[el.internationalLanguageCode]}
                                                        onChange={(e) => handleChangeOfficeData("name", e.target.value.trim(), el.internationalLanguageCode)}
                                                    />
                                                    {formValidationErrors[el.formField] && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                </div>
                                            ))}
                                        </section>
                                    </td>
                                </tr>
                                <tr className="office-image-cell">
                                    <th className="office-image-cell">
                                        <img
                                            src={`${process.env.BASE_API_URL}/${officeDetails.imagePath}`}
                                            alt={t(`${officeDetails.title} Office Image !!`)}
                                            width="100"
                                            height="100"
                                            className="d-block mx-auto mb-4"
                                        />
                                    </th>
                                    <td className="update-office-image-cell">
                                        <section className="update-office-image mb-4">
                                            <input
                                                type="file"
                                                className={`form-control d-block mx-auto p-2 border-2 brand-image-field ${formValidationErrors["image"] ? "border-danger mb-3" : "mb-4"}`}
                                                onChange={(e) => setOfficeDetails({ ...officeDetails, image: e.target.files[0] })}
                                                accept=".png, .jpg, .webp"
                                                ref={officeImageFileElementRef}
                                                value={officeImageFileElementRef.current?.value}
                                            />
                                            {formValidationErrors["image"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                                        </section>
                                        {!isWaitChangeOfficeImage && !errorChangeOfficeImageMsg && !successChangeOfficeImageMsg &&
                                            <button
                                                className="btn btn-success d-block mb-3 w-50 mx-auto global-button"
                                                onClick={() => changeOfficeImage(officeId)}
                                            >{t("Change Image")}</button>
                                        }
                                        {isWaitChangeOfficeImage && <button
                                            className="btn btn-info d-block mb-3 mx-auto global-button"
                                        >{t("Please Wait")}</button>}
                                        {successChangeOfficeImageMsg && <button
                                            className="btn btn-success d-block mx-auto global-button"
                                            disabled
                                        >{t(successChangeOfficeImageMsg)}</button>}
                                        {errorChangeOfficeImageMsg && <button
                                            className="btn btn-danger d-block mx-auto global-button"
                                            disabled
                                        >{t(errorChangeOfficeImageMsg)}</button>}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Owner Full Name")}</th>
                                    <td className="update-owner-full-name-cell">
                                        <section className="office-owner-full-name">
                                            <input
                                                type="text"
                                                defaultValue={officeDetails.ownerFullName}
                                                className={`form-control d-block mx-auto p-2 border-2 office-owner-first-name-field ${formValidationErrors["ownerFullName"] ? "border-danger mb-3" : "mb-4"}`}
                                                placeholder={t("Please Enter New Owner Full Name")}
                                                onChange={(e) => setOfficeDetails({ ...officeDetails, ownerFullName: e.target.value })}
                                            />
                                            {formValidationErrors["ownerFullName"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["ownerFullName"])} />}
                                        </section>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Owner Email")}</th>
                                    <td className="update-owner-email-cell">
                                        <section className="office-owner-email">
                                            <input
                                                type="text"
                                                defaultValue={officeDetails.email}
                                                className={`form-control d-block mx-auto p-2 border-2 store-owner-email-field ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                                placeholder={t("Please Enter New Owner Email")}
                                                onChange={(e) => setOfficeDetails({ ...officeDetails, email: e.target.value })}
                                            />
                                            {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                                        </section>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Description")}</th>
                                    <td className="update-description-cell">
                                        <section className="office-description">
                                            {getLanguagesInfoList("description").map((el) => (
                                                <div key={el.fullLanguageName}>
                                                    <h6 className="fw-bold">{t(`In ${el.fullLanguageName}`)} :</h6>
                                                    <input
                                                        type="text"
                                                        placeholder={`${t("Please Enter New Description")} ${t(`In ${el.fullLanguageName}`)}`}
                                                        className={`form-control d-block mx-auto p-2 border-2 office-description-field ${formValidationErrors[el.formField] ? "border-danger mb-3" : "mb-4"}`}
                                                        defaultValue={officeDetails.description[el.internationalLanguageCode]}
                                                        onChange={(e) => handleChangeOfficeData("description", e.target.value.trim(), el.internationalLanguageCode)}
                                                    />
                                                    {formValidationErrors[el.formField] && <FormFieldErrorBox errorMsg={t(formValidationErrors[el.formField])} />}
                                                </div>
                                            ))}
                                        </section>
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Status")}</th>
                                    <td className="status-cell">
                                        {t(officeDetails.status)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Creating Order Date")}</th>
                                    <td className="creating-order-date-cell">
                                        {getDateFormated(officeDetails.creatingOrderDate)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Approve Order Date")}</th>
                                    <td className="approve-order-date-cell">
                                        {officeDetails.approveDate ? getDateFormated(officeDetails.approveDate) : "-----"}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Blocking Date")}</th>
                                    <td className="blocking-office-date-cell">
                                        {officeDetails.blockingDate ? getDateFormated(officeDetails.blockingDate) : "-----"}
                                    </td>
                                </tr>
                                {officeDetails.blockingReason && <tr>
                                    <th>{t("Blocking Reason")}</th>
                                    <td className="blocking-reason-cell">
                                        {officeDetails.blockingReason}
                                    </td>
                                </tr>}
                                <tr>
                                    <th>{t("Cancel Blocking Date")}</th>
                                    <td className="cancel-blocking-office-date-cell">
                                        {officeDetails.dateOfCancelBlocking ? getDateFormated(officeDetails.dateOfCancelBlocking) : "-----"}
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Actions")}</th>
                                    <td>
                                        {!waitMsg && !errorMsg && !successMsg && <button
                                            className="btn btn-success d-block mb-3 mx-auto global-button"
                                            onClick={() => updateOfficeData(officeId)}
                                        >{t("Update")}</button>}
                                        {waitMsg && <button
                                            className="btn btn-info d-block mb-3 mx-auto global-button"
                                        >{t("Please Wait")}</button>}
                                        {successMsg && <button
                                            className="btn btn-success d-block mx-auto global-button"
                                            disabled
                                        >{t(successMsg)}</button>}
                                        {errorMsg && <button
                                            className="btn btn-danger d-block mx-auto global-button"
                                            disabled
                                        >{t(errorMsg)}</button>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section> : <NotFoundError errorMsg="Sorry, This Store Is Not Found !!" />}
                </section>
                {/* End Content Section */}
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}

export async function getServerSideProps(context) {
    const officeId = context.query.officeId;
    if (!officeId) {
        return {
            redirect: {
                permanent: false,
                destination: "/admin-dashboard/stores-managment",
            },
        }
    } else {
        return {
            props: {
                officeId,
            },
        }
    }
}