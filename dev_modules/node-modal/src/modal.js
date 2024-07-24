/** @jsx vNode */
/*

modal.renderHtml("<h1>Hello World!</h1>");
modal.show();

*/
import {vNode,View} from "../../view/view.js";
export { Modal, ModalComponent };


const Modal = (function() {

    let domAttached = false;

    let defaultLeftNavStyles = "display:inline-block;width:25%; vertical-align:top;overflow-y:auto;overflow-y: auto;position: sticky;max-height: 600px;padding-right:25px;";

    defaultLeftNavStyles = "display:none; width:25%; vertical-align:top;overflow-y:auto;overflow-y: auto;position: sticky;max-height: 600px;padding-right:25px;";

    let defaultStyles = "display:inline-block; width:74%; vertical-align:top; overflow-y: auto; overflow-y: auto; padding: 35px; calc(100% + 100px);";

    // let leftNavStyles = !config.leftNav ? (defaultLeftNavStyles + "display:none;") : (defaultLeftNavStyles + "display:inline-block;");

    let defaultConfig = {
        defaultLeftNavStyles,
        defaultStyles
    };



    let proto = {

        show: function() {
            document.body.classList.add("has-modal");
            document.body.classList.add("loading");
            setTimeout(() => document.getElementById("modal").classList.add("fullscreen"), 100);
        },
        
        
        hide: function() {
            //document.getElementById("modal").classList.remove("fullscreen")
            setTimeout(() => document.body.classList.remove('has-modal'), 100);
        },
        
        attach: function() {
            if(domAttached) return;
            let vnode = <ModalComponent content="" config={this.config} />;
            let node = View.createElement(vnode);
            document.body.appendChild(node);
            document.addEventListener("click", this);
            domAttached = true;
        },
        
        render: function(html) {
            if(!domAttached) {
                this.attach();
            }
            //if modal exists
            let modalElement = document.getElementById("modal");
            if(modalElement != null){
                modalElement.remove();
            }
            let vnode =  <ModalComponent content="" config={this.config} />;
            let node = View.createElement(vnode);
            document.body.replaceChild(node, document.getElementById("modal-backdrop"));
            document.getElementById("modal-content").innerHTML = html;
            document.body.classList.remove("loading");
        },

        
        renderHtml: function(html, targetId) {
            document.body.classList.remove("loading");
            document.getElementById(targetId || "modal-content").innerHTML = html;
        },

        titleBar: function(html) {
            document.getElementById("modal-title-bar-content").innerHTML = html;
            var selector = document.getElementById("dropdown");
            selector.addEventListener("change", ()=> {console.log("Dropdown Selected")});
        },

        title: function(text) {
            document.getElementById("modal-title-bar-title").innerHTML = text;
        },

        leftNav: function(html) {
            document.getElementById("modal-left-nav").innerHTML = html;
        },
        
        
        html: function(html) {
            this.renderHtml(html);
        },

        handleEvent: function(e){
            console.log(e.type);
            let target = e.target;
            if(!["close-modal", "modal-backdrop"].includes(target.id)){
                return false;
            }

            e.preventDefault();
            this.hide();
        }
    };


    function Modal(config) {
        this.visible = false;
        this.config = config || defaultConfig;
        
    }

    Modal.prototype = proto;

    return Modal;
})();



const ModalComponent = function(props){
    let content = props.content;
    let config = props.config;
    let customStyles = config.style;
    let leftNavStyles = config.defaultLeftNavStyles;



    return (
    <div id="modal-backdrop">
            <div id="modal">
                <div id="modal-container" style="overflow-y:visible;"> 
                    <div id="modal-body" style="vertical-align:top;">
                        <div id="modal-title-bar" style="text-align:right;">
                            <button style="float:none;" id="close-modal" type="button">X</button>
                            <div id="modal-title-bar-title"></div>
                        </div>
                        <div id="modal-left-nav" class="modal-toc" style={leftNavStyles}>

                        </div>
                        <div id="modal-content" style={customStyles || defaultStyles}>
                        {content}
                        </div>
                    </div>
                </div>
                <div id="loading">
                    <div id="loading-wheel"></div>
                </div>
            </div>  
        </div>
    )
};
