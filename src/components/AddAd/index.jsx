import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";

export default function AddAd({
    setIsDisplayAddAdBox,
    allAds,
    setAllAds
}) {

    const [advertisementType, setAdvertisementType] = useState("");

    const [adData, setAdData] = useState({
        content: "",
        image: null
    });

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const adTypes = ["text", "image"];

    const adImageFileElementRef = useRef();

    const router = useRouter();

    const { t, i18n } = useTranslation();

    const handleClosePopupBox = () => {
        setIsDisplayAddAdBox(false);
    }

    const addAd = async () => {
        try {
            setFormValidationErrors({});
            let validationInputs = [];
            if (advertisementType === "text") {
                validationInputs = [
                    {
                        name: "type",
                        value: advertisementType,
                        rules: {
                            isRequired: {
                                msg: "Sorry, This Field Can't Be Empty !!",
                            },
                        },
                    },
                    {
                        name: "content",
                        value: adData.content,
                        rules: {
                            isRequired: {
                                msg: "Sorry, This Field Can't Be Empty !!",
                            },
                        },
                    },
                ];
            } else {
                validationInputs = [
                    {
                        name: "type",
                        value: advertisementType,
                        rules: {
                            isRequired: {
                                msg: "Sorry, This Field Can't Be Empty !!",
                            },
                        },
                    },
                    {
                        name: "image",
                        value: adData.image,
                        rules: {
                            isRequired: {
                                msg: "Sorry, This Field Can't Be Empty !!",
                            },
                            isImage: {
                                msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Or WEBP Image File !!",
                            },
                        },
                    },
                ];
            }
            const errorsObject = inputValuesValidation(validationInputs);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Saving");
                let formData = null;
                if (advertisementType === "image") {
                    formData = new FormData();
                    formData.append("adImage", adData.image);
                }
                const result = (await axios.post(`${process.env.BASE_API_URL}/ads/add-${advertisementType}-ad?language=${i18n.language}`, formData ?? { content: adData.content }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg("Adding Successfull !!");
                    let successTimeout = setTimeout(async () => {
                        setSuccessMsg("");
                        handleClosePopupBox();
                        setAllAds([...allAds, result.data]);
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
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
                setErrorMsg(err?.message === "Network Error" ?? "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 3000);
            }
        }
    }

    return (
        <div className="add-ad popup-box">
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-4 pb-3 border-bottom border-white">{t("Add New Ad")}</h2>
                <section className="select-advertisement-type w-100">
                    <select
                        className={`select-advertisement-type form-select${i18n.language === "ar" ? " ar" : ""} mb-4`}
                        onChange={(e) => setAdvertisementType(e.target.value)}
                        value={advertisementType}
                    >
                        <option value="" hidden>{t("Please Select Advertisement Type")}</option>
                        {adTypes.map((type) => (
                            <option value={type}>{t(type.replace(type[0], type[0].toUpperCase()))}</option>
                        ))}
                    </select>
                    {formValidationErrors["type"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["type"])} />}
                </section>
                {advertisementType === "text" && <section className="content mb-4 w-100">
                    <textarea
                        placeholder={t("Please Enter Content Here")}
                        className={`form-control p-3 border-2 ${formValidationErrors["content"] ? "border-danger mb-3" : ""}`}
                        onChange={(e) => setAdData({ ...adData, content: e.target.value.trim() })}
                    />
                    {formValidationErrors["content"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["content"])} />}
                </section>}
                {advertisementType === "image" && <section className="image mb-4 w-100">
                    <input
                        type="file"
                        className={`form-control ad-image-field ${formValidationErrors["image"] ? "border-danger mb-3" : "mb-4"}`}
                        placeholder={t("Please Enter Image")}
                        onChange={(e) => setAdData({ ...adData, image: e.target.files[0] })}
                        ref={adImageFileElementRef}
                        value={adImageFileElementRef.current?.value}
                    />
                    {formValidationErrors["image"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                </section>}
                {
                    !waitMsg &&
                    !errorMsg &&
                    !successMsg &&
                    <button
                        className="btn btn-success d-block mx-auto mb-4 global-button"
                        onClick={addAd}
                    >
                        {t("Add")}
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
                {!waitMsg && !successMsg && !errorMsg && <button
                    className="btn btn-danger d-block mx-auto global-button"
                    disabled={waitMsg || errorMsg || successMsg}
                    onClick={handleClosePopupBox}
                >
                    {t("Close")}
                </button>}
            </div>
        </div>
    );
}