import { useState } from "react";
import hideIcon from "../../assets/hide.png";
import showIcon from "../../assets/show.png";
import sharedStyle from "../../Forms.module.css";
import style from "./PasswordInput.module.css";

interface Props {
    password: string;
    passwordLabel: string;
    updatePasswordFunction: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
}

//custom password input component to show/hide password text
const PasswordInput = ({
    password,
    passwordLabel,
    updatePasswordFunction,
}: Props) => {
    const [inputType, setInputType] = useState("password");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordIcon, setPasswordIcon] = useState(hideIcon);

    const changeShowPassword = () => {
        setShowPassword(!showPassword);
        if (showPassword) {
            setInputType("text");
            setPasswordIcon(showIcon);
        } else {
            setInputType("password");
            setPasswordIcon(hideIcon);
        }
    };

    return (
        <div className={sharedStyle.form__inputField}>
            <div className={style.passwordInput__container}>
                <input
                    className={`${style.passwordInput__input}`}
                    type={inputType}
                    value={password}
                    onChange={updatePasswordFunction}
                    required
                />
                <span className={style.passwordInput__iconContainer}>
                    <img
                        className={style.passwordInput__icon}
                        src={passwordIcon}
                        onClick={changeShowPassword}
                    />
                </span>
                <label className={style.passwordInput__label}>
                    {passwordLabel}
                </label>
            </div>
        </div>
    );
};

export default PasswordInput;
