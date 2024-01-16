import { Link, useLocation } from "react-router-dom";
import Button from "../../components/shared/Button/Button";
import styles from "./SignUp.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearRegisterInfo,
  registerFetch,
} from "../../redux/toolkit/registerSlice";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { clearConfirmInfo } from "../../redux/toolkit/confirmSlice";
import {decryptAndRetrieve} from "../../utils/localStorageManagement.js";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [vat, setVat] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [terms, setTerms] = useState(false);
  const [employeeCount, setEmployeeCount] = useState("");
  const [webSite, setWebSite] = useState("");
  const dispatch = useDispatch();
  const { registerInfo } = useSelector((state) => state.register);
  const [confirmModal, setConfirmModal] = useState(false);
    const [confirmTimer, setConfirmTimer] = useState(0);
  const location = useLocation();
  const user =  decryptAndRetrieve("user_type")
    ? decryptAndRetrieve("user_type")
    : location.state.type;
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    companyName: false,
    industry: false,
    vat: false,
    email: false,
    password: false,
    repeatPass: false,
    terms: false,
    employeeCount: false,
    webSite: false,
  });

  const registerRequest = (e) => {
    e.preventDefault();
    if (user === "user") {
      const Individual_User = {
        name: firstName,
        surname: lastName,
        email,
        phone_number: phoneNumber,
        password,
        privacy_policy: terms,
        terms_of_use: terms,
        role: "Individual_User",
      };
      dispatch(registerFetch({ Individual_User }));
    }
    if (user === "company") {
      //TODO address'i formda ekleyince buraya da ekleyecegiz
      //TODO vat da eklenecek,
      const Company_User = {
        name: companyName,
        email,
        phone_number: phoneNumber,
        password,
        privacy_policy: terms,
        terms_of_use: terms,
        industry,
        employee_count: employeeCount,
        web_site: webSite,
        role: "Company_User",
      };
      dispatch(registerFetch({ Company_User }));
    }
  };

  const handleModal = () => {
    localStorage.removeItem("timer");
    setConfirmModal(false);
    dispatch(clearConfirmInfo());
    dispatch(clearRegisterInfo());
  };

  useEffect(() => {
    if (registerInfo?.status_code === "201") {
      setConfirmModal(true);
      setConfirmTimer(registerInfo.confirm_time);
    }
  }, [registerInfo]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (user === "user") {
      if (
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !email ||
        !password ||
        !repeatPass ||
        !terms
      ) {
        setError({
          firstName: !firstName,
          lastName: !lastName,
          phoneNumber: !phoneNumber,
          email: !email,
          password: !password,
          repeatPass: !repeatPass,
          terms: !terms,
        });
        return;
      }
    }
    if (user === "company") {
      if (
        !phoneNumber ||
        !companyName ||
        !industry ||
        !vat ||
        !email ||
        !password ||
        !repeatPass ||
        !terms ||
        !employeeCount ||
        !webSite
      ) {
        setError({
          phoneNumber: !phoneNumber,
          companyName: !companyName,
          industry: !industry,
          vat: !vat,
          email: !email,
          password: !password,
          repeatPass: !repeatPass,
          employee_count: !employeeCount,
          webSite: !webSite,
          terms: !terms,
        });
        return;
      }
    }

    registerRequest(e);
  };

  return (
    <motion.div>
      <div className={styles.container}>
        <div
          className={styles.grid}
          style={user === "user" ? { gridAutoRows: 65 + "rem" } : {}}
        >
          <div className={styles.explanation}>
            <div className={styles.texts}>
              <div>pure code</div>
              <div>asfasf</div>

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
                <span>Already a member ?</span>
                <Button className={["dark"]}>LOG IN</Button>
              </div>
            </div>
            <div>
              Welcome in our service, create account to start your experience.
            </div>
            <form onSubmit={handleOnSubmit}>
              {user === "user" && (
                <>
                  <div className={styles.col}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value.trim());
                          setError({ ...error, firstName: !e.target.value });
                        }}
                        onBlur={() => {
                          setError({ ...error, firstName: !firstName });
                        }}
                      />
                      {error.firstName ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value.trim());
                          setError({ ...error, lastName: !e.target.value });
                        }}
                        onBlur={() => {
                          setError({ ...error, lastName: !lastName });
                        }}
                      />
                      {error.lastName ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}

              {user === "company" ? (
                <>
                  <div className={styles.col}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="companyName">Company Name</label>
                      <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value.trim());
                          setError({ ...error, companyName: !e.target.value });
                        }}
                        onBlur={() => {
                          setError({ ...error, companyName: !companyName });
                        }}
                      />
                      {error.companyName ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="industry">Industry</label>
                      <input
                        type="text"
                        id="industry"
                        value={industry}
                        onChange={(e) => {
                          setIndustry(e.target.value.trim());
                          setError({ ...error, industry: !e.target.value });
                        }}
                        onBlur={() => {
                          setError({ ...error, industry: !industry });
                        }}
                      />
                      {error.industry ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.col}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="vat">vat number</label>
                      <input
                        type="text"
                        id="vat"
                        value={vat}
                        onChange={(e) => {
                          setVat(e.target.value.trim());
                          setError({ ...error, vat: !e.target.value });
                        }}
                        onBlur={() => {
                          setError({ ...error, vat: !vat });
                        }}
                      />
                      {error.vat ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : null}
              <div className={styles.col}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.trim());
                      setError({ ...error, phoneNumber: !e.target.value });
                    }}
                    onBlur={() => {
                      setError({ ...error, phoneNumber: !phoneNumber });
                    }}
                  />
                  {error.phoneNumber ? (
                    <span className={styles.errorMessage}>
                      Field is required
                    </span>
                  ) : null}
                </div>
              </div>
              {user === "company" && (
                <>
                  <div className={styles.col}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="employeeCount">Employee Count</label>
                      <input
                        type="text"
                        id="employeeCount"
                        inputMode="numeric"
                        value={employeeCount}
                        onChange={(e) => {
                          setEmployeeCount(e.target.value.trim());
                          setError({
                            ...error,
                            employeeCount: !e.target.value,
                          });
                        }}
                        onBlur={() => {
                          setError({ ...error, employeeCount: !employeeCount });
                        }}
                      />
                      {error.phoneNumber ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.col}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="webSite">Web Site</label>
                      <input
                        type="text"
                        id="webSite"
                        value={webSite}
                        onChange={(e) => {
                          setWebSite(e.target.value.trim());
                          setError({ ...error, webSite: !e.target.value });
                        }}
                        onBlur={() => {
                          setError({ ...error, webSite: !webSite });
                        }}
                      />
                      {error.phoneNumber ? (
                        <span className={styles.errorMessage}>
                          Field is required
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              <div className={styles.col}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">E mail</label>
                  <input
                    type="text"
                    id="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.trim());
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
                          !email ||
                          !email.match(
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
                {/* Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character */}
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value.trim());
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
                        password: !password.match(
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
                        ),
                      });
                    }}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"
                    maxLength={10}
                    minLength={8}
                    title="Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
                  />
                  {error.password ? (
                    <span className={styles.errorMessage}>
                      Field is required or doesn&apos;t meet criteria
                    </span>
                  ) : null}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="repeatPass">Repeat Password</label>
                  <input
                    type="password"
                    id="repeatPass"
                    autoComplete="new-password"
                    value={repeatPass}
                    onChange={(e) => {
                      setRepeatPass(e.target.value.trim());
                      setError({
                        ...error,
                        repeatPass:
                          !repeatPass ||
                          repeatPass.match(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
                          ),
                      });
                    }}
                    onBlur={() => {
                      setError({
                        ...error,
                        repeatPass: !repeatPass.match(
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
                        ),
                      });
                    }}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"
                    maxLength={10}
                    minLength={8}
                    title="Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
                  />
                  {error.repeatPass ? (
                    <span className={styles.errorMessage}>
                      Field is required or doesn&apos;t match password
                    </span>
                  ) : null}
                </div>
              </div>
              <div className={styles.col}>
                <div className={`${styles.inputGroup} ${styles.privacy}`}>
                  {/* TODO checkbox tasarimdaki gibi style edilecek bir ara */}
                  <input
                    type="checkbox"
                    id="terms"
                    checked={terms}
                    onChange={(e) => {
                      setTerms(e.target.checked);
                      setError({ ...error, terms: !e.target.checked });
                    }}
                  />
                  <label htmlFor="terms">
                    I’ve read and agree to the{" "}
                    <Link to="privacy-policy">privacy policy</Link>
                  </label>
                  {error.terms ? (
                    <span className={styles.errorMessage}>
                      Field is required
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button className={["blue", "md"]}>Sign Up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        {confirmModal && (
          <ConfirmModal handleModal={handleModal} redirectPath={"/login"} confirmTimer={confirmTimer} />
        )}
      </div>
    </motion.div>
  );
}
