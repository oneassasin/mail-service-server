import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(Error)
export class AppExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    console.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.name.includes('Bad') || exception.message.includes('Bad')) {
      exception.name = 'Error';
      exception.message = 'SYSTEM_ERROR';
    }

    if (exception.name !== 'Error') {
      exception.name = 'Error';
      exception.message = 'SYSTEM_ERROR';
    }

    response.json({ status: exception.name, value: exception.message });
  }
}
