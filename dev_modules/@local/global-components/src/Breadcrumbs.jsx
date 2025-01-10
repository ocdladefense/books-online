/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode } from '@ocdla/view';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbDropdown from './BreadcrumbDropdown';
/* eslint-enable */

export default function Breadcrumbs({ items = [] }) {
    return (
        <section class='flex items-center border border-t-0 p-4 capitalize text-black lg:h-16'>
            <ul class='flex flex-wrap items-center whitespace-pre'>
                {items.map((item, i) => {
                    const seperatorString =
                        i !== items.length - 1 ? ' / ' : ' ';

                    if (item.entries)
                        return (
                            <>
                                <BreadcrumbDropdown {...item} />
                                {seperatorString}
                            </>
                        );
                    console.log(item);
                    return (
                        <>
                            <BreadcrumbItem {...item} />
                            {seperatorString}
                        </>
                    );
                })}
            </ul>
        </section>
    );
}
