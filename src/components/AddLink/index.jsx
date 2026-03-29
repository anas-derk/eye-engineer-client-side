import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";
import { getAllGeometriesInsideThePage } from "../../../public/global_functions/popular";

export default function AddLink({
    setIsDisplayAddLinkBox,
    handleAddNewLink
}) {

    const [linkData, setLinkData] = useState({
        title: "",
        url: "",
        geometries: [],
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

    const handleClosePopupBox = () => {
        setIsDisplayAddLinkBox(false);
    }

    const handleGetGeometriesByName = async (e) => {
        try {
            setWaitMsg("Please Waiting To Get Geometries ...");
            const searchedGeometryName = e.target.value;
            setSearchedGeometryName(searchedGeometryName);
            if (searchedGeometryName) {
                setSearchedGeometries((await getAllGeometriesInsideThePage(1, 1000, `storeId=${adminInfo.storeId}&name=${searchedGeometryName}`)).data.geometries);
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
        if ((selectedGeometries.filter((geometry) => geometry._id !== selectedGeometry._id)).length === selectedGeometries.length) {
            setSearchedGeometries(searchedGeometries.filter((geometry) => geometry._id !== selectedGeometry._id));
            setSelectedGeometries([...selectedGeometries, selectedGeometry]);
        }
    }

    const handleRemoveGeometryFromSelectedGeometriesList = (geometry) => {
        setSelectedGeometries(selectedGeometries.filter((selectedGeometry) => geometry._id !== selectedGeometry._id));
        if (searchedGeometryName) setSearchedGeometries([...searchedGeometries, geometry]);
    }

    const addLink = async () => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "title",
                    value: linkData.title,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "url",
                    value: linkData.url,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isURL: {
                            msg: "Sorry, This URL Is Not Valid !!",
                        }
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Saving");
                const result = (await axios.post(`${process.env.BASE_API_URL}/links/add?language=${i18n.language}`, formData, {
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
                        await handleAddNewLink();
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
        <div className="add-link popup-box">
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Add New Link")}</h2>
                <section className="title mb-4 w-100">
                    <input
                        type="text"
                        placeholder={t("Please Enter Title")}
                        className={`form-control p-3 border-2 ${formValidationErrors["title"] ? "border-danger mb-3" : ""}`}
                        onChange={(e) => setLinkData({ ...linkData, title: e.target.value.trim() })}
                    />
                    {formValidationErrors["title"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["title"])} />}
                </section>
                <section className="url mb-4 w-100">
                    <input
                        type="text"
                        placeholder={t("Please Enter Link")}
                        className={`form-control p-3 border-2 ${formValidationErrors["url"] ? "border-danger mb-3" : ""}`}
                        onChange={(e) => setLinkData({ ...linkData, url: e.target.value.trim() })}
                    />
                    {formValidationErrors["url"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["url"])} />}
                </section>
                <section className="geometries mb-4 overflow-auto">
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
                                <li key={geometry._id} onClick={() => handleSelectGeometry(geometry)}>{geometry.name}</li>
                            ))}
                        </ul>
                        {searchedGeometries.length === 0 && searchedGeometryName && <p className="alert alert-danger mt-4">{t("Sorry, Can't Find Any Related Geometries Match This Name") + " !!"}</p>}
                        {formValidationErrors["geometries"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["geometries"])} />}
                    </div>
                </section>
                {selectedGeometries.length > 0 ? <div className="selected Geometries row mb-4">
                    {selectedGeometries.map((geometry) => <div className="col-md-4 mb-3" key={geometry._id}>
                        <div className="selected-geometry-box bg-white p-2 border border-2 border-dark text-center">
                            <span className="me-2 geometry-name">{geometry.name}</span>
                            <IoIosCloseCircleOutline className="remove-icon" onClick={() => handleRemoveGeometryFromSelectedGeometriesList(geometry)} />
                        </div>
                    </div>)}
                </div> : <FormFieldErrorBox errorMsg={t("Sorry, Can't Find Any Geometries Added To The Selected Geometries List !!")} />}
                {
                    !waitMsg &&
                    !errorMsg &&
                    !successMsg &&
                    <button
                        className="btn btn-success d-block mx-auto mb-4 global-button"
                        onClick={addLink}
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