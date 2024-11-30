import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../middleware/authMiddleware';

describe('Authentication Middleware', () => {
  const mockRequest = () => {
    return {
      headers: {},
    } as Request;
  };

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext: NextFunction = jest.fn();

  test('Authentication fails without token', () => {
    const req = mockRequest();
    const res = mockResponse();

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('Authorization blocks invalid roles', () => {
    const req = mockRequest();
    (req as any).user = { role: 'user' };

    const res = mockResponse();
    const middleware = authorize(['admin']);

    middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
