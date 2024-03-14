import { EnvService } from '@app/infra/env/env.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService implements OnModuleInit {
  private readonly sentry: typeof Sentry;

  constructor(private readonly env: EnvService) {
    this.sentry = Sentry;
  }

  onModuleInit() {
    this.sentry.init({
      dsn: this.env.get('SENTRY_DSN_ENDPOINT'),
      integrations: [],
    });
  }

  public getSentry() {
    return this.sentry;
  }

  public captureException(exception: any) {
    this.sentry.captureException(exception);
  }
}
