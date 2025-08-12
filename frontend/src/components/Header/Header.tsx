import style from "./Header.module.css";

interface Props {
    title: string;
    defaultBackground: boolean;
}

const Header = ({ title, defaultBackground }: Props) => {
    return (
        <>
            {defaultBackground && (
                <div className={style.header__background}>
                    <h1 className={style.header__text}>{title}</h1>
                </div>
            )}
            {!defaultBackground && (
                <h1 className={style.header__text}>{title}</h1>
            )}
        </>
    );
};

export default Header;
