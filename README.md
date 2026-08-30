# Dare Me – ren arbetsversion

Det här är en separat arbetsversion baserad på `Dare Me FINAL`.

## Innehåll

- `index.html` – själva spelet
- `rules.html` – regler
- `level1.json`–`level4.json` – kort och nivåer (fler nivåer kan läggas till)
- `dareme.png` – logotyp

Originalversionen är inte ändrad. Den här mappen används för fortsatt utveckling.

## Första förbättringar

- Spelarnamn och korttext skyddas innan de renderas som HTML.
- Analytics får inte längre stoppa spelet om tjänsten saknas.
- Nivåfilerna är validerade som giltig JSON.

Nya nivåer läggs till som `level5.json`, `level6.json` och så vidare. Spelet söker efter nivå 1–20.

## Lokal körning

Kör `start-local.ps1` och öppna sedan http://localhost:8765. JSON-nivåerna fungerar inte korrekt om `index.html` öppnas direkt som `file://`.

## Publicera Firestore-regler

Firebase CLI måste vara installerat och inloggat. Kör följande i denna mapp:

```powershell
firebase deploy --only firestore:rules
```

Reglerna publiceras till projektet `dare-me-1c264` enligt `.firebaserc`.

## Nästa steg

1. Dela upp JavaScript och CSS i separata filer.
2. Flytta Firebase-konfiguration och behörighetslogik till en tydligare modul.
3. Förbättra Firestore-reglerna och synkroniseringen av rum.
4. Förbättra kortens slumpning och historik.
