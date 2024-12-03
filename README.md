# books-online

A better reading experience for OCDLA's Books Online subscribers.

## Installation

- Clone <code>@ocdladefense/books-online</code>.
- Switch to the <code>development</code> branch.
- If already cloned, be sure to run <code>git pull</code>.
- Initialize any Git submodules. _Note: these commands should be run in the project root._
  - Run <code>git submodule update --init --recursive</code>.
- Update NPM packages by running <code>npm update</code>.
- Run <code>npm run watch</code>.

## Working with Git submodules

### Remove the submodule entry from .git/config

```javascript
git submodule deinit -f path/to/submodule
```

### Remove the submodule directory from the superproject's .git/modules directory

```javascript
rm - rf.git / modules / path / to / submodule;
```

### Remove the entry in .gitmodules and remove the submodule directory located at path/to/submodule

```javascript
git rm -f path/to/submodule
```

## Related projects

- ORS Viewer
  - https://ocdladefense.github.io/ors-viewer/

## TODO

_This list was made August 28, 2024 by Katelyn Sullivan_

- The next major item to tackle is going to be routing.
  - The `Table-Of-Contents` component and the `Router` component are going to be key here
- Next is likely going to be reintegration of the `webc-oar` and `webc-ors` components into the body of the chapters after they render.
- An easy feature once routing is in would be to get section linking implemented.
  - What I mean is given the link 'bon.com/fsm/1#section3' the page should load, the URL should be read and parsed, and then scrolled to that section.
- Mobile navigation was a feature asked about in our presentation. It will look very good if when you present next that you can show off a mobile view of the table of contents and outline.
- Being able to go back to a book, and even a specific section that you were previously looking at was asked about in our presentation. Local storage might be a key tool here.
  - I had the idea of a possible 'Working shortlist' feature where a user could add a section to a clipboad saved in local storage, access it via some slide out sidebar or other list, and it would act as direct section link
  - You could take this a step further with tools in that feature like clearing it, or making multiple shortlists you can switch between, or even saving things other than sections like `oar` or `ors` entries and entire books.
- Adding a service worker in to view the publications offline.

## Project notes

