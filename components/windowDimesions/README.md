# DeviceTypeContext-Modul

Das `windowDimesions`-Modul stellt einen React Context bereit, um zwischen Tablet- und Smartphone-Layout zu unterscheiden. Es erkennt automatisch den Gerätetyp und ermöglicht so eine responsive Anpassung der UI in der gesamten App.

## Enthaltene Komponenten & Dateien

### 1. `DeviceTypeContext.tsx`
- **Beschreibung:** Context-Provider und Hook zur Erkennung des Gerätetyps (Tablet oder Phone).
- **Funktionen:**
  - Erkennt beim Start, ob das Gerät ein Tablet oder ein Smartphone ist (mittels `expo-device`).
  - Stellt die Werte `isTablet` und `isPhone` im Context bereit.
  - Ermöglicht allen Kind-Komponenten, den Gerätetyp per Hook (`useDeviceType`) abzufragen.
  - Aktualisiert den Gerätetyp automatisch beim ersten Rendern.

- **Typen:**
  - `DeviceType`: Objekt mit den Feldern `isTablet: boolean` und `isPhone: boolean`.