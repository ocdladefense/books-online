/** @jsx vNode */

/**
 * This is our list of components to be used in the app.
*/


export { InlineModalComponent };
import { vNode } from '../../view/view.js';



const InlineModalComponent = function(props) {


  return (
    <div class="modal inline-modal" id={props.id}>
      <div class="modal-container">
        <div class="modal-content">
          Loading...
        </div>
      </div>
    </div>
  )
};