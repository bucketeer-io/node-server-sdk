import { Event } from '../proto/event/client/event_pb';

export class EventStore {
  private _events: Array<Event>;

  constructor() {
    this._events = [];
  }

  add(event: Event) {
    this._events.push(event);
  }

  getAll(): Array<Event> {
    return this._events;
  }

  takeout(size: number): Array<Event> {
    return this._events.splice(0, size);
  }

  size(): number {
    return this._events.length;
  }
}
