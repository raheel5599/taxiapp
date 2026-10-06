import React from 'react';
import {Car,Plus,RefreshCw} from 'lucide-react';

export default function VehicleManagement({vehicles,loading,error,refresh,onNew,onEdit}){
  return <section className="fleet-page">
    <div className="fleet-toolbar panel">
      <div><p className="eyebrow">FUHRPARK</p><h2>Fahrzeugverwaltung</h2><p>Fahrzeuge, Kilometer, TÜV und Wartung zentral verwalten.</p></div>
      <div className="fleet-toolbar-actions">
        <button className="secondary-button" onClick={refresh}><RefreshCw size={17}/> Aktualisieren</button>
        <button className="primary-button" onClick={onNew}><Plus size={17}/> Fahrzeug anlegen</button>
      </div>
    </div>
    {error&&<div className="users-error">{error}</div>}
    <section className="vehicle-cards">
      {loading?<div className="panel users-loading">Fahrzeuge werden geladen …</div>:vehicles.length===0?<div className="panel empty-fleet"><Car/><h3>Noch keine Fahrzeuge</h3></div>:vehicles.map(v=><article className="panel vehicle-card" key={v.id}>
        <div className="vehicle-card-head"><div className="vehicle-icon"><Car/></div><div><strong>{v.registration}</strong><span>{[v.make,v.model].filter(Boolean).join(' ')||'Fahrzeug'}</span></div></div>
        <div className="vehicle-details"><div><span>Kilometer</span><strong>{Number(v.mileage||0).toLocaleString('de-DE')} km</strong></div><div><span>Fahrer</span><strong>{v.driverName||'Nicht zugeordnet'}</strong></div></div>
        <button className="secondary-button vehicle-edit" onClick={()=>onEdit(v)}>Bearbeiten</button>
      </article>)}
    </section>
  </section>;
}
