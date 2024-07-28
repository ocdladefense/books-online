import BooksOnlineController from './BooksOnlineController.js';

import '/node_modules/@ocdladefense/modal/src/css/loading.css';
import '/node_modules/@ocdladefense/modal/src/css/modal.css';
import '/node_modules/@ocdladefense/modal/src/css/inline-modal.css';
import '/themes/books-online/css/main.css';
import '/themes/books-online/css/citations.css';
import '/themes/books-online/css/headings.css';
import '/themes/books-online/css/toc.css';
import '/themes/books-online/css/modal.css';
import '/themes/books-online/css/tools.css';

import '/themes/books-online/css/desktop.css'; //'(min-width:767px)' 

let controller;
window.onload = () => {
    controller = new BooksOnlineController();
}