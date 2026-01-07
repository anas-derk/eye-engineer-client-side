import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import LoaderPage from "@/components/LoaderPage";
import ErrorOnLoadingThePage from "@/components/ErrorOnLoadingThePage";
import { useRouter } from "next/router";
import { getUserInfo, handleSelectUserLanguage } from "../../../../public/global_functions/popular";
import DashboardSideBar from "@/components/DashboardSideBar";
import axios from "axios";
import NotFoundError from "@/components/NotFoundError";

export default function ShowAndHideServices() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [allServices, setAllServices] = useState([]);

    const [waitMsg, setWaitMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const router = useRouter();

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
                            setAllServices((await getAllServices()).data);
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
                    console.log(err);
                    if (err?.response?.status === 401) {
                        localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                        await router.replace("/login");
                    }
                    else {
                        setIsLoadingPage(false);
                        setErrorMsgOnLoadingThePage(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
                    }
                });
        } else {
            router.replace("/login");
        }
    }, []);

    const getAllServices = async () => {
        try {
            return (await axios.get(`${process.env.BASE_API_URL}/appeared-sections/all-sections`)).data;
        }
        catch (err) {
            throw err;
        }
    }

    const handleSelectAppearedServiceStatus = (serviceIndex, serviceStatus) => {
        allServices[serviceIndex].isAppeared = serviceStatus;
    }

    const changeServicesStatus = async () => {
        try {
            setWaitMsg("Please Wait");
            const result = (await axios.put(`${process.env.BASE_API_URL}/appeared-sections/update-sections-status?language=${i18n.language}`, {
                sectionsStatus: allServices.map((service) => ({ _id: service._id, isAppeared: service.isAppeared })),
            }, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                }
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Updating Successfull !!");
                let successTimeout = setTimeout(() => {
                    setSuccessMsg("");
                    clearTimeout(successTimeout);
                }, 1500);
            }
            else {
                setErrorMsg(result.msg);
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
        catch (err) {
            console.log(err);
            if (err?.response?.status === 401) {
                localStorage.removeItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE);
                await router.replace("/login");
            }
            else {
                setWaitMsg("");
                setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeate The Process !!");
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 1500);
            }
        }
    }

    return (
        <div className="show-and-hide-services dashboard">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Show / Hide Services")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Welcome To You In Page")} : {t("Show / Hide Services")}</h1>
                    <DashboardSideBar isWebsiteOwner={true} isEngineer={true} />
                    {allServices.length > 0 && <section className="show-and-hide-services-box w-100 admin-dashbboard-data-box">
                        <table className="show-and-hide-services-table mb-4 managment-table bg-white w-100 admin-dashbboard-data-table">
                            <thead>
                                <tr>
                                    <th>{t("Name")}</th>
                                    <th>{t("Show / Hide Services")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allServices.map((service, index) => (
                                    <tr key={service._id}>
                                        <td className="service-name-cell">
                                            {service.sectionName[i18n.language]}
                                        </td>
                                        <td className="select-service-status-cell">
                                            <div className="form-check m-0 d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={service.isAppeared}
                                                    className="checkbox-input"
                                                    id={`checkbox${index + 1}`}
                                                    onChange={(e) => handleSelectAppearedServiceStatus(index, e.target.checked)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={2}>
                                        {!waitMsg && !errorMsg && !successMsg &&
                                            <button
                                                className="btn btn-success d-block mx-auto global-button"
                                                onClick={changeServicesStatus}
                                            >{t("Update")}</button>
                                        }
                                        {waitMsg && <button
                                            className="btn btn-warning d-block mx-auto global-button"
                                            disabled
                                        >{t(waitMsg)}</button>}
                                        {successMsg && <button
                                            className="btn btn-success d-block mx-auto global-button"
                                            disabled
                                        >{t(successMsg)}</button>}
                                        {errorMsg && <button
                                            className="btn btn-danger d-block mx-auto global-button"
                                            disabled
                                        >{t(errorMsg)}</button>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>}
                    {allServices.length === 0 && <NotFoundError errorMsg={t("Sorry, Can't Find Any Services !!")} />}
                </div>
                {/* End Page Content */}
                <Footer />
            </>}
            {isLoadingPage && !errorMsgOnLoadingThePage && <LoaderPage />}
            {errorMsgOnLoadingThePage && <ErrorOnLoadingThePage errorMsg={errorMsgOnLoadingThePage} />}
        </div>
    );
}