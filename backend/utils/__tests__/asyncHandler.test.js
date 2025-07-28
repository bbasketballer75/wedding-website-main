import asyncHandler from '../asyncHandler.js';

describe('asyncHandler', () => {
  it('calls next with error on rejected promise', async () => {
    const fn = vi.fn(() => Promise.reject(new Error('fail')));
    const req = {},
      res = {},
      next = vi.fn();
    await asyncHandler(fn)(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('calls fn with req, res, next', async () => {
    const fn = vi.fn(() => Promise.resolve('ok'));
    const req = {},
      res = {},
      next = vi.fn();
    await asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });
});
