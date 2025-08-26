# AudioRecording-Komponente

Die `AudioRecording`-Komponente ermöglicht Audioaufnahmen innerhalb der App und sendet die aufgezeichneten Audiodaten per WebSocket an den Roboter.

## Hauptfunktionen

- Starten und Stoppen von Audioaufnahmen per Button (Mikrofon-Symbol).
- Speicherung der Aufnahme im Dateisystem des Geräts.
- Umwandlung der Audiodatei in Base64 und Versand über WebSocket an das Topic `/audio_wav`.
- Löschen der temporären Audiodatei nach dem Versand.
- Fehlerbehandlung und Weiterleitung zur Fehlerseite bei Problemen (außer im Debug-Modus).

## Props

- `useDebugMode?: boolean`  
  Optional. Aktiviert einen Debug-Modus, der Fehlerbehandlung teilweise überspringt.

## Technische Details

- Nutzt das `expo-audio`-Modul für Aufnahme.
- Verwendet React Contexts für WebSocket und Geräteinformationen.
- UI basiert auf einem Touch-Button mit dynamischem Icon (Mikrofon/Mikrofon durchgestrichen).