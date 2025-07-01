import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // Handle HttpException (like BadRequest, NotFound, etc.)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();

            if (typeof responseBody === 'string') {
                message = responseBody;
            } else if (typeof responseBody === 'object' && responseBody !== null) {
                message = (responseBody as any).message ?? message;
            }
        }

        // Handle general Errors (e.g. TypeORM errors, etc.)
        else if (exception instanceof Error) {
            message = exception.message;
        }

        // Normalize message if it's an array
        if (Array.isArray(message)) {
            message = message.join(', ');
        }

        response.status(status).json({ message });
    }
}

