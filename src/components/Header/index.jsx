import { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Image} from "@heroui/react";
import NextImage from "next/image";
import Logo from "../../../public/images/LogoWithTransparentBackground.png";

export default function Header() {

    const [errorMsgOnLoadingThePage, setErrorMsgOnLoadingThePage] = useState("");

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
        <header className="global-header">
            <Navbar position="static" shouldHideOnScroll className="bg-gray-700">
                <NavbarBrand>
                    <Image
                        alt="Brand Image"
                        as={NextImage}
                        src={Logo.src}
                        width="100"
                        height="100"
                    >

                    </Image>
                    <span className="font-bold">{ process.env.websiteName }</span>
                </NavbarBrand>
            </Navbar>
        </header>
    );
}