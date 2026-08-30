# Dare Me – designförbättringsplan

Status: ⬜ ej påbörjad · 🔧 pågår · 🧪 testas · ✅ klar · ⏸ pausad

## Övergripande mål

Dare Me ska kännas som en exklusiv privatklubb och en påkostad fysisk kortlek: matt svart, varmt champagneguld, benvit text och lugna rörelser. Uttrycket ska vara vuxet, sensuellt och självsäkert utan att bli kasino, neon, plastigt eller överdekorerat.

Designen ska samtidigt vara:

- lättläst på små och stora skärmar;
- kompakt utan att kännas trång;
- tydlig även för ovana användare;
- konsekvent i spelet, lobbyn, reglerna och båda Arkitekterna;
- snabb och stabil även på enklare mobiltelefoner.

## Det som redan ska bevaras

- Den svarta och dämpat gyllene identiteten.
- Hjärtat med nyckelhålet som spelets centrala kännetecken.
- Den eleganta stora serifrubriken.
- Den centrerade och rituella känslan i presentationen.
- Den tydliga guldfyllda huvudknappen.
- De kompakta, utfällbara inställningsdelarna.
- Chilifrukterna som nivåsymboler.

## Grundprinciper

### 1. Hierarki före dekoration

Varje vy ska tydligt visa:

1. vad användaren ska göra nu;
2. vilka inställningar eller uppgifter som behövs;
3. vilka sekundära funktioner som finns.

Alla knappar, rubriker och boxar får inte ha samma visuella tyngd.

### 2. Guld ska vara en belöning

Guld används främst för:

- huvudåtgärder;
- aktiv spelare;
- vald nivå och valda alternativ;
- viktiga rubriker och tunna detaljer;
- fokusmarkeringar.

Vanlig text ska huvudsakligen vara varm benvit eller neutral varmgrå. Om allt är guld känns inget exklusivt.

### 3. Färre ramar

Innehåll grupperas i första hand med avstånd, bakgrundsnyanser och diskreta avdelare. Tydliga ramar reserveras för det aktuella spelkortet, viktiga varningar och verkligt sammanhållna funktioner.

### 4. Tyst rörelse

Animationer ska vara korta och kontrollerade. En premiumkänsla skapas med diskret toning och små förflyttningar, inte stora snurrar, kraftigt sken eller överdrivna 3D-effekter.

## Föreslaget designsystem — ⬜

### Färgpalett

- Nästan svart huvudbakgrund.
- Varm kolsvart panelyta.
- Något ljusare brungrå upphöjd yta.
- Dämpat antikguld som primär accent.
- Champagneguld som ljus markering.
- Varm benvit som primär textfärg.
- Varmgrå som sekundär textfärg.
- Dämpat mörkrött endast för varningar, destruktiva åtgärder och subtil nivå 4-markering.

Exakta färgvärden fastställs efter visuell provning på mobil och dator.

### Typografi

- Ett elegant serif-typsnitt för varumärket och större rubriker.
- Ett lättläst sans serif-typsnitt för gränssnitt och hjälptext.
- Högst två typsnitt i hela produkten.
- Versaler används endast för korta etiketter och statusrader.
- Längre rubriker och instruktioner skrivs i normal meningsform.
- En gemensam typografisk skala införs för varumärke, sidrubrik, sektionsrubrik, brödtext, formulärtext, hjälptext och status.

### Mått och material

- Ett gemensamt avståndssystem i steg om 4 eller 8 pixlar.
- Samma hörnradier för samma typer av komponenter.
- Samma linjetjocklek på jämförbara kanter.
- Breda, mjuka skuggor och mycket diskreta inre ljusreflexer.
- Fullgoda klickytor utan att knapparna visuellt behöver vara stora.

## Knappsystem — ⬜

Fyra tydliga roller införs:

### Primär

Guldfylld och reserverad för den viktigaste åtgärden, exempelvis `STARTA SPELET`, `NÄSTA KORT` och `SPARA KORTLEK`.

### Sekundär

Mörk yta med diskret guldkant, exempelvis `BYT KORT`, `HÖJ STÄMNINGEN` och `LÄGG TILL MIG`.

### Tertiär

Diskret textknapp eller mycket lätt knapp, exempelvis `Visa regler`, `Öppna Arkitekten` och `Visa favoriter`.

### Destruktiv

Neutral eller dämpat mörkröd tills användaren aktiverar den, exempelvis `NOLLSTÄLL ALLT`, `RADERA SPELARE` och `STÄNG RUMMET`.

## Arbetsordning

### Fas 1 – Gemensam designgrund — 🧪

- Inventera nuvarande färger, typstorlekar, knappar, hörnradier, skuggor och avstånd.
- Skapa gemensamma CSS-variabler för hela designsystemet.
- Fastställa typografisk skala.
- Införa knapproller utan att ändra funktionerna.
- Säkerställa läsbar kontrast.

