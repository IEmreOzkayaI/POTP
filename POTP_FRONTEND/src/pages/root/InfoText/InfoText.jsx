import styles from "./InfoText.module.scss";
import playButton from "/play-button.svg";

const InfoText = () => {
	return (
		<div className={styles.infoTextContainer}>
			<div className={styles.infoText}>
				<header>PURE CODE</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
			</div>
			<div className={styles.tryDemoButton}>
				<span className={styles.container}>
					<img className={styles.tryDemoButtonImage} src={playButton} alt='playButton' />
					<span>try demo</span>
				</span>
			</div>
		</div>
	);
};

export default InfoText;
