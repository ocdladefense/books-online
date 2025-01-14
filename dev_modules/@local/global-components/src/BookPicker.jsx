/** @jsx vNode */
/* eslint-disable no-unused-vars */
import { vNode } from '@ocdla/view';
/* eslint-enable */

export default function BookPicker({ onBookChange, books, currentBook }) {
    if (!books) return '';
    return (
        <section class='flex items-center border border-t-0 p-4 capitalize text-black lg:h-16'>
            <ul class='flex flex-wrap items-center whitespace-pre'>
                <li>
                    <select name='breadcrumbs-dropdown' id='breadcrumbs-dropdown' className="max-w-[400px]" onchange={(e) => { let value = e.target.value; onBookChange(value); }}>
                        {books.map((item) => {
                            return (
                                <option key={item.href} value={item.href} selected={item.href === currentBook}>
                                    {item.label}
                                </option>
                            );
                        })}
                    </select>
                </li>
            </ul>
        </section>

    );
}
