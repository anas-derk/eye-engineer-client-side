import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";
import { getAllGeometriesInsideThePage } from "../../../public/global_functions/popular";
import { IoIosCloseCircleOutline } from "react-icons/io";

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

export default function AddFile({
    setIsDisplayAddFileBox,
    handleAddNewFile
}) {

    const [fileData, setFileData] = useState({
        name: "",
        type: "",
        file: null,
    });
    const [searchedGeometryName, setSearchedGeometryName] = useState("");
    const [searchedGeometries, setSearchedGeometries] = useState([]);
    const [selectedGeometries, setSelectedGeometries] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();
    const { t, i18n } = useTranslation();
    const fileInputRef = useRef(null);

    const handleClosePopupBox = () => {
        setIsDisplayAddFileBox(false);
    }

    const handleGetGeometriesByName = async (e) => {
        try {
            setWaitMsg("Please Waiting To Get Geometries ...");
            const searchedGeometryName = e.target.value;
            setSearchedGeometryName(searchedGeometryName);
            if (searchedGeometryName) {
                const geometries = (await getAllGeometriesInsideThePage(1, 1000, `name=${searchedGeometryName}`, "admin", i18n.language)).data.geometries;
                const selectedIds = selectedGeometries.map((geometry) => geometry._id);
                setSearchedGeometries(geometries.filter((geometry) => !selectedIds.includes(geometry._id)));
            } else {
                setSearchedGeometries([]);
            }
            setWaitMsg("");
        }
        catch (err) {
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error On Search !!" : "Sorry, Someting Went Wrong, Please Repeate The Search !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 1500);
        }
    }

    const handleSelectGeometry = (selectedGeometry) => {
        if (!selectedGeometries.some((geometry) => geometry._id === selectedGeometry._id)) {
            setSearchedGeometries(searchedGeometries.filter((geometry) => geometry._id !== selectedGeometry._id));
            setSelectedGeometries([...selectedGeometries, selectedGeometry]);
        }
    }

    const handleRemoveGeometryFromSelectedGeometriesList = (geometry) => {
        setSelectedGeometries(selectedGeometries.filter((selectedGeometry) => geometry._id !== selectedGeometry._id));
        if (searchedGeometryName) setSearchedGeometries([...searchedGeometries, geometry]);
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

    const addFile = async () => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: fileData.name,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "type",
                    value: fileData.type,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "file",
                    value: fileData.file,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "geometries",
                    value: selectedGeometries,
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
                setWaitMsg("Saving");
                const formData = new FormData();
                formData.append("name", fileData.name);
                formData.append("type", fileData.type);
                formData.append("file", fileData.file);
                formData.append("geometries", JSON.stringify(selectedGeometries.map((geometry) => geometry._id)));
                const result = (await axios.post(`${process.env.BASE_API_URL}/files/add?language=${i18n.language}`, formData, {
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
                        await handleAddNewFile();
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
                setErrorMsg(err?.response?.data?.msg || (err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!"));
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 3000);
            }
        }
    }

    return (
        <div className="add-file add-link popup-box">
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Add New File")}</h2>
                <section className="name mb-4 w-100">
                    <input
                        type="text"
                        placeholder={t("Please Enter File Name")}
                        className={`form-control p-3 border-2 ${formValidationErrors["name"] ? "border-danger mb-3" : ""}`}
                        onChange={(e) => setFileData({ ...fileData, name: e.target.value.trim() })}
                    />
                    {formValidationErrors["name"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["name"])} />}
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
                    <input
                        ref={fileInputRef}
                        type="file"
                        className={`form-control p-3 border-2 ${formValidationErrors["file"] ? "border-danger mb-3" : ""}`}
                        accept={acceptedFileTypes[fileData.type] || ""}
                        onChange={(e) => handleChangeFile(e.target.files[0])}
                    />
                    {formValidationErrors["file"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["file"])} />}
                </section>
                <section className="geometries mb-4 w-100">
                    <h6 className="mb-3 fw-bold">{t("Please Select Geometries")}</h6>
                    <div className="select-geometries-box select-box">
                        <input
                            type="text"
                            className="search-box form-control p-2 border-2 mb-4"
                            placeholder={t("Please Enter Geometry Name Or Part Of This")}
                            onChange={handleGetGeometriesByName}
                        />
                        <ul className={`geometries-list options-list bg-white border ${formValidationErrors["geometries"] ? "border-danger mb-4" : "border-dark"}`}>
                            <li className="text-center fw-bold border-bottom border-2 border-dark">{t("Existed Geometries List")}</li>
                            {searchedGeometries.length > 0 && searchedGeometries.map((geometry) => (
                                <li key={geometry._id} onClick={() => handleSelectGeometry(geometry)}>{geometry.name[i18n.language]}</li>
                            ))}
                        </ul>
                        {searchedGeometries.length === 0 && searchedGeometryName && <p className="alert alert-danger mt-4">{t("Sorry, Can't Find Any Related Geometries Match This Name !!")}</p>}
                        {formValidationErrors["geometries"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["geometries"])} />}
                    </div>
                </section>
                {selectedGeometries.length > 0 ? <div className="selected Geometries row mb-4 w-100">
                    {selectedGeometries.map((geometry) => <div className="col-md-4 mb-3" key={geometry._id}>
                        <div className="selected-geometry-box p-2 border border-2 border-dark text-center">
                            <span className={`${i18n.language !== "ar" ? "me-2" : "ms-2"} geometry-name`}>{geometry.name[i18n.language]}</span>
                            <IoIosCloseCircleOutline className="remove-icon" onClick={() => handleRemoveGeometryFromSelectedGeometriesList(geometry)} />
                        </div>
                    </div>)}
                </div> : <FormFieldErrorBox errorMsg={t("Sorry, Can't Find Any Geometries Added To The Selected Geometries List !!")} />}
                {!waitMsg && !errorMsg && !successMsg && <button
                    className="btn btn-success d-block mx-auto mb-4 global-button"
                    onClick={addFile}
                >
                    {t("Add")}
                </button>}
                {waitMsg && <button className="btn btn-info d-block mx-auto mb-3 global-button" disabled>{t(waitMsg)}</button>}
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
