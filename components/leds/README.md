# LEDs-Modul

Das `leds`-Modul ermöglicht die grafische Steuerung und Farbauswahl für die RGB-LEDs des Roboters. Es bietet eine übersichtliche Benutzeroberfläche zur Auswahl und Anpassung der Farben jeder einzelnen LED und sendet die Einstellungen direkt an den Roboter.

## Enthaltene Komponenten

### 1. `LedManager.tsx`
- **Beschreibung:** Hauptkomponente zur Verwaltung und Steuerung der LED-Farben.
- **Funktionen:**
  - Öffnet ein Modal mit einer kreisförmigen Anordnung von 8 LEDs.
  - Jede LED kann einzeln ausgewählt werden.
  - Beim Antippen einer LED öffnet sich ein weiteres Modal mit einem Farbwähler.
  - Änderungen werden sofort per WebSocket an das Topic `/led_rgb` gesendet.
  - Schließen und Speichern der Einstellungen über einen Button.

### 2. `MyColorPicker.tsx`
- **Beschreibung:** Farbauswahl-Komponente für eine einzelne LED.
- **Funktionen:**
  - Zeigt einen Farbwähler (Panel, HueSlider, Swatches) an.
  - Übernimmt die aktuelle Farbe der gewählten LED.
  - Nach Auswahl wird die neue Farbe im RGB-Format in das LED-Array übernommen.
  - Optimierte Darstellung für Tablets (zusätzliche Bedienelemente).

## Technische Details

- Nutzt React Contexts für WebSocket und Geräteeigenschaften.
- Die LED-Farben werden als Array von 24 Zahlen (8 LEDs × 3 RGB-Werte) verwaltet.