**Klart när:** samma komponenttyp ser likadan ut överallt och inga funktioner har ändrat beteende.

Genomfört 2026-08-29:

- En gemensam `design-system.css` har skapats för Dare Me, reglerna och båda Arkitekterna.
- Färgpaletten har flyttats mot matt svart, antikguld, champagne och varm benvit.
- Gemensamma designvärden finns nu för färger, typsnitt, avstånd, hörn, skuggor, fokus och rörelse.
- Primära, sekundära och destruktiva befintliga knappar har fått tydligare visuell hierarki.
- Formulär, paneler, spelkort, spelarstatus och Arkitekternas arbetsytor delar samma materialkänsla.
- Stöd för minskade animationer har lagts till.
- Service worker-cachen har höjts till version 6 och inkluderar den gemensamma stilmallen och Truth-Arkitekten.
- Visuellt kontrollerad på desktop, 390-pixels mobilvy och extra smal 320-pixels mobilvy.
- Startsida, spellägesväljare, lobby, Dare-Arkitekt och Truth-Arkitekt laddar utan konsolfel.
- Guld, champagne och huvudtext har fått högre mättnad och kontrast efter att den första versionen upplevdes som urtvättad.
- Service worker-cachen har höjts till version 8 för att säkert byta till den senaste designen.

Återstår före ✅:

- Praktisk kontroll i Firefox, Chrome och Samsung Internet efter publicering.
- Kontroll av spelkortsvyn med verkliga spelare och ett aktivt rum.

### Fas 2 – Lobby och spelarinställningar — 🧪

- Ge deltagare, spelinställningar och gränser en tydlig ordning.
- Minska antalet synliga ramar.
- Förädla namn-, köns- och läggningsfält.
- Ge utfällda delar lugnare öppning och stängning.
- Visa sammanfattningar när delar är stängda, exempelvis `Nivå 2–3`, `6 valda` och `3 veton`.
- Göra huvudåtgärden tydlig och sekundära länkar diskretare.
- Förbättra tomstatus och felmeddelanden.

**Klart när:** en ny användare omedelbart förstår vad som ska göras och sidan känns lugn trots alla val.

Genomfört 2026-08-29:

- Stängda sektioner visar nu korta sammanfattningar av spelläge, utrustning och veton.
- Sammanfattningarna uppdateras när val ändras och när sparad eller synkad status läses in.
- Vetosammanfattningen nollställs nu direkt när en spelare har sparats eller redigeringen avbryts; föregående spelares antal ligger inte kvar visuellt.
- Utrustningsvalen är fortsatt globala för spelrundan och påverkas inte när en annan spelare skapas eller redigeras.
- Designklassen bevaras nu vid varje lokal och synkad statusuppdatering.
- Mobil lobbyn har verifierats med två lokala testspelare.
- Alla fyra Dare- och fyra Truth-kortlekar har verifierats som giltig JSON och laddas via lokal webbserver.
- `start-local.cmd` har lagts till så lokalversionen kan startas utan PowerShells skriptbehörighet och utan blockerade JSON-anrop från `file://`.

### Fas 3 – Spelkort och aktiv spelvy — 🧪

- Göra spelkortet till sidans tydliga visuella huvudperson.
- Skapa matt mörk kortyta med tunn champagnekant och kontrollerat djup.
- Tydlig men återhållsam presentation av aktiv spelare och nivå.
- Anpassa radlängd, textstorlek och radavstånd för korten.
- Samla teknisk status utan att den konkurrerar med korttexten.
- Införa en diskret kortövergång på cirka 160–220 millisekunder.

**Klart när:** uppdraget eller frågan alltid drar blicken först och kan läsas bekvämt utan onödig scrollning.

Genomfört 2026-08-29:

- Turindikatorn har fått tydligare typografisk prioritet.
- Nivåraden har tonats ned och separerats bättre från korttexten.
- Korttexten har fått kontrollerad radlängd och bättre balans på mobil.
- Favoritknappar och spelkontroller har fått tydligare primär och sekundär hierarki.
- Mobil spelvy har verifierats med två spelare och ett verkligt genererat kort.

### Fas 4 – Mobil åtgärdsrad och turordning — ⬜

- Placera turinformation och spelkort så högt som möjligt.
- Skapa en kompakt fast åtgärdsrad längst ned för de viktigaste funktionerna.
- Respektera mobilens säkra nederkant och navigeringsfält.
- Säkerställa minst cirka 44 pixlars klickytor.
- Hindra tangentbordet från att dölja eller flytta viktiga kontroller.
- Göra paus, lobby och lämna rum tydliga men sekundära.

**Klart när:** en hel normal spelrunda kan skötas på mobil utan att användaren behöver leta eller scrolla fram knappar.

