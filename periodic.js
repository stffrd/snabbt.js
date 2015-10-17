'use strict';
/* global snabbt, window, document */

var chemicalElements = [
  { symbol: 'H', name: 'Hydrogen', group: 1, period: 1 },
  { symbol: 'He', name: 'Helium', group: 18, period: 1 },
  { symbol: 'Li', name: 'Lithium', group: 1, period: 2 },
  { symbol: 'Be', name: 'Beryllium', group: 2, period: 2 },
  { symbol: 'B', name: 'Boron', group: 13, period: 2 },
  { symbol: 'C', name: 'Carbon', group: 14, period: 2 },
  { symbol: 'N', name: 'Nitrogen', group: 15, period: 2 },
  { symbol: 'O', name: 'Oxygen', group: 16, period: 2 },
  { symbol: 'F', name: 'Fluorine', group: 17, period: 2 },
  { symbol: 'Ne', name: 'Neon', group: 18, period: 2 },
  { symbol: 'Na', name: 'Sodium', group: 1, period: 3 },
  { symbol: 'Mg', name: 'Magnesium', group: 2, period: 3 },
  { symbol: 'Al', name: 'Aluminium', group: 13, period: 3 },
  { symbol: 'Si', name: 'Silicon', group: 14, period: 3 },
  { symbol: 'P', name: 'Phosphorus', group: 15, period: 3 },
  { symbol: 'S', name: 'Sulfur', group: 16, period: 3 },
  { symbol: 'Cl', name: 'Chlorine', group: 17, period: 3 },
  { symbol: 'Ar', name: 'Argon', group: 18, period: 3 },
  { symbol: 'K', name: 'Potassium', group: 1, period: 4 },
  { symbol: 'Ca', name: 'Calcium', group: 2, period: 4 },
  { symbol: 'Sc', name: 'Scandium', group: 3, period: 4 },
  { symbol: 'Ti', name: 'Titanium', group: 4, period: 4 },
  { symbol: 'V', name: 'Vanadium', group: 5, period: 4 },
  { symbol: 'Cr', name: 'Chromium', group: 6, period: 4 },
  { symbol: 'Mn', name: 'Manganese', group: 7, period: 4 },
  { symbol: 'Fe', name: 'Iron', group: 8, period: 4 },
  { symbol: 'Co', name: 'Cobalt', group: 9, period: 4 },
  { symbol: 'Ni', name: 'Nickel', group: 10, period: 4 },
  { symbol: 'Cu', name: 'Copper', group: 11, period: 4 },
  { symbol: 'Zn', name: 'Zinc', group: 12, period: 4 },
  { symbol: 'Ga', name: 'Gallium', group: 13, period: 4 },
  { symbol: 'Ge', name: 'Germanium', group: 14, period: 4 },
  { symbol: 'As', name: 'Arsenic', group: 15, period: 4 },
  { symbol: 'Se', name: 'Selenium', group: 16, period: 4 },
  { symbol: 'Br', name: 'Bromine', group: 17, period: 4 },
  { symbol: 'Kr', name: 'Krypton', group: 18, period: 4 },
  { symbol: 'Rb', name: 'Rubidium', group: 1, period: 5 },
  { symbol: 'Sr', name: 'Strontium', group: 2, period: 5 },
  { symbol: 'Y', name: 'Yttrium', group: 3, period: 5 },
  { symbol: 'Zr', name: 'Zirconium', group: 4, period: 5 },
  { symbol: 'Nb', name: 'Niobium', group: 5, period: 5 },
  { symbol: 'Mo', name: 'Molybdenum', group: 6, period: 5 },
  { symbol: 'Tc', name: 'Technetium', group: 7, period: 5 },
  { symbol: 'Ru', name: 'Ruthenium', group: 8, period: 5 },
  { symbol: 'Rh', name: 'Rhodium', group: 9, period: 5 },
  { symbol: 'Pd', name: 'Palladium', group: 10, period: 5 },
  { symbol: 'Ag', name: 'Silver', group: 11, period: 5 },
  { symbol: 'Cd', name: 'Cadmium', group: 12, period: 5 },
  { symbol: 'In', name: 'Indium', group: 13, period: 5 },
  { symbol: 'Sn', name: 'Tin', group: 14, period: 5 },
  { symbol: 'Sb', name: 'Antimony', group: 15, period: 5 },
  { symbol: 'Te', name: 'Tellurium', group: 16, period: 5 },
  { symbol: 'I', name: 'Iodine', group: 17, period: 5 },
  { symbol: 'Xe', name: 'Xenon', group: 18, period: 5 },
  { symbol: 'Cs', name: 'Caesium', group: 1, period: 6 },
  { symbol: 'Ba', name: 'Barium', group: 2, period: 6 },
  { symbol: 'La', name: 'Lanthanum', group: 3, period: 9 },
  { symbol: 'Ce', name: 'Cerium', group: 4, period: 9 },
  { symbol: 'Pr', name: 'Praseodymium', group: 5, period: 9 },
  { symbol: 'Nd', name: 'Neodymium', group: 6, period: 9 },
  { symbol: 'Pm', name: 'Promethium', group: 7, period: 9 },
  { symbol: 'Sm', name: 'Samarium', group: 8, period: 9 },
  { symbol: 'Eu', name: 'Europium', group: 9, period: 9 },
  { symbol: 'Gd', name: 'Gadolinium', group: 10, period: 9 },
  { symbol: 'Tb', name: 'Terbium', group: 11, period: 9 },
  { symbol: 'Dy', name: 'Dysprosium', group: 12, period: 9 },
  { symbol: 'Ho', name: 'Holmium', group: 13, period: 9 },
  { symbol: 'Er', name: 'Erbium', group: 14, period: 9 },
  { symbol: 'Tm', name: 'Thulium', group: 15, period: 9 },
  { symbol: 'Yb', name: 'Ytterbium', group: 16, period: 9 },
  { symbol: 'Lu', name: 'Lutetium', group: 17, period: 9 },
  { symbol: 'Hf', name: 'Hafnium', group: 4, period: 6 },
  { symbol: 'Ta', name: 'Tantalum', group: 5, period: 6 },
  { symbol: 'W', name: 'Tungsten', group: 6, period: 6 },
  { symbol: 'Re', name: 'Rhenium', group: 7, period: 6 },
  { symbol: 'Os', name: 'Osmium', group: 8, period: 6 },
  { symbol: 'Ir', name: 'Iridium', group: 9, period: 6 },
  { symbol: 'Pt', name: 'Platinum', group: 10, period: 6 },
  { symbol: 'Au', name: 'Gold', group: 11, period: 6 },
  { symbol: 'Hg', name: 'Mercury', group: 12, period: 6 },
  { symbol: 'Tl', name: 'Thallium', group: 13, period: 6 },
  { symbol: 'Pb', name: 'Lead', group: 14, period: 6 },
  { symbol: 'Bi', name: 'Bismuth', group: 15, period: 6 },
  { symbol: 'Po', name: 'Polonium', group: 16, period: 6 },
  { symbol: 'At', name: 'Astatine', group: 17, period: 6 },
  { symbol: 'Rn', name: 'Radon', group: 18, period: 6 },
  { symbol: 'Fr', name: 'Francium', group: 1, period: 7 },
  { symbol: 'Ra', name: 'Radium', group: 2, period: 7 },
  { symbol: 'Ac', name: 'Actinium', group: 3, period: 10 },
  { symbol: 'Th', name: 'Thorium', group: 4, period: 10 },
  { symbol: 'Pa', name: 'Protactinium', group: 5, period: 10 },
  { symbol: 'U', name: 'Uranium', group: 6, period: 10 },
  { symbol: 'Np', name: 'Neptunium', group: 7, period: 10 },
  { symbol: 'Pu', name: 'Plutonium', group: 8, period: 10 },
  { symbol: 'Am', name: 'Americium', group: 9, period: 10 },
  { symbol: 'Cm', name: 'Curium', group: 10, period: 10 },
  { symbol: 'Bk', name: 'Berkelium', group: 11, period: 10 },
  { symbol: 'Cf', name: 'Californium', group: 12, period: 10 },
  { symbol: 'Es', name: 'Einsteinium', group: 13, period: 10 },
  { symbol: 'Fm', name: 'Fermium', group: 14, period: 10 },
  { symbol: 'Md', name: 'Mendelevium', group: 15, period: 10 },
  { symbol: 'No', name: 'Nobelium', group: 16, period: 10 },
  { symbol: 'Lr', name: 'Lawrencium3', group: 17, period: 10 },
  { symbol: 'Rf', name: 'Rutherfordium', group: 4, period: 7 },
  { symbol: 'Db', name: 'Dubnium', group: 5, period: 7 },
  { symbol: 'Sg', name: 'Seaborgium', group: 6, period: 7 },
  { symbol: 'Bh', name: 'Bohrium', group: 7, period: 7 },
  { symbol: 'Hs', name: 'Hassium', group: 8, period: 7 },
  { symbol: 'Mt', name: 'Meitnerium', group: 9, period: 7 },
  { symbol: 'Ds', name: 'Darmstadtium', group: 10, period: 7 },
  { symbol: 'Rg', name: 'Roentgenium', group: 11, period: 7 },
  { symbol: 'Cn', name: 'Copernicium', group: 12, period: 7 },
  { symbol: 'Uut', name: 'Ununtrium', group: 13, period: 7 },
  { symbol: 'Fl', name: 'Flerovium', group: 14, period: 7 },
  { symbol: 'Uup', name: 'Ununpentium', group: 15, period: 7 },
  { symbol: 'Lv', name: 'Livermorium', group: 16, period: 7 },
  { symbol: 'Uus', name: 'Ununseptium', group: 17, period: 7 },
  { symbol: 'Uuo', name: 'Ununoctium', group: 18, period: 7 }
];

