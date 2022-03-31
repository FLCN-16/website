import React from 'react';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { motion, AnimatePresence } from 'framer-motion';

import LogoImg from '../../../public/assets/logo.svg';

import style from './style';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  loading: boolean;
}

const Loading: React.FC<IProps> = ({ loading }) => {
  const i18n = useIntl()

  return (
    <AnimatePresence>
      {loading && (
        <style.Wrapper
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="flex flex-col items-center">
            <motion.div
              className="flex justify-center mb-3 h-64 w-64"
              initial={{ opacity: 0, y: '-10%', scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: '-10%', scale: 0.5 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                duration: 0.3,
                delay: 0.4,
              }}
            >
              <LogoImg style={{ height: '100%' }} />
            </motion.div>

            <motion.span
              className="inline-block uppercase text-2xl font-semibold text-gray-700"
              initial={{ opacity: 0, y: '10%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-10%' }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.8,
                duration: 3,
              }}
            >
              {i18n.formatMessage({ id: 'legal.brand' })}
            </motion.span>
          </motion.div>
        </style.Wrapper>
      )}
    </AnimatePresence>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.appReducer.loading,
});

export default connect(mapStateToProps)(Loading);
