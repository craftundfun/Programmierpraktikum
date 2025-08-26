# Battery-Modul

Das Battery-Modul stellt Komponenten zur Anzeige des Batteriestatus und zur Warnung bei niedrigem Akkustand bereit. Es
ist für die Integration in die Steuerungsoberfläche der Roboter-App gedacht und unterstützt verschiedene Warnstufen
sowie Animationen.

## Enthaltene Komponenten

### 1. `Battery.tsx`

- **Beschreibung:** Zeigt den aktuellen Ladezustand (Prozent) und die geschätzte Restlaufzeit (in Minuten) der
  Roboterbatterie an.
- **Funktionen:**
    - Abonnieren des `/battery/status`-Topics per WebSocket.
    - Dynamische Anzeige des Batteriestands mit Icons und Farben je nach Ladezustand.
    - Anzeige der verbleibenden Zeit bis zur Entladung.
    - Optional: Auslösen einer Warnfunktion bei bestimmten Prozentwerten.
    - Fehlerbehandlung und Weiterleitung zur Fehlerseite bei Problemen (außer im Debug-Modus).
- **Props:**
    - `warningPercentage?: number[]` – Prozentwerte, bei denen eine Warnung ausgelöst wird.
    - `warningFunction?: (percentage: number) => void` – Funktion, die bei Warnung aufgerufen wird.
    - `useDebugMode?: boolean` – Aktiviert Debug-Modus (optional).

### 2. `Warning.tsx`

- **Beschreibung:** Zeigt eine animierte Warnung bei niedrigem Batteriestand an.
- **Funktionen:**
    - Animiertes Blinken des Hintergrunds (verschiedene Geschwindigkeiten je nach Warnstufe).
    - Anzeige eines Warntextes.
- **Props:**
    - `enableAnimation: boolean` – Aktiviert/Deaktiviert die Animation.
    - `type: WarningType` – Warnstufe (`warning`, `danger`, `critical`).

### 3. `WarningTypes.ts`

- **Beschreibung:** Definiert die erlaubten Warnstufen als TypeScript-Typ.
- **Typen:**
    - `'warning'`
    - `'danger'`
    - `'critical'`

## Technische Details

- Nutzt React Contexts für WebSocket und Geräteinformationen.
- UI basiert auf Icons von FontAwesome und AntDesign.
- Animationen mit React Native Animated API.