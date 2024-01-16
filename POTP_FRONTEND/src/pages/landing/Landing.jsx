import { motion } from "framer-motion";
import Welcome from "../root/Welcome/Welcome";
const Landing = () => {
  return (
    <motion.div
      className="globalContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Welcome />
    </motion.div>
  );
};

export default Landing;
