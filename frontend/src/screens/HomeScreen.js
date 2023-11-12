import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useContext } from "react";
import { Store } from "../Store";
export default function HomeScreen() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { user } = state;
  const getStartedhandler = () => {
    navigate("/signup");
  };
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ marginTop: "14rem" }}
      >
        <h3 className="text-center">Welcome to Task Manager App</h3>
        {user ? (
          <div>
            <h4>Dear user</h4>
            <Button
              className="firstName-button"
              variant="primary"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </Button>
          </div>
        ) : (
          <Button
            className="GetStarted-button "
            variant="primary"
            type="button"
            onClick={getStartedhandler}
          >
            Get Started
          </Button>
        )}
      </div>

      <Footer></Footer>
    </div>
  );
}
