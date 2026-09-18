import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import type { JourneySessionV1 } from '@hotpesa/contracts';
import { PaymentStore } from '../payments/payment.store.js';

@Controller('api/v1/journey-sessions')
export class JourneysController {
  constructor(@Inject(PaymentStore) private readonly store: PaymentStore) {}

  @Get(':publicCode')
  get(@Param('publicCode') publicCode: string): JourneySessionV1 {
    const journey = this.store.journeyByPublicCode(publicCode);
    if (!journey) throw new NotFoundException('Journey session not found');
    return journey;
  }
}
