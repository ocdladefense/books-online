# books-online
A better reading experience for OCDLA's Books Online subscribers.


## Installation
* Clone <code>@ocdladefense/books-online</code>.
* Switch to the <code>development</code> branch.
* Initialize any Git submodules.  _Note: these commands should be run in the project root._
  * Run <code>git submodule init</code>.
  * Run <code>git submodule update</code>.
* Update NPM packages by running <code>npm update</code>.
* Use VSCode’s LiveServer in <code>src/index.html</code>.




## Related projects
* ORS Viewer
  * https://tnguyen-win.github.io/ocdla_wiki_tailwindcss/


## Project notes
_These notes were made July 23, 2024.  The development instance for this application can be found [here](https://pubs.ocdla.org/fsm/1)._
* Document finished features or features that are incomplete and determine what code/libraries?
* Note the location of each feature on the page.
  * Document outline feature is currently hidden (display:none) in the CSS; let's unhide.
* Retrieve chapter HTML from api call (unwritten).
* Global header (with branding and basic nav).
* Table of Contents (column 1) - list chapters that are in this publication.
* UX - Chapter picker (necessary for mobile).
* UX - Reference list (display all references for both ORS, OAR and* appellate references).
* Webc-ORS / Webc-OAR components (these displaying the statute text as blockquotes).
* Update sections - highlight document revisions.
* Text manipulation - converting any *inline citation to ORS/OAR to be an HTML link <code><a chapter="12" section="23" subsection="b">ORS 123.33(a)</a></code>.
* UX - ORS Viewer - Let customers click on any ORS citation to view the statute text either in an inline or fullscreen modal.


## Initial branching
* <code>main</code> - Primary branch containing all project code (protected).
* <code>development</code> - Development branch containing all development modules; feature branches will be merged into this branch.
* <code>layout</code> - Initial feature branch including HTML structure, existing markup/css as appropriate; TailwindCSS.
* <code>outline</code> - Inital feature branch including code to traverse the document and retireve bookmarks for display in the document outline.
* <code>github-pages</code> - Branch to facilitate the GitHub pages pipeline for our repo.

## Useful links
* [The wikifix project](https://github.com/ocdladefense/wikifix)
* [Books Online beta - Felony Sentencing Manual](https://pubs.ocdla.org/fsm/1)
* [Intern starter project - deprecated](https://github.com/ocdladefense/intern-starter)
* [ORS Chapter 1 - Oregon Legislature Website](https://www.oregonlegislature.gov/bills_laws/ors/ors001.html)
* [ORS Chapter 1 - Oregon Laws Online](https://oregon.public.law/statutes/ors_1.001)
* [ORS Chapter 1 - OCDLA ORS API](https://appdev.ocdla.org/books-online/index.php?chapter=1)

## Formatting notes
* Change <code>.chapter</code> font from Arial to Verdana.

## Implementation notes
* Given that at least an initial HTML payload will be delivered from the server, how does TailwindCSS's runtime compilation of classes and selectors affect either development or production?
* How to access specific ORS chapters/sections using an already-built API?
  * See the OCDLA ORS API, above.

## Publishing notes
We may be able to reduce the programming complexity of any given feature by introducing upstream publishing modifications.  For example, having editors wrap their ORS/OAR citations (specifically, block quotes) would facilitate the parsing of such blockquotes.

```
== ORS 137.005 ==
“(5) ‘Sentence’ means all legal consequences established or imposed by the trial court after conviction of an offense, including but not limited to:

“(a) Forfeiture, imprisonment, cancellation of license, removal from office, monetary obligation, probation, conditions of probation, discharge, restitution and community service; and

“(b) Suspension of imposition or execution of any part of a sentence, extension of a period of probation, imposition of a new or modified condition of probation or of sentence suspension, and imposition or execution of a sentence upon revocation of probation or sentence suspension.”
== end ==
```

