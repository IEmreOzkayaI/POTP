import {Link} from "react-router-dom";
import Button from "../../components/shared/Button/Button";
import styles from "./Dashboard.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {clearUserInfo, userFetch} from "../../redux/toolkit/userSlice.js";
import axios from "axios";

const Dashboard = () => {

    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.userInfo);
    const [user, setUser] = useState({});

    useEffect(() => {
        dispatch(userFetch());
    }, []);

    useEffect(() => {
        userInfo !== null && setUser(userInfo);
    }, [userInfo]);

    const handleLogout = () => {
        axios.get("http://localhost:3000/api/user/log-out", {withCredentials: true}).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        dispatch(clearUserInfo());
    }


    return (
        <div className={styles.dashboard_container}>
            Dashboard
            <Link to='/' onClick={() => handleLogout()}>
                <Button className={["white"]} style={{marginTop: "2rem"}}>Log Out</Button>
            </Link>
            <div>
                {user.name}
            </div>
            <div>
                {user.surname}
            </div>
            <div>
                {user.email}
            </div>
        </div>
    );
};

export default Dashboard;
