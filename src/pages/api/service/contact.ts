import type { NextApiRequest, NextApiResponse } from 'next';
import mailer from '../../../mail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if request method is POST
  if ( req.method !== 'POST' ) {
    return res
      .status(405)
      .json({ status: false, message: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  const mailReciever = process.env.CONTACT_MAIL_RECIEVER;

  try {
    // Send Mail
    await mailer.send(
      'ContactMail',
      { name, email, phone, message },
      { to: mailReciever }
    );

    res.status(200).json({ status: true, message: 'Contact mail sent!' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
}
