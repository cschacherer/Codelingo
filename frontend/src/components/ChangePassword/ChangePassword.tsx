import { useState } from "react";
import sharedStyle from "../../Forms.module.css";
import style from "./ChangePassword.module.css";

interface Props {
    newPassword: string;
    confirmPassword: string;
    updateNewPassword: (value: string) => void;
    updateConfirmPassword: (value: string) => void;
    buttonText: string;
    handleSubmitFunction: () => void;
}

const ChangePassword = ({
    newPassword,
    confirmPassword,
    updateNewPassword,
    updateConfirmPassword,
    buttonText,
    handleSubmitFunction,
}: Props) => {
    return (
        <div className={sharedStyle.form__body}>
            <div className={sharedStyle.form__container}>
                <div className={sharedStyle.form__title}>Change Password</div>
                <form
                    className={sharedStyle.form__form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitFunction();
                    }}
                >
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__inputFieldPassword}`}
                            type="password"
                            value={newPassword}
                            onChange={(e) => updateNewPassword(e.target.value)}
                            required
                        />
                        <label className={sharedStyle.form__inputFieldLabel}>
                            New Password
                        </label>
                    </div>
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__inputFieldPassword}`}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                updateConfirmPassword(e.target.value)
                            }
                            required
                        />
                        <label className={sharedStyle.form__inputFieldLabel}>
                            Confirm New Password
                        </label>
                    </div>
                    <div className={sharedStyle.form__inputField}>
                        <input
                            className={`${sharedStyle.form__inputField__input} ${sharedStyle.form__submitButton}`}
                            type="submit"
                            value={buttonText}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
