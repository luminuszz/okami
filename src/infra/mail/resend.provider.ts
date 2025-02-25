import { EnvService } from "@infra/env/env.service";
import { Injectable, Provider } from "@nestjs/common";
import { Resend } from "resend";

export const RESEND_PROVIDER = Symbol("RESEND_PROVIDER");

export const ResendProvider: Provider = {
  provide: RESEND_PROVIDER,
  inject: [EnvService],
  useFactory: (envService: EnvService) =>
    new Resend(envService.get("RESEND_API_SECRET_KEY")),
};
