# WebSocketContext-Modul

Das `WebSocketContext`-Modul stellt einen React Context für die Verwaltung und Nutzung einer WebSocket-Verbindung bereit. Es ermöglicht globalen Zugriff auf die WebSocket-Instanz, Verbindungsmanagement und das Hinzufügen/Entfernen von Listenern für eingehende Nachrichten.

## Enthaltene Komponenten & Funktionen

### 1. `WebSocketProvider`
- **Beschreibung:** Context-Provider, der die WebSocket-Verbindung und zugehörige Methoden bereitstellt.
- **Funktionen:**
  - Aufbau und Trennung der WebSocket-Verbindung (`connect`, `disconnect`).
  - Verwaltung des Verbindungsstatus (`isConnected`).
  - Verwaltung der WebSocket-Instanz (`socket`).
  - Hinzufügen und Entfernen von Listenern für eingehende Nachrichten (`addMessageListener`, `removeMessageListener`).
  - Automatisches Entfernen aller Listener und Rücksetzen des Status bei Verbindungsabbruch.

### 2. `useWebSocket`
- **Beschreibung:** Custom Hook für den Zugriff auf den WebSocket Context.
- **Funktionen:**
  - Gibt alle Methoden und den Status des Contexts zurück.
  - Wirft einen Fehler, falls der Hook außerhalb des Providers verwendet wird.

## Technische Details

- Listener werden in einem Set verwaltet und bei jeder eingehenden Nachricht aufgerufen.
- Fehler- und Timeout-Handling beim Verbindungsaufbau.
- Automatisches Aufräumen bei Verbindungsabbruch.
