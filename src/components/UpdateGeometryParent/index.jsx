import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";
import { getAllGeometriesInsideThePage } from "../../../public/global_functions/popular";

export default function UpdateGeometryParent({
    setIsDisplayUpdateGeometryParentBox,
    currentParent,
    handleUpdateGeometryParent,
    geometryId,
    setSelectedGeometryIndex
}) {

    const [searchedGeometries, setSearchedGeometries] = useState([]);

    const [selectedGeometryParent, setSelectedGeometryParent] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [filters, setFilters] = useState({
        name: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const router = useRouter();

    const { t, i18n } = useTranslation();

    const handleClosePopupBox = () => {
        setSelectedGeometryIndex(-1);
        setIsDisplayUpdateGeometryParentBox(false);
    }

    const getFilteringString = (filters) => {
        let filteringString = "";
        if (filters.name) filteringString += `name=${filters.name}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const handleSearchOfGeometryParent = async (e) => {
        try {
            setWaitMsg("Please Wait");
            const searchedGeometryName = e.target.value;
            let tempFilters = { name: searchedGeometryName };
            setFilters(tempFilters);
            if (searchedGeometryName) {
                setSearchedGeometries((await getAllGeometriesInsideThePage(1, 1000, getFilteringString(tempFilters), "admin", i18n.language)).data.geometries);
            } else {
                setSearchedGeometries([]);
            }
            setWaitMsg("");
        }
        catch (err) {
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error On Search !!" : "Sorry, Something Went Wrong, Please Repeat The Search !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 1500);
        }
    }

    const handleSelectGeometryParent = (geometryParent) => {
        setSelectedGeometryParent(geometryParent ? geometryParent : {
            name: {
                ar: "لا أب",
                en: "No Parent",
                de: "Kein Elternteil",
                tr: "Ebeveyn Yok"
            }, _id: ""
        });
    }

    const updateGeometryParent = async () => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "geometryParent",
                    value: selectedGeometryParent,
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
                const result = (await axios.put(`${process.env.BASE_API_URL}/geometries/${geometryId}/?language=${i18n.language}`, {
                    parent: selectedGeometryParent?._id ? selectedGeometryParent?._id : null,
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
                        await handleUpdateGeometryParent();
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
        <div className="update-geometry-parent popup-box">
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Change Parent")}</h2>
                <section className="current-parent mb-5 border w-100 p-4">
                    <h6 className="bg-secondary p-3 m-0 text-white border border-2 border-dark">{t("Current Parent")}: {currentParent?.name ? currentParent.name[i18n.language] : t("No Parent")}</h6>
                </section>
                <section className="new-geometry-parent mb-4 w-100">
                    <h6 className="fw-bold mb-3 text-dark">{t("Please Select New Parent")}</h6>
                    {selectedGeometryParent?.name && <h6 className="bg-secondary p-3 mb-4 text-white border border-2 border-dark">{t("New Parent")}: {selectedGeometryParent.name[i18n.language]}</h6>}
                    <div className="select-geometry-box select-box mb-4">
                        <input
                            type="text"
                            className="search-box form-control p-2 border-2 mb-4"
                            placeholder={t("Please Enter Parent Name Or Part Of This")}
                            onChange={handleSearchOfGeometryParent}
                        />
                        <ul className={`geometries-list options-list bg-white border ${formValidationErrors["geometryParent"] ? "border-danger mb-4" : "border-dark"}`}>
                            <li onClick={() => handleSelectGeometryParent("")}>{t("No Parent")}</li>
                            {searchedGeometries.length > 0 && searchedGeometries.map((geometry) => (
                                <li key={geometry._id} onClick={() => handleSelectGeometryParent(geometry)}>{geometry.name[i18n.language]}</li>
                            ))
                            }
                        </ul>
                        {searchedGeometries.length === 0 && filters.name && <p className="alert alert-danger mt-4">{t("Sorry, Can't Find Any Parent Match This Name")}</p>}
                        {formValidationErrors["geometryParent"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["geometryParent"])} />}
                    </div>
                </section>
                {
                    !waitMsg &&
                    !errorMsg &&
                    !successMsg &&
                    <button
                        className="btn btn-success d-block mx-auto mb-4 global-button"
                        onClick={updateGeometryParent}
                    >
                        {t("Update")}
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