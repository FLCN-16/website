import type { NextApiRequest, NextApiResponse } from 'next';
import mailer from '../../../lib/mailer';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, email, phone, message } = req.body;

  res.status(200).json({ name: 'John Doe' });
}
