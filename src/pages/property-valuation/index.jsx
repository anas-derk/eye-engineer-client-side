import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import websiteLogo from "../../../public/images/LogoWithTransparentBackground.webp";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { inputValuesValidation } from "../../../public/global_functions/validations";
import axios from "axios";

export default function PropertyValuation() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [propertyValuationData, setPropertyValuationData] = useState({
        owner: "",
        fullName: "",
        representativeFullName: "",
        legalEntity: "",
        city: "",
        phoneNumber: "",
        whatsappNumber: "",
        location: "",
        purpose: "",
    });

    const [waitMsg, setWaitMsg] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    const createOrder = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: propertyValuationData.name,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isName: {
                            msg: "Sorry, This Name Is Not Valid !!",
                        },
                    },
                },
                {
                    name: "email",
                    value: propertyValuationData.email,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                        isEmail: {
                            msg: "Sorry, This Email Is Not Valid !!",
                        },
                    },
                },
                {
                    name: "subject",
                    value: propertyValuationData.subject,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "content",
                    value: propertyValuationData.content,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {
                setWaitMsg("Please Wait");
                const result = (await axios.post(`${process.env.BASE_API_URL}/messages/send-message?language=${i18n.language}`, propertyValuationData)).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(async () => {
                        setPropertyValuationData({ name: "", email: "", subject: "", content: "" });
                        setSuccessMsg("");
                        clearTimeout(successTimeout);
                    }, 1500);
                } else {
                    setErrorMsg("Sorry, Someting Went Wrong When Updating, Please Repeate The Process !!");
                    let errorTimeout = setTimeout(() => {
                        setErrorMsg("");
                        clearTimeout(errorTimeout);
                    }, 1500);
                }
            }
        }
        catch (err) {
            console.log(err);
            setWaitMsg("");
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 1500);
        }
    }

    return (
        <div className="property-valuation">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Property Valuation")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Property Valuation")}</h1>
                    <div className="container pt-4 pb-4">
                        <h2 className="text-center mb-5">{t("Get a valuation from top experts")}</h2>
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <motion.div
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                    className="image-box text-center"
                                >
                                    <img src={websiteLogo.src} alt={`${process.env.WEBSITE_NAME} Image`} />
                                </motion.div>
                            </div>
                            <motion.div
                                className="col-md-6"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                                whileHover={{
                                    scale: 1.1
                                }}
                            >
                                <form className="property-valuation-form info-box p-4" onSubmit={createOrder}>
                                    <div
                                        className="select-order-owner-field-box"
                                    >
                                        <select
                                            className={`select-order-owner form-select ${i18n.language === "ar" ? "ar" : ""} ${formValidationErrors["owner"] ? "border-danger mb-3" : "mb-5"}`}
                                            onChange={(e) => setPropertyValuationData({ ...propertyValuationData, owner: e.target.value })}
                                            value={propertyValuationData.owner}
                                        >
                                            <option value="" hidden>{t("Please Select Order Owner")}</option>
                                            <option value="individual">{t("Individual")}</option>
                                            <option value="representative">{t("Representative of the concerned party")}</option>
                                        </select>
                                    </div>
                                    {formValidationErrors["owner"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["owner"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 full-name-field ${formValidationErrors["fullName"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Full Name")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, fullName: e.target.value })}
                                        value={propertyValuationData.fullName}
                                    />
                                    {formValidationErrors["fullName"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["fullName"])} />}
                                    {propertyValuationData.owner === "representative" && <>
                                        <input
                                            type="text"
                                            className={`form-control p-2 border-2 representative-full-name-field ${formValidationErrors["representativeFullName"] ? "border-danger mb-3" : "mb-4"}`}
                                            placeholder={t("Full Name")}
                                            onChange={(e) => setPropertyValuationData({ ...propertyValuationData, fullName: e.target.value })}
                                            value={propertyValuationData.fullName}
                                        />
                                        {formValidationErrors["representativeFullName"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["representativeFullName"])} />}
                                        <input
                                            type="text"
                                            className={`form-control p-2 border-2 legal-entity-field ${formValidationErrors["legalEntity"] ? "border-danger mb-3" : "mb-4"}`}
                                            placeholder={t("Legal entity")}
                                            onChange={(e) => setPropertyValuationData({ ...propertyValuationData, legalEntity: e.target.value })}
                                            value={propertyValuationData.legalEntity}
                                        />
                                        {formValidationErrors["legalEntity"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["legalEntity"])} />}
                                    </>}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 city-field ${formValidationErrors["city"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("City")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, city: e.target.value })}
                                        value={propertyValuationData.city}
                                    />
                                    {formValidationErrors["city"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["city"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 phone-number-field ${formValidationErrors["phoneNumber"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Phone Number")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, phoneNumber: e.target.value })}
                                        value={propertyValuationData.phoneNumber}
                                    />
                                    {formValidationErrors["phoneNumber"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["phoneNumber"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 whatsapp-number-number-field ${formValidationErrors["whatsappNumber"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Whatsapp Number")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, whatsappNumber: e.target.value })}
                                        value={propertyValuationData.whatsappNumber}
                                    />
                                    {formValidationErrors["whatsappNumber"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["whatsappNumber"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 email-field ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Email")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, email: e.target.value })}
                                        value={propertyValuationData.email}
                                    />
                                    {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 property-location-field ${formValidationErrors["location"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Property Location")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, propertyLocation: e.target.value })}
                                        value={propertyValuationData.location}
                                    />
                                    {formValidationErrors["location"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["location"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 property-purpose-field ${formValidationErrors["purpose"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Property Purpose")}
                                        onChange={(e) => setPropertyValuationData({ ...propertyValuationData, purpose: e.target.value })}
                                        value={propertyValuationData.purpose}
                                    />
                                    {formValidationErrors["purpose"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["purpose"])} />}
                                    {!waitMsg && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100">
                                        {t("Send Message")}
                                    </button>}
                                    {errorMsg && <button disabled className="btn btn-danger w-100">
                                        {t(errorMsg)}
                                    </button>}
                                    {successMsg && <button disabled className="btn btn-success w-100">
                                        {t(successMsg)}
                                    </button>}
                                </form>
                            </motion.div>
                        </div>
                    </div>
                    <Footer />
                </div>
                {/* End Page Content */}
            </>}
        </div>
    );
}