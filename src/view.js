'use strict';

// Manage our view state between Map and Cards.

const log = require('./log');
const bridges = require('./bridges');
const map = require('./map');

let viewButton;
let mapView;
let cardsView;
let loadingSpinner;
let noCardsWarning;

let switchViewFn;

const useMapView = () => {
  log.info('Switching to Map View');

  mapView.classList.remove('hidden');
  cardsView.classList.add('hidden');

  viewButton.classList.remove('map-icon');
  viewButton.classList.add('cards-icon');
  viewButton.title = 'View collected cards';

  map.redraw();

  switchViewFn = useCardsView;
};

const useCardsView = () => {
  log.info('Switching to Cards View');

  // Get all the unlocked bridges and show their cards
  bridges
    .getUnlocked()
    .then(unlocked => {
      cardsView.innerHTML = '';

      if (!unlocked.length) {
        noCardsWarning.classList.remove('hidden');
      } else {
        noCardsWarning.classList.add('hidden');
        unlocked.forEach(unlockedBridge => {
          cardsView.appendChild(unlockedBridge.cardImgEl);
        });
      }

      mapView.classList.add('hidden');
      cardsView.classList.remove('hidden');

      viewButton.classList.add('map-icon');
      viewButton.classList.remove('cards-icon');
      viewButton.title = 'View map';

      switchViewFn = useMapView;
    })
    .catch(err => log.debug('Error getting unlocked bridges', err));
};

module.exports.init = () => {
  viewButton = document.querySelector('#view-button');
  mapView = document.querySelector('#map');
  cardsView = document.querySelector('#cards');
  loadingSpinner = document.querySelector('.loading-spinner');
  noCardsWarning = document.querySelector('#no-cards-warning');

  // Stop showing the startup spinner now that map is drawn
  log.info('Removing loading spinner');
  if (loadingSpinner) {
    loadingSpinner.classList = 'hidden';
  }

  // Listen for click events on the view button
  viewButton.addEventListener('click', e => {
    e.preventDefault();
    switchViewFn();
    return false;
  });

  // Show the view mode toggle button
  viewButton.classList.remove('hidden');

  // Initially we're in Map View
  useMapView();
};
