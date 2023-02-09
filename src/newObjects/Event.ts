import { v4 } from 'uuid';

export function createEvent(b: string): Event {
  return {
    id: v4(),
    event: b,
  };
}

export type Event = {
  id: string;
  event: string;
};
