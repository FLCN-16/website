import { AxiosResponse } from 'axios';
import Http from '../lib/http';

interface IDeviceDetails {
  type: string;
}

export const registerDevice = async (device: IDeviceDetails) => {
  return await Http.post('/device', device);
};

export const getDeviceDetails = async (deviceId: string) => {
  return await Http.get(`/devices/${deviceId}`);
};
