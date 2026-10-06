export const initialTrips = [
  {
    id: 'T-2001', time: '08:10', patient: 'Müller, Anna', type: 'Taxi',
    from: 'Florstadt, Altenstädter Str. 8', to: 'Bahnhof Friedberg',
    driver: 'Ahmad', vehicle: 'FB-TT 5599', status: 'abgeschlossen',
    wheelchair: false, audit: []
  },
  {
    id: 'T-2002', time: '09:30', patient: 'Schmidt, Karl', type: 'Dialyse',
    from: 'Florstadt, Lindenstraße 12', to: 'Dialysezentrum Friedberg',
    driver: 'Imran', vehicle: 'FB-VD 5599', status: 'in_fahrt',
    wheelchair: false, audit: []
  },
  {
    id: 'T-2003', time: '11:00', patient: 'Yilmaz, Mehmet', type: 'Flughafentransfer',
    from: 'Reichelsheim, Hauptstraße 31', to: 'Frankfurt Flughafen Terminal 1',
    driver: 'Bilal', vehicle: 'FB-CM 5599', status: 'auf_dem_weg',
    wheelchair: false, audit: []
  },
  {
    id: 'T-2004', time: '13:15', patient: 'Becker, Lisa', type: 'Rollstuhlfahrt',
    from: 'Friedberg, Kaiserstraße 47', to: 'MediClin Bad Orb',
    driver: 'Hamza', vehicle: 'FB-TT 5600', status: 'geplant',
    wheelchair: true, audit: []
  },
  {
    id: 'T-2005', time: '15:00', patient: 'Schneider, Thomas', type: 'Taxi',
    from: 'Bad Nauheim, Parkstraße 3', to: 'Florstadt',
    driver: '', vehicle: '', status: 'offen',
    wheelchair: false, audit: []
  }
];

export const driversSeed = [
  { id: 'DRV-001', name: 'Ahmad', vehicle: 'FB-TT 5599', status: 'frei' },
  { id: 'DRV-002', name: 'Imran', vehicle: 'FB-VD 5599', status: 'in_fahrt' },
  { id: 'DRV-003', name: 'Bilal', vehicle: 'FB-CM 5599', status: 'auf_dem_weg' },
  { id: 'DRV-004', name: 'Hamza', vehicle: 'FB-TT 5600', status: 'frei' },
  { id: 'DRV-005', name: 'Ali', vehicle: 'FB-CM 5599', status: 'frei' },
  { id: 'DRV-006', name: 'Yusuf', vehicle: 'FB-XX 5601', status: 'frei' }
];
