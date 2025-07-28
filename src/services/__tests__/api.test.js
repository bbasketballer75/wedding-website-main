import * as api from '../api.js';

describe('api service', () => {
  it('getAlbumMedia returns a promise', () => {
    const result = api.getAlbumMedia();
    expect(result).toBeInstanceOf(Promise);
  });

  it('uploadMedia returns a promise', () => {
    const result = api.uploadMedia(new FormData());
    expect(result).toBeInstanceOf(Promise);
  });

  it('getGuestbookEntries returns a promise', () => {
    const result = api.getGuestbookEntries();
    expect(result).toBeInstanceOf(Promise);
  });

  it('createGuestbookEntry returns a promise', () => {
    const result = api.createGuestbookEntry({ name: 'Test', message: 'Hello' });
    expect(result).toBeInstanceOf(Promise);
  });

  it('getMapLocations returns a promise', () => {
    const result = api.getMapLocations();
    expect(result).toBeInstanceOf(Promise);
  });

  it('logVisit returns a promise', () => {
    const result = api.logVisit();
    expect(result).toBeInstanceOf(Promise);
  });

  it('getAllAlbumMedia returns a promise', () => {
    const result = api.getAllAlbumMedia('test-key');
    expect(result).toBeInstanceOf(Promise);
  });

  it('moderateMedia returns a promise', () => {
    const result = api.moderateMedia('photo-id', true, 'test-key');
    expect(result).toBeInstanceOf(Promise);
  });
});
