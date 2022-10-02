import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

import { uuid4 } from '../../../lib/helper';

type Data = {
  device_id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Create a cookies instance
  const cookies = new Cookies(req, res);

  // Generate a device id
  const device_id = cookies.get('device_id') || uuid4();

  cookies.set('device-id', device_id, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    path: '/',
  });

  res.status(200).json({ device_id });
}
