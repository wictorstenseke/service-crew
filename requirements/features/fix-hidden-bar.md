# Problem: Innehåll döljs bakom en tom rad när ett webb-bokmärke öppnas som app på iPad

### Vad användaren upplever

När en webbplats sparas som bokmärke på iPad och öppnas via **“Lägg till på hemskärmen”** körs den utan Safari-gränssnittet (så kallat **app-läge** eller PWA/standalone-läge). På vissa webbappar visas då en tom rad eller ett vitt fält längst ned; innehåll och knappar hamnar under detta fält och blir otillgängliga.

### Varför det händer

* **Dold safe-area**. I iOS och iPadOS reserveras områden vid skärmens kanter för statusfältet, hemindikatorn eller kamerautskärningar. I Safari lägger webbläsaren automatiskt till marginaler för dessa områden när man scroller. När en sida körs i app-läge räknas dessa marginaler inte in i `100vh` eller `height:100%`, vilket ger en tom rad i botten [oai_citation:0‡developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env).
* **Fixerad höjd med `100vh`**. Höjden `100vh` räknas i iOS Safari enligt “största möjliga viewport” och tar inte hänsyn till den dynamiska bottom baren. Ett element som sätts till `100vh` kan därför hamna bakom Safari-ensidans bottenfält [oai_citation:1‡dev-tips.com](https://dev-tips.com/css/overlapping-bottom-navigation-bar-despite-100vh-in-ios-safari).

### Lösningar

1. **Lägg till rätt meta-taggar**

   För att webbappen ska få fullskärmsläge och tillgång till hela skärmen ska följande taggar läggas in i `<head>`:

   ```html
   <!-- Ger rätt bredd och tillåter att appen fyller hela skärmen, även under notcher -->
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

   <!-- Tillåter helskärm (ingen Safari-chrome) när sidan startas från hemskärmen -->
   <meta name="apple-mobile-web-app-capable" content="yes">

   <!-- Valfritt: styr statusfältets färg, t.ex. svart transluscent -->
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
   ```

   Metataggen `viewport-fit=cover` låter innehållet sträcka sig under notcher och den virtuella hemknappen [oai_citation:2‡johan.im](https://johan.im/writings/ios-homescreen-web-app/).

2. **Kompensera för safe-area med CSS**

   För att säkerställa att innehållet inte hamnar under hemindikatorn, använd iOS-specifika miljövariabler:

   * `env(safe-area-inset-top)`, `env(safe-area-inset-right)`, `env(safe-area-inset-bottom)` och `env(safe-area-inset-left)` ger avståndet till respektive kant [oai_citation:3‡developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env).
   * Dessa används för att lägga till dynamiska marginaler eller paddings. Dev-community-artikeln visar ett exempel där `html` får extra höjd och padding: `min-height: calc(100% + env(safe-area-inset-top));` och `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` [oai_citation:4‡dev.to](https://dev.to/karmasakshi/make-your-pwas-look-handsome-on-ios-1o08).
   * Philip Heltweg beskriver att man kan lägga en säkerhetsmarginal på `body`: `padding: env(safe-area-inset-top, 0 px) env(safe-area-inset-right, 0 px) env(safe-area-inset-bottom, 0 px) env(safe-area-inset-left, 0 px)` [oai_citation:5‡heltweg.org](https://www.heltweg.org/posts/checklist-issues-progressive-web-apps-how-to-fix/). Detta gör att innehållet aldrig hamnar under systemfältet.

   **Exempel:**

   ```css
   html {
     /* se till att dokumentet fyller hela skärmen och att top-notch flyttas bort */
     min-height: calc(100% + env(safe-area-inset-top));
     padding: env(safe-area-inset-top) env(safe-area-inset-right)
              env(safe-area-inset-bottom) env(safe-area-inset-left);
   }

   /* Klass som kan appliceras på navigationsfält eller footers */
   .padding-bottom-inset {
     padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
   }
   ```

   Johan (ios-home-screen-guiden) visar hur man lägger till `padding-bottom: calc(env(safe-area-inset-bottom) + 10px)` och kombinerar med `max(env(safe-area-inset-left), var(--inset))` för sidomarginaler [oai_citation:6‡johan.im](https://johan.im/writings/ios-homescreen-web-app/).

3. **Undvik `100vh` på iOS – använd alternativa höjdenheter**

   iOS Safari betraktar `100vh` som den maximala viewporten, vilket gör att innehåll kan hamna under bottenfältet. Ett mer robust sätt är att använda `height: 100%`, `-webkit-fill-available` eller en CSS-variabel som sätts med `window.innerHeight` [oai_citation:7‡dev-tips.com](https://dev-tips.com/css/overlapping-bottom-navigation-bar-despite-100vh-in-ios-safari). Detta uppdaterar höjden dynamiskt när verktygsfältet visas eller göms.

   **Exempel:**

   ```css
   .container {
     height: 100%;               /* Fallback för andra webbläsare */
     height: -webkit-fill-available; /* Tar hänsyn till iOS-verktygsfältet */
   }
   ```

   Alternativt kan man i JavaScript uppdatera en CSS-variabel med `window.innerHeight` och använda den i höjdangivelsen [oai_citation:8‡dev-tips.com](https://dev-tips.com/css/overlapping-bottom-navigation-bar-despite-100vh-in-ios-safari).

4. **Reservlösningar/hackar**

   I äldre versioner av iOS finns hackar där man ändrar dokumentets höjd när enhetens orientering ändras och scrollar sidan en pixel för att tvinga Safari att återkalkylera viewporten [oai_citation:9‡stackoverflow.com](https://stackoverflow.com/questions/62717621/white-space-at-page-bottom-after-device-rotation-in-ios-safari). Dessa hackar är mest aktuella för iOS 12–13 och bör undvikas om modern CSS fungerar.

5. **Testa på riktiga enheter**

   Eftersom iOS hanterar viewport och verktygsfält dynamiskt, är det viktigt att testa lösningarna på riktiga iPad-enheter i app-läge. Simulators och skrivbordsläge visar inte alltid problemet.

### Sammanfattande tabell

| Åtgärd | Kodexempel | Effekt |
| --- | --- | --- |
| **Aktivera fullskärm och safe-area** | `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; `<meta name="apple-mobile-web-app-capable" content="yes">` | Låter webbappen ta över hela skärmen; ger tillgång till `safe-area-inset-*` [oai_citation:10‡johan.im](https://johan.im/writings/ios-homescreen-web-app/) |
| **Lägg till dynamisk padding för safe area** | `body { padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px); }` | Undviker att innehållet täcks av hemindikatorn eller notcher [oai_citation:11‡heltweg.org](https://www.heltweg.org/posts/checklist-issues-progressive-web-apps-how-to-fix/) |
| **Undvik `100vh`** | `.container { height: 100%; height: -webkit-fill-available; }` | Hindrar att bottenfältet överlappar innehållet [oai_citation:12‡dev-tips.com](https://dev-tips.com/css/overlapping-bottom-navigation-bar-despite-100vh-in-ios-safari) |
| **Extra höjd för att skjuta upp innehållet** | `html { min-height: calc(100% + env(safe-area-inset-top)); }` | Förhindrar vitt fält längst ned när appen körs i helskärm [oai_citation:13‡dev.to](https://dev.to/karmasakshi/make-your-pwas-look-handsome-on-ios-1o08) |
| **Använd en padding-klass för bottennavigering** | `.padding-bottom-inset { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem); }` | Säkerställer att navigationsknappar ligger ovanför hemindikatorn [oai_citation:14‡heltweg.org](https://www.heltweg.org/posts/checklist-issues-progressive-web-apps-how-to-fix/) |

### Slutsats

Fältet som döljer innehåll längst ned när ett bokmärke öppnas i app-läge på iPad beror på att iOS reserverar en **safe area** för hemindikatorn och notcher. Problemet förvärras om man använder `100vh` eller inte lägger till `viewport-fit=cover`. Lösningen är att använda **rätt meta-taggar** och **CSS-paddings baserade på `safe-area-inset-*`** för att justera höjd och marginaler samt undvika `100vh`. Genom att använda dessa tekniker säkerställs att allt innehåll är synligt och att webbappen får ett rent, app-liknande utseende.