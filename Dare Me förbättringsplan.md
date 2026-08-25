# Dare Me – förbättringsplan

Arbetsdokument för förbättringar som vi går igenom punkt för punkt.

Status: ⬜ ej påbörjad · 🔧 pågår · ✅ klar · 🧪 testas · 💬 diskuteras

## 1. Favoriter och kort­historik — 🧪 testas

### Målet

- Spelaren ska kunna spara ett bra kort privat på sin egen enhet som referens eller framtida egen kortlek.
- Spelaren ska kunna se de senast spelade korten.
- Samma kort ska inte upprepas under en pågående runda.
- Favoriter ska överleva byte av roll och nollställning av speldata.
- Favoriter ska inte synkas till andra spelare eller Firebase.

### Första versionen

- Knappen **Spara kort** finns under det aktuella kortet.
- Knappen ändras till **Sparat kort** när kortet redan finns bland favoriterna.
- Varje favorit ska kunna tas bort direkt från listan.
- **Favoriter & historik** kan öppnas från lobby och spelsida.
- Senaste 50 spelade kort sparas i historiken.
- Högst 100 favoriter sparas lokalt.

### Kvar att testa

- Spara och ta bort favorit på dator.
- Spara och ta bort favorit på mobil.
- Kontrollera att favoriter finns kvar efter omladdning.
- Kontrollera att favoriter finns kvar efter “Nollställ allt / Byt roll”.
- Kontrollera att historiken nollställs när ett nytt spel startas.

## 2. Egna kortlekar, import och export — 🔧 pågår

### Kortleksarkitekt — ✅ klar/testas

Arkitekten finns online på [`architect.html`](https://dare-me.madebylexi.se/architect.html) och är mobilanpassad.

- Skapa kort med ordknappar, platshållare och veto-taggar.
- Flytande textbox och snabbknapp för tangentbord.
- Lägg till, redigera och ta bort valfria kort.
- Dubblettvarning och kort-räknare.
- Kompakt mobil-layout med knappkluster.
- Spara kortlek som fil på enheten.
- Öppna en tidigare sparad kortlek från fil.
- Kopiera kort­rader eller hela kortleken som giltig JSON.

### Genomfört i spelet

- Värden kan nu lägga till en eller flera egna kortlekar i lobbyn.
- Egna kortlekar visas som egna val bland nivåerna och kan väljas eller avmarkeras separat.
- I rumsläge synkas värdens valda egna kortlekar till gästerna tillsammans med övriga spelinställningar.
- Originalnivåerna ligger kvar oförändrade.

### Att testa

- Öppna en kortlek som skapats i arkitekten och välj den i ett lokalt spel.
- Testa samma sak i ett rum med minst en gäst på en annan enhet.
- Lägg till två olika kortlekar och kontrollera att båda kan väljas oberoende av varandra.
- Kontrollera att veto-taggar på egna kort filtreras på samma sätt som originalkort.

## 3. Fler spellägen — ⬜ ej påbörjad

Möjliga lägen: Sanning, Het stol, Snurra/flaska, Aldrig har jag och slumpmässig utmaning.

## 4. Tillgängliga saker och miljöfilter — ⬜ ej påbörjad

Värden ska kunna ange vilka saker och typer av kort som finns eller inte finns i rummet.

## 5. Poäng, statistik och dagliga utmaningar — ⬜ ej påbörjad

Möjliga funktioner: poäng, rundstatistik, enkla belöningar och ett dagligt kort.

## 6. Egna konsekvenser och regler — ⬜ ej påbörjad

Värden ska kunna lägga till egna regler eller konsekvenser för en spelrunda.

## Senare idéer

- Långdistansläge.
- Privata meddelanden eller reaktioner.
- Röst- och bildutmaningar, efter separat integritetsbedömning.