var currentFormation = 0;
var domElements = [];
var formations = [
  tableFormation,
  gridFormation,
  spiralFormation
];

var cameraPositions = [
];
var springConstant = 0.5;
var springDeceleration = 0.7;

function elementDelay(i) {
  return i * 5;
}


function divWithClass(cls) {
  var element = document.createElement('div');
  element.classList.add(cls);
  return element;
}

function createElements() {
  var root = document.querySelector('.root');
  chemicalElements.forEach(function(chemElement) {
    var element = divWithClass('element');
    var symbol = divWithClass('element__symbol');
    var name = divWithClass('element__name');
    symbol.textContent = chemElement.symbol;
    name.textContent = chemElement.name;
    element.appendChild(symbol);
    element.appendChild(name);
    root.appendChild(element);
    domElements.push(element);
  });
}

function tableFormation() {
  var columns = 17;
  var rows = 9;
  var spacing = 60;
  var baseXOffset = -Math.floor(columns / 2) * spacing;
  var baseYOffset = -Math.floor(rows / 2) * spacing;
  snabbt(domElements, {
    rotation: [0, 0, 0],
    position: function(i) {
      var e = chemicalElements[i];
      //return [spacing - (i % 2) * 2 * spacing, e.period * spacing, 0];
      return [baseXOffset + (e.group - 1) * spacing, baseYOffset + e.period * spacing, 0];
    },
    easing: 'spring',
    springConstant: springConstant,
    springDeceleration: springDeceleration,
    delay: elementDelay

  });
}

