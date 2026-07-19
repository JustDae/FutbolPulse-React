import { DomainException } from './domain.exception'

export class ApiException extends DomainException {
  status: number
  detail: string
  fieldErrors?: Record<string, string[]>

  constructor(
    status: number,
    detail: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(detail)
    this.status = status
    this.detail = detail
    this.fieldErrors = fieldErrors
  }
}
