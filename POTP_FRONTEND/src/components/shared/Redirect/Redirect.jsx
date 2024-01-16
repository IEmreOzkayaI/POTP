/* eslint-disable react/prop-types */
import styles from "./Redirect.module.scss";

const Redirect = () => {
	return (
		<div className={styles.verified_redirect}>
			<div className={styles.verified_redirect_content}>
				<div className={styles.verified_redirect_title}>
					<span>PURE | </span>Be redirected to the login page in 2 seconds.
				</div>
			</div>
		</div>
	);
};

export default Redirect;
