import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";
import FormFieldErrorBox from "../FormFieldErrorBox";
import { getAllGeometriesInsideThePage } from "../../../public/global_functions/popular";

export default function AddGeometry({
    setIsDisplayAddGeometryBox,
    handleAddNewGeometry

}) {

    const [geometryData, setGeometryData] = useState({
        name: "",
        image: null
    });

    const [searchedGeometries, setSearchedGeometries] = useState([]);

    const [selectedGeometryParent, setSelectedGeometryParent] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [filters, setFilters] = useState({
        name: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const geometryImageFileElementRef = useRef();

    const router = useRouter();

    const { t, i18n } = useTranslation();

    const handleClosePopupBox = () => {
        setIsDisplayAddGeometryBox(false);
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

    const addGeometry = async () => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: geometryData.name,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "geometryParent",
                    value: selectedGeometryParent,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "image",
                    value: geometryData.image,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isImage: {
                            msg: "Sorry, Invalid Image Type, Please Upload JPG Or PNG Or WEBP Image File !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Saving");
                let formData = new FormData();
                formData.append("name", geometryData.name);
                formData.append("parent", selectedGeometryParent._id);
                formData.append("geometryImage", geometryData.image);
                const result = (await axios.post(`${process.env.BASE_API_URL}/geometries/add?language=${i18n.language}`, formData, {
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
                        await handleAddNewGeometry();
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
        <div className="add-geometry popup-box">
            <div className="content-box d-flex align-items-center text-white flex-column p-4 text-center">
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Add New Geometry")}</h2>
                <section className="name mb-4 w-100">
                    <input
                        type="text"
                        placeholder={t("Please Enter Name")}
                        className={`form-control p-3 border-2 ${formValidationErrors["name"] ? "border-danger mb-3" : ""}`}
                        onChange={(e) => setGeometryData({ ...geometryData, name: e.target.value.trim() })}
                    />
                    {formValidationErrors["name"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["name"])} />}
                </section>
                <section className="geometry-parent mb-4 w-100">
                    <h6 className="fw-bold mb-3 text-dark">{t("Please Select Parent")}</h6>
                    {selectedGeometryParent.name && <h6 className="bg-secondary p-3 mb-4 text-white border border-2 border-dark">{t("Parent")}: {selectedGeometryParent.name[i18n.language]}</h6>}
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
                <section className="image mb-4 w-100">
                    <input
                        type="file"
                        className={`form-control geometry-image-field ${formValidationErrors["image"] ? "border-danger mb-3" : "mb-4"}`}
                        placeholder={t("Please Enter Image")}
                        onChange={(e) => setGeometryData({ ...geometryData, image: e.target.files[0] })}
                        ref={geometryImageFileElementRef}
                        value={geometryImageFileElementRef.current?.value}
                    />
                    {formValidationErrors["image"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["image"])} />}
                </section>
                {
                    !waitMsg &&
                    !errorMsg &&
                    !successMsg &&
                    <button
                        className="btn btn-success d-block mx-auto mb-4 global-button"
                        onClick={addGeometry}
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