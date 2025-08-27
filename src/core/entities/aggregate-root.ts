import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { BaseEntity } from './baseEntity'

export abstract class AggregateRoot<T> extends BaseEntity<T> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents() {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAgrregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}
