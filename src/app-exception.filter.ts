import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(Error)
export class AppExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    console.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.json({ error: exception.name, message: exception.message });
  }
}
