import {Route, Routes} from "react-router-dom";
import {useLocation} from "react-router-dom/dist";
import {AnimatePresence} from "framer-motion";
import {lazy} from "react";
import {Suspense} from "react";
import Redirect from "./shared/Redirect/Redirect";
import Navbar from "../pages/root/Navbar/Navbar";

const defaultErrorElement = (
    <div style={{fontSize: "4em", textAlign: "center"}}>
        Oops, there is an error!
    </div>
);

export default function AnimatedRoutes() {
    const location = useLocation();
    const LazyLanding = lazy(() => {
        return new Promise((resolve) =>
            setTimeout(() => resolve(import("../pages/landing/Landing")), 0)
        );
    });
    const LazySignUp = lazy(() => {
        return new Promise((resolve) =>
            setTimeout(() => resolve(import("../pages/signUp/SignUp")), 0)
        );
    });
    const LazyLogin = lazy(() => {
        return new Promise((resolve) =>
            setTimeout(() => resolve(import("../pages/login/Login")), 0)
        );
    });
    const LazyDashboard = lazy(() => {
        return new Promise((resolve) =>
            setTimeout(() => resolve(import("../pages/dashboard/Dashboard")), 2000)
        );
    });

    return (
        <AnimatePresence mode="initial" initial={false}>
            <Navbar key={"navbar"}/>
            <Suspense fallback={<Redirect/>} key={"suspense"}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<LazyLanding/>}/>
                    <Route path="signUp" element={<LazySignUp/>}/>
                    <Route path="login" element={<LazyLogin/>}/>
                    <Route path="dashboard" element={<LazyDashboard/>}/>
                    <Route path="*" element={defaultErrorElement}/>
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}
