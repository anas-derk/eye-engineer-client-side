import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaInstagram, FaTiktok } from "react-icons/fa";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { IoLogoFacebook } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, handleSelectUserLanguage } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import WebsiteLogo from "../../../public/images/LogoWithTransparentBackground.webp"
import axios from "axios";

export default function Footer() {

    const { i18n, t } = useTranslation();

    const [subscriptionEmail, setSubscriptionEmail] = useState("");

    const [subscriptionWaitMsg, setSubscriptionWaitMsg] = useState("");

    const [subscriptionSuccessMsg, setSubscriptionSuccessMsg] = useState("");

    const [subscriptionErrorMsg, setSubscriptionErrorMsg] = useState("");

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

    const subscribe = async (e) => {
        try {
            e.preventDefault();
            setSubscriptionSuccessMsg("");
            setSubscriptionErrorMsg("");
            const email = subscriptionEmail.trim();
            if (!email) {
                setSubscriptionErrorMsg("Please Enter Email Here");
                return;
            }
            setSubscriptionWaitMsg("Please Wait");
            const result = (await axios.post(`${process.env.BASE_API_URL}/subscriptions/add?language=${i18n.language}`, {
                email,
            })).data;
            setSubscriptionWaitMsg("");
            if (!result.error) {
                setSubscriptionEmail("");
                setSubscriptionSuccessMsg(result.msg || "Subscription Process Has Been Successfully !!");
                let successTimeout = setTimeout(() => {
                    setSubscriptionSuccessMsg("");
                    clearTimeout(successTimeout);
                }, 3000);
            } else {
                setSubscriptionErrorMsg(result.msg || "Sorry, Something Went Wrong, Please Repeat The Process !!");
            }
        }
        catch (err) {
            setSubscriptionWaitMsg("");
            setSubscriptionErrorMsg(err?.response?.data?.msg || (err?.message === "Network Error" ? "Network Error" : "Sorry, Something Went Wrong, Please Repeat The Process !!"));
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
                        <img src={WebsiteLogo.src} alt={`${process.env.WEBSITE_NAME} Image`} className="mw-100 mb-4" />
                        <form className="footer-subscribe-form text-center" onSubmit={subscribe}>
                            <h5 className="footer-subscribe-title fw-bold mb-4 pb-2 mx-auto">{t("Subscribe")}</h5>
                            <p className="footer-subscribe-text mb-3">{t("Enter Your Email Address")}</p>
                            <p className="footer-subscribe-text mb-4">{t("I want to receive all updates by email")}</p>
                            <input
                                type="email"
                                className="footer-subscribe-input form-control mb-3"
                                placeholder={t("Please Enter Email Here")}
                                value={subscriptionEmail}
                                onChange={(e) => {
                                    setSubscriptionEmail(e.target.value);
                                    setSubscriptionSuccessMsg("");
                                    setSubscriptionErrorMsg("");
                                }}
                            />
                            {!subscriptionWaitMsg && !subscriptionSuccessMsg && !subscriptionErrorMsg && <button type="submit" className="footer-subscribe-button btn">{t("Subscribe")}</button>}
                            {subscriptionWaitMsg && <button type="button" className="footer-subscribe-button btn" disabled>{t(subscriptionWaitMsg)} ...</button>}
                            {subscriptionSuccessMsg && <button type="button" className="footer-subscribe-button footer-subscribe-button--success btn" disabled>{t(subscriptionSuccessMsg)}</button>}
                            {subscriptionErrorMsg && <button type="button" className="footer-subscribe-button footer-subscribe-button--error btn" disabled>{t(subscriptionErrorMsg)}</button>}
                        </form>
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
                        <h5 className="fw-bold mb-4 pb-2 title">{t("Useful Links").toUpperCase()}</h5>
                        <ul
                            className="links-list"
                        >
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/" className="link-btn">{t("Home").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/about-us" className="link-btn">{t("About Us").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/our-capabilities" className="link-btn">{t("Our Capabilities").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/contact-us" className="link-btn">{t("Contact Us").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/reserve-office" className="link-btn">{t("Reserve Office").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/intelligent-translator" className="link-btn">{t("Intelligent Translator").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/privacy-policy" className="link-btn">{t("Privacy Policy").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/articles-policy" className="link-btn">{t("Articles Policy").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/questions-and-answer-policy" className="link-btn">{t("Questions Policy").toUpperCase()}</Link>
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
                        <h5 className="fw-bold mb-4 pb-2 title">{t("Our Services").toUpperCase()}</h5>
                        <ul
                            className="links-list"
                        >
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/" className="link-btn">{t("Geometries").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/about-us" className="link-btn">{t("Educational Videos").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/about-us" className="link-btn">{t("Recents").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/capabilities" className="link-btn">{t("Engineering Articles").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/contact-us" className="link-btn">{t("Terminologies").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/return-and-refund-policy" className="link-btn">{t("Offices").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2 icon" /> : <FaLongArrowAltLeft className="ms-2 icon" />}
                                <Link href="/return-and-delivery-sheet" className="link-btn">{t("Property Valuation").toUpperCase()}</Link>
                            </li>
                        </ul>
                    </motion.div>
                    <motion.div
                        className="col-xl-3"
                        initial={getInitialStateForElementBeforeAnimation()}
                        whileInView={getAnimationSettings}
                    >
                        <h5 className="fw-bold mb-4 pb-2 title">{t("Contact Us").toUpperCase()}</h5>
                        <ul
                            className="links-list"
                        >
                            <li className="link-item fw-bold mb-3">
                                <IoLogoFacebook className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href={process.env.FACEBOOK_LINK} target="_blank" className="link-btn">{t("Facebook").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaInstagram className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href={process.env.INSTAGRAM_LINK} target="_blank" className="link-btn">{t("Instagram").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaTiktok className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href={process.env.TIKTOK_LINK} target="_blank" className="link-btn">{t("Tiktok").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <BiLogoMicrosoftTeams className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href={process.env.TEAMS_LINK} target="_blank" className="link-btn">{t("Teams").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <MdEmail className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href={`mailto:${process.env.CONTACT_EMAIL}`} className="link-btn">{t("Email").toUpperCase()}</Link>
                            </li>
                        </ul>
                    </motion.div>
                </div>
                <p className="mb-0 text-center fw-bold">
                    {t("All Rights Reserved For")} <Link href="/" className="website-link">{process.env.WEBSITE_NAME}</Link>
                </p>
            </div>
        </footer>
    );
}
