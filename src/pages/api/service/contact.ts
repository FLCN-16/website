import type { NextApiRequest, NextApiResponse } from 'next';
import mailer from '../../../mail';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, email, phone, message } = req.body;

  mailer.send(
    'ContactMail',
    { name, email, phone, message },
    {
      to: 'officialr.kay@gmail.com',
    }
  );

  res.status(200).json({ name: 'John Doe' });
}
