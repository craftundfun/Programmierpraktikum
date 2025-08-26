# Slider-Modul

Das `slider`-Modul stellt UI-Komponenten zur Auswahl und Steuerung von Werten per Schieberegler und Segmentauswahl bereit.

## Enthaltene Komponenten

### 1. `Slider.tsx`
- **Beschreibung:** Anpassbarer Schieberegler zur Auswahl eines Werts im Bereich zwischen `minimumValue` und `maximumValue`.
- **Funktionen:**
  - Zeigt aktuellen Wert als Prozentzahl an (z.B. „Speed: 75%“).
  - Wert kann per Drag-Geste verändert werden.
  - Animierte Darstellung des Schiebereglers und des Thumbs.
  - Throttling der Wertänderung (max. alle 50ms).
  - Optional: Deaktivierbar über Prop `active`.
  - Unterstützt externe Gestensteuerung via `gestureRef` und `simultaneousRef`.
- **Props:**
  - `value: number` – Aktueller Wert.
  - `setValue: (value: number) => void` – Setter für den Wert.
  - `minimumValue?: number` – Minimalwert (Standard: 0).
  - `maximumValue?: number` – Maximalwert (Standard: 1).
  - `active?: boolean` – Aktiviert/Deaktiviert den Slider (Standard: `true`).
  - `gestureRef?`, `simultaneousRef?` – Für externe Gestensteuerung (optional).

### 2. `SegmentedControl.tsx`
- **Beschreibung:** Segmentierte Schaltfläche zur Auswahl eines von mehreren diskreten Werten (z. B. Modusauswahl).
- **Funktionen:**
  - Zeigt mehrere auswählbare Tabs an.
  - Visuelles Feedback für aktives Segment.
  - Optional: Deaktivierbar über Prop `active`.
- **Props:**
  - `values: string[]` – Anzuzeigende Segmente.
  - `index: number` – Index des aktuell aktiven Segments.
  - `onIndexChange: (index: number) => void` – Callback bei Auswahländerung.
  - `active?: boolean` – Aktiviert/Deaktiviert die Komponente (Standard: `true`).

## Technische Details

- Nutzt Animated API und react-native-gesture-handler für Interaktionen.
- Komponenten sind für Wiederverwendung und Integration in andere Module ausgelegt.