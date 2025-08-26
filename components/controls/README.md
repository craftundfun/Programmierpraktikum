# Controls-Modul

Das `controls`-Modul stellt zentrale Steuerelemente für die manuelle Robotersteuerung bereit. Es umfasst Komponenten für die Steuerung per ControlPad, per Joystick sowie einen Context zur Verwaltung der Roboterkontrolle.

## Enthaltene Komponenten

### 1. `ControlPad.tsx`
- **Beschreibung:** Steuerkreuz mit vier Richtungstasten (vor/zurück/links/rechts) zur manuellen Robotersteuerung.
- **Funktionen:**
  - Senden von Fahrbefehlen (`/manuell/cmd_vel`) über WebSocket.
  - Geschwindigkeit wird durch `speedMultiplier` skaliert.
  - Visuelles Feedback für gedrückte Richtung.
  - Fehlerbehandlung und Weiterleitung zur Fehlerseite bei WebSocket-Problemen (außer im Debug-Modus).
- **Props:**
  - `speedMultiplier: number` – Skaliert die Geschwindigkeit.
  - `gestureRef?`, `simultaneousRef?` – Für Gestensteuerung (optional).
  - `active: boolean` – Aktiviert/Deaktiviert das Pad.
  - `useDebugMode?: boolean` – Debug-Modus (optional).

### 2. `JoyStick.tsx`
- **Beschreibung:** Joystick zur stufenlosen Steuerung von Richtung und Geschwindigkeit.
- **Funktionen:**
  - Senden von Fahrbefehlen (`/manuell/cmd_vel`) über WebSocket, basierend auf Joystick-Position.
  - Geschwindigkeit und Drehrate werden dynamisch berechnet.
  - Animation des Joysticks bei Bewegung.
  - Fehlerbehandlung und Weiterleitung zur Fehlerseite bei WebSocket-Problemen (außer im Debug-Modus).
- **Props:**
  - `speedMultiplier: number` – Skaliert die Geschwindigkeit.
  - `active?: boolean` – Aktiviert/Deaktiviert den Joystick (Standard: `true`).
  - `gestureRef?`, `simultaneousRef?` – Für Gestensteuerung (optional).
  - `useDebugMode?: boolean` – Debug-Modus (optional).

### 3. `RobotControlContext.tsx`
- **Beschreibung:** Context zur Verwaltung der Roboterkontrolle (exklusiver Zugriff).
- **Funktionen:**
  - Prüfen, ob der Roboter bereits von jemandem gesteuert wird.
  - Anfordern und Freigeben der Roboterkontrolle via API.
- **API:**
  - `doWeControlTheRobot: boolean` – Gibt an, ob die App aktuell den Roboter steuert.
  - `getRobotControlIfPossible(url: string): Promise<boolean>` – Versucht, Kontrolle zu übernehmen.
  - `giveUpRobotControl(url: string): void` – Gibt die Kontrolle frei.
  - `checkIfRobotIsAlreadyInUse(url: string): Promise<boolean>` – Prüft, ob der Roboter belegt ist.

## Technische Details

- Nutzt React Contexts für WebSocket, Geräteeigenschaften und Einstellungen.
- Fehlerbehandlung mit Weiterleitung zur Fehlerseite (außer im Debug-Modus).
- Fahrbefehle werden regelmäßig oder bei Interaktion gesendet.