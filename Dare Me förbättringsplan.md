# Dare Me – förbättringsplan

Arbetsdokument för förbättringar som vi går igenom punkt för punkt.

Status: ⬜ ej påbörjad · 🔧 pågår · ✅ klar · 🧪 testas · 💬 diskuteras

## 1. Favoriter och kort­historik — ✅ klar/testas

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
- Senaste 15 spelade kort sparas i historiken.
- Högst 100 favoriter sparas lokalt.
- Historiken kapas automatiskt till 15 kort även om äldre data redan finns sparad.

### Kvar att testa

- Spara och ta bort favorit på dator.
- Spara och ta bort favorit på mobil.
- Kontrollera att favoriter finns kvar efter omladdning.
- Kontrollera att favoriter finns kvar efter “Nollställ allt / Byt roll”.
- Kontrollera att historiken nollställs när ett nytt spel startas.

## 2. Egna kortlekar, import och export — 🧪 testas

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
- Skicka upp en färdig kortlek direkt från Arkitekten till spelskaparen.
- Kortleken skickas som en privat inskickning till Firebase.

### Genomfört i spelet

- Värden kan nu lägga till en eller flera egna kortlekar i lobbyn.
- Egna kortlekar visas som egna val bland nivåerna och kan väljas eller avmarkeras separat.
- I rumsläge synkas värdens valda egna kortlekar till gästerna tillsammans med övriga spelinställningar.
- Originalnivåerna ligger kvar oförändrade.
- Värden kan dela sina egna kortlekar med gästerna.
- Gäster kan spara delade kortlekar som Dare Me - [kortlekens namn].json.
- Gästen kan lämna rummet utan att värdens egna kortlekar följer med till singelspel.

### Inskick och granskning — ✅ klar/testas

- Uppladdning sker endast från Arkitekten, där kortleken skapats.
- En kort förklaring visas vid knappen Skicka upp till spelskaparen.
- Inskick sparas i den privata Firestore-samlingen guestDeckSubmissions.
- Endast wolfsphoto.tk@gmail.com får läsa, ändra eller radera inskick.
- Publik adminvy finns på [deckadmin.html](https://dare-me.madebylexi.se/deckadmin.html).
- Adminvyn visar korten radvis med text och tags i stället för hela JSON-wrappern.
- Admin kan läsa, kopiera JSON, ladda ner, markera som granskad och radera.

### Att testa

- Öppna en kortlek som skapats i arkitekten och välj den i ett lokalt spel.
- Testa samma sak i ett rum med minst en gäst på en annan enhet.
- Lägg till två olika kortlekar och kontrollera att båda kan väljas oberoende av varandra.
- Kontrollera att veto-taggar på egna kort filtreras på samma sätt som originalkort.
- Skicka in en kortlek från Arkitekten och kontrollera att den visas i adminvyn.
- Testa inloggning från deckadmin.html på dator och mobil.
- Kontrollera att en annan Google-användare inte kan läsa inskickningarna.

## 3. Tillgängliga saker och miljöfilter — ✅ klar/testas

Värden kan ange vilken konkret utrustning som finns i rummet. Kort som kräver utrustning som saknas filtreras bort.

- Utrustningstaggarna är separerade från veto-taggarna.
- JSON-taggarna är på engelska medan gränssnittet visas på svenska.
- Utrustning kan markeras i Arkitekten och i värdens lobby.
- Ordknappar för utrustning märker kortet automatiskt.
- Analplugg, expanderande plugg, analkulor och analprob markerar även `anal` och `penetration`.
- Handbojor, ankelbojor och rep markerar även `bondage`.
- Impact-redskap markerar `impact_play`.
- Specifika dildo-typer markerar inte felaktigt vanlig `dildo`.
- Gemensamma taggar skrivs inte längre över av senare automatikregler.
- Listorna är alfabetiskt sorterade i spelet och Arkitekten.

### Att testa

- Välj endast ett fåtal redskap och kontrollera att övriga utrustningskort filtreras bort.
- Kontrollera både lokalt spel och rum med flera enheter.
- Skapa egna kort i Arkitekten och kontrollera automatisk och manuell utrustningstaggning.

## 4. Fler spellägen — 🧪 testas

### Truth or Dare

- Värden kan välja **Dare Me**, **Truth** eller **Truth or Dare**.
- I blandläget väljer den aktiva spelaren **TRUTH**, **DARE** eller **SLUMPA** inför varje kort.
- Minst en Truth-nivå och en Dare-nivå måste väljas för blandläget.
- Truth har fyra separata nivåer med 80 frågor per nivå.
- Flera valda Truth-nivåer blandas under spelet.
- Könsberoende Truth-frågor kan filtreras efter den aktiva spelarens kön och läggning.
- Truth nivå 3 och 4 har genomgått en separat språkgranskning.

### Kvar att bygga och testa

- Separata Truth-veton för exempelvis personliga frågor, fantasier, gruppfrågor och erfarenheter.
- Testa alla tre spellägen lokalt och i rum med flera enheter.
- Kontrollera nivåval, turordning, historik och slumpning med flera valda Truth-nivåer.
- Bygg stöd för Truth-kort i Arkitekten.
- Möjliga framtida lägen: Het stol, Snurra/flaska och Aldrig har jag.

## 5. Poäng, statistik och dagliga utmaningar — ⬜ ej påbörjad

Möjliga funktioner: poäng, rundstatistik, enkla belöningar och ett dagligt kort.

## 6. Egna konsekvenser och regler — ⬜ ej påbörjad

Värden ska kunna lägga till egna regler eller konsekvenser för en spelrunda.

## 7. Spelflöde och stabilitet — ✅ klar/testas

- Lokalt spel med minst två spelare startar utan krav på Firebase-synkning.
- Spelarredigering tar inte längre bort spelaren innan ändringen sparas.
- Det går att byta mellan olika spelare i redigeringsläget utan att någon försvinner.
- Redigering har tydliga knappar för **SPARA ÄNDRING** och **AVBRYT REDIGERING**.

### Kvar att testa

- Två spelare i lokalt läge på riktig mobil.
- Redigera flera spelare efter varandra på mobil och dator.
- Starta rumsläge och kontrollera att samma redigeringsflöde fungerar för värden.

## Visuell finputsning — 🧪 testas

### Senaste genomförda finputsning

- Knapparna i Arkitekten har tätats på mobil och dator.
- `MARKERA ALLT` och `RENSA VAL` i utrustningsdelen har gjorts kompaktare.
- Kortmotorn har fått fortsatt grammatikkontroll och korrigerade taggar.
- Nivå 4 har rensats från flera upprepade eller obegripliga kort.

- Lobbyn använder nu en bredare och kompaktare layout på dator.
- Profil, spelinställningar och veton är tydligare grupperade.
- Långa inställningsdelar kan fällas ihop för mindre scrollning.
- Spelvyn har en tydligare statusrad, kortyta och knapphierarki.
- Dare Me, Arkitekten och regelsidan använder samma svart-guld-formspråk.
- Arkitekten har mindre toppbild, konsekventa knappar och sökning bland ord och utrustning.
- Regelsidan har en fast genvägsrad till de viktigaste avsnitten.

### Att testa

- Laptop i Firefox.
- Mobil i Firefox, Chrome och Samsung Internet.
- Liten mobilskärm med nivå 4-varningen öppen.
- Tangentbord öppet i lobby och Arkitekten.

## Senare idéer

- Långdistansläge.
- Privata meddelanden eller reaktioner.
- Röst- och bildutmaningar, efter separat integritetsbedömning.
