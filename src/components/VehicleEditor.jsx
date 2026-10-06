import React,{useState} from 'react';
import {X} from 'lucide-react';

export default function VehicleEditor({vehicle,onClose,onSave}){
  const [registration,setRegistration]=useState(vehicle?.registration||'');
  const [make,setMake]=useState(vehicle?.make||'');
  const [model,setModel]=useState(vehicle?.model||'');
  async function submit(e){
    e.preventDefault();
    await onSave({registration:registration.toUpperCase(),make,model});
  }
  return <div className="modal-layer">
    <button className="modal-backdrop" onClick={onClose} aria-label="Schließen"/>
    <form className="modal-card" onSubmit={submit}>
      <div className="modal-head"><h2>{vehicle?'Fahrzeug bearbeiten':'Fahrzeug anlegen'}</h2><button type="button" className="icon-button" onClick={onClose}><X/></button></div>
      <div className="form-grid">
        <label><span>Kennzeichen</span><input value={registration} onChange={e=>setRegistration(e.target.value)} required/></label>
        <label><span>Hersteller</span><input value={make} onChange={e=>setMake(e.target.value)}/></label>
        <label><span>Modell</span><input value={model} onChange={e=>setModel(e.target.value)}/></label>
      </div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Abbrechen</button><button className="primary-button">Speichern</button></div>
    </form>
  </div>;
}
