import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PopDownBox = ({text}) => {
  const [checkText, setCheckText] = useState()

  useEffect(()=> {
    checkTextisCleared()
  }, [text])

  function checkTextisCleared() {
    if(text.includes('cleared' && 'Removed')){
      setCheckText(true)
    }else{
      setCheckText(false)
    }
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md mx-auto mt-10"
    >
      <p className={` ${checkText ? 'text-red-600' : 'text-emerald-600' }  `}>{text} 🚀</p>
    </motion.div>
  );
};

export default PopDownBox;