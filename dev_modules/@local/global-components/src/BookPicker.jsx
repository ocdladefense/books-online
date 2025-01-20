/** @jsx vNode */
/* eslint-disable no-unused-vars */
import { vNode } from '@ocdla/view';
/* eslint-enable */

export default function BookPicker({ onBookChange, onChapterChange, books, currentBook }) {
    books = books || [];
    return (
        <section class='flex items-center border border-t-0 p-4 capitalize text-black lg:h-16'>
            <ul class='flex flex-wrap items-center whitespace-pre'>
                <li>
                    <select name='breadcrumbs-dropdown' id='breadcrumbs-dropdown' className="max-w-[400px]" onchange={(e) => { onChapterChange(e.target.dataset.default); onBookChange(e.target.value); }}>
                        {books.map((book) => {
                            return (
                                <option key={book.shortName} value={book.shortName} data-default={book.default} {...(book.shortName === currentBook ? { selected: true } : {})}>
                                    {book.name}
                                </option>
                            );
                        })}
                    </select>
                </li>
            </ul>
        </section>

    );
}
