/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode } from '@ocdla/view';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbDropdown from './BreadcrumbDropdown';
/* eslint-enable */

export default function Breadcrumbs({ crumbs = [] }) {
    return (
        <section class='flex items-center border border-t-0 p-4 capitalize text-black lg:h-16'>
            <ul class='flex flex-wrap items-center whitespace-pre'>
                {crumbs.map((crumb, i) => {
                    const seperatorString =
                        i !== crumbs.length - 1 ? ' / ' : ' ';

                    if (crumb.entries)
                        return (
                            <>
                                <BreadcrumbDropdown {...crumb} />
                                {seperatorString}
                            </>
                        );
                    console.log(crumb);
                    return (
                        <>
                            <BreadcrumbItem {...crumb} />
                            {seperatorString}
                        </>
                    );
                })}
            </ul>
        </section>
    );
}
