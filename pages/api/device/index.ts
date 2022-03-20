import type { NextApiRequest, NextApiResponse } from 'next';
import { generateKeys, exportKeys } from '../../../lib/encryption';
import { uuid4 } from './../../../lib/helper';

type Data = {
  device_id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const device_id = uuid4();
  const keys = await generateKeys(device_id);

  res.status(200).json({ device_id });
}
