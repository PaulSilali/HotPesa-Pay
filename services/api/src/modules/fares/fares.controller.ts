import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import type { FareQuoteV1 } from '@hotpesa/contracts';
import { FareService } from './fare.service.js';

@Controller('api/v1/trips')
export class FaresController {
  constructor(@Inject(FareService) private readonly fares: FareService) {}

  @Post(':id/fare-quotes')
  quote(@Param('id') tripId: string, @Body() body: { readonly destinationStageId?: string }): FareQuoteV1 {
    return this.fares.quote(tripId, body.destinationStageId ?? '');
  }
}
