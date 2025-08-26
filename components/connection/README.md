# Connection-Modul

Das `connection`-Modul verwaltet die Verbindungskonfigurationen und das Verbindungsmanagement zur Robotersteuerung. Es ermöglicht das Speichern, Löschen, Prüfen und Herstellen von Verbindungen zu Robotern im lokalen Netzwerk. Die Komponenten sind für die Integration in die Start- und Steuerungsoberfläche der App optimiert.

## Enthaltene Dateien & Komponenten

### 1. `checkAddressAndConnect.ts`
- **Beschreibung:** Stellt zentrale Funktionen für das Verbindungsmanagement bereit.
- **Funktionen:**
  - `checkAddressAndConnect`: Prüft Adressen/Ports, stellt eine WebSocket-Verbindung her, speichert neue Roboter, navigiert zur Steuerungs- oder Fehlerseite.
  - Verwaltung der gespeicherten Roboter (`newRobot`, `getRobots`, `removeRobot`, `doesRobotExist`, `updateLastUsed`).
- **Verwendung:** Wird von UI-Komponenten genutzt, um Verbindungen zu prüfen, herzustellen und zu verwalten.

### 2. `ConnectionManager.tsx`
- **Beschreibung:** Zeigt eine Liste der zuletzt genutzten Verbindungen an.
- **Funktionen:**
  - Lädt gespeicherte Roboter aus dem lokalen Speicher.
  - Sortiert nach „zuletzt verwendet“.
  - Stellt für jeden Eintrag ein `ConnectionField` bereit.
  - Ermöglicht das Löschen von Einträgen.
- **UI:** Horizontale Scroll-Liste mit Verbindungsfeldern.

### 3. `ConnectionField.tsx`
- **Beschreibung:** Einzelnes Verbindungsfeld für einen gespeicherten Roboter.
- **Funktionen:**
  - Zeigt Adressen, Ports, „zuletzt verwendet“ und Systemstatus (Batterie, CPU, RAM, Temperatur) an.
  - Prüft regelmäßig die Erreichbarkeit des Roboters.
  - Bietet Buttons zum Verbinden und Löschen/Speichern.
  - Stellt Verbindung her und aktualisiert „zuletzt verwendet“.
- **UI:** Übersichtliches Feld mit Statusanzeigen und Aktionen.

### 4. `NewConnectionManager.tsx`
- **Beschreibung:** Scannt das lokale Netzwerk nach neuen Robotern.
- **Funktionen:**
  - Durchsucht das Subnetz nach erreichbaren Robotern (Ping auf API-Port).
  - Zeigt gefundene Adressen in Echtzeit an.
  - Ermöglicht das Hinzufügen neuer Roboter zur gespeicherten Liste.
- **UI:** Fortschrittsanzeige während des Scans, gefundene Adressen als Felder.

## Technische Details

- Nutzt `AsyncStorage` für persistente Speicherung der Verbindungen.
- Verwendet WebSocket und HTTP für Status- und Verbindungsprüfungen.
- Kontextintegration für Geräteeigenschaften, Einstellungen und WebSocket.