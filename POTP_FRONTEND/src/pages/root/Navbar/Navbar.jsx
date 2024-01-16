import pureLogo from "/pure-logo.svg";
import styles from "./Navbar.module.scss";
import {Link} from "react-router-dom";
import {useState} from "react";
import FullScreenNavbar from "./FullScreenNavbar";
import {encryptAndStore, decryptAndRetrieve} from "../../../utils/localStorageManagement.js";
import {useSelector} from "react-redux";

const Navbar = () => {
    // login isleri hallolduktan sonra bu state kalkacak veya degisecek
    //test icin su anlik
    const [user, setUser] = useState({loggedIn: false, type: "user"});
    const [fullNav, setFullNav] = useState(false);
    const userInfo = useSelector(state => state.user.userInfo);

    return (
        <nav className={styles.navbar}>
            <ul>
				<span className={styles.firstChild}>
					<li>
						<Link to={"/"}><img src={pureLogo} alt='logo'/></Link>
					</li>
				</span>
                <span className={styles.lastChild}>
					{userInfo && (
                        <>
                            <div className={styles.userName}>{userInfo.name} {userInfo.surname}</div>
                            <div className={styles.avatarDark}>
                                <img src='./avatar.png' alt='avatar'/>
                            </div>
                            <div className={styles.dropdownContentLoggedIn}>
                                <div>
                                    <div className={styles.imgContainer}>
                                        {user.type === "user" && <img src='./avatar.png' alt=''/>}
                                        {user.type === "company" && <img src='./building.png' alt=''/>}
                                    </div>
                                </div>
                                <div>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='13' height='11' viewBox='0 0 13 11'
                                         fill='none'>
                                        <path d='M0 5.5H11.5M11.5 5.5L6.9 1M11.5 5.5L6.9 10' stroke='#6C7B9F'/>
                                    </svg>
                                    <Link to={"/profile"}>See Profile</Link>
                                </div>
                                <div>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='13' viewBox='0 0 14 13'
                                         fill='none'>
                                        <path d='M6.5 1H1V12H6.5M5 6H12.5M12.5 6L9.5 3M12.5 6L9.5 9' stroke='#CD6E60'/>
                                    </svg>
                                    <Link to={"/"}>Log Out</Link>
                                </div>
                            </div>
                        </>
                    )}
                    {!userInfo && (
                        <>
                            <li>
                                <Link className={styles.login} to={"/login"}>
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <div id={styles.signUp}>Sign Up</div>
                                <div className={styles.dropdownContentSignUp}>
                                    <Link className={styles.dropdownItem1} to={"/signUp"} state={{type: "company"}}
                                          onClick={() => encryptAndStore("user_type", "company")
                                          }>
                                        <img src='./building.png' alt='company'/> Companies
                                    </Link>
                                    <Link className={styles.dropdownItem2} to={"/signUp"} state={{type: "user"}}
                                          onClick={() => encryptAndStore("user_type", "user")
                                          }>
                                        <img src='./person.png' alt='person'/> Users
                                    </Link>
                                </div>
                            </li>
                        </>
                    )}
				</span>
            </ul>
            <div className={styles.hamburger} onClick={() => setFullNav(!fullNav)}>
                <svg viewBox='0 0 100 80' width='40' height='40' fill='#fff'>
                    <rect width='100' height='20'></rect>
                    <rect y='30' width='100' height='20'></rect>
                    <rect y='60' width='100' height='20'></rect>
                </svg>
            </div>
            {fullNav && <FullScreenNavbar setFullNav={setFullNav}/>}
        </nav>
    );
};

export default Navbar;