### Fas 5 – Spelarlista, värd och anslutningsstatus — ⬜

- Markera värden med en liten och konsekvent symbol eller etikett.
- Ge aktiv spelare champagnefärgad kant eller motsvarande tydlig markering.
- Markera den egna profilen diskret.
- Dämpa övriga spelare utan att göra dem svårlästa.
- Visa frånkopplad, återansluter och ansluten med små statusmarkeringar.
- Undvika stora tekniska feltexter när ett kort statusmeddelande räcker.

**Klart när:** man omedelbart ser vem som är värd, vem som är aktiv och om någon tappat anslutningen.

### Fas 6 – Regler, samtycke och hjälp — ⬜

- Förbättra radlängd, mellanrum och rubrikhierarki.
- Använda benvit brödtext och guld sparsamt.
- Gruppera stopp, paus, veton, rumsspel, nivå 4 och turordning i tydliga avsnitt.
- Behålla innehållet kort och lätt att skanna.

**Klart när:** texten känns som en välformgiven liten handbok och inte som en lång vägg av information.

### Fas 7 – Dare- och Truth-Arkitekterna — ⬜

- Behålla deras kompakta arbetsverktygskaraktär.
- Ge dem samma färger, typografi och knappsystem som spelet.
- Minska onödiga ramar runt kategorier.
- Standardisera chipknapparnas höjd och tillstånd.
- Integrera sökning, skiljetecken och ångra som en sammanhållen verktygsrad.
- Ge automatiskt valda taggar en tydlig men diskret markering.
- Lägga till en levande förhandsvisning i samma kortstil som används i spelet.
- Hålla Dare- och Truth-kod och ordlistor separerade.

**Klart när:** Arkitekterna känns som professionella studior som tillhör samma produktfamilj som spelet.

### Fas 8 – Nivåernas visuella stegring — ⬜

- Behålla chilifrukterna.
- Nivå 1 får en mycket subtil champagneaccent.
- Nivå 2 får en varmare guldaccent.
- Nivå 3 får en kopparguldsaccent.
- Nivå 4 får en återhållsam kombination av mörkt crimson och guld.
- Färgskillnaden används endast i små detaljer och förändrar inte hela sidans tema.

**Klart när:** nivån känns visuellt utan att produkten ser ut som fyra olika appar.

### Fas 9 – Mikrointeraktioner och slutputs — ⬜

- Diskret nedtryckt känsla på knappar.
- Mjuk öppning och stängning av paneler.
- Enhetlig laddningsindikator.
- Tydliga fokusmarkeringar för tangentbordsanvändning.
- Stöd för `prefers-reduced-motion`.
- Eventuell lätt haptik vid kortdragning i installerad mobilapp.
- Eventuellt diskret och valfritt ljud, avstängt som standard.

**Klart när:** gränssnittet känns responsivt och polerat utan att animationerna märks mer än innehållet.

## Särskilda riktlinjer för Arkitekterna

- Täta ordpaletter är avsiktliga och ska inte fyllas med stora tomrum.
- Kategorier ska organiseras med rubriker och jämna mellanrum, inte tunga boxar.
- Omarkerade ord är neutrala.
- Senast valda ord kan få en kort champagnefärgad markering.
- Valda taggar måste vara tydliga men inte dominera arbetsytan.
- Skrivytan ska vara lättillgänglig även vid lång scrollning.
- Filfunktioner ska vara kompakta, samlade och begripliga för ovana användare.

## Sådant som ska undvikas

- Guld på nästan all text.
- Guldram runt varje box.
- Kraftigt sken runt alla knappar.
- Glassmorphism på alla paneler.
- Kasino-, neon- eller spelautomatstil.
- Stora 3D-animationer.
- Dekorativa typsnitt i brödtext.
- För många visuellt likvärdiga huvudknappar.
- Olika visuell identitet på mobil och dator.
- Designändringar som samtidigt ändrar spellogik.

## Testkrav för varje fas

Varje fas granskas innan nästa påbörjas på:

- vanlig laptop eller datorskärm;
- liten mobilskärm;
- större mobilskärm;
- Firefox;
- Chrome;
- Samsung Internet när mobilbeteendet berörs;
- lokalt spel;
- värd i rum;
- gäst i rum.

Kontrolleras särskilt:

- läsbarhet och kontrast;
- scrollmängd;
- tangentbordets påverkan;
- klickytor;
- avklippt eller överlappande innehåll;
- anslutnings- och rollbeteende;
- att inga befintliga funktioner försvinner.

## Slutmål

Dare Me ska upplevas som en sammanhållen premiumprodukt där varje vy känns avsiktligt formgiven. Användaren ska mötas av ett lugnt, vuxet och självsäkert gränssnitt där spelets innehåll står i centrum och guldet används sparsamt nog för att fortfarande kännas värdefullt.
