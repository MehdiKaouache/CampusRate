import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from '@nestjs/common';
import { Response, Request } from 'express';

const STATUS_TITLES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  415: 'Unsupported Media Type',
  500: 'Internal Server Error'
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const messages = this.resolveMessages(exception, status);

    this.logError(exception, request, status, messages[0]);

    response.status(status).type('application/problem+json').json({
      type: 'about:blank',
      title: STATUS_TITLES[status] ?? 'Error',
      status,
      detail: messages[0],
      instance: request.originalUrl,
      ...(messages.length > 1 ? { errors: messages } : {}),
    });
  }

  private logError(exception: unknown, request: Request, status: number, detail: string): void {
        const line = `${request.method} ${request.originalUrl} ${status}`;

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            const message = exception instanceof Error ? exception.message : String(exception);
            const stack = exception instanceof Error ? exception.stack : undefined;

            this.logger.error(`${line} - ${message}`, stack);
            return;
        }

        this.logger.warn(`${line} - ${detail}`);
    }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveMessages(exception: unknown, status: number): string[] {
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return ['Une erreur interne est survenue.'];
    }

    if (exception instanceof HttpException) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        return [body];
      }

      if (typeof body === 'object' && body !== null && 'message' in body) {
        const message = (body as { message: unknown }).message;
        return Array.isArray(message) ? message.map(String) : [String(message)];
      }
    }

    return ['Une erreur est survenue.'];
  }
}