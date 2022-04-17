import Http from '../lib/http';

interface IContact {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface IProjectRequiremet {
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
  project_document: File;
}

export const contact = async (data: IContact) => {
  return await Http.post('/service/contact/', data);
};

export const projectRequirements = async (data: IProjectRequiremet) => {
  return await Http.post('/service/hire/', data);
}