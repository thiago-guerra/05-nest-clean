import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(indetifier: string) {
    super(`Student ${indetifier} already exists`)
  }
}
