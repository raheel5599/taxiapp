import React,{useState} from 'react';
import {Plus,RefreshCw,ShieldCheck,X} from 'lucide-react';
import {createDriver,updateDriver,assignVehicle,releaseVehicle} from '../data/fleet.js';

export default function DriverManagement({drivers,vehicles,loading,error,refresh}){
  const [editing,setEditing]=useState(null);
  const [message,setMessage]=useState('');
  const [saveError,setSaveError]=useState('');

  async function save(form){
    const result=editing?.id ? await updateDriver(editing.id,form) : await createDriver(form);
    if(!result.ok){setSaveError(result.message||'Fahrer konnte nicht gespeichert werden.');return;}
    const driverId=editing?.id||result.data?.id;
    if(driverId){
      if(form.vehicleId) await assignVehicle(driverId,form.vehicleId);
      else if(editing?.vehicleId) await releaseVehicle(driverId);
    }
    setEditing(null);setMessage('Fahrer wurde gespeichert.');await refresh();
  }

  return <section className="fleet-page">
    <div className="fleet-toolbar panel">
      <div><p className="eyebrow">PERSONAL & EINSATZ</p><h2>Fahrer</h2><p>Fahrer zentral verwalten und Fahrzeug zuordnen.</p></div>
      <div className="fleet-toolbar-actions">
        <button className="secondary-button" onClick={refresh}><RefreshCw size={17}/> Aktualisieren</button>
        <button className="primary-button" onClick={()=>setEditing({})}><Plus size={17}/> Fahrer anlegen</button>
      </div>
    </div>
    {message&&<div className="users-notice">{message}<button onClick={()=>setMessage('')}><X size={15}/></button></div>}
    {(error||saveError)&&<div className="users-error">{error||saveError}<button onClick={()=>setSaveError('')}><X size={15}/></button></div>}
    <section className="panel"><div className="fleet-table-wrap"><table className="fleet-table">
      <thead><tr><th>Fahrer</th><th>Kontakt</th><th>Fahrzeug</th><th>Status</th><th>Führerschein</th><th/></tr></thead>
      <tbody>{loading?<tr><td colSpan="6" className="users-loading">Fahrer werden geladen …</td></tr>:drivers.length===0?<tr><td colSpan="6" className="users-loading">Noch keine Fahrer angelegt.</td></tr>:drivers.map(d=><tr key={d.id}>
        <td><strong>{d.name}</strong><br/><small>{d.personnelNumber||'Keine Personalnummer'}</small></td>
        <td>{d.phone||'—'}<br/><small>{d.email||'—'}</small></td>
        <td>{d.vehicle||'Nicht zugeordnet'}</td>
        <td><span className={`account-status ${d.active?'active':'blocked'}`}><span/>{d.active?d.status:'Inaktiv'}</span></td>
        <td>{d.licenseExpiry?new Date(d.licenseExpiry).toLocaleDateString('de-DE'):'—'}</td>
        <td><button className="text-button" onClick={()=>setEditing(d)}>Bearbeiten</button></td>
      </tr>)}</tbody>
    </table></div></section>
    {editing&&<DriverEditor driver={editing.id?editing:null} vehicles={vehicles} onClose={()=>setEditing(null)} onSave={save}/>}
  </section>;
}

function DriverEditor({driver,vehicles,onClose,onSave}){
  const [form,setForm]=useState({fullName:driver?.fullName||'',email:driver?.email||'',phone:driver?.phone||'',personnelNumber:driver?.personnelNumber||'',licenseNumber:driver?.licenseNumber||'',licenseExpiry:driver?.licenseExpiry||'',notes:driver?.notes||'',active:driver?.active??true,vehicleId:driver?.vehicleId||''});
  const [saving,setSaving]=useState(false);
  const change=(key,value)=>setForm(v=>({...v,[key]:value}));
  async function submit(e){e.preventDefault();setSaving(true);await onSave(form);setSaving(false);}
  return <div className="modal-layer"><button className="modal-backdrop" onClick={onClose}/><form className="modal-card user-editor" onSubmit={submit}>
    <div className="modal-head"><div><p className="eyebrow">FAHRERVERWALTUNG</p><h2>{driver?'Fahrer bearbeiten':'Fahrer anlegen'}</h2></div><button type="button" className="icon-button" onClick={onClose}><X/></button></div>
    <div className="form-grid">
      <label><span>Name</span><input value={form.fullName} onChange={e=>change('fullName',e.target.value)} required/></label>
      <label><span>Personalnummer</span><input value={form.personnelNumber} onChange={e=>change('personnelNumber',e.target.value)}/></label>
      <label><span>Telefon</span><input value={form.phone} onChange={e=>change('phone',e.target.value)}/></label>
      <label><span>E-Mail</span><input type="email" value={form.email} onChange={e=>change('email',e.target.value)}/></label>
      <label><span>Führerschein-Nr.</span><input value={form.licenseNumber} onChange={e=>change('licenseNumber',e.target.value)}/></label>
      <label><span>Gültig bis</span><input type="date" value={form.licenseExpiry} onChange={e=>change('licenseExpiry',e.target.value)}/></label>
      <label className="wide"><span>Fahrzeug</span><select value={form.vehicleId} onChange={e=>change('vehicleId',e.target.value)}><option value="">Kein Fahrzeug</option>{vehicles.filter(v=>v.active&&(!v.driverId||v.driverId===driver?.id)).map(v=><option key={v.id} value={v.id}>{v.registration} · {[v.make,v.model].filter(Boolean).join(' ')}</option>)}</select></label>
      {driver&&<label className="checkbox-label wide"><input type="checkbox" checked={form.active} onChange={e=>change('active',e.target.checked)}/><span>Fahrer aktiv</span></label>}
    </div>
    <div className="modal-summary"><ShieldCheck size={18}/><span>Die Zuordnung wird zentral gespeichert.</span></div>
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Abbrechen</button><button className="primary-button" disabled={saving}>{saving?'Wird gespeichert …':'Speichern'}</button></div>
  </form></div>;
}
