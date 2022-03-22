import React from 'react';
import { connect } from 'react-redux';

import style from './style';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  loading: boolean;
}

const Loading: React.FC<IProps> = ({ loading }) => {
  return (
    <style.Wrapper isLoading={loading !== false} className="loading">
      <div className="loading-icon">Loading...</div>
    </style.Wrapper>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.appReducer.loading,
});

export default connect(mapStateToProps)(Loading);
