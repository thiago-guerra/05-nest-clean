import { BadRequestException, PipeTransform } from '@nestjs/common'
import z, { ZodError } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}
  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation error',
          errors: z.treeifyError(error),
          statusCode: 400,
        })
      }
      throw new BadRequestException('Validation error')
    }
  }
}
