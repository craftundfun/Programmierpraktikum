# Info-Modul

Das `info`-Modul stellt Komponenten zur Anzeige von Systeminformationen des Roboters bereit, wie CPU-Auslastung, RAM-Nutzung und CPU-Temperatur. Die Informationen werden in einem ausklappbaren Panel dargestellt und visuell hervorgehoben, wenn kritische Werte erreicht werden.

## Enthaltene Komponenten

### 1. `InfoPanel.tsx`
- **Beschreibung:** Zeigt ein seitlich ausfahrbares Panel mit aktuellen Systemdaten des Roboters an.
- **Funktionen:**
  - Abonnieren des `/system`-Topics per WebSocket.
  - Anzeige von CPU-Auslastung, RAM-Nutzung und CPU-Temperatur.
  - Visuelle Warnung bei kritischen Werten:
    - CPU-Auslastung ≥ 90%
    - RAM-Nutzung ≥ 80%
    - CPU-Temperatur ≥ 50°C
  - Automatisches Öffnen des Panels bei Alarm.
  - Fehlerbehandlung und Weiterleitung zur Fehlerseite bei Problemen (außer im Debug-Modus).
- **Props:**
  - `useDebugMode?: boolean` – Aktiviert Debug-Modus (optional).

### 2. `InfoText.tsx`
- **Beschreibung:** Zeigt einen einzelnen Systemwert mit Label, Wert und optionalem Anhang an.
- **Funktionen:**
  - Farbige und fette Darstellung bei Alarm.
  - Zeigt einen Ladeindikator, solange keine Daten vorliegen.
- **Props:**
  - `text: string` – Label des Werts.
  - `textColor: string` – Textfarbe.
  - `textBold: boolean` – Fettdruck bei Alarm.
  - `info: string | null` – Anzuzeigender Wert.
  - `appendix?: string` – Optionaler Anhang (z.B. „°C“).

## Technische Details

- Nutzt React Contexts für WebSocket und Geräteeigenschaften.
- Animationen mit React Native Animated API.
- Fehlerbehandlung mit Weiterleitung zur Fehlerseite (außer im Debug-Modus).