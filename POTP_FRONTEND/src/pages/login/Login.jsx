import Button from "../../components/shared/Button/Button";
import styles from "./Login.module.scss";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearLogInInfo, logInFetch} from "../../redux/toolkit/logInSlice";
import {useEffect} from "react";
import {motion} from "framer-motion";
import {clearConfirmInfo} from "../../redux/toolkit/confirmSlice";
import {clearRegisterInfo} from "../../redux/toolkit/registerSlice";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import {userFetch} from "../../redux/toolkit/userSlice";
import {useNavigate} from "react-router-dom";
import {toast, Toaster} from "react-hot-toast";

// TODO user'i ya localstorage'dan ya da redux'tan al
export default function Login() {
    const navigateTo = useNavigate();
    const [logInForm, setLogInForm] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState({
        email: false,
        password: false,
    });

    const dispatch = useDispatch();
    const logInError = useSelector((state) => state.logIn.logInError);
    const logInInfo = useSelector((state) => state.logIn.logInInfo);
    const userInfo = useSelector((state) => state.user.userInfo);

    const [confirmModal, setConfirmModal] = useState(false);

    const handleLogIn = (e) => {
        e.preventDefault();
        dispatch(logInFetch({logInForm}));
    };

    const handleFormChange = (e) => {
        setLogInForm({...logInForm, [e.target.id]: e.target.value});
    };
    const handleModal = () => {
        localStorage.removeItem("timer");
        setConfirmModal(false);
        dispatch(clearConfirmInfo());
        dispatch(clearRegisterInfo());
        dispatch(clearLogInInfo());
    };

    useEffect(() => {
        if (logInInfo) {
            navigateTo("/dashboard");
        }
    }, [logInInfo]);

    useEffect(() => {
        if (logInError.status_code === "401") {
            setConfirmModal(true);
        }
        if (logInError.status_code === "400") {
            toast.error(logInError.message);
        }
        if (logInError.status_code === "429") {
            toast.error(logInError.message);
        }
    }, [logInError]);

    return (
        <motion.div>
            <div className={styles.container}>
                <div
                    className={styles.grid}
                    // style={user === "user" ? { gridAutoRows: 46 + "rem" } : {}}
                >
                    <div className={styles.explanation}>
                        <div className={styles.texts}>
                            <div>pure code</div>
                            <div></div>

                            <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliquat enim
                                ad minim veniam.
                            </p>
                        </div>
                        <div className={styles.image}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="800"
                                height="513"
                                viewBox="0 0 800 513"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M296.033 148.682C337.304 148.682 370.874 115.112 370.874 73.8545C370.874 32.5703 337.304 -1 296.033 -1C254.762 -1 221.192 32.5703 221.192 73.8411C221.192 115.112 254.762 148.682 296.033 148.682ZM296.034 25.8777C322.481 25.8777 343.997 47.4068 343.997 73.8411C343.997 100.275 322.481 121.804 296.034 121.804C269.586 121.804 248.07 100.289 248.07 73.8545C248.07 47.4203 269.586 25.8777 296.034 25.8777ZM22.2379 509.121C19.6934 511.357 16.5329 512.456 13.3992 512.456C9.68956 512.456 5.99335 510.929 3.34171 507.916C-1.5464 502.358 -1.01071 493.895 4.547 489.007L408.536 118.404C413.839 113.744 421.847 113.999 426.856 118.994L490.375 182.511L621.537 38.8577C623.934 36.2329 627.282 34.666 630.831 34.5053C634.353 34.425 637.848 35.6169 640.473 38.014L801.178 185.323C806.642 190.318 807.004 198.795 802.008 204.245C797.013 209.696 788.536 210.071 783.085 205.076L632.277 66.8329L509.324 201.473L573.7 265.847C578.936 271.083 578.936 279.547 573.7 284.783C568.464 290.019 560 290.019 554.764 284.783L416.798 146.835L22.2379 509.121Z"
                                    fill="#F5F3F3"
                                    fillOpacity="0.04"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className={styles.getStarted}>
                        <div className={styles.header}>
                            <span id={styles.getStarted}>Get Started Now</span>
                            <div className="flex">
                                <span className={styles.hideOnMobile}>Not a member ?</span>
                                <Button className={["dark"]}>Sign Up</Button>
                            </div>
                        </div>
                        <div>Log in to your account to continue your experience.</div>
                        <form onSubmit={(e) => handleLogIn(e)}>
                            <div className={styles.col}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">E mail</label>
                                    <input
                                        type="text"
                                        id="email"
                                        autoComplete="username"
                                        value={logInForm.email}
                                        onChange={(e) => {
                                            handleFormChange(e);
                                            setError({
                                                ...error,
                                                email: !e.target.value.match(
                                                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                                                ),
                                            });
                                        }}
                                        onBlur={() => {
                                            setError({
                                                ...error,
                                                email:
                                                    !logInForm.email ||
                                                    !logInForm.email.match(
                                                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                                                    ),
                                            });
                                        }}
                                    />
                                    {error.email ? (
                                        <span className={styles.errorMessage}>
                      Please enter a valid email
                    </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={logInForm.password}
                                        onChange={(e) => {
                                            handleFormChange(e);
                                            setError({
                                                ...error,
                                                password:
                                                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/.test(
                                                        e.target.value
                                                    ),
                                            });
                                        }}
                                        onBlur={() => {
                                            setError({
                                                ...error,
                                                password: !logInForm.password.match(
                                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
                                                ),
                                            });
                                        }}
                                        minLength={8}
                                    />
                                    {error.password ? (
                                        <span className={styles.errorMessage}>
                      Field is required or doesn&apos;t meet criteria
                    </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <Button className={["blue", "md"]}>Log In</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                {confirmModal && (
                    <ConfirmModal handleModal={handleModal} redirectPath={"/dashboard"}/>
                )}
            </div>
            <Toaster/>

        </motion.div>
    );
}
