/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { vNode } from "@ocdla/view";

import Sidebar from "@ocdla/global-components/src/Sidebar.jsx";
import Sidebar_Item_Left from "@ocdla/global-components/src/SidebarItemLeft.jsx";
export default function TableOfContents({ entries }) {

    return <Sidebar sticky={true}>
        <ul id="toc-sidebar" class="list-none">
            {entries.map((entry) => {
                return (
                    <Sidebar_Item_Left
                        active={false}
                        id={entry.getId()}
                        href={entry.getHref()}
                        heading={entry.isChapter() ? entry.getHeading() : null}
                        label={entry.getName()}
                    >
                        <span class="font-bold">
                            {entry.isChapter() ? entry.getHeading() : null}
                        </span>
                        <div>{entry.getName()}</div>
                    </Sidebar_Item_Left>
                );
            })}
        </ul>
    </Sidebar>
}