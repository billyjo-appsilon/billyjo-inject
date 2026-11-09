#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

const ownedEndpoint = '/v1/products/catalog/';
const ownedIndex = source.indexOf("var p = fetch('https://admin2-api.billyjo.co.kr" + ownedEndpoint);
const fallbackIndex = source.indexOf("fetch('/html/dh_prod/prod_view/' + pid");

if (ownedIndex < 0) throw new Error('owned catalog thumbnail request is missing');
if (fallbackIndex < 0) throw new Error('migration fallback is missing');
if (!source.includes(".catch(fromProdView)")) {
  throw new Error('prod_view is not constrained to the owned-API failure path');
}
if (!source.includes("API + '/v1/products/catalog/' + encodeURIComponent(prodNo)")) {
  throw new Error('direct-offer current product does not hydrate from owned catalog');
}
if (!source.includes("imageSource: product.imageSource || 'bizcare_fallback'")) {
  throw new Error('image provenance is not preserved');
}
if (!source.includes("function replacePrimaryProductImages(product)")) {
  throw new Error('owned primary product image replacement is missing');
}
if (!source.includes(".prod_img_big img, .prod_img_small img, .prod_img_m img")) {
  throw new Error('native product gallery selectors are not covered');
}
if (!source.includes("replacePrimaryProductImages(state.current)")) {
  throw new Error('owned primary product image replacement is not activated');
}

console.log('owned catalog path: ok');
