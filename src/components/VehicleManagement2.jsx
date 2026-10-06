import React,{useState} from 'react';
import {Car,Plus,RefreshCw} from 'lucide-react';
import VehicleEditor from './VehicleEditor.jsx';
import {createVehicle,updateVehicle} from '../data/fleet.js';

export default function VehicleManagement2({vehicles,loading,error,refresh}){
  const [editing,setEditing]=useState(null);
  const [message,setMessage]=useState('');

  async function save(payload){
    const result=editing?.id?await updateVehicle(editing.id,payload):await createVehicle(payload);
    if(!result.ok){setMessage(result.message||'Fahrzeug konnte nicht gespeichert werden.');return;}
    setEditing(null);
    setMessage('Fahrzeug wurde gespeichert.');
    await refresh();
  }

  return <section className="fleet-page">
    <div className="fleet-toolbar panel">
      <div><p className="eyebrow">FUHRPARK</p><h2>Fahrzeugverwaltung</h2><p>Fahrzeuge zentral verwalten.</p></div>
      <div className="fleet-toolbar-actions">
        <button className="secondary-button" onClick={refresh}><RefreshCw size={17}/> Aktualisieren</button>
        <button className="primary-button" onClick={()=>setEditing({})}><Plus size={17}/> Fahrzeug anlegen</button>
      </div>
    </div>
    {(error||message)&&<div className={error?'users-error':'users-notice'}>{error||message}</div>}
    <section className="vehicle-cards">
      {loading?<div className="panel users-loading">Fahrzeuge werden geladen …</div>:vehicles.length===0?<div className="panel empty-fleet"><Car/><h3>Noch keine Fahrzeuge</h3></div>:vehicles.map(v=><article className="panel vehicle-card" key={v.id}>
        <div className="vehicle-card-head"><div className="vehicle-icon"><Car/></div><div><strong>{v.registration}</strong><span>{[v.make,v.model].filter(Boolean).join(' ')||'Fahrzeug'}</span></div></div>
        <div className="vehicle-details"><div><span>Kilometer</span><strong>{Number(v.mileage||0).toLocaleString('de-DE')} km</strong></div><div><span>Fahrer</span><strong>{v.driverName||'Nicht zugeordnet'}</strong></div></div>
        <button className="secondary-button vehicle-edit" onClick={()=>setEditing(v)}>Bearbeiten</button>
      </article>)}
    </section>
    {editing&&<VehicleEditor vehicle={editing.id?editing:null} onClose={()=>setEditing(null)} onSave={save}/>}
  </section>;
}
