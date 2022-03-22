import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/outline';

// Components
import Link from '../../../component/Link';

import style from './style';

const NotFound = () => {
  return (
    <style.Wrapper className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col -mx-3">
          <div className="w-full px-3 text-center">
            <style.NotFoundNumber>404 - Not Found</style.NotFoundNumber>
            <style.NotFoundText>
              Code not developed for this page.
            </style.NotFoundText>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to={'/'}
              className="inline-flex items-center bg-gray-100 hover:bg-gray-200 py-2 px-4 text-xl font-semibold rounded uppercase"
            >
              <ChevronLeftIcon className="h-6 w-6 mr-2" />
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </style.Wrapper>
  );
};

export default NotFound;
