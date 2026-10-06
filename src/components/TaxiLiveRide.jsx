import React, { useState } from 'react';
import { Car, CheckCircle2, Navigation, XCircle } from 'lucide-react';
import { DESTINATION_MODE, navigationUrl } from '../domain/taxiLive.js';
import { cancelWalkInRide, finishWalkInRide, reportTaxiLocation, startWalkInRide, updateWalkInRide } from '../data/taxiLive.js';

const locate=()=>new Promise((resolve,reject)=>{
  if(!navigator.geolocation)return reject(new Error('Standort ist auf diesem Gerät nicht verfügbar.'));
  navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:12000,maximumAge:5000});
});
const point=p=>({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy,heading:p.coords.heading,speed:p.coords.speed});

export default function TaxiLiveRide({ vehicle }) {
  const [ride,setRide]=useState(null);
  const [mode,setMode]=useState(DESTINATION_MODE.UNKNOWN);
  const [destination,setDestination]=useState('');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');

  async function start(){
    setBusy(true);setMessage('');
    try{
      const p=point(await locate());
      const result=await startWalkInRide({source:'manual',pickupLat:p.latitude,pickupLng:p.longitude,destinationMode:mode,destinationAddress:destination});
      if(!result.ok)throw new Error(result.message);
      setRide(result.data.ride);
    }catch(e){setMessage(e.message);}finally{setBusy(false);}
  }

  async function saveDestination(value){
    setDestination(value);
    if(!ride)return;
    const result=await updateWalkInRide({rideId:ride.id,destinationAddress:value,destinationMode:value?DESTINATION_MODE.KNOWN:mode});
    if(result.ok)setRide(result.data.ride);
  }

  async function finish(){
    setBusy(true);setMessage('');
    try{
      const p=point(await locate());
      const result=await finishWalkInRide({rideId:ride.id,destinationLat:p.latitude,destinationLng:p.longitude,destinationAddress:destination});
      if(!result.ok)throw new Error(result.message);
      setRide(null);setDestination('');setMode(DESTINATION_MODE.UNKNOWN);
    }catch(e){setMessage(e.message);}finally{setBusy(false);}
  }

  async function cancel(){
    setBusy(true);setMessage('');
    const result=await cancelWalkInRide(ride.id);
    if(result.ok){setRide(null);setDestination('');setMode(DESTINATION_MODE.UNKNOWN);}
    else setMessage(result.message);
    setBusy(false);
  }

  async function sendLocation(){
    if(!ride)return;
    try{
      const p=point(await locate());
      await reportTaxiLocation({rideId:ride.id,...p});
    }catch{}
  }

  React.useEffect(()=>{
    if(!ride)return;
    sendLocation();
    const id=setInterval(sendLocation,10000);
    return()=>clearInterval(id);
  },[ride?.id]);

  if(!ride)return <section className="taxi-live-card">
    <div className="taxi-live-title"><strong><span className="taxi-live-dot free"/> Taxi frei</strong><small>{vehicle||'Fahrzeug laut Schicht'}</small></div>
    <p>Einsteiger starten: Abfahrt wird automatisch per GPS gespeichert.</p>
    <div className="destination-choice">
      <label><input type="radio" checked={mode===DESTINATION_MODE.KNOWN} onChange={()=>setMode(DESTINATION_MODE.KNOWN)}/> Ziel bekannt</label>
      <label><input type="radio" checked={mode===DESTINATION_MODE.LATER} onChange={()=>setMode(DESTINATION_MODE.LATER)}/> Ziel später</label>
      <label><input type="radio" checked={mode===DESTINATION_MODE.UNKNOWN} onChange={()=>setMode(DESTINATION_MODE.UNKNOWN)}/> Keine Adresse</label>
    </div>
    {mode===DESTINATION_MODE.KNOWN&&<input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Zieladresse" />}
    <button className="primary-button" disabled={busy||(mode===DESTINATION_MODE.KNOWN&&!destination.trim())} onClick={start}><Car size={18}/> {busy?'GPS wird ermittelt …':'Fahrgast eingestiegen · Besetzt'}</button>
    {message&&<p className="taxi-live-error">{message}</p>}
  </section>;

  const nav=navigationUrl({destinationAddress:destination});
  return <section className="taxi-live-card occupied">
    <div className="taxi-live-title"><strong><span className="taxi-live-dot occupied"/> Besetzt</strong><small>seit {new Date(ride.started_at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</small></div>
    <label className="taxi-destination"><span>Ziel</span><input value={destination} onChange={e=>saveDestination(e.target.value)} placeholder="Ziel noch nicht angegeben"/></label>
    <div className="taxi-live-actions">
      {nav?<a className="primary-button" href={nav} target="_blank" rel="noreferrer"><Navigation size={18}/> Navigation</a>:<button className="secondary-button" disabled><Navigation size={18}/> Ziel fehlt</button>}
      <button className="secondary-button" disabled={busy} onClick={finish}><CheckCircle2 size={18}/> Fahrt beenden</button>
      <button className="danger-button" disabled={busy} onClick={cancel}><XCircle size={18}/> Abbrechen</button>
    </div>
    <small>Live-Position wird während der aktiven Fahrt aktualisiert. Ohne Zieladresse speichert Fahrt beenden den aktuellen GPS-Endpunkt.</small>
    {message&&<p className="taxi-live-error">{message}</p>}
  </section>;
}
