import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyEntity } from '../entities/db/api-key.entity';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.query || !req.query.token) {
      throw new Error('BAD TOKEN');
    }

    const authorization = req.query['token'] as string;

    if (authorization.trim().length === 0) {
      throw new Error('BAD TOKEN');
    }

    const apiKey = await ApiKeyEntity.findOneBy({ id: authorization });

    if (!apiKey) {
      throw new Error('BAD TOKEN');
    }

    try {
      apiKey.lastUse = new Date();
      await apiKey.save();
    } catch {
    }

    return true;
  }
}
