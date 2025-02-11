import { EnvService } from '@infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class ResendProvider extends Resend {
  constructor(envService: EnvService) {
    super(envService.get('RESEND_API_SECRET_KEY'))
  }
}
