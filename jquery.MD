# Kako organizovati jQuery kod?

Ukoliko ste ikad radili kao Front-end developer, verovatno ste naišli na ogroman `jQuery` fajl (obično `main.js`), koji su pisale generacije developera, ko je kako stigao. Novi developeri obično ubace svoje parče koda na dnu fajla, bez neke posebne logike. Takav fajl brzo naraste na par stotina (čak par hiljada) linija, pa je veoma teško izboriti se sa njim. 

`jQuery` je nastao kao pomoćno sredstvo za manipulaciju `DOM`-a, nije predviđen za ogromne front-end aplikacije koje su u međuvremenu nastale. Ako se pažljivo ne organizuje, jQuery ima tendenciju da na velikim projektima postane haotičan.

Srećom, postoje rutinski koraci koji će vam pomoći da sve to organizujete. Nakon refaktorisanja, stara i neodrživa aplikacija će moći da nastavi razvoj, a `JavaSkript` kod će biti moguće odvojiti u zasebne module i prevesti u ES6.

  1. [Postavite sktrukturu stranice](#postavite-sktrukturu-stranice)
  
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

Samo pretražite fajl (ključna reč `var`) i gde god se pojavljuje varijabla u globalnom prostoru, premestite je u uvodnu sekciju. 

Tokom procesa, verovatno ćete primetiti da neke varijable ne treba da budu globalne nego lokalne, pa ih smestite gde treba. Ukoliko vidite da se neke od promenljivih zapravo koriste kao konstante, naznačite to `VELIKIM_SLOVIMA` u nazivu.

Isto važi i za parametarske objekte, koje često anonimno proleđujemo funkcijama. Imenujte ih i premestite u uvodnu sekciju, pored ostalih konfiguracija. Ako neka podešavanja budu trebala da se menjaju, imaćete ih sve na okupu.

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

http://callbackhell.com/

Here is some messy browser JavaScript that uses browser-request to make an AJAX request to a server:

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
This code has two anonymous functions. Let's give em names!

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


```javascript
$('#button').click(function() {
    $('#label').method();
    $('#label').method2();
    $('#label').css('background-color', 'red');
});
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

Uklonite sav JS iz HTML-a u poseban fajl, nazovite ga po toj stranici (npr. `contact.js` ili `products.js`) i učitajte regularnim putem. Između ostalog, ovo će vam omogućiti da imate svu funkcionalnost na jednom mestu, da ne mešate više jezika u jednom fajlu, da asinhrono učitavate vaše skripte i da postepeno pređete na modularnu organizaciju projekta.

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

## Odvojte kod u zasebne fajlove

## Lokalizujte globalne varijable

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
