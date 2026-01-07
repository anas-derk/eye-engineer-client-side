import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import axios from "axios";
import { useRouter } from "next/router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { useTranslation } from "react-i18next";
import { handleSelectUserLanguage } from "../../../public/global_functions/popular";
import FormFieldErrorBox from "../FormFieldErrorBox";

export default function ChangeOfficeStatusBox({
    setIsDisplayChangeOfficeStatusBox,
    setOfficeAction,
    selectedOffice,
    officeAction,
    handleChangeOfficeStatus,
}) {

    const [changeStatusReason, setChangeStatusReason] = useState("");

    const [adminPassword, setAdminPassword] = useState("");

    const [isVisiblePassword, setIsVisiblePassword] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();

    const { i18n, t } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : i18n.language, i18n.changeLanguage);
    }, []);

    const handleClosePopupBox = () => {
        setIsDisplayChangeOfficeStatusBox(false);
        setOfficeAction("");
    }

    const approveOfficeCreate = async (officeId) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "adminPassword",
                    value: adminPassword,
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
                setWaitMsg("Please Wait");
                const result = (await axios.post(`${process.env.BASE_API_URL}/offices/approve-office/${officeId}?password=${adminPassword}&language=${i18n.language}`, undefined,
                    {
                        headers: {
                            Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                        }
                    }
                )).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(async () => {
                        setSuccessMsg("");
                        handleClosePopupBox();
                        handleChangeOfficeStatus("approving");
                        clearTimeout(successTimeout);
                    }, 3000);
                }
                else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
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
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const rejectOfficeCreate = async (officeId) => {
        try {
            setWaitMsg("Please Wait");
            const result = (await axios.delete(`${process.env.BASE_API_URL}/offices/reject-office/${officeId}?language=${i18n.language}`,
                {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                }
            )).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg(result.msg);
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    handleClosePopupBox();
                    handleChangeOfficeStatus("rejecting");
                    clearTimeout(successTimeout);
                }, 3000);
            }
            else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
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

    const blockingOffice = async (officeId, changeStatusReason) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "changeStatusReason",
                    value: changeStatusReason,
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
                const result = (await axios.put(`${process.env.BASE_API_URL}/offices/blocking-office/${officeId}?blockingReason=${changeStatusReason}&language=${i18n.language}`, undefined,
                    {
                        headers: {
                            Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                        }
                    }
                )).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(async () => {
                        setSuccessMsg("");
                        handleClosePopupBox();
                        handleChangeOfficeStatus("blocking");
                        clearTimeout(successTimeout);
                    }, 3000);
                }
                else {
                    setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
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
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const cancelBlockingOffice = async (officeId) => {
        try {
            setWaitMsg("Please Wait");
            const result = (await axios.put(`${process.env.BASE_API_URL}/offices/cancel-blocking/${officeId}?language=${i18n.language}`, undefined,
                {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                }
            )).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg(result.msg);
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    handleClosePopupBox();
                    handleChangeOfficeStatus("approving");
                    clearTimeout(successTimeout);
                }, 3000);
            }
            else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
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
        <div className="change-office-status-box popup-box">
            <div className="content-box d-flex align-items-center justify-content-center text-white flex-column p-4 text-center">
                {!waitMsg && !errorMsg && !successMsg && <GrFormClose className="close-popup-box-icon" onClick={handleClosePopupBox} />}
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Change Office Status")}</h2>
                <h4 className="mb-4">{t("Are You Sure From")}: {t(`Office ${officeAction}`)}: ( {selectedOffice.name[i18n.language]} ) {t("?")}</h4>
                <form className="change-office-status-form w-50" onSubmit={(e) => e.preventDefault()}>
                    {officeAction === "blocking" && <section className="change-office-status mb-4">
                        <input
                            type="text"
                            className={`form-control p-3 border-2 change-status-reason-field ${formValidationErrors["changeStatusReason"] ? "border-danger mb-3" : "mb-4"}`}
                            placeholder={t(`Please Enter ${officeAction} Reason`)}
                            onChange={(e) => setChangeStatusReason(e.target.value)}
                            value={changeStatusReason}
                        />
                        {formValidationErrors["changeStatusReason"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["changeStatusReason"])} />}
                    </section>}
                    {
                        !waitMsg &&
                        !errorMsg &&
                        !successMsg &&
                        officeAction === "approving" && <section className="change-office-status mb-4">
                            <div className="password-field-box field-box">
                                <input
                                    type={isVisiblePassword ? "text" : "password"}
                                    placeholder={t("Please Enter Engineer Account Password")}
                                    className={`form-control p-3 border-2 ${formValidationErrors["isVisiblePassword"] ? "border-danger mb-3" : "mb-5"}`}
                                    onChange={(e) => setAdminPassword(e.target.value.trim())}
                                />
                                <div className={`icon-box ${i18n.language !== "ar" ? "other-languages-mode" : "ar-language-mode"}`}>
                                    {!isVisiblePassword && <AiOutlineEye className="eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                    {isVisiblePassword && <AiOutlineEyeInvisible className="invisible-eye-icon icon" onClick={() => setIsVisiblePassword(value => value = !value)} />}
                                </div>
                            </div>
                            {formValidationErrors["adminPassword"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["adminPassword"])} />}
                        </section>
                    }
                    {
                        !waitMsg &&
                        !errorMsg &&
                        !successMsg &&
                        officeAction === "approving" &&
                        <button
                            className="btn btn-success d-block mx-auto mb-4 global-button"
                            onClick={() => approveOfficeCreate(selectedOffice._id)}
                        >
                            {t("Approve")}
                        </button>
                    }
                    {
                        !waitMsg &&
                        !errorMsg &&
                        !successMsg &&
                        officeAction === "rejecting" &&
                        <button
                            className="btn btn-success d-block mx-auto mb-4 global-button"
                            onClick={() => rejectOfficeCreate(selectedOffice._id)}
                        >
                            {t("Reject")}
                        </button>
                    }
                    {
                        !waitMsg &&
                        !errorMsg &&
                        !successMsg &&
                        officeAction === "blocking" &&
                        <button
                            className="btn btn-success d-block mx-auto mb-4 global-button"
                            onClick={() => blockingOffice(selectedOffice._id, changeStatusReason)}
                        >
                            {t("Block")}
                        </button>
                    }
                    {
                        !waitMsg &&
                        !errorMsg &&
                        !successMsg &&
                        officeAction === "cancel-blocking" &&
                        <button
                            className="btn btn-success d-block mx-auto mb-4 global-button"
                            onClick={() => cancelBlockingOffice(selectedOffice._id)}
                        >
                            {t("Cancel Blocking")}
                        </button>
                    }
                    {waitMsg &&
                        <button
                            className="btn btn-info d-block mx-auto mb-3 global-button"
                            disabled
                        >
                            {t(waitMsg)}
                        </button>
                    }
                    {errorMsg &&
                        <button
                            className="btn btn-danger d-block mx-auto mb-3 global-button"
                            disabled
                        >
                            {t(errorMsg)}
                        </button>
                    }
                    {successMsg &&
                        <button
                            className="btn btn-success d-block mx-auto mb-3 global-button"
                            disabled
                        >
                            {t(successMsg)}
                        </button>
                    }
                    <button
                        className="btn btn-danger d-block mx-auto global-button"
                        disabled={waitMsg || errorMsg || successMsg}
                        onClick={handleClosePopupBox}
                    >
                        {t("Close")}
                    </button>
                </form>
            </div>
        </div>
    );
}