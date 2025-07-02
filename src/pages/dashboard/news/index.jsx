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

export default function News() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [isGetUsers, setIsGetUsers] = useState(false);

    const [allUsersInsideThePage, setAllUsersInsideThePage] = useState([]);

    const [waitMsg, setWaitMsg] = useState("");

    const [selectedNewsIndex, setSelectedNewsIndex] = useState(-1);

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetUsersData, setErrorMsgOnGetUsersData] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        _id: "",
        name: "",
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
                        const filtersAsQuery = getFiltersAsQuery(filters);
                        result = (await getAllUsersInsideThePage(1, pageSize, filtersAsQuery)).data;
                        setAllUsersInsideThePage(result.users);
                        setTotalPagesCount(Math.ceil(result.usersCount / pageSize));
                        setIsLoadingPage(false);
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
        if (filters.email) filteringString += `email=${filters.email}&`;
        if (filters.name) filteringString += `name=${filters.name}&`;
        if (filteringString) filteringString = filteringString.substring(0, filteringString.length - 1);
        return filteringString;
    }

    const getAllUsersInsideThePage = async (pageNumber, pageSize, filters) => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/users/all-users-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&language=${i18n.language}&${filters ? filters : ""}`, {
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
            setIsGetUsers(true);
            setErrorMsgOnGetUsersData("");
            const newCurrentPage = currentPage - 1;
            setAllUsersInsideThePage((await getAllUsersInsideThePage(newCurrentPage, pageSize)).data.users);
            setCurrentPage(newCurrentPage);
            setIsGetUsers(false);
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
            setIsGetUsers(true);
            setErrorMsgOnGetUsersData("");
            const newCurrentPage = currentPage + 1;
            setAllUsersInsideThePage((await getAllUsersInsideThePage(newCurrentPage, pageSize)).data.users);
            setCurrentPage(newCurrentPage);
            setIsGetUsers(false);
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
            setIsGetUsers(true);
            setErrorMsgOnGetUsersData("");
            setAllUsersInsideThePage((await getAllUsersInsideThePage(pageNumber, pageSize)).data.users);
            setCurrentPage(pageNumber);
            setIsGetUsers(false);
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

    const deleteNews = async (userIndex) => {
        try {
            setWaitMsg("Please Wait");
            setSelectedNewsIndex(userIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/users/delete-user?userType=admin&userId=${allUsersInsideThePage[userIndex]._id}&language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedNewsIndex(-1);
                    setAllUsersInsideThePage(allUsersInsideThePage.filter((user, index) => index !== userIndex));
                    clearTimeout(successTimeout);
                }, 1000);
            } else {
                setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedNewsIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1000);
            }
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedNewsIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="news dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("News")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {isDisplayConfirmDeleteBox && <ConfirmDelete
                    name={t("News")}
                    setIsDisplayConfirmDeleteBox={setIsDisplayConfirmDeleteBox}
                    handleDeleteFunc={() => deleteNews(selectedNewsIndex)}
                    setSelectedElementIndex={setSelectedNewsIndex}
                    waitMsg={waitMsg}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />}
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("News")}</h1>
                    <DashboardSideBar />
                    {allUsersInsideThePage.length > 0 && !isGetUsers && <section className="users-box w-100 admin-dashbboard-data-box">
                        <table className="users-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <th>{t("Content")}</th>
                                    <th>{t("Date Of Creation")}</th>
                                    <th>{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsersInsideThePage.map((user, userIndex) => (
                                    <tr key={user._id}>
                                        <td className="user-id-cell">
                                            {user._id}
                                        </td>
                                        <td className="user-name-cell">
                                            <section className="ad-content mb-4">
                                                {getLanguagesInfoList("content").map((el) => (
                                                    <div key={el.fullLanguageName}>
                                                        <h6 className="fw-bold">In {el.fullLanguageName} :</h6>
                                                        <input
                                                            type="text"
                                                            placeholder={`Enter New News Content In ${el.fullLanguageName}`}
                                                            className={`form-control d-block mx-auto p-2 border-2 news-content-field ${formValidationErrors[el.formField] && adIndex === selectedAdIndex ? "border-danger mb-3" : "mb-4"}`}
                                                            defaultValue={ad.content[el.internationalLanguageCode]}
                                                            onChange={(e) => changeAdContent(adIndex, e.target.value.trim(), el.internationalLanguageCode)}
                                                        />
                                                        {formValidationErrors[el.formField] && adIndex === selectedAdIndex && <FormFieldErrorBox errorMsg={formValidationErrors[el.formField]} />}
                                                    </div>
                                                ))}
                                            </section>
                                        </td>
                                        <td className="user-date-of-creation-cell">
                                            {getDateFormated(user.dateOfCreation)}
                                        </td>
                                        <td className="update-cell">
                                            {selectedNewsIndex !== userIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => handleDisplayConfirmDeleteBox(userIndex, setSelectedNewsIndex, setIsDisplayConfirmDeleteBox)}
                                                >{t("Delete")}</button>
                                                <hr />
                                                <button
                                                    className="btn btn-success global-button"
                                                    onClick={() => deleteNews(userIndex)}
                                                >{t("Update")}</button>
                                            </>}
                                            {waitMsg && selectedNewsIndex === userIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{t(waitMsg)} ...</button>}
                                            {successMsg && selectedNewsIndex === userIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{t(successMsg)}</button>}
                                            {errorMsg && selectedNewsIndex === userIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{t(errorMsg)}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allUsersInsideThePage.length === 0 && !isGetUsers && <NotFoundError errorMsg={t("Sorry, Can't Find Any News !!")} />}
                    {isGetUsers && <SectionLoader />}
                    {errorMsgOnGetUsersData && <NotFoundError errorMsg={errorMsgOnGetUsersData} />}
                    {totalPagesCount > 1 && !isGetUsers &&
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