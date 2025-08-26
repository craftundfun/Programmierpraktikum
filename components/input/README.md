# InputFields-Modul

Das `InputFields`-Modul stellt wiederverwendbare Eingabefelder für Adressen und Ports bereit. Diese Komponenten werden vor allem für die Eingabe von Roboter-IP-Adressen und Ports in der Verbindungsverwaltung verwendet.

## Enthaltene Komponenten

### 1. `AddressField`
- **Beschreibung:** Textfeld zur Eingabe einer IP-Adresse oder Host-Adresse.
- **Funktionen:**
  - Zeigt einen Platzhaltertext an (Standard: „Enter Address“).
  - Übergibt den aktuellen Wert und eine Setter-Funktion als Props.
  - Optional: Validierungsfunktion (`checkValue`), die bei jeder Änderung aufgerufen wird.

- **Props:**
  - `placeholder?: string` – Platzhaltertext (optional).
  - `value: string` – Aktueller Wert des Feldes.
  - `setValue: (value: string) => void` – Setter für den Wert.
  - `checkValue?: (value: string) => void` – Optionale Validierungsfunktion.

### 2. `PortField`
- **Beschreibung:** Textfeld zur Eingabe eines Ports (nur numerisch).
- **Funktionen:**
  - Zeigt einen Platzhaltertext an (Standard: „Enter port (default: 9090)“).
  - Übergibt den aktuellen Wert und eine Setter-Funktion als Props.
  - Optional: Validierungsfunktion (`checkValue`), die bei jeder Änderung aufgerufen wird.
  - Tastatur ist auf numerische Eingabe eingestellt.

- **Props:**
  - `placeholder?: string` – Platzhaltertext (optional).
  - `value: string` – Aktueller Wert des Feldes.
  - `setValue: (value: string) => void` – Setter für den Wert.
  - `checkValue?: (value: string) => void` – Optionale Validierungsfunktion.

## Technische Details

- Nutzt React Native `TextInput` für die Eingabefelder.
- Die Komponenten sind für die Wiederverwendung in verschiedenen Modulen ausgelegt.