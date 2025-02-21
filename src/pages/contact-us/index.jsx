import Head from "next/head";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import websiteLogo from "../../../public/images/LogoWithTransparentBackground.webp";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import { GoClockFill } from "react-icons/go";
import { MdOutlineWhatsapp, MdOutlineMail } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import FormFieldErrorBox from "@/components/FormFieldErrorBox";
import { inputValuesValidation } from "../../../public/global_functions/validations";

export default function AboutUs() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [messageData, setMessageData] = useState({
        subject: "",
        content: ""
    });

    const [isWaitStatus, setIsWaitStatus] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const { t } = useTranslation();

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    const sendMessage = (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "subject",
                    value: messageData.subject,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
                {
                    name: "content",
                    value: messageData.content,
                    rules: {
                        isRequired: {
                            msg: "Sorry, This Field Can't Be Empty !!",
                        },
                    },
                },
            ]);
            setFormValidationErrors(errorsObject);
            if (Object.keys(errorsObject).length == 0) {

            }
        }
        catch (err) {
            setIsWaitStatus(false);
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Someting Went Wrong, Please Repeat The Process !!");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 1500);
        }
    }

    return (
        <div className="contact-us">
            <Head>
                <title>{t(process.env.websiteName)} {t("Contact Us")}</title>
            </Head>
            {!isLoadingPage && !errorMsgOnLoadingThePage && <>
                <Header />
                {/* Start Page Content */}
                <div className="page-content">
                    <h1 className="section-name text-center mb-4 text-white h5">{t("Contact Us")}</h1>
                    <div className="container pt-4 pb-4">
                        <div className="row mb-5">
                            <div className="col-md-3">
                                <motion.div
                                    className="contact-box info-box text-center p-3"
                                    initial={getInitialStateForElementBeforeAnimation()}
                                    whileInView={getAnimationSettings}
                                    whileHover={{
                                        scale: 1.1
                                    }}
                                >
                                    <GoClockFill className="mb-3 contact-icon" />
                                    <h4 className="mb-3">{t("Opening Hours")}</h4>
                                    <h6>{t("09:00 AM to 06:00 PM")}</h6>
                                </motion.div>
                            </div>
                            <motion.div
                                className="col-md-3"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                                whileHover={{
                                    scale: 1.1
                                }}
                            >
                                <div className="contact-box info-box text-center p-3">
                                    <MdOutlineWhatsapp className="mb-3 contact-icon" />
                                    <h4 className="mb-3">{t("Whatsapp")}</h4>
                                    <h6>{process.env.contactNumber}</h6>
                                </div>
                            </motion.div>
                            <motion.div className="col-md-3"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                                whileHover={{
                                    scale: 1.1
                                }}
                            >
                                <div className="contact-box info-box text-center p-3">
                                    <MdOutlineMail className="mb-3 contact-icon" />
                                    <h4 className="mb-3">{t("Email")}</h4>
                                    <h6>{process.env.contactEmail}</h6>
                                </div>
                            </motion.div>
                            <motion.div
                                className="col-md-3"
                                initial={getInitialStateForElementBeforeAnimation()}
                                whileInView={getAnimationSettings}
                                whileHover={{
                                    scale: 1.1
                                }}
                            >
                                <div className="contact-box info-box text-center p-3">
                                    <FaRegAddressCard className="mb-3 contact-icon" />
                                    <h4 className="mb-3">{t("Address")}</h4>
                                    <h6>{t("Syria")}</h6>
                                </div>
                            </motion.div>
                        </div>
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
                                    <img src={websiteLogo.src} alt={`${process.env.websiteName} Image`} />
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
                                <form className="contact-us-form info-box p-4" onSubmit={sendMessage}>
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 email-field ${formValidationErrors["subject"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Subject")}
                                        onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                                    />
                                    {formValidationErrors["subject"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["subject"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 content-field ${formValidationErrors["content"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Content")}
                                        onChange={(e) => setMessageData({ ...messageData, content: e.target.value })}
                                    />
                                    {formValidationErrors["content"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["content"])} />}
                                    {!isWaitStatus && !errorMsg && !successMsg && <button type="submit" className="orange-btn btn w-100">
                                        {t("Send The Message")}``
                                    </button>}
                                    {errorMsg && <button disabled className="btn btn-danger w-100">
                                        {t(errorMsg)}
                                    </button>}
                                    {successMsg && <button disabled className="btn btn-sucess w-100">
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