_These notes were made July 23, 2024. The development instance for this application can be found [here](https://pubs.ocdla.org/fsm/1)._

- Document finished features or features that are incomplete and determine what code/libraries?
- Note the location of each feature on the page.
  - Document outline feature is currently hidden (display:none) in the CSS; let's unhide.
- Retrieve chapter HTML from api call (unwritten).
- Global header (with branding and basic nav).
- Table of Contents (column 1) - list chapters that are in this publication.
- UX - Chapter picker (necessary for mobile).
- UX - Reference list (display all references for both ORS, OAR and\* appellate references).
- Webc-ORS / Webc-OAR components (these displaying the statute text as blockquotes).
- Update sections - highlight document revisions.
- Text manipulation - converting any \*inline citation to ORS/OAR to be an HTML link <code><a chapter="12" section="23" subsection="b">ORS 123.33(a)</a></code>.
- UX - ORS Viewer - Let customers click on any ORS citation to view the statute text either in an inline or fullscreen modal.

## Initial branching

- <code>main</code> - Primary branch containing all project code (protected).
- <code>development</code> - Development branch containing all development modules; feature branches will be merged into this branch.
- <code>layout</code> - Initial feature branch including HTML structure, existing markup/css as appropriate; TailwindCSS.
- <code>outline</code> - Inital feature branch including code to traverse the document and retireve bookmarks for display in the document outline.
- <code>github-pages</code> - Branch to facilitate the GitHub pages pipeline for our repo.

## Useful links

- [The wikifix project](https://github.com/ocdladefense/wikifix)
- [Books Online beta - Felony Sentencing Manual](https://pubs.ocdla.org/fsm/1)
- [Intern starter project - deprecated](https://github.com/ocdladefense/intern-starter)
- [ORS Chapter 1 - Oregon Legislature Website](https://www.oregonlegislature.gov/bills_laws/ors/ors001.html)
- [ORS Chapter 1 - Oregon Laws Online](https://oregon.public.law/statutes/ors_1.001)
- [ORS Chapter 1 - OCDLA ORS API](https://appdev.ocdla.org/books-online/index.php?chapter=1)

## Formatting notes

- Change <code>.chapter</code> font from Arial to Verdana.

## Implementation notes

- Given that at least an initial HTML payload will be delivered from the server, how does TailwindCSS's runtime compilation of classes and selectors affect either development or production?
- How to access specific ORS chapters/sections using an already-built API?
  - See the OCDLA ORS API, above.

## Publishing notes

We may be able to reduce the programming complexity of any given feature by introducing upstream publishing modifications. For example, having editors wrap their ORS/OAR citations (specifically, block quotes) would facilitate the parsing of such blockquotes.

```
== ORS 137.005 ==
“(5) ‘Sentence’ means all legal consequences established or imposed by the trial court after conviction of an offense, including but not limited to:

“(a) Forfeiture, imprisonment, cancellation of license, removal from office, monetary obligation, probation, conditions of probation, discharge, restitution and community service; and

“(b) Suspension of imposition or execution of any part of a sentence, extension of a period of probation, imposition of a new or modified condition of probation or of sentence suspension, and imposition or execution of a sentence upon revocation of probation or sentence suspension.”
== end ==
```


# Pandoc general notes
* [Pandoc documentation](https://pandoc.org/MANUAL.html) can be found at: https://pandoc.org/MANUAL.html.
* By default Pandoc converts from Pandoc markdown to HTML.
* You can use Pandoc from the command line: <code>echo "# I am a heading" | pandoc</code>.
* Description of the [<code>styles</code> extension](https://pandoc.org/chunkedhtml-demo/14.2-input.html).


<p>&nbsp;</p>
<p>&nbsp;</p>

# Pandoc conversion examples

### Convert a MediaWiki document to an HTML document.
Given a sample MediaWiki document:
```html
= Felony Sentencing in Oregon: Guidelines, Statutes, Cases =
2019 edition. Includes January 2024 update by Jennelle Meeks Barton.

== Chapter 1 - Introduction ==
'''Jesse Wm. Barton'''

In 1977, the Oregon Legislature adopted the state’s indeterminate (parole matrix) sentencing system. Effective November 1, 1989, the legislature replaced that system with the Oregon Sentencing Guidelines, a determinate sentencing system. The differences between indeterminate and determinate sentencing systems are discussed later in this chapter. Under either system:

<div ref="ORS 138.005(5)(a)-(b)" custom-style="ors" data-custom-style="ors">
“(5) ‘Sentence’ means all legal consequences established or imposed by the trial court after conviction of an offense, including but not limited to:

“(a) Forfeiture, imprisonment, cancellation of license, removal from office, monetary obligation, probation, conditions of probation, discharge, restitution and community service; and

“(b) Suspension of imposition or execution of any part of a sentence, extension of a period of probation, imposition of a new or modified condition of probation or of sentence suspension, and imposition or execution of a sentence upon revocation of probation or sentence suspension.”
</div>
```

We can convert this document to HTML5 using this command:
```bash
# Add the --section-divs flag to get sections wrapped in divs.
pandoc --standalone --metadata title="OCDLA Felony Sentencing Manual" -f mediawiki -t html5 input/fsm-1.wiki -o output/fsm-1.html --template templates/html5.html
```

### Convert wikitest to ICML
```bash
pandoc --standalone --metadata title="OCDLA Felony Sentencing Manual" -f mediawiki -t icml input/fsm-1.wiki -o output/fsm-1.icml --table-of-contents
```

### Convert HTML to DOCX
```bash
pandoc -f html -t docx output/fsm-1.html -o output/fsm-1.docx --reference-doc style/bonstyles.docx
```

### Convert DOCX to HTML
```bash
pandoc --standalone --metadata title="OCDLA Felony Sentencing Manual" -f docx+styles -t html5 output/fsm-1.docx -o fsm-1-FINAL.html --reference-doc style/bonstyles.docx
```


### Convert back to HTML from Word
```bash
pandoc --standalone --metadata title="OCDLA Felony Sentencing Manual" -f docx+styles -t html5 output/fsm-1.docx -o fsm-1-FINAL.html --reference-doc style/bonstyles.docx --section-divs --table-of-contents
```

### Other flags
```bash
pandoc --standalone --metadata title="OCDLA Felony Sentencing Manual" -f mediawiki -t html5 input/fsm-1.wiki -o output/fsm-1.html --bibliography=test.bib
```