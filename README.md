# GIF Gallery - Minimalistic & Responsive

Eine elegante, responsive Webseite zur Darstellung animierter GIFs in einem modularen Rasterlayout.

## 🎯 Features

### Desktop (> 768px)

- **Responsive CSS-Grid Layout** mit bis zu 6 Feldern
- **Mehrere GIFs pro Feld** mit Pfeil-Navigation (< / >)
- **Punkt-Indikatoren** für direkten Zugang zu spezifischen GIFs
- **Auto-Cycle Funktion** (alle 5 Sekunden, pausiert bei Hover)
- **Smooth Hover-Effekte** und sanfte Übergänge

### Mobile (≤ 768px)

- **Großer Einzelcontainer** für optimale Sichtbarkeit
- **Touch/Swipe Navigation** für intuitive Bedienung
- **Tap-to-Fullscreen** Modal-Ansicht
- **Button- und Indikator-Navigation** als Alternative
- **Performance-optimiert** für mobile Geräte

### Allgemein

- **Keine Backend-Abhängigkeiten** - rein statische Lösung
- **Modular erweiterbar** - einfaches Hinzufügen neuer GIFs
- **Lazy Loading** für bessere Performance
- **Keyboard Navigation** (Pfeiltasten, ESC)
- **Minimalistisches Design** inspiriert von Apple/Muji

## 📁 Struktur

```
Gif_Page/
├── index.html          # Hauptdatei mit HTML-Struktur
├── style.css           # Responsive CSS-Styling
├── script.js           # JavaScript-Funktionalität
├── README.md           # Diese Dokumentation
└── assets/
    └── gifs/           # Ordner für GIF-Dateien
```

## 🚀 Installation & Verwendung

1. **Repository klonen/herunterladen**
2. **GIFs hinzufügen**: Laden Sie Ihre GIF-Dateien in den `assets/gifs/` Ordner
3. **GIF-Pfade anpassen**:
   - Öffnen Sie `index.html`
   - Ersetzen Sie die Platzhalter-URLs mit Ihren lokalen GIF-Pfaden
   - Alternativ: Nutzen Sie die `GIF_CONFIG` in `script.js`
4. **Starten**: Öffnen Sie `index.html` in einem Browser

### Beispiel für lokale GIF-Integration:

```html
<!-- Ersetzen Sie die via.placeholder.com URLs mit: -->
<img class="gif-image active" src="assets/gifs/mein-gif.gif" alt="Mein GIF" />
```

## ⚙️ Konfiguration

### GIFs über JavaScript-Config hinzufügen:

```javascript
// In script.js - GIF_CONFIG Object anpassen
const GIF_CONFIG = {
  desktop: [
    {
      cell: 0,
      gifs: [
        { src: "assets/gifs/gif1.gif", alt: "GIF 1" },
        { src: "assets/gifs/gif2.gif", alt: "GIF 2" },
      ],
    },
  ],
  mobile: [{ src: "assets/gifs/mobile1.gif", alt: "Mobile GIF 1" }],
};
```

### Programmatisch GIFs hinzufügen:

```javascript
// Nach dem Laden der Seite:
window.gifGallery.addGif("assets/gifs/neues-gif.gif", "Neues GIF");
```

## 🎨 Design-Anpassungen

### CSS-Variablen (in style.css anpassen):

```css
/* Farben */
--primary-color: #2c3e50;
--background-color: #f8f9fa;
--card-background: white;

/* Grid-Layout */
--desktop-columns: 3;
--mobile-height: 400px;
--border-radius: 12px;
```

### Responsive Breakpoints:

- **Desktop**: > 768px (CSS Grid)
- **Tablet**: 769px - 1024px (2 Spalten)
- **Mobile**: ≤ 768px (Single Container)
- **Small Mobile**: ≤ 480px (Kompakt)

## 🔧 Erweiterte Features

### Auto-Cycle Konfiguration:

```javascript
// In setupDesktopGrid() - Interval anpassen:
setInterval(() => {
  // Auto-switch alle 5000ms (5 Sekunden)
}, 5000);
```

### Touch-Sensitivity anpassen:

```javascript
// In handleSwipe() - Threshold anpassen:
const swipeThreshold = 50; // Pixel für Swipe-Erkennung
```

## 📱 Browser-Kompatibilität

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (alle aktuellen Versionen)
- **CSS Grid Support**: IE11+ (mit Fallbacks)
- **Touch Events**: Alle modernen Mobile Browser
- **Backdrop Filter**: Moderne Browser (Safari, Chrome 76+, Firefox 103+)

## 🎯 Performance-Tipps

1. **GIF-Optimierung**: Verwenden Sie komprimierte GIFs (< 2MB empfohlen)
2. **Lazy Loading**: Bereits implementiert für bessere Ladezeiten
3. **Preloading**: Automatisches Vorladen aller Bilder
4. **Responsive Images**: Nutzen Sie verschiedene Größen für Mobile/Desktop

## 🎪 Demo-URLs

Die aktuelle Version nutzt Platzhalter-Bilder von placeholder.com. Für die Produktion ersetzen Sie diese durch Ihre eigenen GIFs.

## 📄 Lizenz

Freie Nutzung für private und kommerzielle Projekte.

## 🤝 Beitragen

Pull Requests und Issues sind willkommen!

---

**Entwickelt für maximale Eleganz und Funktionalität** ✨
