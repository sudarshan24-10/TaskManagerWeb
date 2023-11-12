import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import { useContext } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signinError, setSigninError] = useState(null);

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { user } = state;

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email: email,
        password: password,
      });
      toast.success("Sign-in successful!", {
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: false,
      });
      ctxDispatch({
        type: "SET_USER",
        payload: data,
      });
      localStorage.setItem("user", JSON.stringify(data));
      setTimeout(() => {
        navigate("/dashboard");
      }, 3500);
    } catch (err) {
      console.log(err);
      setSigninError(err.response.data.message);
    }
  };
  return (
    <div>
      <Helmet>SignIn</Helmet>
      <h3 className="text-center mt-5 mb-5">Sign In</h3>
      <div className="Signin-screen mt-5">
        <form onSubmit={handleSubmit}>
          <div className="signin-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>
          <div className="signin-form">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <button className="signup-submit mb-3" type="submit">
              Sign in
            </button>
          </div>
        </form>
        <div>
          <Link className="sign-up-link-2" to="/signup">
            <p>No account? Please signup</p>
          </Link>
        </div>
        <Link to="/passwordreset">Forgot password?</Link>
      </div>
      <div className="signin-error">
        <span>{signinError}</span>
      </div>

      <Footer></Footer>
    </div>
  );
}
