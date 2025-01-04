/** @jsx vNode */
/* eslint-disable no-unused-vars */
import { vNode } from '@ocdla/view';
/* eslint-enable */

export default function BreadcrumbDropdown({ href, entries }) {
    return (
        <li>
            <select name='breadcrumbs-dropdown' id='breadcrumbs-dropdown' className="max-w-[400px]">
                {entries.map((item) => {
                    const selected = item.href === href;
                    if (selected) {
                        return (
                            <option key={item.href} value={item.href} selected>
                                {item.label}
                            </option>
                        );
                    }
                    return (
                        <option key={item.href} value={item.href}>
                            {item.label}
                        </option>
                    );
                })}
            </select>
        </li>
    );
}
