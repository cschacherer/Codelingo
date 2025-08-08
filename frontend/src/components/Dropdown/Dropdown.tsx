import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import styles from "./Dropdown.module.css";

interface Props {
    title: string;
    items: string[];
    selectedItem: string;
    changeSelectedItem: (value: any) => void;
    useCustomText?: boolean;
    customText?: string;
    onCustomTextChange?: (value: string) => void;
}

const Dropdown = ({
    title,
    items,
    selectedItem,
    changeSelectedItem,
    useCustomText = false,
    customText = "",
    onCustomTextChange = () => {},
}: Props) => {
    return (
        <Container>
            <Row className={styles.dropdown__row}>
                <Col className={styles.dropdown__lableColumn}>
                    <h1 className={styles.dropdown__lableText}>{title}</h1>
                </Col>
                <Col>
                    <div className={styles.dropdown__dropdownContainer}>
                        <div className="dropdown">
                            <button
                                className={`btn btn-light dropdown-toggle ${styles.dropdown__dropdownButton}`}
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {selectedItem}
                            </button>
                            <ul
                                className={`dropdown-menu ${styles.dropdown__dropdownItemContainer}`}
                            >
                                {items.map((item) => (
                                    <li
                                        className="dropdown-item"
                                        key={item}
                                        onClick={() => {
                                            changeSelectedItem(item);
                                        }}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {useCustomText && (
                            <input
                                className={styles.dropdown__dropdownCustomText}
                                type="text"
                                value={customText}
                                onChange={(e) =>
                                    onCustomTextChange(e.target.value)
                                }
                            ></input>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dropdown;
