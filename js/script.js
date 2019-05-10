var pageHeader = document.querySelector('.page-header');
var navToggle = document.querySelector('.page-header__toggle');

pageHeader.classList.remove('page-header--nojs');

navToggle.addEventListener('click', function () {
  if (pageHeader.classList.contains('page-header--opened')) {
    pageHeader.classList.remove('page-header--opened');
    pageHeader.classList.add('page-header--closed');
  } else {
    pageHeader.classList.add('page-header--opened');
    pageHeader.classList.remove('page-header--closed');
  }
});