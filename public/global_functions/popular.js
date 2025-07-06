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
        const userLanguage = localStorage.getItem(process.env.userlanguageFieldNameInLocalStorage);
        return (await axios.get(`${process.env.BASE_API_URL}/users/user-info?language=${userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en"}`, {
            headers: {
                Authorization: localStorage.getItem(process.env.userTokenNameInLocalStorage),
            },
        })).data;
    }
    catch (err) {
        throw err;
    }
}

const sendTheCodeToUserEmail = async (email, typeOfUse, userType) => {
    try {
        const userLanguage = localStorage.getItem(process.env.userlanguageFieldNameInLocalStorage);
        return (await axios.post(`${process.env.BASE_API_URL}/users/send-account-verification-code?language=${userLanguage === "ar" || userLanguage === "en" || userLanguage === "tr" || userLanguage === "de" ? userLanguage : "en"}`, {
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

export {
    getDateFormated,
    getUserInfo,
    sendTheCodeToUserEmail,
    handleSelectUserLanguage,
    getInitialStateForElementBeforeAnimation,
    getAnimationSettings,
    handleDisplayConfirmDeleteBox
}