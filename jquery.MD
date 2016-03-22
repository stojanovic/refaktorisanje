# Kako organizovati jQuery kod?

Ukoliko ste radili kao Front-end developer, verovatno ste naišli na ogroman `jQuery` fajl (obično `main.js`), koji su pisale generacije developera, ko je kako stigao. Novi developeri obično ubace svoje parče koda na dnu fajla, bez neke posebne logike. Takav fajl brzo naraste na par stotina (čak par hiljada) linija, pa je veoma teško izboriti se sa njim. 

`jQuery` je nastao kao pomoćno sredstvo za manipulaciju `DOM`-a, nije predviđen za ogromne front-end aplikacije koje su u međuvremenu nastale. Ako se pažljivo ne organizuje, jQuery ima tendenciju da na velikim projektima postane haotičan.

Srećom, postoje rutinski koraci koji će vam pomoći da sve to organizujete. Nakon refaktorisanja, stara i neodrživa aplikacija će moći da nastavi razvoj, a `JavaSkript` kod će biti moguće odvojiti u zasebne module.

## Imenujte anonimne funkcije

## Odvojte funkcije u posebnu sekciju

(na dnu)

## Odvojte varijable u posebnu sekciju

(na vrhu)

## Odvojte event listenere u posebnu sekciju

(pri vrhu)

## Uklonite sav JS kod iz HTML-a

```javascript


```

## Odvojte kod u zasebne fajlove

## Lokalizujte globalne varijable

## Smestite česte selektore u varijable

