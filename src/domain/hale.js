import { DESTINATION_MODE } from './taxiLive.js';

export const HALE_EVENT = Object.freeze({
  FREE: 'FREE',
  OCCUPIED: 'OCCUPIED',
  PRICE_UPDATE: 'PRICE_UPDATE',
  TRIP_END: 'TRIP_END'
});

const num=value=>{
  const parsed=Number(value);
  return Number.isFinite(parsed)?parsed:null;
};

export function normalizeHaleEvent(input={}) {
  const type=String(input.type||input.event||input.state||'').trim().toUpperCase();
  if(!Object.values(HALE_EVENT).includes(type)) return null;

  return {
    type,
    occurredAt: input.occurredAt||input.timestamp||new Date().toISOString(),
    fareAmount: num(input.fareAmount??input.price??input.fare),
    distanceKm: num(input.distanceKm??input.km??input.distance),
    destinationAddress: String(input.destinationAddress||input.destination||'').trim(),
    destinationMode: input.destinationAddress||input.destination
      ? DESTINATION_MODE.KNOWN
      : DESTINATION_MODE.UNKNOWN,
    raw: input
  };
}

export function haleEventAction(event, activeRide) {
  if(!event) return {action:'ignore'};
  if(event.type===HALE_EVENT.OCCUPIED && !activeRide) return {action:'start'};
  if(event.type===HALE_EVENT.PRICE_UPDATE && activeRide) return {action:'meter'};
  if((event.type===HALE_EVENT.TRIP_END||event.type===HALE_EVENT.FREE) && activeRide) return {action:'finish'};
  return {action:'ignore'};
}
