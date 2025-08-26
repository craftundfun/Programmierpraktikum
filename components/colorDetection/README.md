# ColorDetector-Komponente

Die `ColorDetector`-Komponente visualisiert die Farbdaten von bis zu vier Farbsensoren des Roboters. Sie empfängt die Sensordaten über WebSocket und stellt die erkannten Farben grafisch dar.

## Hauptfunktionen

- Abonnieren des WebSocket-Themas `/scan/floor` für Farbsensordaten.
- Empfangen und Parsen der Sensordaten (RGBA-Werte) von bis zu vier Sensoren.
- Umrechnung der Rohdaten in RGB-Farben für die Anzeige.
- Grafische Darstellung der Sensorwerte als farbige Kreise in einer Leiste.
- Automatische Fehlerbehandlung und Weiterleitung zur Fehlerseite bei Problemen (außer im Debug-Modus).

## Props

- `useDebugMode?: boolean`  
  Optional. Aktiviert einen Debug-Modus, der Fehlerbehandlung teilweise überspringt.

## Technische Details

- Nutzt React Contexts für WebSocket und Geräteeigenschaften.
- Die Sensordaten werden als Array empfangen und in vier Sensorobjekte aufgeteilt.
- Die Farben werden aus den Rohwerten (r, g, b, c) berechnet und als `rgb(...)` angezeigt.