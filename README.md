# Pokédex - Angular

Eine interaktive Pokédex-Anwendung, die mit **Angular 19** entwickelt wurde. Die Anwendung ermöglicht es Benutzern, Pokémon zu durchsuchen, detaillierte Informationen zu betrachten und ihre Evolutionsketten zu entdecken.

## 🎯 Funktionalität

Die Pokédex-Anwendung bietet folgende Features:

- **Pokémon Durchsuchen**: Durchsuche nach Pokémon nach Namen mithilfe der Suchleiste
- **Pokémon Anzeigen**: Zeige Pokémon-Karten mit grundlegenden Informationen an
- **Detailansicht**: Klicke auf eine Pokémon-Karte, um detaillierte Informationen in einem Overlay anzuzeigen
- **Evolutionsketten**: Entdecke die Evolutionsketten von Pokémon
- **Live-Daten**: Alle Daten werden von der [PokéAPI](https://pokeapi.co/) abgerufen
- **Responsive Design**: Optimiert für Desktop und mobile Geräte

## 🚀 Projektstart

### Anforderungen

Stelle sicher, dass folgende Programme installiert sind:
- **Node.js** (Version 18+ empfohlen)
- **npm** oder **yarn**

### Installation

Klone das Repository und installiere die Abhängigkeiten:

```bash
git clone <repository-url>
cd PokeDex---Angular
npm install
```

### Entwicklungsserver starten

Starte den Entwicklungsserver mit folgendem Befehl:

```bash
npm start
```

oder alternativ:

```bash
ng serve
```

Öffne dann deinen Browser und navigiere zu:
```
http://localhost:4200/
```

Die Anwendung wird automatisch neu geladen, wenn du Quelldateien änderst.

## 📁 Projektstruktur

```
src/
├── app/
│   ├── components/
│   │   ├── poke-card/              # Hauptkomponente für Pokémon-Kartenliste
│   │   ├── pokemon-overlay/        # Detailansicht für Pokémon-Informationen
│   │   └── loading-spinner/        # Ladeindikator-Komponente
│   ├── services/
│   │   └── poke-api.service.ts     # Service für API-Anfragen an PokéAPI
│   ├── interfaces/
│   │   ├── pokemon.interface.ts    # Schnittstelle für Pokémon-Daten
│   │   └── pokemon_evolutions.interface.ts  # Schnittstelle für Evolutionsdaten
│   ├── app.component.ts            # Haupt-App-Komponente mit Suchfunktion
│   └── app.config.ts               # Anwendungskonfiguration
├── assets/                         # Statische Ressourcen und Icons
└── styles.scss                     # Globale Styles
```

## 🛠️ Verfügbare NPM-Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm start` | Startet den Entwicklungsserver |
| `npm run build` | Erstellt einen produktiven Build |
| `npm run watch` | Build im Watch-Modus (für Entwicklung) |
| `npm test` | Führt Unit-Tests mit Karma aus |

## 🏗️ Build für Produktion

Um das Projekt für die Produktion zu bauen:

```bash
npm run build
```

Die kompilierten Dateien werden im `dist/`-Verzeichnis gespeichert. Der Build ist optimiert für Leistung und Geschwindigkeit.

## 🧪 Testen

Führe die Unit-Tests aus:

```bash
npm test
```

Dies startet den Karma Test Runner und führt alle Tests aus.

## 📚 Verwendete Technologien

- **Angular 19** - Framework für die Benutzeroberflächenentwicklung
- **TypeScript** - Typsichere Programmiersprache
- **SCSS** - Stilsheets für Responsive Design
- **RxJS** - Reactive Programming Library
- **HttpClient** - Für API-Anfragen
- **PokéAPI** - Öffentliche API mit Pokémon-Daten

## 📖 Weitere Ressourcen

- [Angular Dokumentation](https://angular.dev)
- [Angular CLI Dokumentation](https://angular.dev/tools/cli)
- [PokéAPI Dokumentation](https://pokeapi.co/docs/v2)

## 📝 Lizenz

Dieses Projekt ist Teil eines persönlichen Lernprojekts.
