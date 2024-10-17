/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode } from "@ocdla/view";
import Navbar from "@ocdla/global-components/src/Navbar";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs";
import Sidebar from "@ocdla/global-components/src/Sidebar";
import ORS_Section_Link from "./components/ORS_Section_Link";
import Sidebar_Item from "@ocdla/global-components/src/Sidebar_Item";
import Body from "@ocdla/global-components/src/Body";
import Footer from "@ocdla/global-components/src/Footer";
/* eslint-enable */
import Books_Online_Breadcrumbs_Items from "../data/json/books-online/breadcrumbs/items.json";
import Books_Online_Sidebar_Left_Items from "../data/json/books-online/sidebar_left/items.json";
import Books_Online_Sidebar_Right_Items from "../data/json/books-online/sidebar_right/items.json";

export default function App({
  view,
  currentAppType,
  headerPinned,
  currentVolume,
  currentTitle,
  currentChapter,
  currentSection,
  items_breadcrumbs_ors_viewer,
  items_sidebar_left_ors_viewer,
  items_sidebar_left_books_online,
  html_body_ors_viewer,
  items_sidebar_right_ors_viewer,
}) {
  const appTypeIndicators = currentAppType ? "📚" : "🔍";
  const appTypeString = currentAppType ? "books-online" : "ors-viewer";

  // console.log(items_sidebar_left_books_online);

  return (
    <>
      <div
        // Preserve whitespace at end of top-0
        // prettier-ignore
        class={`${headerPinned === 'pinned' ? 'fixed ' : 'absolute '}right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2`}
      >
        <button
          class="select-none font-bold"
          onclick={() => {
            currentAppType = !currentAppType;

            view.render(
              <App
                headerPinned={headerPinned}
                currentVolume={currentVolume}
                currentTitle={currentTitle}
                currentChapter={currentChapter}
                currentSection={currentSection}
                items_breadcrumbs_ors_viewer={items_breadcrumbs_ors_viewer}
                items_sidebar_left_ors_viewer={items_sidebar_left_ors_viewer}
                items_sidebar_left_books_online={
                  items_sidebar_left_books_online
                }
                html_body_ors_viewer={html_body_ors_viewer}
                items_sidebar_right_ors_viewer={items_sidebar_right_ors_viewer}
              />
            );
          }}
        >
          {appTypeIndicators} | {appTypeString}
        </button>
      </div>
      <header
        // Preserve whitespace at end of top-0
        // prettier-ignore
        class={`${headerPinned === 'pinned' ? 'sticky top-0 ' : ''}container mx-auto flex w-full flex-col bg-white lg:h-32`}
      >
        <Navbar />
        <Breadcrumbs
          items={
            currentAppType
              ? Books_Online_Breadcrumbs_Items
              : currentAppType === false
              ? items_breadcrumbs_ors_viewer
              : []
          }
        />
      </header>
      {/* <Main cols='3' /> */}
      <div class="container mx-auto border-x">
        {/* <div class='flex flex-col lg:flex-row'> */}
        <div class="lg:grid lg:grid-cols-6">
          {/* ? Ors_Viewer_Sidebar_Left_Items */}
          <Sidebar>
            {/* eslint-disable indent */}
            {currentAppType
              ? Books_Online_Sidebar_Left_Items.map((item) => (
                  <ORS_Section_Link {...item} />
                ))
              : items_sidebar_left_ors_viewer.map((item) => (
                  <ORS_Section_Link {...item} />
                ))}
            {/* eslint-enable */}
          </Sidebar>
          <Body
            view={view}
            type={appTypeString}
            html_body_ors_viewer={html_body_ors_viewer}
          />
          <Sidebar>
            {/* eslint-disable indent */}
            {currentAppType
              ? Books_Online_Sidebar_Right_Items.map((item) => (
                  <Sidebar_Item {...item} />
                ))
              : items_sidebar_right_ors_viewer.map((item) => (
                  <Sidebar_Item {...item} />
                ))}
            {/* eslint-enable */}
          </Sidebar>
        </div>
      </div>
      <Footer
        showFacebook={true}
        showTwitter={true}
        useGoogleMapsIFrame={true}
      />
    </>
  );
}
