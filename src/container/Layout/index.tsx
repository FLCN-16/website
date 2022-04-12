import React from 'react';
import { motion } from 'framer-motion';

// Components
import Header from './Header';
import Footer from './Footer';
import Loading from '../../component/Loading';

import style from './style';

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -150 },
};

interface ILayout extends React.HTMLProps<HTMLDivElement> {
  sticky?: boolean;
}

const Layout = ({ sticky, children }: ILayout) => {
  return (
    <style.Wrapper className="font-sans">
      {/* Header */}
      <Header sticky={sticky !== false} />

      {/* Content */}
      <motion.main
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: 'linear', delay: 0.25 }} // Set the transition to linear
      >
        <div className="content">{children}</div>
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* Loading */}
      <Loading />
    </style.Wrapper>
  );
};

export default Layout;
