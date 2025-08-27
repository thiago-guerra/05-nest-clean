/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: unknown) => void

export class DomainEvents {
  private static hadlersMap: Record<string, DomainEventCallback[]> = {}
  private static makedAgregates: AggregateRoot<unknown>[] = []

  public static markAgrregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.makedAgregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event) => {
      this.dispatch(event)
    })
  }

  private static removedAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.makedAgregates.findIndex((a) =>
      a.id.equals(aggregate.id),
    )
    this.makedAgregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityId,
  ): AggregateRoot<unknown> | undefined {
    return this.makedAgregates.find((a) => a.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removedAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisterBefore = eventClassName in this.hadlersMap

    if (!wasEventRegisterBefore) {
      this.hadlersMap[eventClassName] = []
    }

    this.hadlersMap[eventClassName].push(callback)
  }

  public static clearHandlers() {
    this.hadlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.makedAgregates = []
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName = event.constructor.name
    const isEventRegistered = eventClassName in this.hadlersMap

    if (isEventRegistered) {
      const handlers = this.hadlersMap[eventClassName]

      handlers.forEach((handler) => {
        handler(event)
      })
    }
  }
}
