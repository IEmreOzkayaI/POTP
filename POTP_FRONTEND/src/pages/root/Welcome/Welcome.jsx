import styles from "./Welcome.module.scss";
import TrustedBy from "../TrustedBy/TrustedBy";
import InfoText from "../InfoText/InfoText";

const Welcome = () => {
  return (
    <section className={styles.welcome}>
      <div className={styles.welcome_sub}>
        <InfoText />
      </div>
      <div className={styles.backgroundImage}>
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
      <div className={styles.grid}>
        <div className={styles.blackBox}></div>
        <TrustedBy />
      </div>
    </section>
  );
};

export default Welcome;
