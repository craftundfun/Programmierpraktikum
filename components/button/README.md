# Button-Modul

Das Button-Modul stellt verschiedene Schaltflächen-Komponenten für die Roboter-App bereit. Diese Buttons können zentrale Sachen wie Not-Aus, Rückkehr zur Startseite oder das Aktivieren von Objekterkennung aktivieren.

## Enthaltene Komponenten

### 1. `BackToHomeButton.tsx`
- **Beschreibung:** Button zum sofortigen Zurückkehren auf die Startseite.
- **Funktionen:**
  - Beendet die WebSocket-Verbindung.
  - Gibt ggf. die Robotersteuerung frei.
  - Navigiert zur Startseite (`/`).
  - Optional: Setzt einen Status, wenn der Button gedrückt wurde.
- **Props:**
  - `setWasPressed?: React.Dispatch<React.SetStateAction<boolean>>` – Optionaler Callback beim Drücken.
  - `url?: string | null` – Optionale URL für die Freigabe der Robotersteuerung.

### 2. `KillButton.tsx`
- **Beschreibung:** Not-Aus-Button für den Roboter.
- **Funktionen:**
  - Sendet Stopp-Kommandos an den Roboter (Fahrmodus aus, Geschwindigkeit null).
  - Trennt die WebSocket-Verbindung.
  - Gibt die Robotersteuerung frei.
  - Sendet einen Not-Aus-Request an das Backend.
  - Navigiert zur Übersichtsseite mit den Ergebnissen der Notabschaltung.
  - Optional: Setzt einen Status, wenn der Button gedrückt wurde.
- **Props:**
  - `wasPressed?: React.Dispatch<React.SetStateAction<boolean>>` – Optionaler Callback beim Drücken.

### 3. `ObjectDetection.tsx`
- **Beschreibung:** Button zum Aktivieren/Deaktivieren der Objekterkennung.
- **Funktionen:**
  - Schaltet die Objekterkennung an oder aus.
- **Props:**
  - `active: boolean` – Status der Objekterkennung.
  - `setActive: React.Dispatch<React.SetStateAction<boolean>>` – Callback zum Umschalten.
  - `disabled?: boolean` – Optional, deaktiviert den Button.

## Technische Details

- Nutzt React Contexts für WebSocket, Geräteeigenschaften und Robotersteuerung.
- Navigation erfolgt über `expo-router`.