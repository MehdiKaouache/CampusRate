import { Injectable, NestMiddleware, UnsupportedMediaTypeException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    const sendsBody = request.method === 'POST' || request.method === 'PATCH';

    if (sendsBody && request.is('application/json') === false) {
      throw new UnsupportedMediaTypeException('Le Content-Type doit etre application/json.');
    }

    next();
  }
}