import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getDateFormated, getLanguagesInfoList, getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage, getAllOfficesInsideThePage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import ConfirmDelete from "@/components/ConfirmDelete";
import { inputValuesValidation } from "../../../../public/global_functions/validations";
import PaginationBar from "@/components/PaginationBar";
import Link from "next/link";

export default function Offices() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({});

    const [allOfficesInsideThePage, setAllOfficesInsideThePage] = useState([]);

    const [isGetOffices, setIsGetOffices] = useState(false);

    const [selectedOfficeIndex, setSelectedOfficeIndex] = useState(-1);

    const [waitMsg, setWaitMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetOfficesData, setErrorMsgOnGetOfficesData] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        officeId: "",
        name: "",
        status: "",
        ownerFullName: "",
        email: "",
    });

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const [isDisplayChangeOfficeStatusBox, setIsDisplayChangeOfficeStatusBox] = useState(false);

    const [officeAction, setOfficeAction] = useState("");

    const [selectedOffice, setSelectedOffice] = useState("");

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const router = useRouter();

    const pageSize = 3;

    const officeStatusList = ["pending", "approving", "blocking"];

    const languagesInfoList = [
        {
            fullLanguageName: "Arabic",
            internationalLanguageCode: "ar",
            formField: "contentInAR"
        },
        {
            fullLanguageName: "English",
            internationalLanguageCode: "en",
            formField: "contentInEN"
        },
        {
            fullLanguageName: "Deutche",
            internationalLanguageCode: "de",
            formField: "contentInDE"
        },
        {
            fullLanguageName: "Turkish",
            internationalLanguageCode: "tr",
            formField: "contentInTR"
        }
    ];

    const { t, i18n } = useTranslation();

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
                            setUserInfo(adminDetails);
                            result = (await getAllOfficesInsideThePage(1, pageSize, undefined, i18n.language)).data;
                            setAllOfficesInsideThePage(result.offices);
                            setTotalPagesCount(Math.ceil(result.officesCount / pageSize));
                            setIsLoadingPage(false);
                        } else {
                            await router.replace("/dashboard");
                        }
                    }
                })
                .catch(async (err) => {
                    console.log(err);
                    if (err?.response?.status === 401) {
                        // localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        // await router.replace("/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else router.replace("/login");
    }, []);

    const getPreviousPage = async () => {
        try {
            setIsGetOffices(true);
            setErrorMsgOnGetOfficesData("");
            const newCurrentPage = currentPage - 1;
            setAllOfficesInsideThePage((await getAllOfficesInsideThePage(newCurrentPage, pageSize, getFilteringString(filters), i18n.language)).data.offices);
            setCurrentPage(newCurrentPage);
            setIsGetOffices(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetOffices(false);
                setErrorMsgOnGetOfficesData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getNextPage = async () => {
        try {
            setIsGetOffices(true);
            setErrorMsgOnGetOfficesData("");
            const newCurrentPage = currentPage + 1;
            setAllOfficesInsideThePage((await getAllOfficesInsideThePage(newCurrentPage, pageSize, getFilteringString(filters), i18n.language)).data.offices);
            setCurrentPage(newCurrentPage);
            setIsGetOffices(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetOffices(false);
                setErrorMsgOnGetOfficesData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getSpecificPage = async (pageNumber) => {
        try {
            setIsGetOffices(true);
            setErrorMsgOnGetOfficesData("");
            setAllOfficesInsideThePage((await getAllOfficesInsideThePage(pageNumber, pageSize, getFilteringString(filters), i18n.language)).data.offices);
            setCurrentPage(pageNumber);
            setIsGetOffices(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetOffices(false);
                setErrorMsgOnGetOfficesData(err?.message === "Network Error" ? "Network Error When Get Offices Data" : "Sorry, Someting Went Wrong When Get Offices Data, Please Repeate The Process !!");
            }
        }
    }

    const getFilteringString = (filters) => {
        let filteringString = "";
        if (filters.officeId) filteringString += `_id=${filters.officeId}&`;
        if (filters.name) filteringString += `name=${filters.name}&`;
        if (filters.status) filteringString += `status=${filters.status}&`;
        if (filters.ownerFullName) filteringString += `ownerFullName=${filters.ownerFullName}&`;
        if (filters.email) filteringString += `email=${filters.email}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const filterOffices = async (filters) => {
        try {
            setIsGetOffices(true);
            setCurrentPage(1);
            const filteringString = getFilteringString(filters);
            const result = (await getAllOfficesInsideThePage(1, pageSize, filteringString, i18n.language)).data;
            setAllOfficesInsideThePage(result.stores);
            setTotalPagesCount(Math.ceil(result.storesCount / pageSize));
            setIsGetOffices(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetOffices(false);
                setCurrentPage(-1);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const handleDisplayChangeOfficeStatusBox = (officeDetails, officeAction) => {
        setOfficeAction(officeAction);
        setSelectedOffice(officeDetails);
        setIsDisplayChangeOfficeStatusBox(true);
    }

    const changeOfficeData = (officeIndex, fieldName, newValue, language) => {
        if (language) {
            allOfficesInsideThePage[officeIndex][fieldName][language] = newValue;
        } else {
            allOfficesInsideThePage[officeIndex][fieldName] = newValue;
        }
    }

    const updateOfficeData = async (officeIndex) => {
        try {
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: allOfficesInsideThePage[officeIndex].name,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "email",
                    value: allOfficesInsideThePage[officeIndex].email,
                    rules: {
                        isEmail: {
                            msg: "Sorry, Invalid Email !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            setSelectedOfficeIndex(officeIndex);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait To Updating ...");
                const result = (await axios.put(`${process.env.BASE_API_URL}/offices/update-office-info/${allOfficesInsideThePage[officeIndex]._id}?language=${i18n.language}`, {
                    name: allOfficesInsideThePage[officeIndex].name,
                    email: allOfficesInsideThePage[officeIndex].email,
                }, {
                    headers: {
                        Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                    }
                })).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg("Updating Successfull !!");
                    let successTimeout = setTimeout(() => {
                        setSuccessMsg(false);
                        setSelectedOfficeIndex(-1);
                        clearTimeout(successTimeout);
                    }, 3000);
                } else {
                    setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        setSelectedOfficeIndex(-1);
                        clearTimeout(errorTimeout);
                    }, 3000);
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
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                setSelectedOfficeIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    const deleteOffice = async (officeIndex) => {
        try {
            setWaitMsg("Please Wait To Deleting ...");
            setSelectedOfficeIndex(officeIndex);
            let result = (await axios.delete(`${process.env.BASE_API_URL}/offices/delete-office/${allOfficesInsideThePage[officeIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg(true);
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("Deleting Successfull !!");
                    setSelectedOfficeIndex(-1);
                    setAllOfficesInsideThePage((await getAllOfficesInsideThePage(currentPage, pageSize, getFilteringString(filters), i18n.language)).data.offices);
                    setCurrentPage(currentPage);
                    clearTimeout(successTimeout);
                }, 3000);
            } else {
                setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedOfficeIndex(-1);
                    clearTimeout(errorTimeout);
                }, 3000);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
                return;
            }
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                setSelectedOfficeIndex(-1);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    const handleChangeOfficeStatus = async (newStatus) => {
        try {
            switch (newStatus) {
                case "approving": {
                    setIsGetOffices(true);
                    setAllOfficesInsideThePage((await getAllOfficesInsideThePage(1, pageSize, getFilteringString(filters), i18n.language)).data.offices);
                    setCurrentPage(currentPage);
                    setIsGetOffices(false);
                    return;
                }
                case "rejecting": {
                    setIsGetOffices(true);
                    setAllOfficesInsideThePage(allOfficesInsideThePage.filter((_, index) => index !== officeIndex));
                    setCurrentPage(1);
                    setIsGetOffices(false);
                    return;
                }
                case "blocking": {
                    setIsGetOffices(true);
                    setAllOfficesInsideThePage((await getAllOfficesInsideThePage(1, pageSize, getFilteringString(filters), i18n.language)).data.offices);
                    setCurrentPage(currentPage);
                    setIsGetOffices(false);
                    return;
                }
            }
        }
        catch (err) {
            setIsGetOffices(false);
            setErrorMsg(true);
            let errorTimeout = setTimeout(() => {
                setErrorMsg(false);
                clearTimeout(errorTimeout);
            }, 3000);
        }
    }

    return (
        <div className="offices dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Offices")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Offices")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteOffice(selectedNewsIndex)}
                    setSelectedElementIndex={setSelectedOfficeIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {isDisplayChangeOfficeStatusBox && <ChangeOfficeStatusBox
                    setIsDisplayChangeOfficeStatusBox={setIsDisplayChangeOfficeStatusBox}
                    setOfficeAction={setOfficeAction}
                    selectedOffice={selectedOffice}
                    officeAction={officeAction}
                    handleChangeOfficeStatus={handleChangeOfficeStatus}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Offices")}</h1>
                    <DashboardSideBar isWebsiteOwner={true} isExistOffice={true} />
                    <section className="filters mb-3 bg-white border-3 border-info p-3 text-start">
                        <h5 className="section-name fw-bold text-center">{t("Filters")}: </h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <h6 className="me-2 fw-bold text-center">{t("Office Id")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Store Id")}
                                    onChange={(e) => setFilters({ ...filters, officeId: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-4">
                                <h6 className="me-2 fw-bold text-center">{t("Office Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Office Name")}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-4">
                                <h6 className="me-2 fw-bold text-center">{t("Status")}</h6>
                                <select
                                    className="select-office-status form-select"
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="" hidden>{t("Please Enter Status")}</option>
                                    <option value="">{t("All")}</option>
                                    {officeStatusList.map((status, index) => (
                                        <option value={status} key={index}>{t(status)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mt-5">
                                <h6 className="me-2 fw-bold text-center">{t("Owner Full Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Owner Full Name")}
                                    onChange={(e) => setFilters({ ...filters, ownerFullName: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-4 mt-5">
                                <h6 className="me-2 fw-bold text-center">{t("Owner Email")}</h6>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder={t("Please Enter Owner Email")}
                                    onChange={(e) => setFilters({ ...filters, email: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetOffices && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            onClick={() => filterOffices(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetOffices && <button
                            className="btn btn-success d-block w-25 mx-auto mt-2 global-button"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allOfficesInsideThePage.length > 0 && !isGetOffices && <section className="offices-data-box p-3 data-box admin-dashbboard-data-box">
                        <table className="offices-data-table mb-4 managment-table bg-white admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th width="50">{t("Office Id")}</th>
                                    <th width="250">{t("Name")}</th>
                                    <th>{t("Owner Full Name")}</th>
                                    <th width="300">{t("Owner Email")}</th>
                                    <th width="250">{t("Status")}</th>
                                    <th>{t("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOfficesInsideThePage.map((office, officeIndex) => (
                                    <tr key={office._id}>
                                        <td>{office._id}</td>
                                        <td>
                                            <section className="office-name mb-4">
                                                {languagesInfoList.map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">In {el.fullLanguageName} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={t(`Enter New Office Name In ${el.fullLanguageName}`)}
                                                            className={`form-control d-block mx-auto p-2 border-2 office-name-field ${formValidationErrors[el.formField] && officeIndex === selectedOfficeIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={office.name[el.internationalLanguageCode]}
                                                            onChange={(e) => changeOfficeData(officeIndex, "name", e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && officeIndex === selectedOfficeIndex && <FormFieldErrorBox errorMsg={formValidationErrors[el.formField]} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td>
                                        <td>{office.ownerFullName}</td>
                                        <td>
                                            <section className="office-owner-email mb-4">
                                                <input
                                                    type="text"
                                                    defaultValue={office.email}
                                                    className={`form-control d-block mx-auto p-2 border-2 office-owner-email-field ${formValidationErrors["email"] && officeIndex === selectedOfficeIndex ? "border-danger mb-3" : "mb-4"}`}
                                                    placeholder={t("Please Enter Owner Email")}
                                                    onChange={(e) => changeOfficeData(officeIndex, "email", e.target.value)}
                                                />
                                                {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={formValidationErrors["email"]} />}
                                            </section>
                                        </td>
                                        <td>
                                            {t(office.status)}
                                        </td>
                                        <td>
                                            {officeIndex !== selectedOfficeIndex && <button
                                                className="btn btn-info d-block mx-auto mb-3 global-button"
                                                onClick={() => updateOfficeData(officeIndex)}
                                            >
                                                {t("Update")}
                                            </button>}
                                            {!office.isMainOffice && <>
                                                {
                                                    officeIndex !== selectedOfficeIndex && office.status !== "pending" &&
                                                    <button
                                                        className="btn btn-danger d-block mx-auto mb-3 global-button"
                                                        onClick={() => handleDisplayConfirmDeleteBox(officeIndex, setSelectedOfficeIndex, setIsDisplayConfirmDeleteBox)}
                                                    >
                                                        {t("Delete")}
                                                    </button>
                                                }
                                                {waitMsg && officeIndex === selectedOfficeIndex && <button
                                                    className="btn btn-danger d-block mx-auto mb-3 global-button"
                                                    disabled
                                                >
                                                    {t(waitMsg)}
                                                </button>}
                                                {successMsg && officeIndex === selectedOfficeIndex && <button
                                                    className="btn btn-success d-block mx-auto mb-3 global-button"
                                                    disabled
                                                >
                                                    {t(successMsg)}
                                                </button>}
                                                {
                                                    !waitMsg &&
                                                    !successMsg &&
                                                    !errorMsg &&
                                                    office.status === "pending" &&
                                                    <button
                                                        className="btn btn-success d-block mx-auto mb-3 global-button"
                                                        onClick={() => handleDisplayChangeOfficeStatusBox(office, "approving")}
                                                    >
                                                        {t("Approve")}
                                                    </button>
                                                }
                                                {
                                                    !waitMsg &&
                                                    !successMsg &&
                                                    !errorMsg &&
                                                    office.status === "pending" &&
                                                    <button
                                                        className="btn btn-danger d-block mx-auto mb-3 global-button"
                                                        onClick={() => handleDisplayChangeOfficeStatusBox(office, "rejecting")}
                                                    >
                                                        {t("Reject")}
                                                    </button>
                                                }
                                                {
                                                    !waitMsg &&
                                                    !successMsg &&
                                                    !errorMsg &&
                                                    office.status === "pending" || office.status === "approving" &&
                                                    <button
                                                        className="btn btn-danger d-block mx-auto mb-3 global-button"
                                                        onClick={() => handleDisplayChangeOfficeStatusBox(office, "blocking")}
                                                    >
                                                        {t("Blocking")}
                                                    </button>
                                                }
                                                {
                                                    !waitMsg &&
                                                    !successMsg &&
                                                    !errorMsg &&
                                                    office.status === "blocking" &&
                                                    <button
                                                        className="btn btn-danger d-block mx-auto mb-3 global-button"
                                                        onClick={() => handleDisplayChangeOfficeStatusBox(office, "cancel-blocking")}
                                                    >
                                                        {t("Cancel Blocking")}
                                                    </button>
                                                }
                                                {errorMsg && officeIndex === selectedOfficeIndex && <button
                                                    className="btn btn-danger d-block mx-auto mb-3 global-button"
                                                    disabled
                                                >
                                                    {t(errorMsg)}
                                                </button>}
                                            </>}
                                            {!waitMsg && !errorMsg && !successMsg && <>
                                                <Link
                                                    href={`/dashboard/offices/${office._id}`}
                                                    className="btn btn-success d-block mx-auto mb-4 global-button"
                                                >{t("Show Full Details")}</Link>
                                            </>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allOfficesInsideThePage.length === 0 && !isGetOffices && <NotFoundError errorMsg={t("Sorry, Can't Find Any Offices !!")} />}
                    {isGetOffices && <TableLoader />}
                    {errorMsgOnGetOfficesData && <NotFoundError errorMsg={errorMsgOnGetOfficesData} />}
                    {totalPagesCount > 1 && !isGetOffices &&
                        <PaginationBar
                            totalPagesCount={totalPagesCount}
                            currentPage={currentPage}
                            getPreviousPage={getPreviousPage}
                            getNextPage={getNextPage}
                            getSpecificPage={getSpecificPage}
                        />
                    }
                </div>
                {/* End Page Content */}
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}