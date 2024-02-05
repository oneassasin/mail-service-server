import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTokenGuard } from './api-token-guard.service';
import { ApiService } from './api.service';
import { Response } from 'express';

@Controller('mail')
@UseGuards(new ApiTokenGuard())
export class ApiMailController {
  constructor(private apiService: ApiService) {
  }

  @Get(':id')
  async getMail(
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    const message = await this.apiService.getIncomeMail(id);
    if (!message) {
      response.status(404).send('Not found');
      return;
    }

    response.send(message.html);
  }
}
