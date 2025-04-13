import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getDateFormated, getUserInfo, handleSelectUserLanguage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";

export default function Users() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [userInfo, setUserInfo] = useState(true);

    const [isGetUsers, setIsGetUsers] = useState(false);

    const [allUsersInsideThePage, setAllUsersInsideThePage] = useState([]);

    const [waitMsg, setWaitMsg] = useState("");

    const [selectedUserIndex, setSelectedUserIndex] = useState(-1);

    const [errorMsg, setErrorMsg] = useState("");

    const [errorMsgOnGetUsersData, setErrorMsgOnGetUsersData] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [filters, setFilters] = useState({
        _id: "",
        name: "",
    });

    const router = useRouter();

    const pageSize = 10;

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.userlanguageFieldNameInLocalStorage);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            getUserInfo()
                .then(async (result) => {
                    if (!result.error) {
                        setUserInfo(result.data);
                        const filtersAsQuery = getFiltersAsQuery(filters);
                        result = (await getAllUsersInsideThePage(1, pageSize, filtersAsQuery)).data;
                        setAllUsersInsideThePage(result.users);
                        setTotalPagesCount(Math.ceil(result.usersCount / pageSize));
                        setIsLoadingPage(false);
                    } else {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                        await router.replace("/login");
                    }
                })
                .catch(async (err) => {
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
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
                    Authorization: localStorage.getItem(process.env.userTokenNameInLocalStorage),
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
                localStorage.removeItem(process.env.userTokenNameInLocalStorage);
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
                localStorage.removeItem(process.env.userTokenNameInLocalStorage);
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
                localStorage.removeItem(process.env.userTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setErrorMsgOnGetUsersData(err?.message === "Network Error" ? "Network Error When Get Brands Data" : "Sorry, Someting Went Wrong When Get Brands Data, Please Repeate The Process !!");
            }
        }
    }

    const filterUsers = async (filters) => {
        try {
            setIsGetUsers(true);
            setCurrentPage(1);
            const filteringString = getFiltersAsQuery(filters);
            const result = (await getAllUsersInsideThePage(1, pageSize, filteringString)).data;
            setAllUsersInsideThePage(result.users);
            setTotalPagesCount(Math.ceil(result.usersCount / pageSize));
            setIsGetUsers(false);
        }
        catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.adminTokenNameInLocalStorage);
                await router.replace("/login");
            }
            else {
                setIsGetUsers(false);
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    const deleteUser = async (userIndex) => {
        try {
            setWaitMsg("Please Wait To Deleting ...");
            setSelectedUserIndex(userIndex);
            const result = (await axios.delete(`${process.env.BASE_API_URL}/users/delete-user?userType=admin&userId=${allUsersInsideThePage[userIndex]._id}&language=${i18n.language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.adminTokenNameInLocalStorage),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Deleting Successfull !!");
                let successTimeout = setTimeout(async () => {
                    setSuccessMsg("");
                    setSelectedUserIndex(-1);
                    setAllUsersInsideThePage(allUsersInsideThePage.filter((user, index) => index !== userIndex));
                    clearTimeout(successTimeout);
                }, 1500);
            } else {
                setErrorMsg("Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    setSelectedUserIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
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
                    setSelectedUserIndex(-1);
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="users dashboard">
            <Head>
                <title>{t(process.env.websiteName)} {t("Users")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Users")}</h1>
                    <DashboardSideBar />
                    <section className="filters mb-3 bg-white border-3 border-info p-3 text-start">
                        <h5 className="fw-bold text-center">{t("Filters")}: </h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h6 className="me-2 fw-bold text-center">{t("User Id")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter User Id")}
                                    onChange={(e) => setFilters({ ...filters, _id: e.target.value.trim() })}
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
                            <div className="col-md-6 mt-3">
                                <h6 className="me-2 fw-bold text-center">{t("Name")}</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Please Enter Name")}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value.trim() })}
                                />
                            </div>
                        </div>
                        {!isGetUsers && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            onClick={() => filterUsers(filters)}
                        >
                            {t("Filter")}
                        </button>}
                        {isGetUsers && <button
                            className="btn d-block w-25 mx-auto mt-2 orange-btn"
                            disabled
                        >
                            {t("Filtering")} ...
                        </button>}
                    </section>
                    {allUsersInsideThePage.length > 0 && !isGetUsers && <section className="users-box w-100 p-3 admin-dashbboard-data-box">
                        <table className="users-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Id")}</th>
                                    <th>{t("Email")}</th>
                                    <th>{t("Name")}</th>
                                    <th>{t("Image")}</th>
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
                                        <td className="user-email-cell">
                                            {user.email}
                                        </td>
                                        <td className="user-name-cell">
                                            {user.name}
                                        </td>
                                        <td className="user-image-cell">
                                            <img
                                                src={`${process.env.BASE_API_URL}/${user.imagePath}`}
                                                alt={`${user.name} User Image !!`}
                                                width="100"
                                                height="100"
                                            />
                                        </td>
                                        <td className="user-date-of-creation-cell">
                                            {getDateFormated(user.dateOfCreation)}
                                        </td>
                                        <td className="update-cell">
                                            {selectedUserIndex !== userIndex && <>
                                                <button
                                                    className="btn btn-danger global-button"
                                                    onClick={() => deleteUser(userIndex)}
                                                >{t("Delete")}</button>
                                                <hr />
                                                <button
                                                    className="btn btn-success global-button"
                                                    onClick={() => deleteUser(userIndex)}
                                                >{t("Update")}</button>
                                            </>}
                                            {waitMsg && selectedUserIndex === userIndex && <button
                                                className="btn btn-info d-block mb-3 mx-auto global-button"
                                                disabled
                                            >{waitMsg}</button>}
                                            {successMsg && selectedUserIndex === userIndex && <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                disabled
                                            >{successMsg}</button>}
                                            {errorMsg && selectedUserIndex === userIndex && <button
                                                className="btn btn-danger d-block mx-auto global-button"
                                                disabled
                                            >{errorMsg}</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>}
                    {allUsersInsideThePage.length === 0 && !isGetUsers && <NotFoundError errorMsg="Sorry, Can't Find Any Users !!" />}
                    {isGetUsers && <TableLoader />}
                    {errorMsgOnGetUsersData && <NotFoundError errorMsg={errorMsgOnGetUsersData} />}
                    {totalPagesCount > 1 && !isGetUsers &&
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