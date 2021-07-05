//TODO: Вынести все регулярки в константы (возможно стоит переписать класс. без регулярок выйдет за o(n))
//TODO: * почему-то ломает текстовую ноду Надо править регулярки
//TODO: Вынести часть реализации в helper
export class Templator {
    isAppend = false;
    bindTextNodesMap = new Map();
    bindEventsMap = new Map();
    slotsMap = new Map();
    contentElement;

    constructor(template = '') {
        if (typeof template !== 'string') throw Error('Templator: template is not string');

        this.template = template;
        this.nodes = this.initTemplate(template);
    }

    initTemplate(str) {
        const outNodes = [];
        const addToChain = (node, content) => {
            const getParent = () => {
                //из-за того что есть не закрывающиеся теги
                var parentIndex = htmlElements[htmlElements.length - 1] !== node
                    ? htmlElements.length - 1
                    : htmlElements.length - 2;

                if(!htmlElements[parentIndex]) {
                    throw new Error('Templator: the parent could not be found, most likely the element with the "slot" attribute lies in the root of the template');
                }

                return htmlElements[parentIndex];
            }

            if (node.hasAttribute('slot')) {
                const parent = getParent(node);

                if (this.slotsMap.has(parent)) {
                    this.slotsMap.get(parent).push(node);
                } else {
                    this.slotsMap.set(parent, [node]);
                };

                return;
            }

            if (htmlElements.length > 1) {
                const parent = getParent(node);

                parent.appendChild(node);
                parent.appendChild(this.initBindTextNode(content));
            } else {
                outNodes.push(node);
                outNodes.push(this.initBindTextNode(content));
            }
        }
        // получаем массив, который содержит один тег и контент до следующего тега
        //TODO: Не даёт писать атрибу

        const htmlConfig = str.match(/\<.*?\>[^\<\>]*/gim)
            .map(str => {
                // выбираем только тег
                const tagStr = str.match(/^\<.*?\>/)[0];
                const content = str.split(tagStr)[1];
                // разбиваем тег на массив из имени тега и атрибутов (также элементы могут быть в {} и [])
                //TODO: нужно переписать логику на что-нибудь менее страшное
                const tagArray = tagStr.match(/([(<|<\/)\w\-]+(?:=)?(?:"|'|\{\{|\}\})?[\w\-|\(|\)|\.]+(?:"|'|\{\{|\}\})?)/gim);

                const tag = {
                    isOpen: !(/^\<\//.test(tagStr)),
                    name: tagArray[0].match(/[^</\s]+/)[0],
                    attributes: tagArray.slice(1),
                };

                return {tag, content};
            })

        const htmlElements = [];

        for (var item of htmlConfig) {
            if (item.tag.isOpen) {
                const element = document.createElement(item.tag.name);

                for (var attribute of item.tag.attributes) {
                    if (!/[A-z]+[\s]*\=[\s]*[\{]{2}[\s]*[A-z\.\(\)]+[\s]*[\}]{2}/.test(attribute)) {
                        const atr = /.*=.*/.test(attribute) ? attribute.split('=') : [attribute, ''];
                        atr[1] = atr[1].match(/[^"']*/gim).reduce((out, str) => out || str) || '';
                        element.setAttribute(...atr);
                    } else {
                        const customAttribute = attribute.split('=');
                        const name = customAttribute[0];
                        const value = customAttribute[1].replace(/[^A-z\.]*/g, '');

                        this.bindEventsMap.has(element)
                            ? this.bindEventsMap.get(element).push({name, value})
                            : this.bindEventsMap.set(element, [{name, value}]);
                    }
                }

                if (!this.isSolloTag(element)) {
                    element.appendChild(this.initBindTextNode(item.content));
                    htmlElements.push(element);
                } else {
                    if (this.isContentElement(element)) this.contentElement = element;

                    addToChain(element, item.content);
                }
            } else {
                if (
                    !htmlElements[htmlElements.length - 1]
                    || htmlElements[htmlElements.length - 1].tagName !== item.tag.name.toUpperCase()
                   ) {
                    throw Error(`Templator: invalid html template: ${str}`);
                }
                addToChain(htmlElements[htmlElements.length - 1], item.content);
                htmlElements.pop();
            }
        }

        if (htmlElements.length) {
            throw Error(`Templator: invalid html template: ${str}`);
        }

        return outNodes;
    }

    initBindTextNode(content) {
        const node = document.createTextNode(content.trim());

        const varieblesArr = content.match(/[\{]{2}[\s]*[A-z\.\(\)]+[\s]*[\}]{2}/g)
        
        if (!varieblesArr) return node;

        const variebles = varieblesArr.map(value => value.match(/[A-z\.\(\)]+/)[0]);

        for (var varieble of variebles) {
            if (this.bindTextNodesMap.has(varieble)) {
                this.bindTextNodesMap.get(varieble).push(node);
            } else {
                this.bindTextNodesMap.set(varieble, [node]);
            }
        }

        return node;
    }

    render(context, options = {}) {
        if (options.content && this.contentElement) this.setContent(options.content);

        this.setContext(context);
        this.setAttributesAndEventListeners(context);
        this.setSlots();
    }

    setContent(content = []) {
        for (var node of content) {
            this.contentElement.appendChild(node);
        }
    }

    setSlots() {
        for (var parent of this.getMapKeys(this.slotsMap)) {
            for (var slot of this.slotsMap.get(parent)) {

                const slotNode =  this.getSlotNode(parent, slot.getAttribute('slot'));

                if (slotNode) slotNode.appendChild(slot);
            }
        }
    }

    setAttributesAndEventListeners(context) {
        for (var element of this.getMapKeys(this.bindEventsMap)) {
            for (var config of this.bindEventsMap.get(element)) {
                let contextPoint = context;

                for(var value of config.value.split('.')) {
                    contextPoint = contextPoint[value];
                }

                if (!contextPoint) break;

                switch(typeof contextPoint) {
                    case "function":
                        element.addEventListener(config.name, (e) => contextPoint.call(context, e));
                        break;
                    case "string":
                        element.setAttribute(config.name, contextPoint);
                        break;
                    case "boolean":
                        if (contextPoint) element.setAttribute(config.name, '');
                    default:
                        element.setAttribute(config.name, String(contextPoint));
                        break;
                  }
            }
        }
    }

    setContext(context) {
        for (var varieble of this.getMapKeys(this.bindTextNodesMap)) {
            var value = context;
            var hasValue = true;

            for (var field of varieble.split('.')) {
                if (field in value && typeof value[field] !== 'undefined') {
                    value = value[field];
                } else {
                    hasValue = false;
                    return;
                }
            }

            if (!hasValue) break;

            const reg = RegExp(`\{\{[ ]*${varieble}[ ]*\}\}`, "gi");
            for(var node of this.bindTextNodesMap.get(varieble)) {
                //TODO: добавить поддержку функций в шаблоне
                node.textContent = node.textContent.replace(reg, value);
            }
        }
    }
    //TODO: вынести в утилиту
    getMapKeys(map) {
        return [...map].map(value => value[0]);
    }

    isSolloTag(element) {
        const solloTags = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'hr', 'img',
            'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'content'];
        return solloTags.includes(element.tagName.toLowerCase());
    }

    isContentElement(element) {
        return element.tagName.toLowerCase() === 'content';
    }

    // node.querySelector("slot[name="name"]")
    getSlotNode(node, name) {
        if (!node.hasChildNodes()) return null;

        for (var index = 0; index < node.children.length; index++) {
            const child = node.children.item(index);

            if (child.tagName === 'SLOT' && child.getAttribute('name') === name) {
                return child;
            }

            var req = this.getSlotNode(child, name);

            if (req) return req;
        }

        return null;
    }
}