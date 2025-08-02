import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import userAvatar from "../../assets/user.png";
import style from "./NavigationBar.module.css";

interface Props {
    loggedIn: boolean;
}

const NavigationBar = ({ loggedIn }: Props) => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Collapse className={style.navigationBar__container}>
                    <Nav.Link className={style.navigationBar__link} href="/">
                        Home
                    </Nav.Link>
                    <Nav.Link
                        className={style.navigationBar__link}
                        href="/about"
                    >
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
                        <NavDropdown
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
                            <NavDropdown.Item href="/logout">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
