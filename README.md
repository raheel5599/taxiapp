# TARIQ Taxi Zentrale App

Produktive Adresse: https://app.tariq-taxizentrale.de

Die Verwaltungsbasis wurde aus Fahrdienst-Stand ad31fd3 übernommen. Kunden, Serienfahrten, Disposition und Historie, Fahrer/Fahrzeuge, Schichten/Pausen/Kilometer, Verträge und Krankenfahrtabrechnung, Rechnungen/Quittungen/Vorschau, Eigenanteilsmahnungen, Zahlungseingänge, Buchhaltung/Belegexport, Dokumente, Nachrichten und Berichte verwenden den Geschäftsbereich `taxi`.

Taxi-Marke, Fahrtarten und die begonnene Einsteiger-/GPS-Funktion bleiben erhalten. Einsteigerfahrten verwenden das Schichtfahrzeug; laufende Einsteiger blockieren Pause, Schichtende und den Start anderer Aufträge. Geplante Taxi-Aufträge sind standardmäßig privat; Preise und Umsatzsteuer müssen bestätigt werden. Bei Abschluss entsteht ein zu prüfender Abrechnungsfall.

Unter Einstellungen müssen die eigenen Unternehmens- und Bankdaten gespeichert werden, bevor neue Rechnungen ausgestellt werden. Bestehende Dokumente behalten ihren Aussteller-Snapshot. Derzeit sind Mahnungen für Eigenanteilsrechnungen verfügbar, keine allgemeine Taxi-Mahnautomatik.

## Noch offen
- Echte HALE-Geräteanbindung und automatische Taxameterübertragung.
- Einsteiger automatisch in die reguläre Abrechnung übernehmen (aktuell eigener Live-Datensatz).
- Echte Hintergrund-Pushnachrichten und Offline-Schichtänderungen.
- DATEV-Direktformat und Gutscheinkonten.

## Prüfung und Deployment
`npm ci`, `npm test`, `npm run build`; Browserprüfungen: `npm run test:ui`, `npm run test:reports`, `npm run test:offline` (mit `UI_WEBKIT=1` auch WebKit).
Gemeinsame Edge Functions gehören zum bestehenden Supabase-Projekt. Das App-Deployment läuft über `.github/workflows/deploy-taxi-app.yml` in Taxi_website; es erhält die Compose-Zuordnung und schreibt keine Proxy-Konfiguration. Das zentrale Routing gehört zu fahrschulpilot.
