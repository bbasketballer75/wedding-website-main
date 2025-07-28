import { errorHandler } from '../errorHandler.js';

describe('errorHandler', () => {
  it('sets status code and returns error message', () => {
    const err = new Error('Test error');
    const req = {};
    const res = { statusCode: 200, status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test error' }));
  });
});
