import React from 'react';
import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';

// Store
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hireSubmit } from '../../../redux/services/actions';

// Components
import PageTitle from '../../../component/PageTitle';

import style from './style';

interface Inputs {
  name: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  position: string;
  project_name: string;
  project_budget: string;
  project_timeline: string;
  project_description: string;
  project_requirements: string;
  project_document: FileList;
}

interface IProps {
  hire: {
    loading: boolean;
    success: boolean;
    error: string;
  };
  action: {
    hireSubmit: (data: any) => void;
  }
}

const HireMe = (props: IProps) => {
  const i18n = useIntl();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('website', data.website);
    formData.append('company', data.company);
    formData.append('position', data.position);
    formData.append('project_name', data.project_name);
    formData.append('project_budget', data.project_budget);
    formData.append('project_timeline', data.project_timeline);
    formData.append('project_description', data.project_description);
    formData.append('project_requirements', data.project_requirements);
    formData.append('project_document', data.project_document[0]);

    props.action.hireSubmit(formData);
  };

  return (
    <style.Wrapper>
      <PageTitle title={i18n.formatMessage({ id: 'text.hire-me' })} />

      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="md:w-1/2 px-3"></div>
            <div className="md:w-1/2 px-3">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold leading-tight">
                      {i18n.formatMessage({ id: 'text.hire-me.title' })}
                    </h3>
                    <p className="text-gray-700">
                      {i18n.formatMessage({ id: 'text.hire-me.description' })}
                    </p>
                    <p className="text-yellow-500 mt-2 hidden">
                      <b className="uppercase">Note:</b>{' '}
                      {i18n.formatMessage({ id: 'text.hire-me.notice' })}
                    </p>
                  </div>
                </div>

                <div className="w-full px-4">
                  <form method="post" encType='multipart/form-data' onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="name"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.name',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Jane Doe"
                          {...register('name', {
                            required: true,
                            minLength: 3,
                          })}
                        />
                      </div>

                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="email"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.email',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="email"
                          placeholder="m***@*****.com"
                          {...register('email', {
                            required: true,
                            minLength: 3,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="phone"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.phone',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="+1 (***) ***-****"
                          {...register('phone', {
                            required: true,
                            minLength: 10,
                          })}
                        />
                      </div>

                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="website"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.website',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Website"
                          {...register('website', {
                            required: false,
                            pattern:
                              /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="company"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.company',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Company"
                          {...register('company', {
                            required: false,
                            minLength: 3,
                          })}
                        />
                      </div>

                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="position"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.position',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Position"
                          {...register('position', {
                            required: false,
                            minLength: 3,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="project-name"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.project-name',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Project Name"
                          {...register('project_name', {
                            required: true,
                            minLength: 6,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="project-budget"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.project-budget',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Project Budget"
                          {...register('project_budget', {
                            required: true,
                            minLength: 3,
                            pattern:
                              /^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/,
                          })}
                        />
                      </div>

                      <div className="w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="project-timeline"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.project-timeline',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="text"
                          placeholder="Project Timeline"
                          {...register('project_timeline', {
                            required: true,
                            minLength: 3,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="project-description"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.project-description',
                          })}
                        </label>
                        <textarea
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          placeholder="Project Description"
                          rows={6}
                          {...register('project_description', {
                            required: true,
                            minLength: 100,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="project-requirements"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.project-requirements',
                          })}
                        </label>
                        <textarea
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          placeholder="Project Requirements"
                          rows={6}
                          {...register('project_requirements', {
                            required: true,
                            minLength: 100,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="project-document"
                        >
                          {i18n.formatMessage({
                            id: 'text.project.requirements.form.project-document',
                          })}
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          type="file"
                          placeholder="Project Document"
                          {...register('project_document')}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <div className="flex justify-end w-full px-3">
                          <button
                            type="submit"
                            className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded uppercase focus:outline-none focus:shadow-outline"
                          >
                            {i18n.formatMessage({
                              id: 'text.project.requirements.form.submit',
                            })}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </style.Wrapper>
  );
};

const mapStateToProps = (state: any) => ({
  hire: state.servicesReducer.hire,
});

const mapDispatchToProps = (dispatch: any) => ({
  action: bindActionCreators(
    {
      hireSubmit,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HireMe);
