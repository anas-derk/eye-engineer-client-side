import axios from "axios";

const getDateFormated = (date) => {
    let orderedDateInDateFormat = new Date(date);
    const year = orderedDateInDateFormat.getFullYear();
    const month = orderedDateInDateFormat.getMonth() + 1;
    const day = orderedDateInDateFormat.getDate();
    orderedDateInDateFormat = `${year} / ${month} / ${day}`;
    return orderedDateInDateFormat;
}

async function getUserInfo() {
    try {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        return (await axios.get(`${process.env.BASE_API_URL}/users/user-info?language=${userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en"}`, {
            headers: {
                Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
            },
        })).data;
    }
    catch (err) {
        throw err;
    }
}

const sendTheCodeToUserEmail = async (email, typeOfUse, userType) => {
    try {
        const userLanguage = localStorage.getItem(process.env.USER_LANGUAGE_FIELD_NAME_IN_LOCAL_STORAGE);
        return (await axios.post(`${process.env.BASE_API_URL}/auth/send-code?language=${userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en"}`, {
            email,
            typeOfUse,
            userType,
        })).data;
    }
    catch (err) {
        throw err;
    }
}

const handleSelectUserLanguage = (userLanguage, changeLanguageFunc) => {
    changeLanguageFunc(userLanguage);
    document.body.lang = userLanguage;
}

const getInitialStateForElementBeforeAnimation = () => {
    return {
        scale: 0.7
    }
}

const getAnimationSettings = (delay = 0) => {
    return {
        scale: 1,
        transition: {
            delay,
            duration: 0.4
        }
    }
}

const handleDisplayConfirmDeleteBox = (selectedElementIndex, setSelectedElementIndex, setIsDisplayConfirmDeleteBox) => {
    setIsDisplayConfirmDeleteBox(true);
    setSelectedElementIndex(selectedElementIndex);
}

const getLanguagesInfoList = (fieldName) => {
    return [
        {
            fullLanguageName: "Arabic",
            internationalLanguageCode: "ar",
            formField: `${fieldName}InAR`
        },
        {
            fullLanguageName: "English",
            internationalLanguageCode: "en",
            formField: `${fieldName}InEN`
        },
        {
            fullLanguageName: "German",
            internationalLanguageCode: "de",
            formField: `${fieldName}InDE`
        },
        {
            fullLanguageName: "Turkish",
            internationalLanguageCode: "tr",
            formField: `${fieldName}InTR`
        }
    ];
}

const getAllOfficesInsideThePage = async (pageNumber, pageSize, filters, language) => {
    try {
        return (await axios.get(`${process.env.BASE_API_URL}/offices/all-offices-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&language=${language}&${filters ? filters : ""}`, {
            headers: {
                Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE)
            }
        })).data;
    }
    catch (err) {
        throw err;
    }
}

const getOfficeDetails = async (officeId, userType, language) => {
    try {
        if (!officeId) {
            return (await axios.get(`${process.env.BASE_API_URL}/offices/main-office-details?userType=${userType}&language=${language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                },
            })).data;
        } else {
            return (await axios.get(`${process.env.BASE_API_URL}/offices/office-details/${officeId}?userType=${userType}&language=${language}`, {
                headers: {
                    Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE),
                },
            })).data;
        }
    }
    catch (err) {
        throw err;
    }
}

const getAllGeometriesInsideThePage = async (pageNumber, pageSize, filters, language) => {
    try {
        return (await axios.get(`${process.env.BASE_API_URL}/geometries/all-geometries-inside-the-page?pageNumber=${pageNumber}&pageSize=${pageSize}&language=${language}&${filters ? filters : ""}`, {
            headers: {
                Authorization: localStorage.getItem(process.env.USER_TOKEN_NAME_IN_LOCAL_STORAGE)
            }
        })).data;
    }
    catch (err) {
        throw err;
    }
}

export {
    getDateFormated,
    getUserInfo,
    sendTheCodeToUserEmail,
    handleSelectUserLanguage,
    getInitialStateForElementBeforeAnimation,
    getAnimationSettings,
    handleDisplayConfirmDeleteBox,
    getLanguagesInfoList,
    getAllOfficesInsideThePage,
    getOfficeDetails,
    getAllGeometriesInsideThePage
}