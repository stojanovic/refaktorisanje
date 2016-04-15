# Kako preživeti jQuery?
## Vodič za refaktorisanje Javaskript koda
> Nivo: srednji - napredni

***Ovaj vodić je namenjen organizovanju nasleđenog Javaskript koda, na projekatima koji ne koriste ni jedan front-end framework. Vodič se ne bavi tehnikama optimizacije i kodnim stilom, već isključivo arhitekturom.***

Ukoliko ste ikad radili kao Front-end developer, verovatno ste naišli na [ogroman jQuery fajl](bad-jquery-example.js) (obično `main.js`), koji su pisale generacije developera, ko je kako stigao. Novi developeri obično ubace svoje parče koda na dnu fajla, bez neke posebne logike. Takav fajl brzo naraste na par stotina (čak par hiljada) linija, pa je veoma teško izboriti se sa njim.

`jQuery` je nastao kao pomoćno sredstvo za manipulaciju `DOM`-a, nije predviđen za ogromne front-end aplikacije koje su u međuvremenu nastale. Ako se pažljivo ne organizuje, jQuery ima tendenciju da na velikim projektima postane haotičan.

Srećom, postoje rutinski koraci koji će vam pomoći da sve to organizujete. Nakon refaktorisanja, stara i neodrživa aplikacija će moći da nastavi razvoj, a `JavaSkript` kod će biti moguće odvojiti u zasebne module i prevesti u `ES6`.

