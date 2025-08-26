# Video-Modul

Das `Video`-Modul stellt eine Komponente zur Anzeige eines MJPEG-Videostreams bereit, der typischerweise vom Roboter geliefert wird. Die Komponente bettet den Stream in eine WebView ein.

## Enthaltene Komponente

### 1. `Video.tsx`
- **Beschreibung:** Zeigt einen MJPEG-Videostream in einer WebView an.
- **Funktionen:**
  - Baut die Stream-URL aus Adresse, Port und optionalem Routen-Parameter zusammen (Standard: `/video_feed`).
  - Generiert ein minimales HTML, das das MJPEG-Video als `<img>` einbettet.

- **Props:**
  - `address: string` – IP-Adresse oder Host des Videostream-Servers.
  - `port: number` – Port des Videostream-Servers.
  - `route?: string` – Optionaler Pfad zum Stream (Standard: `/video_feed`).

## Technische Details

- Nutzt `react-native-webview` zur Anzeige des Streams.
- Das Video wird als `<img>` in HTML eingebettet, um MJPEG-Streams zu unterstützen.