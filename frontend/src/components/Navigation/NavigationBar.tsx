import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import userAvatar from "../../assets/user.png";
import style from "./NavigationBar.module.css";
import owlIcon from "../../assets/owlIcon.svg";
import { useAuth } from "../../context/authContext";

interface Props {
    loggedIn: boolean;
    onUserPage: boolean;
}

const NavigationBar = ({ loggedIn, onUserPage }: Props) => {
    const auth = useAuth();
    return (
        <Navbar expand="lg" className={style.navigationBar__background}>
            {onUserPage && (
                <Navbar.Brand href="/" className={style.navigationBar__brand}>
                    <img src={owlIcon} width="50" height="50" /> CodeLingo
                </Navbar.Brand>
            )}

            <Navbar.Collapse className={style.navigationBar__container}>
                <Nav.Link className={style.navigationBar__link} href="/">
                    Home
                </Nav.Link>
                <Nav.Link className={style.navigationBar__link} href="/about">
                    About
                </Nav.Link>
                {!loggedIn && (
                    <Nav.Link
                        className={style.navigationBar__link}
                        href="/login"
                    >
                        Login
                    </Nav.Link>
                )}
                {loggedIn && (
                    <>
                        <Nav.Link
                            className={style.navigationBar__link}
                            href="/questions/saved"
                        >
                            Saved Questions
                        </Nav.Link>
                        <NavDropdown
                            align="end"
                            className={style.navigationBar__link}
                            title={
                                <img
                                    src={userAvatar}
                                    width="25"
                                    height="25"
                                ></img>
                            }
                        >
                            <NavDropdown.Item href="/user">
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                href="/"
                                onClick={() => auth.logoutUser()}
                            >
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
