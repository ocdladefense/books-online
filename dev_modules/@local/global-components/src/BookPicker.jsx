/** @jsx vNode */
/* eslint-disable no-unused-vars */
import { vNode } from '@ocdla/view';
/* eslint-enable */

export default function BookPicker({ onBookChange, href, entries }) {
    return (
        <section class='flex items-center border border-t-0 p-4 capitalize text-black lg:h-16'>
            <ul class='flex flex-wrap items-center whitespace-pre'>
                <li>
                    <select name='breadcrumbs-dropdown' id='breadcrumbs-dropdown' className="max-w-[400px]" onChange={onBookChange}>
                        {entries.map((item) => {
                            return (
                                <option key={item.href} value={item.href} selected={item.href === href}>
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
