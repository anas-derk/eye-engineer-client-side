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

export default function Messages() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState({});

    const [isGetMessages, setIsGetMessages] = useState(false);

    const [allMessagesInsideThePage, setAllMessagesInsideThePage] = useState([]);

    const [waitMsg, setWaitMsg] = useState("");

    const [selectedMessageIndex, setSelectedMessageIndex] = useState(-1);

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetUsersData, setErrorMsgOnGetUsersData] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        _id: "",
        name: "",
        email: ""
    });

    const [isDisplayConfirmDeleteBox, setIsDisplayConfirmDeleteBox] = useState(false);

    const router = useRouter();

    const pageSize = 10;

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
                            result = (await getAllMessagesInsideThePage(1, pageSize, filtersAsQuery)).data;
                            setAllMessagesInsideThePage(result.messages);
                            setTotalPagesCount(Math.ceil(result.messagesCount / pageSize));
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
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
                    }
                });
        } else {
            router.replace("/login");
        }
    }, []);

    const getFiltersAsQuery = (filters) => {
        let filteringString = "";
        if (filters._id) filteringString += `_id=${filters._id}&`;
        if (filters.name) filteringString += `name=${filters.name}&`;
        if (filters.email) filteringString += `email=${filters.email}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const getAllMessagesInsideThePage = async (pageNumber, pageSize, filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/messages/all-messages-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&language=${i18n.language}&${filters ? filters : ""}`, {
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
            setIsGetMessages(true);
            setErrorMsgOnGetUsersData("");
            const newCurrentPage = currentPage - 1;
            setAllMessagesInsideThePage((await getAllMessagesInsideThePage(newCurrentPage, pageSize)).data.messages);
            setCurrentPage(newCurrentPage);
            setIsGetMessages(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const getNextPage = async () => {
        try {
            setIsGetMessages(true);
            setErrorMsgOnGetUsersData("");
            const newCurrentPage = currentPage + 1;
            setAllMessagesInsideThePage((await getAllMessagesInsideThePage(newCurrentPage, pageSize)).data.messages);
            setCurrentPage(newCurrentPage);
            setIsGetMessages(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const getSpecificPage = async (pageNumber) => {
        try {
            setIsGetMessages(true);
            setErrorMsgOnGetUsersData("");
            setAllMessagesInsideThePage((await getAllMessagesInsideThePage(pageNumber, pageSize)).data.messages);
            setCurrentPage(pageNumber);
            setIsGetMessages(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const filterMessages = async (filters) => {
        try {
            setIsGetMessages(true);
            setCurrentPage(1);
            const filteringString = getFiltersAsQuery(filters);
            const result = (await getAllMessagesInsideThePage(1, pageSize, filteringString)).data;
            setAllMessagesInsideThePage(result.messages);
            setTotalPagesCount(Math.ceil(result.usersCount / pageSize));
            setIsGetMessages(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setIsGetMessages(false);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const deleteMessage = async (messageIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedMessageIndex(messageIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/messages/delete-message/${allMessagesInsideThePage[messageIndex]._id}?language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedMessageIndex(-1);
                    setAllMessagesInsideThePage(allMessagesInsideThePage.filter((_, index) => index !== messageIndex));
                    clearTimeout(successTimeout);
                }, 1000);
            } else {
                setErrorMsg("Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedMessageIndex(-1);
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
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedMessageIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="messages dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Messages")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("Message")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteMessage(selectedMessageIndex)}
                    setSelectedElementIndex={setSelectedMessageIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Messages")}</h1>
                    <DashboardSideBar isWebsiteOwner={userInfo.isWebsiteOwner} isEngineer={userInfo.isEngineer} />
                    <section className="filters mb-4 bg-white border-3 border-info p-3 text-start">
                        <h5 className="fw-bold text-center">{t("Filters")}: </h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h6 className="me-2 fw-bold text-center">{t("Message Id")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Message Id")}
                                    onChange={(e) => setFilters({ ...filters, _id: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Name")}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value.trim() })}
                                />
                            </div>
                            <div className="col-md-6">
                                <h6 className="me-2 fw-bold text-center">{t("Email")}</h6>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder={t("Please Enter Email")}
                                    onChange={(e) => setFilters({ ...filters, email: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetMessages && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            onClick={() => filterMessages(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetMessages && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allMessagesInsideThePage.length > 0 && !isGetMessages && <section className="messages-box w-100 admin-dashbboard-data-box">
                        <table className="messages-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <th>{t("Name")}</th>
                                    <th>{t("Email")}</th>
                                    <th>{t("Subject")}</th>
                                    <th>{t("Content")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allMessagesInsideThePage.map((message, messageIndex) => (
                                    <tr key={message._id}>
                                        <td className="message-id-cell">
                                            {message._id}
                                        </td>
                                        <td className="message-name-cell">
                                            {message.name}
                                        </td>
                                        <td className="message-email-cell">
                                            {message.email}
                                        </td>
                                        <td className="subject-email-cell">
                                            {message.subject}
                                        </td>
                                        <td className="content-email-cell">
                                            {message.content}
                                        </td>
                                        <td className="message-date-of-creation-cell">
                                            {getDateFormated(message.createdAt)}
                                        </td>
                                        <td className="delete-cell">
                                            {selectedMessageIndex !== messageIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(messageIndex, setSelectedMessageIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                            </>}
                                            {waitMsg && selectedMessageIndex === messageIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedMessageIndex === messageIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedMessageIndex === messageIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allMessagesInsideThePage.length === 0 && !isGetMessages && <NotFoundError errorMsg={t("Sorry, Can't Find Any Messages !!")} />}
                    {isGetMessages && <SectionLoader />}
                    {errorMsgOnGetUsersData && <NotFoundError errorMsg={errorMsgOnGetUsersData} />}
                    {totalPagesCount > 1 && !isGetMessages &&
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