import React from 'react';
import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';

// Components
import PageTitle from '../../component/PageTitle';

import style from './style';

type Inputs = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const Contact = () => {
  const i18n = useIntl();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <style.Wrapper>
      <PageTitle>{i18n.formatMessage({ id: 'text.contact' })}</PageTitle>

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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
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
                  <div className="w-full px-3">
                    <button
                      className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded uppercase focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
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

export default Contact;
