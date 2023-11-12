import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
export default function Footer() {
  return (
    <footer className="bg-dark text-light custom-footer">
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Task Manager App</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
