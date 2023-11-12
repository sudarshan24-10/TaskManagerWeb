import NavigationBar from "./components/NavigationBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SignupScreen from "./screens/SignupScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SigninScreen from "./screens/SigninScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <NavigationBar></NavigationBar>
        <Routes>
          <Route path="/" element={<HomeScreen></HomeScreen>}></Route>
          <Route path="/signup" element={<SignupScreen></SignupScreen>}></Route>
          <Route path="/passwordreset" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordScreen />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardScreen></DashboardScreen>
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/signin" element={<SigninScreen></SigninScreen>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
