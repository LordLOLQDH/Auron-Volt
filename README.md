# Auron Vault

Auron Vault ist ein lokaler Passwort-Tresor für iPhone und moderne Browser.

Das Projekt ist bewusst **local-first** aufgebaut: Die eigentlichen Tresordaten sollen nicht auf einem Auron-Server gespeichert werden.

## Aktueller Stand

Die aktuelle Version enthält:

- Master-Passwort zum Entsperren
- lokale Speicherung über IndexedDB
- AES-256-GCM für den verschlüsselten Tresor
- PBKDF2-SHA-256 mit 600.000 Iterationen zur Schlüsselableitung
- zufälligen Salt pro Tresor
- zufällige Nonce/IV bei der Verschlüsselung
- Passwort-Einträge
- Suche
- Bearbeiten
- sicheren Passwortgenerator über die Web-Crypto-API
- manuelles Sperren des Tresors
- vollständiges Löschen des lokalen Tresors über eine separate Notfallfunktion

## Geplante Sicherheitsfunktionen

Auron Vault wird schrittweise um zusätzliche Sicherheitsmechanismen erweitert.

Geplant sind unter anderem:

- Argon2id statt PBKDF2
- separate Sicherheits-PIN
- Profilname
- eindeutiger Codename im Format N7-X4-X9-21
- manuelle Codename-Eingabe mit Formatprüfung
- automatische Codename-Generierung
- Recovery Key
- Gerätebindung
- automatische Sperre bei Inaktivität
- stärkere Schlüsselhierarchie
- sichere verschlüsselte Backups und Wiederherstellung
- zusätzliche Sicherheitsbestätigungen für kritische Aktionen
- weitere Schutzmaßnahmen gegen Manipulation und XSS

Diese Funktionen werden nicht nur optisch ergänzt, sondern sollen technisch umgesetzt und getestet werden.

## Notfall-Löschung

Auron Vault besitzt eine bewusst auffällige **ALLES LÖSCHEN**-Funktion.

Sie ist für Notfälle oder zum vollständigen Schließen eines Profils gedacht.

Eine bestätigte Löschung entfernt den lokalen Auron-Vault-Speicher dieses Browsers, einschließlich:

- Profil/Tresor
- gespeicherter Passwort-Einträge
- verschlüsselter Tresordaten
- lokaler Einstellungen des Tresors

Die Aktion ist **nicht rückgängig zu machen**.

Vor der Löschung wird deshalb eine deutliche Warnung angezeigt und eine zusätzliche Bestätigung verlangt.

Wichtig: Diese Funktion löscht nur die lokalen Daten, die Auron Vault selbst im Browser gespeichert hat. Sie löscht keine Daten aus anderen Apps, Websites, iCloud, dem iPhone oder externen Backups.

## Datenschutz

Auron Vault soll ohne einen eigenen Passwort-Server auskommen.

Es werden keine Passwörter an Auron gesendet.

Es werden keine Analytics oder unnötigen Drittanbieter-Dienste benötigt.

## GitHub Pages

GitHub Pages kann die statische Web-App aus diesem Repository bereitstellen:

Settings → Pages → Deploy from a branch → main → / (root) → Save

Danach kann die Seite in Safari geöffnet und über Teilen → Zum Home-Bildschirm als Web-App hinzugefügt werden.

## Wichtiger Sicherheitshinweis

Auron Vault befindet sich in aktiver Entwicklung.

Die aktuelle Version ist **nicht als professionell geprüfter Passwort-Manager einzustufen**. Vor der Verwendung mit wirklich kritischen Passwörtern sollte eine unabhängige Sicherheitsprüfung erfolgen.

Ein vergessenes Master-Passwort kann in der aktuellen Architektur nicht wiederhergestellt werden.

Auron Vault – local-first password security.
