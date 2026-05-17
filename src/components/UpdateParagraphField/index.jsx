import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { getLanguagesInfoList } from "../../../public/global_functions/popular";
import ArticleRichEditor from "../ArticleRichEditor";
import FormFieldErrorBox from "../FormFieldErrorBox";

const fieldSettings = {
    title: {
        modalTitle: "Update Article Title",
        placeholder: "Please Enter Article Title",
        sectionClassName: "update-paragraph-title",
        inputType: "input",
    },
    content: {
        modalTitle: "Update Article Content",
        placeholder: "Please Enter Article Content",
        sectionClassName: "update-paragraph-content",
        inputType: "textarea",
    },
};

export default function UpdateParagraphField({
    paragraph,
    fieldName,
    setIsDisplayUpdateParagraphFieldBox,
    setSelectedParagraphIndex,
    handleUpdateParagraphField,
}) {
    const settings = fieldSettings[fieldName] || fieldSettings.title;
    const { t, i18n } = useTranslation();
    const [activeLanguage, setActiveLanguage] = useState(i18n.language);
    const [fieldValue, setFieldValue] = useState({
        ar: paragraph?.[fieldName]?.ar || "",
        en: paragraph?.[fieldName]?.en || "",
        de: paragraph?.[fieldName]?.de || "",
        tr: paragraph?.[fieldName]?.tr || "",
    });
    const [waitMsg, setWaitMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();

    const handleClosePopupBox = () => {
        setSelectedParagraphIndex(-1);
        setIsDisplayUpdateParagraphFieldBox(false);
    }

    const updateActiveLanguageValue = (value) => {
        setFieldValue({
            ...fieldValue,
            [activeLanguage]: value,
        });
    }

    const updateParagraphField = async () => {
        try {
            setFormValidationErrors({});
            const activeFieldName = `${fieldName}In${activeLanguage.toUpperCase()}`;
            const errorsObject = inputValuesValidation([
                {
                    name: activeFieldName,
                    value: fieldValue[activeLanguage],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                }
            ]);
            if (fieldName === "content" && !((fieldValue[activeLanguage] || "").replace(/<[^>]*>/g, "").trim() || (fieldValue[activeLanguage] || "").includes("<img"))) {
                errorsObject[activeFieldName] = "Sorry, This Field Can't Be Empty !!";
            }
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length === 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.put(`${process.env.BASE_API_URL}/paragraphs/${paragraph._id}?language=${i18n.language}`, {
                    [fieldName]: fieldValue[activeLanguage],
                    sourceLanguage: activeLanguage,
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
                        handleClosePopupBox();
                        await handleUpdateParagraphField();
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
                return;
            }
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className={`update-paragraph-field ${settings.sectionClassName} add-link popup-box`}>
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-5 pb-3 border-bottom border-white">{t(settings.modalTitle)}</h2>
                <ul className="paragraph-update-language-tabs mb-4" role="tablist">
                    {getLanguagesInfoList(fieldName).map((language) => (
                        <li key={language.internationalLanguageCode}>
                            <button
                                type="button"
                                className={`paragraph-update-language-tab ${activeLanguage === language.internationalLanguageCode ? "active" : ""}`}
                                onClick={() => setActiveLanguage(language.internationalLanguageCode)}
                            >
                                {t(language.fullLanguageName)}
                            </button>
                        </li>
                    ))}
                </ul>
                {fieldName === "content" ? <section className="article-content mb-4 w-100">
                    <ArticleRichEditor
                        key={activeLanguage}
                        value={fieldValue[activeLanguage]}
                        onChange={updateActiveLanguageValue}
                        placeholder={t("Write The Article Here")}
                        language={activeLanguage}
                        errorMsg={formValidationErrors[`contentIn${activeLanguage.toUpperCase()}`]}
                    />
                    {formValidationErrors[`contentIn${activeLanguage.toUpperCase()}`] && <FormFieldErrorBox errorMsg={t(formValidationErrors[`contentIn${activeLanguage.toUpperCase()}`])} />}
                </section> : <section className="article-title mb-4 w-100">
                    <input
                        type="text"
                        dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                        placeholder={t(settings.placeholder)}
                        className={`form-control p-3 border-2 ${formValidationErrors[`titleIn${activeLanguage.toUpperCase()}`] ? "border-danger mb-3" : ""}`}
                        value={fieldValue[activeLanguage]}
                        onChange={(e) => updateActiveLanguageValue(e.target.value)}
                    />
                    {formValidationErrors[`titleIn${activeLanguage.toUpperCase()}`] && <FormFieldErrorBox errorMsg={t(formValidationErrors[`titleIn${activeLanguage.toUpperCase()}`])} />}
                </section>}
                {!waitMsg && !errorMsg && !successMsg && <button
                    className="btn btn-success d-block mx-auto mb-4 global-button"
                    onClick={updateParagraphField}
                >
                    {t("Save Changes")}
                </button>}
                {waitMsg && <button className="btn btn-info d-block mx-auto mb-3 global-button" disabled>{t(waitMsg)} ...</button>}
                {errorMsg && <button className="btn btn-danger d-block mx-auto mb-3 global-button" disabled>{t(errorMsg)}</button>}
                {successMsg && <button className="btn btn-success d-block mx-auto mb-3 global-button" disabled>{t(successMsg)}</button>}
                {!waitMsg && !successMsg && !errorMsg && <button
                    className="btn btn-danger d-block mx-auto global-button"
                    onClick={handleClosePopupBox}
                >
                    {t("Close")}
                </button>}
            </div>
        </div>
    );
}
