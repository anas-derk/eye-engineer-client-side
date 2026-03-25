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
import axios from "axios";

export default function ContactUs() {

    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [messageData, setMessageData] = useState({
        name: "",
        email: "",
        subject: "",
        content: ""
    });

    const [waitMsg, setWaitMsg] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const [formValidationErrors, setFormValidationErrors] = useState({});

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    const sendMessage = async (e) => {
        try {
            e.preventDefault();
            setFormValidationErrors({});
            const errorsObject = inputValuesValidation([
                {
                    name: "name",
                    value: messageData.name,
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
                    value: messageData.email,
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
                setWaitMsg("Please Wait");
                const result = (await axios.post(`${process.env.BASE_API_URL}/messages/send-message?language=${i18n.language}`, messageData)).data;
                setWaitMsg("");
                if (!result.error) {
                    setSuccessMsg(result.msg);
                    let successTimeout = setTimeout(async () => {
                        setMessageData({ name: "", email: "", subject: "", content: "" });
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
        <div className="contact-us">
            <Head>
                <title>{t(process.env.WEBSITE_NAME)} {t("Contact Us")}</title>
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
                                    <a href={`https://wa.me/${process.env.CONTACT_NUMBER}?text=welcome`} target="_blank" className="text-dark">
                                        <MdOutlineWhatsapp className="mb-3 contact-icon" />
                                        <h4 className="mb-3">{t("Whatsapp")}</h4>
                                        <h6>{process.env.contactNumber}</h6>
                                    </a>
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
                                    <a href={`mailto:${process.env.CONTACT_EMAIL}`} target="_blank" className="text-dark">
                                        <MdOutlineMail className="mb-3 contact-icon" />
                                        <h4 className="mb-3">{t("Email")}</h4>
                                        <h6>{process.env.contactEmail}</h6>
                                    </a>
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
                                <form className="contact-us-form info-box p-4" onSubmit={sendMessage}>
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 email-field ${formValidationErrors["name"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Name")}
                                        onChange={(e) => setMessageData({ ...messageData, name: e.target.value })}
                                        value={messageData.name}
                                    />
                                    {formValidationErrors["name"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["name"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 email-field ${formValidationErrors["email"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Email")}
                                        onChange={(e) => setMessageData({ ...messageData, email: e.target.value })}
                                        value={messageData.email}
                                    />
                                    {formValidationErrors["email"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["email"])} />}
                                    <input
                                        type="text"
                                        className={`form-control p-2 border-2 email-field ${formValidationErrors["subject"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Subject")}
                                        onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                                        value={messageData.subject}
                                    />
                                    {formValidationErrors["subject"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["subject"])} />}
                                    <textarea
                                        className={`form-control p-2 border-2 content-field ${formValidationErrors["content"] ? "border-danger mb-3" : "mb-4"}`}
                                        placeholder={t("Content")}
                                        onChange={(e) => setMessageData({ ...messageData, content: e.target.value })}
                                        value={messageData.content}
                                    />
                                    {formValidationErrors["content"] && <FormFieldErrorBox errorMsg={t(formValidationErrors["content"])} />}
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