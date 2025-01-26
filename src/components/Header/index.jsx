import Link from "next/link";
import { useState, useEffect } from "react";
import { MdOutlineLogout } from "react-icons/md";
import { useRouter } from "next/router";
import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import websiteLogo from "../../../public/images/LogoWithTransparentBackground.png";
import { GrLanguage } from "react-icons/gr";

export default function Header() {

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

    const [lightMode, setLightMode] = useState("sunny");

    const [token, setToken] = useState("");

    const router = useRouter();

    const { i18n, t } = useTranslation();

    useEffect(() => {
        const tempLightMode = localStorage.getItem("eye-engineer-store-light-mode");
        if (tempLightMode && (tempLightMode === "dark" || tempLightMode === "sunny")) {
            setLightMode(tempLightMode);
            let rootElement = document.documentElement;
            rootElement.style.setProperty("--main-color-one", tempLightMode === "sunny" ? "#6A017A" : "#000");
        }
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem(process.env.userTokenNameInLocalStorage);
        if (userToken) {
            setToken(userToken);
        }
    }, []);

    const handleChangeMode = () => {
        const newLightMode = lightMode == "sunny" ? "dark" : "sunny";
        setLightMode(newLightMode);
        let rootElement = document.documentElement;
        rootElement.style.setProperty("--main-color-one", newLightMode === "sunny" ? "#6A017A" : "#000");
        localStorage.setItem("asfour-store-light-mode", newLightMode);
    }

    const userLogout = async () => {
        localStorage.removeItem(process.env.userTokenNameInLocalStorage);
        await router.push("/auth");
    }

    const handleChangeLanguage = (language) => {
        i18n.changeLanguage(language);
        document.body.lang = language;
        localStorage.setItem(process.env.userlanguageFieldNameInLocalStorage, language);
    }

    return (
        <header className="global-header border-2 border-bottom border-dark">
            <Navbar expand="lg" className="bg-body-tertiary pb-1 pt-1" fixed="top">
                <Container fluid>
                    <Navbar.Brand href="/" as={Link}>
                        <img src={websiteLogo.src} alt="eye engineer logo for header" className="website-logo" width="150" height="70" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        {!errorMsgOnLoadingThePage ? <Nav>
                            <Nav.Link href="/" as={Link}>
                                {t("Home")}
                            </Nav.Link>
                            <Nav.Link href="/" as={Link}>
                                {t("About Us")}
                            </Nav.Link>
                            <Nav.Link href="/" as={Link}>
                                {t("Capabilities")}
                            </Nav.Link>
                            <Nav.Link href="/" as={Link}>
                                {t("Contact Us")}
                            </Nav.Link>
                            <NavDropdown title={<GrLanguage />} id="languages-nav-dropdown" className="orange-btn">
                                <NavDropdown.Item onClick={() => handleChangeLanguage("ar")}>{t("Arabic")}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => handleChangeLanguage("en")}>{t("English")}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => handleChangeLanguage("tr")}>{t("Turkish")}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => handleChangeLanguage("de")}>{t("German")}</NavDropdown.Item>
                            </NavDropdown>
                            {!token && <>
                                <Nav.Link href="/auth" as={Link} className="orange-btn">
                                    {t("Sign Up")}
                                </Nav.Link>
                                <Nav.Link href="/auth" as={Link} className="orange-btn">
                                    {t("Login")}
                                </Nav.Link>
                            </>}
                            {lightMode == "sunny" ?
                                <MdOutlineDarkMode
                                    className="dark-mode-icon global-header-icon ms-2 me-2"
                                    onClick={handleChangeMode}
                                /> :
                                <MdOutlineWbSunny
                                    className="sunny-icon global-header-icon ms-2 me-2"
                                    onClick={handleChangeMode}
                                />}
                            {token && <>
                                <Nav.Link href="/customer-dashboard" as={Link}>
                                    {t("Profile")}
                                </Nav.Link>
                                <button className="btn btn-danger logout-btn" onClick={userLogout}>
                                    <MdOutlineLogout className={i18n.language !== "ar" ? "me-2" : "ms-2"} />
                                    <span>{t("Logout")}</span>
                                </button>
                            </>}
                        </Nav> : <p className="alert alert-danger m-0 w-100 text-center fw-bold">{errorMsgOnLoadingThePage}</p>}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}