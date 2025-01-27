import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaInstagram, FaTiktok } from "react-icons/fa";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { IoLogoFacebook } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { getAnimationSettings, getInitialStateForElementBeforeAnimation, handleSelectUserLanguage } from "../../../public/global_functions/popular";
import { motion } from "motion/react";
import WebsiteLogo from "../../../public/images/LogoWithTransparentBackground.png"

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
                                <Link href="/reserve-office" className="text-dark link-btn">{t("Reserve Office").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/intelligent-translator" className="text-dark link-btn">{t("Intelligent Translator").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/privacy-policy" className="text-dark link-btn">{t("Privacy Policy").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/articles-policy" className="text-dark link-btn">{t("Articles Policy").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold">
                                {i18n.language !== "ar" ? <FaLongArrowAltRight className="me-2" /> : <FaLongArrowAltLeft className="ms-2" />}
                                <Link href="/questions-policy" className="text-dark link-btn">{t("Questions Policy").toUpperCase()}</Link>
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
                                <Link href="https://www.facebook.com/eyeengineer?mibextid=ZbWKwL" target="_blank" className="text-dark link-btn">{t("Facebook").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaInstagram className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.instagram.com/eyeengineer?igsh=MzRlODBiNWFlZA==" target="_blank" className="text-dark link-btn">{t("Instagram").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <FaTiktok className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://www.tiktok.com/@cirat.co?_t=8oZFsy0KQ2z&_r=1" target="_blank" className="text-dark link-btn">{t("Tiktok").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <BiLogoMicrosoftTeams className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="https://teams.live.com/l/community/FEAG3TGynF-xu-I6AI" target="_blank" className="text-dark link-btn">{t("Tiktok").toUpperCase()}</Link>
                            </li>
                            <li className="link-item fw-bold mb-3">
                                <MdEmail className={`${i18n.language !== "ar" ? "me-2" : "ms-2"}`} />
                                <Link href="mailto:info@eyeengineer.com" className="text-dark link-btn">{t("Email").toUpperCase()}</Link>
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