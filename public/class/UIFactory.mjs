export class UIFactory {
    static createInputText(options) {
        let item = document.createElement("input");
        item.setAttribute("type", "text");
        item.value = options ? options.value || "" : "";
        if(!item.value || !item.value.length) {
            item.classList.add("empty");
        }
        if(options.class) {
            if(!Array.isArray(options.class)) { options.class = options.class.split(" "); }
            options.class.forEach(c => item.classList.add(c));
        }
        if(options.onall) {
            item.onchange = function(event) {
                UIFactory.updateEmpty(event);
                options.onall(event);
            };
            item.onkeyup = item.onchange;
            item.oncut = item.onchange;
            item.onpaste = item.onchange;
            item.oninput = item.onchange;
        }
        if(options.onchange) {
            item.onchange = function(event) { UIFactory.updateEmpty(event); options.onchange(event); };
        }
        if(options.onkeyup) {
            item.onkeyup = function(event) { UIFactory.updateEmpty(event); options.onkeyup(event); };
        }
        if(options.oncut) {
            item.oncut = function(event) { UIFactory.updateEmpty(event); options.oncut(event); };
        }
        if(options.onpaste) {
            item.onpaste = function(event) { UIFactory.updateEmpty(event); options.onpaste(event); };
        }
        if(options.oninput) {
            item.oninput = function(event) { UIFactory.updateEmpty(event); options.oninput(event); };
        }
        return item;
    }

    static updateEmpty(event) {
        if(event.target.value && event.target.value.length) {
            event.target.classList.remove("empty");
        } else {
            event.target.classList.add("empty");
        }
    }

    static createButton(options) {
        let item = document.createElement("button");
        if(options.text) {
            item.appendChild(document.createTextNode(options.text));
        }
        if(options.class) {
            if(!Array.isArray(options.class)) { options.class = options.class.split(" "); }
            options.class.forEach(c => item.classList.add(c));
        }
        if(options.image) {
            let im = document.createElement("img");
            im.setAttribute("src", options.image);
            item.appendChild(im);
        }
        if(options.title) {
            item.setAttribute("title", options.title);
        }
        if(options.onclick) {
            item.onclick = function(event) { options.onclick(event); };
        }
        return item;
    }
}