import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";
import { getAllGeometriesInsideThePage } from "../../../public/global_functions/popular";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function UpdateGeometries({
    setIsDisplayUpdateRelatedGeometriesBox,
    handleUpdateRelatedGeometriestBox,
    currentGeometries = [],
    endpointName = "links",
    linkId,
    itemId,
    setSelectedLinkIndex
}) {

    const [searchedGeometryName, setSearchedGeometryName] = useState("");
    const [searchedGeometries, setSearchedGeometries] = useState([]);
    const [selectedGeometries, setSelectedGeometries] = useState(currentGeometries);
    const [waitMsg, setWaitMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();
    const { t, i18n } = useTranslation();

    const handleClosePopupBox = () => {
        setSelectedLinkIndex(-1);
        setIsDisplayUpdateRelatedGeometriesBox(false);
    }

    const handleGetGeometriesByName = async (e) => {
        try {
            setWaitMsg("Please Waiting To Get Geometries ...");
            const geometryName = e.target.value;
            setSearchedGeometryName(geometryName);
            if (geometryName) {
                const geometries = (await getAllGeometriesInsideThePage(1, 1000, `name=${geometryName}`, "admin", i18n.language)).data.geometries;
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
            setFormValidationErrors({});
        }
    }

    const handleRemoveGeometryFromSelectedGeometriesList = (geometry) => {
        setSelectedGeometries(selectedGeometries.filter((selectedGeometry) => geometry._id !== selectedGeometry._id));
        if (searchedGeometryName) setSearchedGeometries([...searchedGeometries, geometry]);
    }

    const updateRelatedGeometries = async () => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
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
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Saving");
                const result = (await axios.put(`${process.env.BASE_API_URL}/${endpointName}/${itemId || linkId}?language=${i18n.language}`, {
                    geometries: selectedGeometries.map((geometry) => geometry._id),
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
                        await handleUpdateRelatedGeometriestBox();
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
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 3000);
            }
        }
    }

    return (
        <div className="update-related-geometries add-link popup-box">
            <div className="content-box ee-update-geometries-box d-flex align-items-center flex-column p-4 text-center">
                <h2 className="ee-update-geometries-title mb-5 pb-3 border-bottom">{t("Update Related Geometries")}</h2>
                <section className="current-geometries mb-4 w-100">
                    <h6 className="ee-update-geometries-section-title mb-3 fw-bold">{t("Current Geometries")}</h6>
                    {currentGeometries.length > 0 ? <div className="row w-100 mx-0">
                        {currentGeometries.map((geometry) => (
                            <div className="col-md-4 mb-3" key={geometry._id}>
                                <div className="ee-update-geometries-chip selected-geometry-box p-2 border border-2 text-center">
                                    <span className="geometry-name">{geometry.name[i18n.language]}</span>
                                </div>
                            </div>
                        ))}
                    </div> : <FormFieldErrorBox errorMsg={t("Sorry, Can't Find Any Geometries Added To The Selected Geometries List !!")} />}
                </section>
                <section className="geometries mb-4 w-100">
                    <h6 className="ee-update-geometries-section-title mb-3 fw-bold">{t("Please Select New Geometry")}</h6>
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
                        <div className="ee-update-geometries-chip selected-geometry-box p-2 border border-2 text-center">
                            <span className={`${i18n.language !== "ar" ? "me-2" : "ms-2"} geometry-name`}>{geometry.name[i18n.language]}</span>
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
                        onClick={updateRelatedGeometries}
                    >
                        {t("Save Changes")}
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
