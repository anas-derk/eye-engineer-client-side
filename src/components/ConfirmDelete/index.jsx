import { useTranslation } from "react-i18next";
import { GrFormClose } from "react-icons/gr";

export default function ConfirmDelete({
    setIsDisplayConfirmDeleteBox,
    handleDeleteFunc,
    setSelectedElementIndex,
    waitMsg,
    errorMsg,
    successMsg
}) {

    const { t } = useTranslation();

    const handleClosePopupBox = () => {
        setIsDisplayConfirmDeleteBox(false);
        setSelectedElementIndex(-1);
    }

    const callDeleteFunc = async () => {
        await handleDeleteFunc();
        handleClosePopupBox();
    }

    return (
        <div className="confirm-delete-box popup-box">
            <div className="content-box d-flex align-items-center justify-content-center text-white flex-column p-4 text-center">
                {!waitMsg && !errorMsg && !successMsg && <GrFormClose className="close-popup-box-icon" onClick={handleClosePopupBox} />}
                <h2 className="mb-5 pb-3 border-bottom border-white">{t("Confirm Delete")}</h2>
                <h4 className="mb-4">{t("Are You Sure About Deleting ?")}</h4>
                {
                    !waitMsg &&
                    !errorMsg &&
                    !successMsg &&
                    <button
                        className="btn btn-success d-block mx-auto mb-4 global-button"
                        onClick={callDeleteFunc}
                    >
                        {t("Delete")}
                    </button>
                }
                {waitMsg &&
                    <button
                        className="btn btn-info d-block mx-auto mb-3 global-button"
                        disabled
                    >
                        {t(waitMsg)}
                    </button>
                }
                {errorMsg &&
                    <button
                        className="btn btn-danger d-block mx-auto mb-3 global-button"
                        disabled
                    >
                        {t(errorMsg)}
                    </button>
                }
                {successMsg &&
                    <button
                        className="btn btn-success d-block mx-auto mb-3 global-button"
                        disabled
                    >
                        {t(successMsg)}
                    </button>
                }
                <button
                    className="btn btn-danger d-block mx-auto global-button"
                    disabled={waitMsg || errorMsg || successMsg}
                    onClick={handleClosePopupBox}
                >
                    {t("Close")}
                </button>
            </div>
        </div>
    );
}