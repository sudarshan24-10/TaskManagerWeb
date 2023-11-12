import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import NavLink from "react-bootstrap/NavLink";

import { Store } from "../Store";
export default function NavigationBar() {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const isDashboard = location.pathname === "/dashboard";
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "SIGNOUT" });
    navigate("/signin");
  };
  return (
    <div>
      <Navbar expand="lg" bg="dark" variant="dark" className="custom-Navbar">
        <NavbarBrand className="custom-NavbarBrand">
          <NavLink href="/">Task Manager</NavLink>
        </NavbarBrand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-end w-100">
            {user ? (
              <>
                <Profile
                  isDashboard={isDashboard}
                  user={user}
                  signOut={signoutHandler}
                ></Profile>
              </>
            ) : isSignUp ? (
              <>
                <React.Fragment>
                  <span style={{ color: "white", paddingTop: "0.5rem" }}>
                    Already have an Account? :
                  </span>
                  <NavLink href="/signin" className="pe-5">
                    Signin
                  </NavLink>
                </React.Fragment>
              </>
            ) : (
              <>
                <React.Fragment>
                  <NavLink href="/contact" className="pe-2">
                    Contact
                  </NavLink>
                  <NavLink href="/about" className="pe-5">
                    About
                  </NavLink>
                  <NavLink href="/signin" className="pe-5">
                    Signin
                  </NavLink>
                </React.Fragment>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
