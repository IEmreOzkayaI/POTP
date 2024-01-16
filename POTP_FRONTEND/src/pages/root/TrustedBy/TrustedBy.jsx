import styles from "./TrustedBy.module.scss";
import arcelik from "/arcelik.svg";
import beko from "/beko.svg";
import token from "/token.svg";
import yapikredi from "/yapikredi.svg";
import grundig from "/grundig.svg";
import kocsistem from "/kocsistem.svg";

const TrustedBy = () => {
  return (
  <div className={styles.outBorder_line}>
      <div className={styles.outerBorder}>
      <div className={styles.trustedBy}>
        <div className={styles.text}>Trusted by</div>
        <div className={styles.logos}>
          <img src={token} alt="token" />
          <img src={beko} alt="beko" />
          <img src={arcelik} alt="arcelik" />
          <img src={yapikredi} alt="yapikredi" />
          <img src={grundig} alt="grundig" />
          <img src={kocsistem} alt="kocsistem" />
        </div>
      </div>
    </div>
  </div>
  );
};
export default TrustedBy;
