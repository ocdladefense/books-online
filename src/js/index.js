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


import HttpClient from "@ocdla/lib-http/HttpClient.js";

// import { OrsApiMock } from "./mock/OrsApiMock.js";
// import { OarApiMock } from "./mock/OarApiMock.js";
import { BonMock } from "./mock/BonMock.js";

if (true) {
    //HttpClient.register("https://appdev.ocdla.org/", new OrsApiMock());
    //HttpClient.register("https://appdev.ocdla.org/", new OarApiMock());
    HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}




let controller = new BooksOnlineController();