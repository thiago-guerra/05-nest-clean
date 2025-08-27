import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvent } from './domain-event'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  public aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  getAggregateId(): UniqueEntityId {
    throw new Error('Method not implemented.')
  }
}
class CustomAggregate extends AggregateRoot<null> {
  static Create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBack = vi.fn()
    // Subcriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callBack, CustomAggregateCreated.name)

    // Criando uma resposta porém sem salvar no banco
    const aggregate = CustomAggregate.Create()

    // Verificando se o evento foi criado porém não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber recebeu o evento
    expect(callBack).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
