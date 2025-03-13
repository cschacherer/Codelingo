import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Dropdown.css";

interface Props {
  title: string;
  items: string[];
  selectedItem: string;
  changeSelectedItem: (value: string) => void;
}

const Dropdown = ({
  title,
  items,
  selectedItem,
  changeSelectedItem,
}: Props) => {
  return (
    <Container>
      <Row className="horizontalFlex">
        <Col className="centerVertically horizontalRight minLabelSize">
          <h1 className="nameText margins">{title}</h1>
        </Col>
        <Col className="centerVertically minButtonSize ">
          <div className="dropdown horizontalRight">
            <button
              className="btn btn-light dropdown-toggle margins minButtonSize fullWidth dropdownSpacing"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedItem}
            </button>
            <ul className="dropdown-menu buttonWidth">
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
        </Col>
      </Row>
    </Container>
  );
};

export default Dropdown;
