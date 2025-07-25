import { getGeoLocation } from '../geo.js';

describe('getGeoLocation', () => {
  it('returns default location for local IPs', async () => {
    const result = await getGeoLocation('127.0.0.1');
    expect(result.city).toBeDefined();
    expect(result.country).toBeDefined();
  });

  it('returns error location for fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject('fail'));
    const result = await getGeoLocation('8.8.8.8');
    expect(result.city).toBe('Error');
    expect(result.country).toBe('Error');
  });
});
