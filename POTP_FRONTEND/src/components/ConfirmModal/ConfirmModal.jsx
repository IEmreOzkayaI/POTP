/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import styles from "./ConfirmModal.module.scss";
import {clearConfirmInfo, confirmFetch} from "../../redux/toolkit/confirmSlice";
import {reConfirmFetch} from "../../redux/toolkit/reConfirmSlice";
import {useDispatch, useSelector} from "react-redux";
import CloseIcon from "/close.svg";
import Shape from "/shape.svg";
import {useEffect, useState} from "react";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";

const ConfirmModal = (props) => {
    const {handleModal, redirectPath} = props;
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const confirmError = useSelector((state) => state.confirm.confirmError);
    const confirmInfo = useSelector((state) => state.confirm.confirmInfo);
    const reConfirmInfo = useSelector((state) => state.reConfirm.reConfirmInfo);
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [timer, setTimer] = useState(localStorage.getItem("timer") || 60);
    const [countdown, setCountdown] = useState(null);
    const [resetTimer, setResetTimer] = useState(false);

    useEffect(() => {
        if (timer === 0) return;
        const countdown = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === "0") {
                    clearInterval(countdown);
                    return 0;
                }
                const newTimer = prevTimer - 1;
                if (newTimer === 0) {

                    localStorage.setItem("timer", newTimer)
                    clearInterval(countdown); // Durdurma işlemi burada yapılıyor
                    setDigits(["", "", "", "", "", ""]);
                    return 0;
                }
                console.log(newTimer);
                localStorage.setItem("timer", newTimer);
                return newTimer; // Ensure the timer doesn't go below 0
            });
        }, 1000);
        setCountdown(countdown);
        return () => clearInterval(countdown);
    }, [resetTimer]);

    const handleResend = () => {
        dispatch(reConfirmFetch());
        clearInterval(countdown);
        localStorage.setItem("timer", 60)
        setTimer(60);
        setResetTimer(!resetTimer);
        dispatch(clearConfirmInfo());
        setDigits(["", "", "", "", "", ""])
    };

    const handleConfirm = () => {
        dispatch(confirmFetch({confirm_credential: digits.join("")}));
    };

    useEffect(() => {
        if (digits.includes("") || digits.length !== 6) return;
        handleConfirm();
    }, [digits]);

    useEffect(() => {
        if (confirmInfo?.status === "success") {
            setTimeout(() => {
                navigateTo(redirectPath);
                handleModal();
            }, 500);
        }
    }, [confirmInfo]);

    const handleCodeChange = (e, index) => {
        const BACKSPACE_KEY = 8;
        dispatch(clearConfirmInfo())
        if (e.keyCode === BACKSPACE_KEY && e.target.value === "") {
            const newDigits = [...digits];
            newDigits[index] = ""; // Mevcut inputun değerini sıfırla
            setDigits(newDigits);

            if (index > 0) {
                inputRefs[index - 1].current.focus(); // Bir önceki inputa odaklan
            }
            return;
        }

        const newDigits = [...digits];
        newDigits[index] = e.target.value;
        setDigits(newDigits);

        if (e.target.value !== "") {
            if (index === digits.length - 1) {
                // Tüm basamaklar dolduğunda istekte bulun
                return;
            }
            inputRefs[index + 1].current.focus();
        }
    };

    return (
        <>
            <div className={styles.confirm_modal_fallback}>
                <div className={styles.confirm_modal_content_outer}>
                    <div className={styles.confirm_modal_content_container}>
                        <div className={styles.confirm_modal_content}>
                            <div className={styles.header}>
                                <div className={styles.close} onClick={() => handleModal()}>
                                    <img src={CloseIcon} alt=''/>
                                </div>
                                <div className={styles.label}>pure code</div>
                                <div className={styles.image}>
                                    <img src={Shape} alt=''/>
                                </div>
                            </div>
                            <div className={styles.verification_step}>
                                {(confirmInfo === null && confirmError === false) && (
                                    <div className={styles.timer}>
                                        <div className={styles.timer_value}>{timer}</div>
                                    </div>
                                )}

                                {confirmError?.status === "error" && confirmInfo === null && (
                                    <svg xmlns='http://www.w3.org/2000/svg' width='184' height='184'
                                         viewBox='0 0 184 184' fill='none'>
                                        <circle cx='91.9717' cy='91.9727' r='43' fill='#F77777' stroke='#F5F3F3'
                                                strokeWidth='6'/>
                                        <rect x='104' y='82' width='31.9992' height='4' rx='2'
                                              transform='rotate(133.998 104 82)' fill='#F5F3F3'/>
                                        <rect x='101' y='105' width='31.9992' height='4' rx='2'
                                              transform='rotate(-134 101 105)' fill='#F5F3F3'/>
                                    </svg>
                                )}
                                {confirmInfo?.status === "success" && (
                                    <svg xmlns='http://www.w3.org/2000/svg' width='184' height='184'
                                         viewBox='0 0 184 184' fill='none'>
                                        <circle cx='91.9717' cy='92' r='43' fill='#A3BE8C' stroke='#F5F3F3'
                                                strokeWidth='6'/>
                                        <rect x='109.642' y='81.7773' width='31.9992' height='4' rx='2'
                                              transform='rotate(133.998 109.642 81.7773)' fill='#F5F3F3'/>
                                        <rect x='78.751' y='90.8809' width='15.8959' height='4' rx='2'
                                              transform='rotate(43.9985 78.751 90.8809)' fill='#F5F3F3'/>
                                    </svg>
                                )}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.title}>
                                    {timer !== 0 && <span>Verification Code</span>}
                                    {timer === 0 && <span>Time Is Up</span>}
                                </div>
                                <div className={styles.subtitle}>
                                    {timer !== 0 && <span>Check your email!</span>}
                                    {timer === 0 && <span>Get code again!</span>}
                                </div>
                                <div className={styles.line}/>
                                <div className={styles.input_box}>
                                    {digits.map((digit, index) => (
                                        <input disabled={timer === 0} key={index} type='text' maxLength={1}
                                               value={digit} onKeyDown={(e) => handleCodeChange(e, index)}
                                               onChange={(e) => handleCodeChange(e, index)} ref={inputRefs[index]}/>
                                    ))}
                                </div>
                                <div className={styles.reconfirm} onClick={() => handleResend()}>
                                    <span>Get Code Again</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
