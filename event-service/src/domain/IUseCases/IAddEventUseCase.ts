import { EventEntity } from "../entities/eventEntity";

export interface IAddEventUseCase {
  execute(data: EventEntity): Promise<EventEntity| null>
}