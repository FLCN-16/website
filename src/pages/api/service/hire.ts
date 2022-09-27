import type { NextApiResponse } from 'next';
import { withFileUpload, FormNextApiRequest } from 'next-multiparty';
import mailer from '../../../mail';


export default withFileUpload(
  async (req: FormNextApiRequest, res: NextApiResponse) => {
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
    } = req.fields;

    const mailReciever = process.env.CONTACT_MAIL_RECIEVER;

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
          to: mailReciever,
          replyTo: email,
          priority: 'high',
          attachments: [
            {
              filename: req?.file?.originalFilename as string,
              path: req?.file?.filepath,
              contentType: req?.file?.mimetype as string,
            },
          ],
        }
      );

      res.status(200).json({ status: true, message: 'Mail sent!' });
    } catch (error) {
      res.status(200).json({ status: false, message: 'Internal server error' });
    }
  }
);

export const config = {
  api: { bodyParser: false },
};
