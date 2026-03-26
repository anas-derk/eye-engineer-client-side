import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getDateFormated, getUserInfo, handleDisplayConfirmDeleteBox, handleSelectUserLanguage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";
import SectionLoader from "@/components/SectionLoader";
import PaginationBar from "@/components/PaginationBar";
import ConfirmDelete from "@/components/ConfirmDelete";

export default function PropertyValuationOrders() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({});

    const [isGetPropertyValuationOrders, setIsGetPropertyValuationOrders] = useState(false);

    const [allPropertyValuationOrdersInsideThePage, setAllPropertyValuationOrdersInsideThePage] = useState([]);

    const [waitMsg, setWaitMsg] = useState("");

    const [selectedPropertyValuationOrderIndex, setSelectedPropertyValuationOrderIndex] = useState(-1);

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetUsersData, setErrorMsgOnGetUsersData] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        _id: "",
        owner: "",
        fullName: "",
        representativeFullName: "",
        phoneNumber: "",
        whatsappNumber: "",
        email: ""
    });

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const router = useRouter();

    const pageSize = 10;

    const owners = ["individual", "representative"];

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (!result.error) {
                        const adminDetails = result.data;
                        if (adminDetails.isWebsiteOwner) {
                            setUserInfo(adminDetails);
                            const filtersAsQuery = getFiltersAsQuery(filters);
                            result = (await getAllPropertyValuationOrdersInsideThePage(1, pageSize, filtersAsQuery)).data;
                            setAllPropertyValuationOrdersInsideThePage(result.orders);
                            setTotalPagesCount(Math.ceil(result.ordersCount / pageSize));
                            setIsLoadingPage(false);
                        }
                        else {
                            await router.replace("/dashboard");
                        }
                    } else {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.order === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else {
            router.replace("/login");
        }
    }, []);

    const getFiltersAsQuery = (filters) => {
        let filteringString = "";
        if (filters._id) filteringString += `_id=${filters._id}&`;
        if (filters.owner) filteringString += `owner=${filters.owner}&`;
        if (filters.fullName) filteringString += `fullName=${filters.fullName}&`;
        if (filters.representativeFullName) filteringString += `representativeFullName=${filters.representativeFullName}&`;
        if (filters.city) filteringString += `city=${filters.city}&`;
        if (filters.phoneNumber) filteringString += `phoneNumber=${encodeURIComponent(filters.phoneNumber)}&`;
        if (filters.whatsappNumber) filteringString += `whatsappNumber=${encodeURIComponent(filters.whatsappNumber)}&`;
        if (filters.email) filteringString += `email=${filters.email}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const getAllPropertyValuationOrdersInsideThePage = async (pageNumber, pageSize, filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/property-valuation/all-orders-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&language=${i18n.language}&${filters ? filters : ""}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
        }
        catch (err) {
            throw err;
        }
    }

    const getPreviousPage = async () => {
        try {
            setIsGetPropertyValuationOrders(true);
            setErrorMsgOnGetUsersData("");
            const newCurrentPage = currentPage - 1;
            setAllPropertyValuationOrdersInsideThePage((await getAllPropertyValuationOrdersInsideThePage(newCurrentPage, pageSize, getFiltersAsQuery(filters))).data.orders);
            setCurrentPage(newCurrentPage);
            setIsGetPropertyValuationOrders(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.order === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const getNextPage = async () => {
        try {
            setIsGetPropertyValuationOrders(true);
            setErrorMsgOnGetUsersData("");
            const newCurrentPage = currentPage + 1;
            setAllPropertyValuationOrdersInsideThePage((await getAllPropertyValuationOrdersInsideThePage(newCurrentPage, pageSize, getFiltersAsQuery(filters))).data.orders);
            setCurrentPage(newCurrentPage);
            setIsGetPropertyValuationOrders(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.order === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const getSpecificPage = async (pageNumber) => {
        try {
            setIsGetPropertyValuationOrders(true);
            setErrorMsgOnGetUsersData("");
            setAllPropertyValuationOrdersInsideThePage((await getAllPropertyValuationOrdersInsideThePage(pageNumber, pageSize, getFiltersAsQuery(filters))).data.orders);
            setCurrentPage(pageNumber);
            setIsGetPropertyValuationOrders(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.order === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const filterOrders = async (filters) => {
        try {
            setIsGetPropertyValuationOrders(true);
            setCurrentPage(1);
            const result = (await getAllPropertyValuationOrdersInsideThePage(1, pageSize, getFiltersAsQuery(filters))).data;
            setAllPropertyValuationOrdersInsideThePage(result.orders);
            setTotalPagesCount(Math.ceil(result.ordersCount / pageSize));
            setIsGetPropertyValuationOrders(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetPropertyValuationOrders(false);
                setErrorMsg(err?.order === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const deleteOrder = async (orderIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedPropertyValuationOrderIndex(orderIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/property-valuation/delete-order/${allPropertyValuationOrdersInsideThePage[orderIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedPropertyValuationOrderIndex(-1);
                    setAllPropertyValuationOrdersInsideThePage(allPropertyValuationOrdersInsideThePage.filter((_, index) => index !== orderIndex));
                    clearTimeout(successTimeout);
                }, 1000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedPropertyValuationOrderIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1000);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.order === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedPropertyValuationOrderIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="property-valuation-orders dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Property Valuation Orders")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Property Valuation Order")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteOrder(selectedPropertyValuationOrderIndex)}
                    setSelectedElementIndex={setSelectedPropertyValuationOrderIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Property Valuation Orders")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    <section className="filters mb-4 bg-white border-3 border-info p-3 text-start">
                        <h5 className="fw-bold text-center">{t("Filters")}: </h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h6 className="me-2 fw-bold text-center">{t("Property Valuation Order Id")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Property Valuation Order Id")}
                                    onChange={(e) => setFilters({ ...filters, _id: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6">
                                <h6 className="me-2 fw-bold text-center">{t("Owner")}</h6>
                                <select
                                    className={`select-owner form-select${i18n.language === "ar" ? " ar" : ""}`}
                                    onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                                >
                                    <option value="" hidden>{t("Please Enter Owner")}</option>
                                    <option value="">{t("All")}</option>
                                    {owners.map((owner, index) => (
                                        <option value={owner} key={index}>{t(owner)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Owner Full Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Name")}
                                    onChange={(e) => setFilters({ ...filters, fullName: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Representative Full Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Name")}
                                    onChange={(e) => setFilters({ ...filters, representativeFullName: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("City")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Name")}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Phone Number")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Phone Number")}
                                    onChange={(e) => setFilters({ ...filters, phoneNumber: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Whatsapp Number")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Whatsapp Number")}
                                    onChange={(e) => setFilters({ ...filters, whatsappNumber: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Email")}</h6>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder={t("Please Enter Email")}
                                    onChange={(e) => setFilters({ ...filters, email: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetPropertyValuationOrders && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            onClick={() => filterOrders(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetPropertyValuationOrders && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allPropertyValuationOrdersInsideThePage.length > 0 && !isGetPropertyValuationOrders && <section className="orders-box w-100 admin-dashbboard-data-box">
                        <table className="orders-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <th>{t("Owner")}</th>
                                    <th>{t("Owner Full Name")}</th>
                                    <th>{t("Representative Full Name")}</th>
                                    <th>{t("Legal entity")}</th>
                                    <th>{t("City")}</th>
                                    <th>{t("Phone Number")}</th>
                                    <th>{t("Whatsapp Number")}</th>
                                    <th>{t("Email")}</th>
                                    <th>{t("Property Location")}</th>
                                    <th>{t("Property Purpose")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPropertyValuationOrdersInsideThePage.map((order, orderIndex) => (
                                    <tr key={order._id}>
                                        <td className="order-id-cell">
                                            {order._id}
                                        </td>
                                        <td className="order-owner-cell">
                                            {t(order.owner)}
                                        </td>
                                        <td className="order-owner-full-name-cell">
                                            {order.fullName}
                                        </td>
                                        <td className="order-representative-full-name-cell">
                                            {order?.representativeFullName ?? "---------------------"}
                                        </td>
                                        <td className="order-legal-entity-cell">
                                            {order?.legalEntity ?? "---------------------"}
                                        </td>
                                        <td className="order-owner-city-cell">
                                            {order.city}
                                        </td>
                                        <td className="order-owner-phone-number-cell">
                                            {order.phoneNumber}
                                        </td>
                                        <td className="order-owner-whatsapp-number-cell">
                                            {order.whatsappNumber}
                                        </td>
                                        <td className="order-email-cell">
                                            {order.email}
                                        </td>
                                        <td className="order-location-cell">
                                            {order.location}
                                        </td>
                                        <td className="order-purpose-cell">
                                            {order.purpose}
                                        </td>
                                        <td className="order-date-of-creation-cell">
                                            {getDateFormated(order.createdAt)}
                                        </td>
                                        <td className="delete-cell">
                                            {selectedPropertyValuationOrderIndex !== orderIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(orderIndex, setSelectedPropertyValuationOrderIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                            </>}
                                            {waitMsg && selectedPropertyValuationOrderIndex === orderIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedPropertyValuationOrderIndex === orderIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedPropertyValuationOrderIndex === orderIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allPropertyValuationOrdersInsideThePage.length === 0 && !isGetPropertyValuationOrders && <NotFoundError errorMsg={t("Sorry, Can't Find Any Property Valuation Orders !!")} />}
                    {isGetPropertyValuationOrders && <SectionLoader />}
                    {errorMsgOnGetUsersData && <NotFoundError errorMsg={errorMsgOnGetUsersData} />}
                    {totalPagesCount > 1 && !isGetPropertyValuationOrders &&
                        <PaginationBar
                            totalPagesCount={totalPagesCount}
                            currentPage={currentPage}
                            getPreviousPage={getPreviousPage}
                            getNextPage={getNextPage}
                            getSpecificPage={getSpecificPage}
                            paginationButtonTextColor={"#000"}
                            paginationButtonBackgroundColor={"#FFF"}
                            activePaginationButtonColor={"#000"}
                            activePaginationButtonBackgroundColor={"var(--main-color-two)"}
                            isDisplayCurrentPageNumberAndCountOfPages={false}
                            isDisplayNavigateToSpecificPageForm={false}
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