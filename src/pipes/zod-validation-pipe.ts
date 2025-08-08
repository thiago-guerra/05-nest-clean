import { BadRequestException, PipeTransform } from '@nestjs/common'
import z, { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    try {
      this.schema.parse(value)
      return value
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
