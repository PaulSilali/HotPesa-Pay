import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): Readonly<{ status: 'ok'; scope: 'phase-0-foundation' }> {
    return Object.freeze({ status: 'ok', scope: 'phase-0-foundation' });
  }
}