## Sadržaj
  * [Podelite kod u zasebne fajlove](#podelite-kod-u-zasebne-fajlove)
  * [Postavite sktrukturu Javaskripta](#postavite-sktrukturu-javaskripta)
  * [Izdvojte varijable u poseban odeljak](#izdvojte-varijable-u-poseban-odeljak)
  * [Izdvojte event listenere u poseban odeljak](#izdvojte-event-listenere-u-poseban-odeljak)
  * [Izdvojte funkcije u poseban odeljak](#izdvojte-funkcije-u-poseban-odeljak)
  * [Imenujte anonimne funkcije](#imenujte-anonimne-funkcije)
  * [Imenujte anonimne parametarske objekte](#imenujte-anonimne-parametarske-objekte)
  * [Organizujte varijable u objekte](#organizujte-varijable-u-objekte)
  * [Uklonite JavaScript iz HTML-a](#uklonite-javascript-iz-html-a)
  * [Izolujte globalni opseg](#izolujte-globalni-opseg)
  * [Učitavajte skripte asinhrono](#učitavajte-skripte-asinhrono)


## Podelite kod u zasebne fajlove

![alt text](http://i.stack.imgur.com/YaaJ6.png)

Podelite glavni JS fajl u manje fajlove, nazvane po logičnim celinama za čiju funkcionalnost su nadležni (npr. `contact.js`, `header.js`, `slider.js`). U glavnom fajlu ostavite samo zajedničku funkcionalnost. Na primer, ako se funkcija za slanje formulara koristi samo na kontakt stranici, smestite je tamo. Obavezno testirajte program posle svakog premeštanja.

Podela koda će nam, zajedno sa drugim koracima, pomoći da pređemo na modularnu organizaciju projekta. Nakon razdvajanja u svrhe razvoja, upotrebite neku build alatku (kao `Grunt` ili `Gulp`), da sve spakujete u jedan minifikovan fajl.

Ovaj korak možete preskočiti ukoliko glavni fajl nema više od dvestotinjak linija.

## Postavite sktrukturu Javaskripta

Komentarima naznačite glavne odeljke koje ćemo imati unutar svakog fajla. Vaša struktura se može razlikovati, ali korisno je napraviti mini sadržaj na početku kao putokaz:

```javascript
/*** KONFIG ***/

/*** LISTENERS ***/

/*** FUNCTIONS ***/
```

Na vrhu su varijable, koje služe kao konfiguracija. Potom dolaze event listeneri, unutar kojih se pozivaju funkcije (izvršni deo koda). Na kraju se nalaze deklaracije funkcija, koje je moguće ranije koristiti zbog [*dizanja*] (http://www.w3schools.com/js/js_hoisting.asp). Neke od opštekorisnih funkcija kasnije možemo odvojiti u poseban fajl (npr. `utils.js`), izolovati iz globalnog opsega i organizovati kao modul.

Da biste stekli širu sliku, zamislite gornji deo fajla kao kontrolnu tablu, gde podešavate neke dugmiće, a donji deo kao unutrašnjost mašine. Sve dok radi, unutrašnjost mašine ne treba da vam bude pred očima. Kad neki deo otkaže, otvarate ga. Tako je i sa funkcijama (modulima). Ne treba sve vreme da vam budu pred očima.

<img src='https://upload.wikimedia.org/wikipedia/commons/0/09/Plc_control_panel.JPG' width='400'>


## Izdvojte varijable u poseban odeljak

Pretražite čitav fajl (ključna reč `var`) i gde god nađete varijablu u globalnom prostoru, premestite je u uvodnu sekciju. Izuzetak su varijable koje zavise od DOM-a, njih smestite unutar `document ready` eventa.

Ukoliko primetite da neka varijabla ne treba da budu globalna nego lokalna, smestite je u odgovarajući opseg. Ukoliko vidite da se neka promenljiva zapravo koristi kao konstanta, naznačite to `VELIKIM_SLOVIMA` u nazivu.

Ukoliko nađete [anonimni parametarski objekat](#imenujte-anonimne-parametarske-objekte), koji se prosleđuje funkciji, imenujte ga i premestite u uvodni odeljak. Tako ćemo imati sve konfiguracije na jednom mestu. Sada naš uvodni odeljak izgleda otprilike ovako:

```javascript
/*** KONFIG ***/

var $table; // samo proglašavamo, a vrednost dodajemo kasnije kada DOM bude spreman
var title = 'Refaktorišemo jQuery';
var currentSpeed = 0;
var MAX_SPEED = 256;
```


## Izdvojte event listenere u poseban odeljak

U jQuery-u, `document ready` je glavni slušalac događaja, koji se okida tek kada je HTML učitan (bez slika i svega ostalog što se učitava naknadno). On nam jemči da će u trenutku izvršenja koda biti spremni svi elementi iz HTML-a.

Niži osluškivači događaja obično idu unutar njega. Ako ih ostavimo izvan, rizikujemo da element koji ciljamo još nije spreman. Listeneri koji se kače na globalne objekte (`document` ili `window`) mogu biti izvan, jer su nezavisni.

Odeljak sa event listenerima sada izgleda otprilike ovako:


```javascript
/*** LISTENERS ***/

$(document).ready(function() {

    $table = $('#table');

    $('.should-hide').click(function(){
        $(this).hide();
    });

    $('.book-description').click(function() {
      $('.book').fadeIn('slow');
    });

});

$(window).resize(function() {
  resizeThePage();
});
```

<img src='http://www.simoahava.com/wp-content/uploads/2014/08/custom-listeners.png' width='600'>

Međutim, ukoliko sve trpamo u `document ready`, Javascript fajl će brzo postati jedno veliko *jQuery crevo*. Štaviše, neće raditi događaji za elemente koji se dinamički ubacuju u DOM, tokom izvršenja programa. Ako, na primer, vežemo `klik` za klasu `.should-hide`, koja trenutno nije u HTML-u, nakon što klasa bude dodata u DOM, klik neće raditi:

```javascript
$(document).ready(function() {

  $('.should-hide').on('click', function() {
    $(this).hide();
  });

});
```

Srećom, postoji standardno rešenje. Ako vežemo klik za globalni `document` objekat (koji je dostupan sve vreme), kad on bude kliknut, delegiraće klik potčinjenoj klasi ukoliko se ona u međuvremenu pojavi:

```javascript
$(document).on('click', '.should-hide', function(){
  $(this).hide();
});
```

Između ova dva načina organizacije, treba koristiti drugo rešenje jer time izbegavamo pucanje programa, kao i stepeničastu strukturu koda. Odeljak sa osluškivačima događaja na kraju treba da izgleda ovako:

```javascript
/*** LISTENERS ***/

$(document).ready(function() {
  $table = $('#table');
});

$(window).resize(function() {
  resizeThePage();
});

$(document).on('click', '.should-hide', function(){
  $(this).hide();
});

$(document).on('click', '.book-description', function(){
  $('.book').fadeIn('slow');
});
```


## Izdvojte funkcije u poseban odeljak

Pretražite fajl i organizujte sve funkcije u poseban odeljak, koja se nalazi na dnu. Obavezno koristiti deklaracije funkcija, a ne funkcionalne izraze, jer je [razlika presudna](http://stackoverflow.com/questions/1013385/what-is-the-difference-between-a-function-expression-vs-declaration-in-javascrip) (u drugom slučaju će pući aplikacija). Anonimne funkcije za sada ostavite gde jesu, ali neke od njih ćemo kasnije [imenovati](#imenujte-anonimne-funkcije). Sada naš odeljak sa funkcijama izgleda ovako:

```javascript
/*** FUNCTIONS ***/

function toCelsius(fahrenheit) {
    return (5/9) * (fahrenheit-32);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
```

Tokom ovog procesa, verovatno ćete morati da popravite neke funkcije. Vodite računa da svaka funkcija obavlja jedan zadatak i da ima jasno definisan ulaz i izlaz (ukoliko treba nešto da vrati). Nemojte da funkcija podrazumeva dostupnost bilo čega, osim onog što joj je prosleđeno. Imajte na umu da kad premestite funkciju u drugi kontekst ona i dalje treba da radi.

<img src='http://captivatedev.com/wp-content/uploads/2011/04/220pxFunction_machine2_svg_thumb.jpg' width='300'>


## Imenujte anonimne funkcije

Imenovanje anonimnih funkcija je važan korak kako bismo izbegli zloglasni [*callback pakao*](http://callbackhell.com/). Evo jednog primera zbrkanog koda, kojim se iz browsera šalje `http` zahtev serveru:

```javascript
var form = document.querySelector('form')
form.onsubmit = function (submitEvent) {
  var name = document.querySelector('input').value
  request({
    uri: 'http://example.com/upload',
    body: name,
    method: 'POST'
  }, function (err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
  })
}
```

U gornjem kodu postoje dve anonimne funkcije. Hajde da ih imenujemo `formSubmit` i `postResponse`:

```javascript
var form = document.querySelector('form')
form.onsubmit = function formSubmit (submitEvent) {
  var name = document.querySelector('input').value
  request({
    uri: 'http://example.com/upload',
    body: name,
    method: 'POST'
  }, function postResponse (err, response, body) {
    var statusMessage = document.querySelector('.status')
    if (err) return statusMessage.value = err
    statusMessage.value = body
  })
}
```

Kao što vidite, imenovanje funkcija je lako i ima brojne prednosti:
* čini kod čitljivijim zahvaljujući opisnom nazivu funkcija
* omogućuje nam da pomerimo funkciju gde želimo
* ako dođe do greške prijaviće nam aktuelnu funkciju, umesto anonimne

Sada naša skripta za slanje formulara izgleda ovako:

```javascript
document.querySelector('form').onsubmit = formSubmit;

function formSubmit (e) {
  var name = document.querySelector('input').value
  request({
    uri: 'http://example.com/upload',
    body: name,
    method: 'POST'
  }, postResponse)
}

function postResponse (err, response, body) {
  var statusMessage = document.querySelector('.status')
  if (err) return statusMessage.value = err
  statusMessage.value = body
}
```

Imenovanje anonimnih funkcija je često korisno, ali ne uvek. Funkcije nekada treba da ostanu anonimne, ali to treba eksplicirati tako što ćemo ih prevesti u [streličaste funkcije](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

<img src='https://stijndewitt.files.wordpress.com/2013/12/p_anonymous-function.png' width="400">

Gornji kod možemo još dodatno refaktorisati imenovanjem anonimnog parametarskog objekta, o čemu u narednom odeljku.


## Imenujte anonimne parametarske objekte

Navedena skripta za slanje formulara ima jedan anonimni objekat, koji nije toliko upadljiv:

```javascript
function formSubmit (e) {
  var name = document.querySelector('input').value
  request({
    uri: 'http://example.com/upload',
    body: name,
    method: 'POST'
  }, postResponse)
}
```

Možemo ga izdvojiti i staviti u uvodni odeljak sa ostalim konfiguracijama:

```javascript
var postParams = {
  uri: 'http://example.com/upload',
  body: document.querySelector('input').value,
  method: 'POST'
}
```

Izdvajanje konfiguracionih objekata nije uvek neophodno, ali ima smisla ukoliko ćemo ih povremeno menjati. Npr. kada preuzimamo `plugin` za slajder, često nam bude ponuđeno parče koda poput ovog:

```javascript
$(window).load(function() {
    $('#flexslider1').flexslider({
    easing: "swing",  
    animation: "fade",
    slideshowSpeed: 7000,
    animationSpeed: 600,
    startAt: 0,
    controlNav: true,
    pausePlay: true,
    pauseText: 'Pause',
    playText: 'Play'
  });
});
```

U ovih nekoliko linija se zapravo mnogo toga dešava. Imamo slušalac događaja, parametarski objekat, jQuery selektor i pozivanje metode. Hajde da podešavanja slajdera pomerimo među ostale konfiguracije na "kontrolnoj tabli":

```javascript
var sliderParams = {
  easing: "swing",  
  animation: "fade",
  slideshowSpeed: 7000,
  animationSpeed: 600,
  startAt: 0,
  controlNav: true,
  pausePlay: true,
  pauseText: 'Pause',
  playText: 'Play'
}
```

Izvršni deo koda stavljamo među event listenere (metoda `flexslider` kreće nakon što se slike učitaju):

```javascript
$(window).load(function() {
  $('#flexslider1').flexslider(sliderParams);
});
```

Ukoliko slajder koristi događaj koji smo već definisali, komandu za slajder dodajemo među ostale funkcije:

```javascript
$(window).load(function() {
  hideIntro();
  showImages();
  $('#flexslider1').flexslider(sliderParams);
});
```

Ovako smo umesto pukog kopi-pejstovanja, preuzeti kod prilagodili strukturi našeg projekta.


## Organizujte varijable u objekte

<img src='http://eloquentjavascript.net/img/object.jpg' width='400'>

Ukoliko u konfiguracionom delu fajla imate letećih varijabli, struktuirajte ih u objekte. Na primer, ako imate:

```javascript
var robotHeight = 200;
var robotWidth = 300;
var robotSpeed = 20;
```

Povežite ih u jedan objekat:
```javascript
var robot = {
  height: 200,
  width: 300,
  speed: 20
}
```

Osim varijabli, često postoje i funkcije povezane sa objektom, na primer:

```javascript
var changeRobotImage = function() {
  /* function body */
}
var changeRobotSpeed = function() {
  /* function body */
}
```

Moguće je i metode pridružiti objektu, pa umesto razbacanih delova koda dobijamo sledeću strukturu:
```javascript
var robot = {
  height: 200,
  width: 1024,
  speed: 20,
  changeImage: function() {
    /* function body */
  },
  changeSpeed: function() {
    /* function body */
  }
}
```

Ovako organizovan objekat sada možemo [izdvojiti u zaseban fajl](#podelite-kod-u-zasebne-fajlove), a veoma lako ga možemo refaktorisati u klasu.


## Uklonite JavaScript iz HTML-a

<img src='http://www.proun-game.com/Oogst3D/BLOG/Italian%20Food%20Coding%20Spaghetti.jpg' width='300'>

Akademska zajednica [preporučuje](http://www.ece.ubc.ca/~amesbah/docs/scam13.pdf) da se u web aplikacijama potpuno odvoje `JS`, `HTML` i `CSS`. HTML služi za prezentaciju sadržaja i strukture, CSS za stilizovanje, a JavaScript za funkcionalnost, što je princip poznat kao [razdvajanje briga](https://en.wikipedia.org/wiki/Separation_of_concerns). Nažalost, web developeri često mešaju ove jezike, što negativno utiče na razumevanje, održavanje i debagovanje programa.

Verovatno ste često viđali male pomoćne skripte u HTML-u koje nešto rade na određenoj stranici:

```html
<script>
	$(document).ready(initPage);
	doThis();
	dontDoThat();
</script>
```

Uklonite sav JS iz HTML-a u posebne fajlove, nazvane po stranici sa koje su uklonjeni (npr. `contact.js` ili `products.js`) i učitajte ih regularnim putem. Ovo će nam omogućiti da imamo svu funkcionalnost na jednom mestu, da ne mešamo više jezika u jednom fajlu, da asinhrono učitavamo skripte i da postepeno pređemo na modularnu arhitekturu.

Pored velikih JS blokova koji se nalaze unutar `script` tagova, često nalazimo i *inline* pozive JS funkcija:

```html
<div onclick='showMore()'>Show more!</a>
```

Umesto poziva funkcije, ostavite ostavite `CSS` klasu koju će vaš Javaskript ciljati. Pošto osnovna namena te klase nije stilizovanje, eksplicirajte to u njenom nazivu. Možete koristiti bilo koju konvenciju, ja predlažem prefiks `js-` ispred naziva:

```html
<div class='js-show-more'>Show more!</a>
```

Nakon toga u JS fajl smeštamo klik okidač koji poziva funkciju, među ostale osluškivače događaja:

```javascript
$('.js-show-more').click(showMore);
```


## Izolujte globalni opseg

Trenutno u fajlu imamo puno globalnih varijabli uopštenih naziva, što žestoko zagađuje globalni prostor. Ukoliko promenljiva istog naziva već postoji u drugom fajlu, ili biblioteci koju uključujemo, doćiće do kolizije i pucanja programa.

Ceo fajl ćemo lako izolovati tako što ćemo ga zatvoriti u [closure](https://developer.mozilla.org/en/docs/Web/JavaScript/Closures), odnosno u [samoizvršnu anonimnu funkciju](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression):

```javascript
(function() {

    /*** KONFIG ***/

    var currentSpeed = 0;
    var MAX_SPEED = 256;

    /*** LISTENERS ***/

    $(window).resize(function() {
      resizeThePage();
    });

    $(document).on('click', '.should-hide', function(){
      $(this).hide();
    });

    /*** FUNCTIONS ***/

    function toDegrees (angle) {
      return angle * (180 / Math.PI);
    }

    function toRadians (angle) {
      return angle * (Math.PI / 180);
    }

})();
```

Zagrade oko funkcije znače da je ona anonimna, a zagrade nakon funkcije da se odmah poziva. Na ovaj način, sve što je ostalo unutra više nije dostupno za spoljni svet i ovu funkciju više niko ne može pozvati. Ukoliko zatvorena funkcija ima neku spoljašnju zavisnost (u ovom slučaju jQuery), onda to eksplicirajte prosleđivanjem varijable:

```javascript
(function($) {

  // jQuery objekat je unutra dostupan pod alijasom $

})(jQuery);
```

Anonimnoj funkciji prosleđujemo globalnu `jQuery` varijablu, koju ona prima pod alijasom `$`. Globalna varijabla će naravno biti dostupna i ako je ne prosledimo, ali ovako ekspliciramo zavisnost u slučaju da promenimo okruženje.

<img src='https://lostechies.com/derekgreer/files/2012/02/closure3.png' width='400'>

Ukoliko želimo da nešto iz unutrašnjosti postane dostupno, moramo to izvesti van. Uskladištimo rezultat poziva anonimne funkcije u varijablu, koja postaje naš prvi Javascript modul. Iznutra [vraćamo](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/return) objekat sa metodama koje postaju javne:

```javascript
var mathModule = (function() {

  /*** PRIVATNO ***/

  var currentSpeed = 0;
  var MAX_SPEED = 256;

  function toCelsius(fahrenheit) {
    return (5/9) * (fahrenheit-32);
  }

  function toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  /*** JAVNO ***/

  return {
    toDegrees: toDegrees,
    toRadians: toRadians
  };
})();
```

Dve javne metode koje smo izvezli sada su dostupne u `mathModule` imenskom prostoru i možemo ih koristiti na sledeći način: `mathModule.toDegrees(45)`. Treća funkcija `toCelsius()`, koju nismo izvezli, ostaje privatna.


## Učitavajte skripte asinhrono

![asinhrono učitavanje modula](https://upload.wikimedia.org/wikipedia/commons/2/22/Asynchronous_Module_Definition_overview_vector.svg 'Razlika između blokirajućeg i asinhronog učitavanja JS modula')

Asinhrono učitavanje skripti je jedino ispravno rešenje koje [Google preporučuje](https://developers.google.com/speed/docs/insights/BlockingJS) (ne blokira ostale resurse). Skripte se na taj način umesto jedna za drugom, učitavaju istovremeno, ali se izvršavaju bez ikakvog reda, što može biti malo nezgodno.

U HTML-u postoje dva atributa za asinhrono učitavanje: `defer` i `async`. `defer` odlaže izvršenje dok se sve skripte ne učitaju, i izvršava ih redom kojim su uključene. S druge strane, `async` izvršava skripte kako koja pristiže, nezavisno od redosleda kojim su navedene. Ukoliko ne želite da ručno regulišete izvršenje skripti, najprostije rešenje je `defer` atribut:
```html
<script src="jquery.js" defer></script>
<script src="slider-plugin.js" defer></script>
<script src="main.js" defer></script>
```

U browserima, [import](https://developer.mozilla.org/en/docs/web/javascript/reference/statements/import) izraz još uvek nije prirodno podržan, ali postoje razni učitavači modula. [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) alatke nam omogućuju da eksplicitno navedemo zavisnosti, pa se skripta izvršava tek nakon što se sve zavisnosti učitaju.
