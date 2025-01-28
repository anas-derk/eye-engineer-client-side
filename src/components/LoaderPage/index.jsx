import { useEffect } from "react";
import loaderImage from "../../../public/images/loaderImage.svg";

export default function LoaderPage() {

    useEffect(() => {
        const tempLightMode = localStorage.getItem(process.env.userThemeModeFieldNameInLocalStorage);
        if (tempLightMode && (tempLightMode === "dark" || tempLightMode === "sunny")) {
            let rootElement = document.documentElement;
            rootElement.style.setProperty("--main-color-one", "#f0fdf4");
            rootElement.style.setProperty("--main-text-color", tempLightMode === "sunny" ? "#000" : "#FFF");
        }
    }, []);

    return (
        <div className="loading-box d-flex justify-content-center align-items-center">
            <img src={loaderImage.src} alt="Loader Image" />
        </div>
    );
}