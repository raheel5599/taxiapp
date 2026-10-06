export const APP_CONFIG = Object.freeze({
  name: 'TARIQ Taxi Zentrale',
  shortName: 'TARIQ Taxi',
  domain: 'app.taxi-fahrdienst.de',
  logoUrl: 'https://taxi5599.de/assets/taxi/logo-tariq-taxizentrale-header-20261001.png',
  productMode: 'taxi_and_medical_transport',
  businessUnitCode: 'taxi',
  tripTypes: [
    'Taxi',
    'Großraumtaxi',
    'Flughafentransfer',
    'Kurierfahrt',
    'Rollstuhlfahrt',
    'Arztfahrt',
    'Dialyse',
    'Chemotherapie',
    'Reha',
    'Krankenhaus'
  ],
  dataVersion: 1
});

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  OFFICE: 'office',
  DRIVER: 'driver'
});
