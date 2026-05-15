import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import { getLanguagesInfoList } from "../../../public/global_functions/popular";

const fileTypes = ["PDF", "VIDEO", "Images", "ZIP", "Audios"];

const acceptedFileTypes = {
    PDF: ".pdf,application/pdf",
    VIDEO: "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
    Images: "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif",
    ZIP: ".zip,application/zip,application/x-zip-compressed,multipart/x-zip",
    Audios: "audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm,.mp3,.m4a,.wav,.ogg,.webm",
};

const isSuitableFileForType = (file, type) => {
    if (!file || !type) return true;
    const mimeType = file.type;
    return (
        (type === "PDF" && mimeType === "application/pdf") ||
        (type === "VIDEO" && mimeType.startsWith("video/")) ||
        (type === "Images" && mimeType.startsWith("image/")) ||
        (type === "ZIP" && ["application/zip", "application/x-zip-compressed", "multipart/x-zip"].includes(mimeType)) ||
        (type === "Audios" && mimeType.startsWith("audio/"))
    );
}

export default function UpdateFile({
    selectedFile,
    setIsDisplayUpdateFileBox,
    setSelectedFileIndex,
    handleUpdateFile
}) {

    const [fileData, setFileData] = useState({
        name: {
            ar: selectedFile?.name?.ar || "",
            en: selectedFile?.name?.en || "",
            de: selectedFile?.name?.de || "",
            tr: selectedFile?.name?.tr || "",
        },
        type: selectedFile?.type || "",
        file: null,
    });
    const [waitMsg, setWaitMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef(null);

    const handleClosePopupBox = () => {
        setSelectedFileIndex(-1);
        setIsDisplayUpdateFileBox(false);
    }

    const handleChangeFileType = (type) => {
        const isInvalidCurrentFile = fileData.file && !isSuitableFileForType(fileData.file, type);
        if (isInvalidCurrentFile && fileInputRef.current) fileInputRef.current.value = "";
        setFileData({
            ...fileData,
            type,
            file: isInvalidCurrentFile ? null : fileData.file,
        });
        setFormValidationErrors({
            ...formValidationErrors,
            file: isInvalidCurrentFile ? "Sorry, Uploaded File Does Not Match Selected File Type !!" : "",
        });
    }

    const handleChangeFile = (file) => {
        if (file && fileData.type && !isSuitableFileForType(file, fileData.type)) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            setFileData({ ...fileData, file: null });
            setFormValidationErrors({
                ...formValidationErrors,
                file: "Sorry, Uploaded File Does Not Match Selected File Type !!",
            });
            return;
        }
        setFileData({ ...fileData, file });
        setFormValidationErrors({
            ...formValidationErrors,
            file: "",
        });
    }

    const updateFile = async () => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                ...getLanguagesInfoList("name").map((language) => ({
                    name: language.formField,
                    value: fileData.name[language.internationalLanguageCode],
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                })),
                {
                    name: "type",
                    value: fileData.type,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
            ]);
            if (fileData.file && !isSuitableFileForType(fileData.file, fileData.type)) {
                errorsObject.file = "Sorry, Uploaded File Does Not Match Selected File Type !!";
            }
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const formData = new FormData();
                formData.append("name", JSON.stringify(fileData.name));
                formData.append("type", fileData.type);
                if (fileData.file) formData.append("file", fileData.file);
                const result = (await axios.put(`${process.env.BASE_API_URL}/files/${selectedFile._id}?language=${i18n.language}`, formData, {
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
                        await handleUpdateFile();
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
            setErrorMsg(err?.response?.data?.msg || (err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!"));
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className="update-file add-file add-link popup-box">
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Update File")}</h2>
                <section className="name mb-4 w-100">
                    {getLanguagesInfoList("name").map((language) => (
                        <div key={language.fullLanguageName} className="mb-4">
                            <h6 className="fw-bold">{t(`In ${language.fullLanguageName}`)} :</h6>
                            <input
                                type="text"
                                placeholder={`${t("Please Enter File Name")} ${t(`In ${language.fullLanguageName}`)}`}
                                className={`form-control p-3 border-2 ${formValidationErrors[language.formField] ? "border-danger mb-3" : ""}`}
                                value={fileData.name[language.internationalLanguageCode]}
                                onChange={(e) => setFileData({
                                    ...fileData,
                                    name: {
                                        ...fileData.name,
                                        [language.internationalLanguageCode]: e.target.value,
                                    },
                                })}
                            />
                            {formValidationErrors[language.formField] && <FormFieldErrorBox errorMsg={t(formValidationErrors[language.formField])} />}
                        </div>
                    ))}
                </section>
                <section className="type mb-4 w-100">
                    <select
                        className={`form-control p-3 border-2 ${formValidationErrors["type"] ? "border-danger mb-3" : ""}`}
                        value={fileData.type}
                        onChange={(e) => handleChangeFileType(e.target.value)}
                    >
                        <option value="">{t("Please Select File Type")}</option>
                        {fileTypes.map((type) => (
                            <option key={type} value={type}>{t(type)}</option>
                        ))}
                    </select>
                    {formValidationErrors["type"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["type"])} />}
                </section>
                <section className="file mb-4 w-100">
                    <h6 className="mb-3 fw-bold">{t("Select New File")}</h6>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className={`form-control p-3 border-2 ${formValidationErrors["file"] ? "border-danger mb-3" : ""}`}
                        accept={acceptedFileTypes[fileData.type] || ""}
                        onChange={(e) => handleChangeFile(e.target.files[0])}
                    />
                    {formValidationErrors["file"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["file"])} />}
                </section>
                {!waitMsg && !errorMsg && !successMsg && <button
                    className="btn btn-success d-block mx-auto mb-4 global-button"
                    onClick={updateFile}
                >
                    {t("Update")}
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
