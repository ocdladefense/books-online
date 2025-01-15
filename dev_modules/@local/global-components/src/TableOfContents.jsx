/** @jsx vNode */ /** @jsxFrag "Fragment" */
import { vNode } from "@ocdla/view";
export default function TableOfContents({ onChapterChange, entries, currentChapter }) {
    return <aside class='lg:sticky lg:top-0 hidden h-[87.5vh] list-none overflow-y-scroll lg:block overflow-x-clip'>
        <ul id="toc-sidebar" class="list-none">
            {entries.map((entry) => {
                return (
                    <li onclick={(e) => { e.stopPropagation(); e.preventDefault(); onChapterChange(entry.getUnit()); }}>
                        <a
                            id={entry.getId()}
                            class={["group", "flex", "flex-col", "gap-2", "border-b", "px-4", "py-2", entry.getUnit() === currentChapter ? 'text-white border-black bg-black' : 'hover:bg-neutral-100'].join(" ")}
                            href='#'>
                            <h1 class='text-blue-400 group-hover:text-blue-500 font-bold'>
                                {entry.isChapter() ? entry.getHeading() : null}
                            </h1>
                            <p>{entry.getName()}</p>
                        </a>
                    </li>
                );
            })}
        </ul>
    </aside>
}