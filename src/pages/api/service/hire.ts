import type { NextApiRequest, NextApiResponse } from 'next';
import mailer from '../../../mail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if request method is POST
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ status: false, message: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    website,
    company,
    position,
    project_name,
    project_budget,
    project_timeline,
    project_description,
    project_requirements,
  } = req.body;

  return res.status(200).json(req.body);

  try {
    // Send Mail
    await mailer.send(
      'HireMail',
      {
        name,
        email,
        phone,
        website,
        company,
        position,
        project_name,
        project_budget,
        project_timeline,
        project_description,
        project_requirements,
      },
      {
        to: process.env.CONTACT_MAIL_RECIEVER,
      }
    );

    res.status(200).json({ status: true, message: 'Mail sent!' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
}
