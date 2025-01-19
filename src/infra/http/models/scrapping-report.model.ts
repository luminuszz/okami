import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'
import { WorkHttp, workSchema } from './work.model'

export const scrappingWorkSchema = workSchema.and(
  z.object({
    message: z.string().nullable(),
  }),
)

export const scrappingReportHttpSchema = z.object({
  data: z.array(scrappingWorkSchema),
  totalOfPages: z.number(),
})

export class ScrappingReportWorkModel extends WorkHttp {
  @ApiProperty({ nullable: true, type: 'string' })
  message?: string
}

export class ScrappingReportModel {
  @ApiProperty({ type: ScrappingReportWorkModel, isArray: true })
  data: ScrappingReportWorkModel[]

  @ApiProperty()
  totalOfPages: number

  @ApiProperty({ nullable: true, type: 'number' })
  nextPage: number | null
}
