import { APP_CONFIG } from '../config/app.js';
import { supabase } from '../lib/supabase.js';

async function invoke(body) {
  const { data, error } = await supabase.functions.invoke('manage-taxi-live', {
    body: { ...body, businessUnitCode: APP_CONFIG.businessUnitCode }
  });
  if (error) return { ok: false, message: error.message || 'Live-Fahrt konnte nicht gespeichert werden.' };
  if (data?.error) return { ok: false, message: data.error };
  return { ok: true, data };
}

export const startWalkInRide = input => invoke({ action: 'start', ...input });
export const updateWalkInRide = input => invoke({ action: 'update', ...input });
export const finishWalkInRide = input => invoke({ action: 'finish', ...input });
export const cancelWalkInRide = rideId => invoke({ action: 'cancel', rideId });
export const reportTaxiLocation = input => invoke({ action: 'location', ...input });
