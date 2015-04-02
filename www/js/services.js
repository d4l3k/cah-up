/*global angular, window*/
'use strict';

angular.module('starter.services', [])

.factory('Cards', function() {
  // Might use a resource here that returns a JSON array

  var cards = window.cards;

  var cardCategories = {};

  cards.forEach(function(card) {
    if (!cardCategories[card.watermark]) {
      cardCategories[card.watermark] = [];
    }
    cardCategories[card.watermark].push(card);
  });

  return {
    categories: cardCategories,
  };
});
