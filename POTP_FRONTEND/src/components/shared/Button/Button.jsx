import PropTypes from "prop-types";
import styles from "./Button.module.scss";

export default function Button(props) {
  let className = props.className?.map((className) => {
    return styles[className];
  });
  className?.push(styles.button);

  return (
    <button {...props} className={className?.join(" ")}>
      {props.children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.arrayOf(PropTypes.string),
};
