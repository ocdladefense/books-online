/** @jsx vNode */

export { InlineModal };
import { InlineModalComponent } from "./components.js";
import { vNode, View } from "../../view/view.js";
var InlineModal = function () {
  var proto = {
    show: function show(x, y) {
      if (x && y) {
        x = x + 'px';
        y = y + 'px';
        $('#' + this.selector).css('top', y);
        $('#' + this.selector).css('left', x);
      }
      $('#' + this.selector).css("display", "block");
    },
    hide: function hide() {
      $('#' + this.selector).css("display", "none"); //setTimeout(() => $('body').removeClass('has-modal-jr', 100));
    },

    render: function render(vNode) {
      document.getElementById('modal').innerHtml = "";
      document.getElementById('modal').appendChild(View.createElement(vNode));
    },
    renderHtml: function renderHtml(html) {
      document.querySelector('#' + this.selector + ' .modal-content').innerHTML = html;
    },
    html: function html(_html) {
      this.renderHtml(_html);
    },
    getRoot: function getRoot() {
      return this.root;
    }
  };
  function InlineModal(selector) {
    this.root = View.createElement(vNode(InlineModalComponent, {
      id: selector
    }));
    this.selector = selector;
    document.querySelector("body").appendChild(this.root);
  }
  InlineModal.prototype = proto;
  return InlineModal;
}();