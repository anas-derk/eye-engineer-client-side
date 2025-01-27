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

export default function Footer() {

    const { i18n, t } = useTranslation();

    useEffect(() => {
        const userLanguage = localStorage.getItem(process.env.userlanguageFieldNameInLocalStorage);
        handleSelectUserLanguage(userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en", i18n.changeLanguage);
    }, []);

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
                                <Link href="/capabilities" className="link-btn">{t("Capabilities").toUpperCase()}</Link>
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
                                <Link href="/questions-policy" className="link-btn">{t("Questions Policy").toUpperCase()}</Link>
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
                                <Link href="https://www.facebook.com/eyeengineer?mibextid=ZbWKwL" target="_blank" className="link-btn">{t("Facebook").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaInstagram className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.instagram.com/eyeengineer?igsh=MzRlODBiNWFlZA==" target="_blank" className="link-btn">{t("Instagram").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaTiktok className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.tiktok.com/@cirat.co?_t=8oZFsy0KQ2z&_r=1" target="_blank" className="link-btn">{t("Tiktok").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <BiLogoMicrosoftTeams className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://teams.live.com/l/community/FEAG3TGynF-xu-I6AI" target="_blank" className="link-btn">{t("Tiktok").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <MdEmail className={`icon ${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="mailto:info@eyeengineer.com" className="link-btn">{t("Email").toUpperCase()}</Link>
                            </li>
                        </ul>
                    </motion.div>
                </div>
                <p className="mb-0 text-center fw-bold">
                    {t("All Rights Reserved For")} <Link href="/" className="website-link">{process.env.websiteName}</Link>
                </p>
            </div>
        </footer>
    );
}