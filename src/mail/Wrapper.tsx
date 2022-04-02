import React from 'react';
import { IntlShape } from 'react-intl';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  i18n: IntlShape;
}

const Wrapper: React.FC<IProps> = ({ i18n, children }) => {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1536px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#e5e7eb',
          padding: '1rem 0.5rem',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            lineHeight: '1',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          {i18n.formatMessage({ id: 'legal.brand' })}
        </h1>
      </div>
      <div
        style={{
          backgroundColor: '#f9fafb',
          padding: '2rem',
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem 0.5rem',
          backgroundColor: '#f3f4f6',
        }}
      >
        <p>{i18n.formatMessage({ id: 'legal.copyright' })}</p>
      </div>
    </main>
  );
};

export default Wrapper;