function gridFormation() {
  var spacing = 120;
  var layerSpacing = 120;
  var cols = 5;
  var elementsPerLayer = 5 * 5;
  var baseXOffset = -Math.floor(cols / 2) * spacing;
  var baseYOffset = -Math.floor(cols / 2) * spacing;
  var layerOffset = Math.floor(5 / 2) * layerSpacing;
  snabbt(domElements, {
    rotation: [0, 0, 0],
    position: function(i) {
      var layerIndex = Math.floor(i / elementsPerLayer);
      var indexWithinLayer = i - layerIndex * elementsPerLayer;
      var row = Math.floor(indexWithinLayer / cols);
      var col = indexWithinLayer % cols;
      return [baseXOffset + col * spacing, baseYOffset + row * spacing, layerOffset - layerIndex * layerSpacing];
    },
    //delay: function(i) { return i * 5; },
    duration: 10000,
    easing: 'spring',
    springConstant: springConstant,
    springDeceleration: springDeceleration,
    delay: elementDelay
  });
}

function spiralFormation() {
  var rots = 5;

  snabbt(domElements, {
    position: function(i, len) {
      var x = Math.sin(rots * 2 * Math.PI * i / len);
      var z = Math.cos(rots * 2 * Math.PI * i / len);
      var radius = 300;
      return [radius * x, i * 3, radius * z];
    },
    rotation: function(i, len) {
      var rotation = -(i / len) * rots * Math.PI * 2;
      while (rotation < -2 * Math.PI)
        rotation += 2 * Math.PI;
      return [0, rotation, 0];
    },
    easing: 'spring',
    springConstant: springConstant,
    springDeceleration: springDeceleration,
    delay: elementDelay
  });
}

function rootAnimation() {
  var root = document.querySelector('.root');
  var constant = 0.2;
  var perspective = 1000;
  snabbt(root, {
    rotation: [0, Math.PI / 4, 0],
    perspective: perspective,
    easing: 'spring',
    springConstant: constant,
    springDeceleration: springDeceleration
  }).snabbt({
    rotation: [-Math.PI / 4, 0, 0],
    perspective: perspective,
    easing: 'spring',
    springConstant: constant,
    springDeceleration: springDeceleration,
  }).snabbt({
    rotation: [0, -Math.PI / 4, 0],
    perspective: perspective,
    easing: 'spring',
    springConstant: constant,
    springDeceleration: springDeceleration,
  }).snabbt({
    rotation: [Math.PI / 4, 0, 0],
    perspective: perspective,
    easing: 'spring',
    springConstant: constant,
    springDeceleration: springDeceleration,
    complete: rootAnimation
  });
}

function cameraOne() {
  var root = document.querySelector('.root');
  snabbt(root, {
    rotation: [Math.PI / 2, 0, 0],
    position: [200, 200, 0],
    duration: 3000,
    perspective: 1000,
    easing: 'spring',
    springConstant: springConstant,
    springDeceleration: springDeceleration

  });
}

function cameraTwo() {
  var root = document.querySelector('.root');
  snabbt(root, {
    rotation: [0, 0, 0],
    position: [0, 0, 1000],
    duration: 3000,
    perspective: 1000,
  });
}

function switchFormation() {
  currentFormation = (currentFormation + 1) % formations.length;
  formations[currentFormation]();
}

function initEventListeners() {
  var container = document.querySelector('.container');
  container.addEventListener('click', function() {
    switchFormation();
  });
}

createElements();
tableFormation();
rootAnimation();
initEventListeners();