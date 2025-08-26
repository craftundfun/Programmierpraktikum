# Settings-Modul

Das `settings`-Modul verwaltet globale Einstellungen der App, wie Standardadressen, Ports, Subnetz und Betriebsmodi (Joystick, Debug). Es stellt einen Context für den Zugriff auf die Einstellungen bereit und bietet eine UI-Komponente zur komfortablen Anpassung dieser Werte.

## Enthaltene Komponenten & Dateien

### 1. `SettingsContext.tsx`
- **Beschreibung:** Context-Provider für globale App-Einstellungen.
- **Funktionen:**
  - Speichern, Laden und Zurücksetzen von Einstellungen in `AsyncStorage`.
  - Standardwerte für Adresse, Ports, Subnetz, Joystick- und Debug-Modus.
  - Methoden:
    - `getSetting(settingType, defaultValue?)`: Gibt den Wert einer Einstellung zurück (mit Fallback auf Standard).
    - `setSettings(newSettings)`: Speichert neue/aktualisierte Einstellungen.
    - `resetToDefaultSettings()`: Setzt alle Einstellungen auf Standard zurück.
    - `reloadSettingsFlag` & `triggerSettingsReload()`: Ermöglichen das Neuladen der Einstellungen in abhängigen Komponenten.
- **Verwendung:** Über den Context können alle Komponenten zentral auf die Einstellungen zugreifen.

### 2. `SettingsManager.tsx`
- **Beschreibung:** UI-Komponente zur Anzeige und Bearbeitung der globalen Einstellungen.
- **Funktionen:**
  - Öffnet ein Modal zur Bearbeitung der Einstellungen.
  - Felder für WebSocket-Adresse, Ports, Subnetz, Joystick- und Debug-Modus.
  - Speichern, Zurücksetzen auf Standard und Schließen ohne Speichern.
  - Lädt aktuelle Werte beim Öffnen und nach Änderungen.
  - Nutzt `AddressField` und `PortField` aus dem Input-Modul für Eingaben.

## Technische Details

- Persistente Speicherung mit `@react-native-async-storage/async-storage`.
- Context-API für globalen Zugriff.