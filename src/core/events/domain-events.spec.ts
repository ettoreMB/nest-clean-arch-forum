import { AggregateRoot } from '../entities/agreggate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domains-events'

class CustomAggregateCreate implements DomainEvent {
  public ocurredAt: Date
  private aggreagate: CustomAgreggate // eslint-disable-line
  constructor(aggregate: CustomAgreggate) {
    this.aggreagate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggreagate.id
  }
}

class CustomAgreggate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAgreggate(null)

    aggregate.addDomainEvent(new CustomAggregateCreate(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // subscriber cadastrado(ouvindo o evento "respostas criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreate.name)

    // Estou criando uma resposta porem SEM salvar no banco
    const aggregate = CustomAgreggate.create()

    // Estou assegurando que o evento foi criado porem NÁO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e assim disparando o evento

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
