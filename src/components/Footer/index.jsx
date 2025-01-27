import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaCcPaypal, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LiaCcVisa } from "react-icons/lia";
import { FaCcMastercard } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, handleSelectUserLanguage } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import WebsiteLogo from "../../../public/images/LogoWithTransparentBackground.png"

export default function Footer() {

    const [email, setEmail] = useState("");

    const [waitMsg, setWaitMsg] = useState("");

    const [errMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");

    const { i18n, t } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.userlanguageFieldNameInLocalStorage);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    const handleSubscription = async (e, email) => {
        try {
            e.preventDefault();
            setWaitMsg("Please Wait ...");
            const result = (await axios.post(`${process.env.BASE_API_URL}/subscriptions/add-new-subscription?language=${i18n.language}`, {
                email,
            })).data;
            setWaitMsg("");
            if (!result.error) {
                setSuccessMsg("Success Subscription !!");
                let errorTimeout = setTimeout(() => {
                    setSuccessMsg("");
                    clearTimeout(errorTimeout);
                }, 5000);
            } else {
                setErrorMsg(result.msg);
                let errorTimeout = setTimeout(() => {
                    setErrorMsg("");
                    clearTimeout(errorTimeout);
                }, 5000);
            }
        }
        catch (err) {
            setWaitMsg(false);
            setErrorMsg(err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Try Again !");
            let errorTimeout = setTimeout(() => {
                setErrorMsg("");
                clearTimeout(errorTimeout);
            }, 5000);
        }
    }

    return (
        <footer className="pt-4 pb-4">
            <div className="container">
                <div className="row align-items-center mb-4">
                    <motion.div
                        className="col-xl-3 p-4"
                        initial={{
                            scale: 0.7,
                        }}
                        whileInView={{
                            scale: 1,
                            transition: {
                                duration: 0.4,
                            }
                        }}
                    >
                        <img src={WebsiteLogo.src} alt={`${process.env.websiteName} Image`} className="mw-100 mb-4" />
                        {!waitMsg && !successMsg && !errMsg && <Link className="btn orange-btn d-block w-100" href="/">{t("Send Message")}</Link>}
                    </motion.div>
                    <motion.div
                        className="col-xl-3"
                        initial={{
                            scale: 0.7,
                        }}
                        whileInView={{
                            scale: 1,
                            transition: {
                                duration: 0.4,
                            }
                        }}
                    >
                        <h5 className="fw-bold mb-4 border-bottom border-dark border-2 pb-2 title">{t("Useful Links").toUpperCase()}</h5>
                        <ul
                            className="links-list"
                        >
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/" className="text-dark link-btn">{t("Home").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/about-us" className="text-dark link-btn">{t("About Us").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/capabilities" className="text-dark link-btn">{t("Capabilities").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/contact-us" className="text-dark link-btn">{t("Contact Us").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-refund-policy" className="text-dark link-btn">{t("Reserve Office").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-delivery-sheet" className="text-dark link-btn">{t("Intelligent Translator").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-delivery-sheet" className="text-dark link-btn">{t("Privacy Policy").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-delivery-sheet" className="text-dark link-btn">{t("Articles Policy").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-delivery-sheet" className="text-dark link-btn">{t("Questions Policy").toUpperCase()}</Link>
                            </li>
                        </ul>
                    </motion.div>
                    <motion.div
                        className="col-xl-3"
                        initial={{
                            scale: 0.7,
                        }}
                        whileInView={{
                            scale: 1,
                            transition: {
                                duration: 0.4,
                            }
                        }}
                    >
                        <h5 className="fw-bold mb-4 border-bottom border-dark border-2 pb-2 title">{t("Our Services").toUpperCase()}</h5>
                        <ul
                            className="links-list"
                        >
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/" className="text-dark link-btn">{t("Geometries").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/about-us" className="text-dark link-btn">{t("Educational Videos").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/about-us" className="text-dark link-btn">{t("Recents").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/capabilities" className="text-dark link-btn">{t("Engineering Articles").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/contact-us" className="text-dark link-btn">{t("Terminologies").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-refund-policy" className="text-dark link-btn">{t("Offices").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/return-and-delivery-sheet" className="text-dark link-btn">{t("Property Valuation").toUpperCase()}</Link>
                            </li>
                        </ul>
                    </motion.div>
                    <motion.div
                        className="col-xl-3"
                        initial={getInitialStateForElementBeforeAnimation()}
                        whileInView={getAnimationSettings}
                    >
                        <h5 className="fw-bold mb-4 border-bottom border-dark border-2 pb-2 title">{t("Contact Us").toUpperCase()}</h5>
                        <ul
                            className="links-list"
                        >
                            <li className="link-item fw-bold mb-3">
                                <IoLogoFacebook className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.facebook.com/AsfourInternational?mibextid=ZbWKwL" target="_blank" className="text-dark link-btn">{t("Facebook").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaInstagram className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.instagram.com/ubuyblues" target="_blank" className="text-dark link-btn">{t("Instagram").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaTiktok className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.tiktok.com/@ubuyblues" target="_blank" className="text-dark link-btn">{t("Tiktok").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <MdEmail className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="mailto:info@ubuyblues.com" className="text-dark link-btn">{t("Email").toUpperCase()}</Link>
                            </li>
                        </ul>
                    </motion.div>
                </div>
                <p className="mb-0 text-center fw-bold">
                    {t("All Rights Reserved For")} <Link href="/" className="text-danger">{process.env.WebsiteName}</Link>
                </p>
            </div>
        </footer>
    );
}