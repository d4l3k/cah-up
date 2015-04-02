/*global angular, window*/
'use strict';

angular.module('starter.services', [])

.factory('Cards', function() {
  // Might use a resource here that returns a JSON array

  return {
    categories: window.cards,
  };
});
