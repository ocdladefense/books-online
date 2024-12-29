// Global components
import "../css/input.css";
import BooksOnlineController from "./BooksOnlineController.js";
import "/themes/books-online/css/main.css";
import "/themes/books-online/css/citations.css";
import "/themes/books-online/css/headings.css";
import "/themes/books-online/css/toc.css";
import "/themes/books-online/css/modal.css";
import "/themes/books-online/css/tools.css";
import "/themes/books-online/css/desktop.css";
import HttpClient from "@ocdla/lib-http/HttpClient.js";


import { BonMock } from "./mock/BonMock.js";

if (USE_MOCK) {
  HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}

let controller = new BooksOnlineController();



