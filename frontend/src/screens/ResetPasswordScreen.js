import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import axios from "axios";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");
  const { state } = useContext(Store);
  const { user } = state;

  useEffect(() => {
    if (user || !token) {
      navigate("/");
    }
  }, [navigate, user, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(token);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.post("/api/users/reset-password", {
        password: password,
        token: token,
      });
      navigate("/signin");
      toast.success("password reset successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>reset Password</title>
      </Helmet>
      <h1 className="my-3">Reset Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confrim Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setConfrimPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Reset Password</Button>
        </div>
      </Form>
    </Container>
  );
}
