import Http from '../lib/http';

interface IDeviceDetails {
  type: string;
}

export const register = async (device: IDeviceDetails) => {
  return await Http.post('/device/', device);
};

export const getDetails = async (deviceId: string) => {
  return await Http.get(`/devices/${deviceId}/`);
};
