import { DomainEvents } from '@/core/events/domains-events'
import { DomainEvent } from '../events/domain-event'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markedAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}
