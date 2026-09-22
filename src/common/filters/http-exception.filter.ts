import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import { Response, Request } from 'express';

const STATUS_TITLES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const detail = this.resolveDetail(exception, status);

    response.status(status).type('application/problem+json').json({
      type: 'about:blank',
      title: STATUS_TITLES[status] ?? 'Error',
      status,
      detail,
      instance: request.url,
    });
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveDetail(exception: unknown, status: number): string {
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'Une erreur interne est survenue.';
    }

    if (exception instanceof HttpException) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        return body;
      }

      if (typeof body === 'object' && body !== null && 'message' in body) {
        const message = (body as { message: unknown }).message;
        return Array.isArray(message) ? message.join(' ') : String(message);
      }
    }

    return 'Une erreur est survenue.';
  }
}