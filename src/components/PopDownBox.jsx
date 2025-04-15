import { motion } from 'framer-motion';

const PopDownBox = ({text}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md mx-auto mt-10"
    >
      <p className='text-emerald-600'>{text} 🚀</p>
    </motion.div>
  );
};

export default PopDownBox;