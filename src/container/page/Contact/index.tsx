import React from 'react';
import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AtSymbolIcon, PhoneIcon } from '@heroicons/react/outline';

// Store
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { contactSubmit } from '../../../redux/services/actions';

// Components
import PageTitle from '../../../component/PageTitle';
import Loading from '../../../component/Icon/Loading';

import style from './style';

interface Inputs {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface IProps {
  contact: {
    loading: boolean;
    success: boolean;
    error: string;
  };
  action: {
    contactSubmit: (data: Inputs) => void;
  }
}

const Contact = ({ contact, action }: IProps) => {
  const i18n = useIntl();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => action.contactSubmit(data);

  return (
    <style.Wrapper>
      <PageTitle title={i18n.formatMessage({ id: 'text.contact' })} />

      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/2 px-3">
              <div className="mb-8">
                <h3 className="text-3xl font-bold leading-tight">
                  {i18n.formatMessage({ id: 'text.contact.title' })}
                </h3>
                <p className="text-gray-700">
                  {i18n.formatMessage({ id: 'text.contact.description' })}
                </p>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 text-gray-600 rounded-full mr-3">
                      <AtSymbolIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-bold">
                        {i18n.formatMessage({ id: 'text.contact.email' })}
                      </p>
                      <p className="text-gray-700">
                        <a href="mailto:work@thefalcon.dev">
                          {i18n.formatMessage({
                            id: 'text.contact.email.address',
                          })}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-10 h-10 bg-gray-200 text-gray-600 rounded-full mr-3">
                      <PhoneIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-bold">
                        {i18n.formatMessage({ id: 'text.contact.phone' })}
                      </p>
                      <p className="text-gray-700">
                        <a href="tel:+91-99884-70143">
                          {i18n.formatMessage({
                            id: 'text.contact.phone.number',
                          })}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <div className="mb-8">
                <h3 className="text-3xl font-bold leading-tight">
                  {i18n.formatMessage({ id: 'text.contact.form.title' })}
                </h3>
                <p className="text-gray-700">
                  {i18n.formatMessage({ id: 'text.contact.form.description' })}
                </p>
              </div>
              <form
                method="post"
                className="w-full max-w-lg"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="name"
                    >
                      {i18n.formatMessage({ id: 'text.contact.form.name' })}
                    </label>
                    <input
                      id="name"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      placeholder="Jane Doe"
                      {...register('name', { required: true, minLength: 3 })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs italic">
                        {i18n.formatMessage({
                          id: 'text.contact.form.error.name',
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      {i18n.formatMessage({ id: 'text.contact.form.email' })}
                    </label>
                    <input
                      id="email"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="email"
                      placeholder="m***@*****.com"
                      {...register('email', { required: true })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs italic">
                        {i18n.formatMessage({
                          id: 'text.contact.form.error.email',
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="phone"
                    >
                      {i18n.formatMessage({ id: 'text.contact.form.phone' })}
                    </label>
                    <input
                      id="phone"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="tel"
                      placeholder="+91-98765-43210"
                      {...register('phone', { required: true, minLength: 10 })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs italic">
                        {i18n.formatMessage({
                          id: 'text.contact.form.error.phone',
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="message"
                    >
                      {i18n.formatMessage({ id: 'text.contact.form.message' })}
                    </label>
                    <textarea
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="message"
                      placeholder="Your Message"
                      rows={4}
                      {...register('message', { required: true })}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-xs italic">
                        {i18n.formatMessage({
                          id: 'text.contact.form.error.message',
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="flex items-center w-full px-3">
                    <div className='mr-5'>
                      {contact.success && (
                        <p className="text-green-500 text-sm">
                          {i18n.formatMessage({
                            id: 'text.contact.form.success',
                          })}
                        </p>
                      )}

                      {contact.error && (
                        <p className="text-red-500 text-sm">
                          {i18n.formatMessage({
                            id: 'text.contact.form.error',
                          })}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center bg-gray-700 hover:bg-gray-800 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded uppercase ml-auto focus:outline-none focus:shadow-outline"
                      disabled={contact.loading}
                    >
                      {contact.loading && <Loading />}
                      {i18n.formatMessage({ id: 'text.contact.form.submit' })}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </style.Wrapper>
  );
};

const mapStateToProps = (state: any) => ({
  contact: state.servicesReducer.contact,
});

const mapDispatchToProps = (dispatch: any) => ({
  action: bindActionCreators({
    contactSubmit
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
