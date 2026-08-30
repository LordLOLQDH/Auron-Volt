# Auron Vault

Lokaler, verschlüsselter Passwort-Tresor als PWA für iPhone.

- Keine Cloud-Datenbank
- Keine Accounts oder Analytics
- Tresor lokal in IndexedDB
- AES-256-GCM
- PBKDF2-SHA-256 mit 600.000 Iterationen
- Master-Passwort wird nicht gespeichert
- Passwortgenerator, Suche, Bearbeiten und Kopieren

## GitHub Pages
Settings → Pages → Deploy from a branch → main → / (root) → Save.

Danach in Safari öffnen und Teilen → Zum Home-Bildschirm.

## Sicherheit
Frühe technische Version. Vor produktiver Nutzung mit wichtigen Passwörtern ist eine unabhängige Sicherheitsprüfung erforderlich. Ein vergessenes Master-Passwort kann nicht wiederhergestellt werden.
