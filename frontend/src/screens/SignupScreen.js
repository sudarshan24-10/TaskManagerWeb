import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";

export default function SignupScreen() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signInConfirm, setSigninConfirm] = useState(false);

  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { user } = state;

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("password does not match");
      return;
    }

    try {
      const data = await axios.post("/api/users/signup", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      if (data) {
        toast.success("Sign-up successful!", {
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: false,
        });
        setTimeout(() => {
          navigate("/signin");
        }, 3500);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Email already exists");
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <Helmet>SignUp</Helmet>
      <h3 className="text-center mt-5">Sign Up</h3>
      <div className=" Signup-screen">
        <form onSubmit={submitHandler}>
          <div className="signup-form">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              onChange={(e) => setfirstName(e.target.value)}
            ></input>
          </div>
          <div className="signup-form">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              onChange={(e) => setlastName(e.target.value)}
            ></input>
          </div>
          <div className="signup-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="Email"
              id="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="signup-form">
            <label htmlFor="password">Set Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className="signup-form">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              id="confirmpassword"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          </div>

          <button className="signup-submit" type="submit">
            Sign up
          </button>
        </form>
        {signInConfirm && (
          <div>
            <Link
              onClick={() => {
                setSigninConfirm(false);
              }}
              to="/signin"
            >
              SignIn success navigate to Signin page
            </Link>
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}
