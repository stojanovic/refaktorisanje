# Kako organizovati jQuery kod?
## Vodič za Front-end refaktorisanje

Ukoliko ste ikad radili kao Front-end developer, verovatno ste naišli na ogroman `jQuery` fajl (obično `main.js`), koji su pisale generacije developera, ko je kako stigao. Novi developeri obično ubace svoje parče koda na dnu fajla, bez neke posebne logike. Takav fajl brzo naraste na par stotina (čak par hiljada) linija, pa je veoma teško izboriti se sa njim.

`jQuery` je nastao kao pomoćno sredstvo za manipulaciju `DOM`-a, nije predviđen za ogromne front-end aplikacije koje su u međuvremenu nastale. Ako se pažljivo ne organizuje, jQuery ima tendenciju da na velikim projektima postane haotičan.

Srećom, postoje rutinski koraci koji će vam pomoći da sve to organizujete. Nakon refaktorisanja, stara i neodrživa aplikacija će moći da nastavi razvoj, a `JavaSkript` kod će biti moguće odvojiti u zasebne module i prevesti u ES6.

## Sadržaj
  1. [Postavite sktrukturu stranice](#postavite-sktrukturu-stranice)
  2. [Odvojte funkcije u posebnu sekciju](#odvojte-funkcije-u-posebnu-sekciju)
  3. [Odvojte varijable u posebnu sekciju](#odvojte-varijable-u-posebnu-sekciju)
  4. [Imenujte anonimne parametarske objekte](#imenujte-anonimne-parametarske-objekte)

## Postavite sktrukturu stranice

Za početak, komentarima naznačite glavne odeljke koje ćete imati na stranici. Možda neki nisu ni potrebni, ali korisno je napraviti mini sadržaj na početku kao putokaz:

```javascript
/*** VARIABLES ***/

/*** LISTENERS ***/

/*** FUNCTIONS ***/
```

Na početku su (globalne) varijable, koje služe kao konfiguracija. Potom dolaze event listeneri, unutar kojih se dešava logika i pozivaju funkcije. Na dnu se nalaze deklaracije funkcija, koje je moguće ranije koristiti zbog [*dizanja*] (http://www.w3schools.com/js/js_hoisting.asp). Neke od opštekorisnih funkcija kasnije možemo odvojiti u poseban fajl (npr. `utils.js`), izolovati iz globalnog opsega i organizovati kao modul.

Da biste stekli širu sliku, zamišljajte gornji deo fajla kao kontrolnu tablu, gde podešavate neke dugmiće, a donji deo kao unutrašnjost mašine. Sve dok radi, unutrašnjost mašine ne treba da vam bude pred očima. Kad neki deo otkaže, otvarate ga. Tako je i sa funkcijama (modulima). Ne treba sve vreme da vam budu pred očima.

## Odvojte funkcije u posebnu sekciju

Pretražite fajl i odvojte sve funkcije u posebnu sekciju, koja se nalazi na dnu. Anonimne funkcije za sada ostavite gde jesu, ali ćemo i neke od njih kasnije odvojiti.

Tokom ovog procesa, verovatno ćete morati da popravite neke funkcije. Vodite računa da svaka funkcija obavlja jedan zadatak i da ima jasno definisan ulaz i izlaz (ukoliko treba nešto da vrati). Nemojte da funkcija podrazumeva dostupnost bilo čega, osim onog što joj je prosleđeno. Imajte na umu da kad premestite funkciju u drugi kontekst ona treba i dalje da radi.

## Odvojte varijable u posebnu sekciju

Samo pretražite fajl (ključna reč `var`) i gde god se pojavljuje varijabla u globalnom prostoru, premestite je u uvodnu sekciju. Izuzetak su varijable koje zavise od HTML elemenata, njih stavite unutar `document ready` event listenera.

Tokom procesa, verovatno ćete primetiti da neke varijable ne treba da budu globalne nego lokalne, pa ih smestite gde treba. Ukoliko vidite da se neke od promenljivih zapravo koriste kao konstante, naznačite to `VELIKIM_SLOVIMA` u nazivu.

Isto važi i za [anonimne parametarske objekte](#imenujte-anonimne-parametarske-objekte), koje proleđujemo funkcijama. Imenujte ih i premestite u uvodnu sekciju, pored ostalih konfiguracija. Ako neka podešavanja budu trebala da se menjaju, imaćete ih sve na okupu.

(dati primer)


## Odvojte event listenere u posebnu sekciju

Prvi i glavni jQuery slušalac događaja je `document ready`, koji se okida kada je HTML učitan (bez slika i bilo čega ostalog što učitava iz HTML-a). Ovaj event vam garantuje da će u trenutku izvršenja Javaskripta u DOM-u biti prisutni svi oni elementi koje nameravate da ciljate.

(pri vrhu)

```javascript
$(document).ready(function() {

    // svi ostali event listeneri idu unutra
});
```

## Imenujte anonimne funkcije

Imenovanje anonimnih funkcija je važan korak kako bismo izbegli zloglasni [*callback pakao*](http://callbackhell.com/). Evo primera zbrkanog koda, kojim JavaScript iz browsera šalje http zahtev serveru (preuzet sa *callbackhell* sajta):

```javascript
var form = document.querySelector('form')
form.onsubmit = function (submitEvent) {
  var name = document.querySelector('input').value
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, function (err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
  })
}
```

U kodu postoje dve anonimne funkcije. Hajde da ih imenujemo:

```javascript
var form = document.querySelector('form')
form.onsubmit = function formSubmit (submitEvent) {
  var name = document.querySelector('input').value
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, function postResponse (err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
  })
}
```

Kao što vidite, imenovanje funkcija je veoma lako i ima brojne prednosti:
* čini kod čitljivijim zahvaljujući opisnim nazivima funkcija
* omogućuje nam da pomerimo funkciju u zasebnu sekciju
* ako dođe do greške prijaviće nam aktuelnu funkciju, umesto anonimne

Sada naša skripta za slanje formulara izgleda ovako:

```javascript
document.querySelector('form').onsubmit = formSubmit;

function formSubmit (e) {
  var name = document.querySelector('input').value
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, postResponse)
}

function postResponse (err, response, body) {
  var statusMessage = document.querySelector('.status')
  if (err) return statusMessage.value = err
  statusMessage.value = body
}
```

Ovaj kod možemo još dodatno refaktorisati imenovanjem anonimnog parametarskog objekta, o čemu u narednom odeljku.

## Imenujte anonimne parametarske objekte

```javascript
function formSubmit (e) {
  var name = document.querySelector('input').value
  request({
    uri: "http://example.com/upload",
    body: name,
    method: "POST"
  }, postResponse)
}
```

```javascript
var postParams = {
  uri: "http://example.com/upload",
  body: name,
  method: "POST"
}

function formSubmit(e) {
  var name = document.querySelector('input').value
  request(postParams, postResponse)
}
```

## Uklonite sav JavaScript iz HTML-a

Često kolege ubacuju male pomoćne skripte u HTML kako bi postigli neku funkcionalnost na određenoj stranici.

```html
<script>
	// Any global variable set-up that might be needed.
	$(document).ready(initPage);
	doThis();
	dontDoThat();
</script>
```

Uklonite sav JS iz HTML-a u posebne fajlove nazvane po stranici sa koje su uklonjeni (npr. `contact.js` ili `products.js`) i učitajte ih regularnim putem. Između ostalog, ovo će nam omogućiti da imamo svu funkcionalnost na jednom mestu, da ne mešamo više jezika u jednom fajlu, da asinhrono učitavamo skripte i da postepeno pređemo na modularnu arhitekturu.

Pored velikih JS blokova koji se nalaze unutar `script` tagova, često imate i *inline* pozive JS funkcija. Uklonite i sve to, iz gore navedenih razloga. Dakle, ako ste imali:

```html
<div onclick="showMore()">Show more!</a>
```

Umesto toga ostavite `CSS` klasu koju će vaš Javaskript ciljati. Pošto osnovna namena te klase nije stilizovanje, eksplicirajte to u njenom nazivu. Možete smisliti bilo koju konvenciju, ja predlažem `js-` ispred naziva klase:

```html
<div class="js-show-more">Show more!</a>
```

```javascript
$('.doSomething').click(showMore);
```

## Podelite kod u zasebne fajlove

![alt text](http://i.stack.imgur.com/YaaJ6.png)

Podelite glavni Javaskript fajl u zasebne fajlove, nazvane po logičkim celinama za čiju funkcionalnost su zaduženi (npr. `contact.js`, `header.js`, `slider.js`). U glavnom fajlu ostavite samo zajedničku funkcionalnost.

Podela briga će nam olakšati razvoj i smanjiti vreme učitavanja, jer ćemo skripte specifične za neku stranicu učitavati samo na toj stranici. Zajedno sa drugim koracima, ovo će nam pomoći da pređemo na modularnu organizaciju projekta.

## Lokalizujte globalne varijable

Ceo Javaskript fajl ćemo lako lokalizovati tako što ćemo ga zatvoriti u [closure](https://developer.mozilla.org/en/docs/Web/JavaScript/Closures), odnosno u [samoizvršujuću anonimnu funkciju](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression):

```javascript
(function() {
    // jQuery je ovde dostupan pod alijasom $
})();
```

Na ovaj način, sve što je ostalo unutra više nije dostupno za spoljni svet. Ako nam je nešto ipak potrebno, moramo to izvesti van:

```javascript
var DED = (function() {

    var private_var;

    function private_method()
    {
        // do stuff here
    }

    return {
        method_1 : function()
            {
                // do stuff here
            },
        method_2 : function()
            {
                // do stuff here
            }
    };
})();
```

Ukoliko vaš modul ima neku spoljašnju zavisnost (u ovom slučaju sigurno jQuery, onda to eksplicirajte:

```javascript
(function($) {
    // jQuery je ovde dostupan pod alijasom $
})(jQuery);
```

Ovako prosleđujemo globalnu `jQuery` varijablu našem modulu, koju unutra koristimo pod alijasom `$`. Globalna varijabla će naravno biti dostupna i ako je ne prosledimo, ali ovako ekspliciramo zavisnost modula u slučaju da promeni okruženje.

## Učitavajte skripte asinhrono

![asinhrono učitavanje modula](https://upload.wikimedia.org/wikipedia/commons/2/22/Asynchronous_Module_Definition_overview_vector.svg "Razlika između blokirajućeg i asinhronog učitavanja modula")

Asinhrono učitavanje skripti je jedino ispravno rešenje koje [Google preporučuje](https://developers.google.com/speed/docs/insights/BlockingJS). Skripte se na taj način učitavaju istovremeno, umesto jedna za drugom, ali se takođe izvršavaju bez ikakvog reda.

Postoji gomila rešenja za asinhrono učitavanje modula (npr. RequireJS, CommonJS...), a možete sve to rešiti i ručno. [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) alatke nam omogućuju da eksplicitno navedemo od kojih modula zavisi naša skripta, pa se kod izvršava tek nakon što se zavisnosti očitaju (npr. ako je za skriptu neophodan jQuery, izvršiće se nakon što se jQuery učita).

## Smestite selektore u varijable

Ukoliko često hvatate određene elemente na stranici, na primer linkove, nemojte ih selektovati svaki put:
```javascript
$('a').click(function(){
    $('a').addClass('wow');
});
```

Umesto toga ih jednom uhvatite i smestite u varijablu (keširajte), čime ćete blago optimizovati kod:

```javascript
var $a = $('a');
$a.click(function(){
    $a.addClass('wow');
});
```

Primećujete da `$` u nazivu varijable koristimo da naznačimo da je u pitanju jQuery objekat, a ne bilo kakva promenljiva, što je [*de facto* standard](http://lab.abhinayrathore.com/jquery-standards/).

## Korisni linkovi
http://stackoverflow.com/questions/16736483/best-way-to-organize-jquery-javascript-code-2013
