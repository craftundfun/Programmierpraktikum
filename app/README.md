## Hauptmodule im `app`-Verzeichnis

### 1. `_layout.tsx`
- **Beschreibung:** Einstiegspunkt der App. Hier werden globale Provider (z.B. für WebSocket, Geräteeigenschaften, Einstellungen, Robotersteuerung) eingebunden. Außerdem werden Status- und Navigationsleisten ausgeblendet und Icons geladen.
- **Funktion:** Stellt sicher, dass alle globalen Kontexte und UI-Grundlagen für die gesamte App bereitstehen.

### 2. `index.tsx`
- **Beschreibung:** Homescreen der App. Hier kann der Nutzer die Roboteradressen und Ports eingeben, eine Verbindung herstellen und Einstellungen anpassen.
- **Funktion:** Verbindungsmanagement, Adress-/Port-Eingabe, Zugriff auf Einstellungen und Verbindungsstatusanzeige.

### 3. `ControlScreen.tsx`
- **Beschreibung:** Hauptsteuerungsoberfläche für den Roboter. Zeigt den Video-Stream, Steuerungselemente (Joystick, ControlPad, Slider), Batterie- und Verbindungsstatus sowie weitere Sensorinformationen an.
- **Funktion:** Ermöglicht die manuelle oder autonome Steuerung des Roboters, Auswahl der Kamera, Aktivierung von Objekterkennung, Notfallabschaltung und Anzeige von Warnungen.

### 4. `ErrorScreen.tsx`
- **Beschreibung:** Fehleranzeigeseite, die bei Verbindungsproblemen oder anderen kritischen Fehlern angezeigt wird.
- **Funktion:** Zeigt eine Fehlermeldung und bietet die Möglichkeit, zur Startseite zurückzukehren.

### 5. `KillButtonScreen.tsx`
- **Beschreibung:** Zeigt die Ergebnisse einer Notfallabschaltung (Emergency Stop) an, also welche Roboterprozesse erfolgreich beendet wurden und welche nicht.
- **Funktion:** Übersicht über den Status der Notabschaltung, Rückkehr zur Startseite möglich.

## Weitere Hinweise

- Die App verwendet verschiedene Kontexte (Context Provider) für WebSocket-Kommunikation, Geräteeigenschaften, Einstellungen und Robotersteuerung.
- Die Navigation erfolgt über das `expo-router`-System.
- Die App ist für verschiedene Bildschirmgrößen und -ausrichtungen optimiert (mehr oder weniger).
- Viele UI-Komponenten sind modular aufgebaut und befinden sich in separaten Unterverzeichnissen (z.B. `components/battery`, `components/controls`).