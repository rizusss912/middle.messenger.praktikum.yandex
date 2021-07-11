//TODO: Возможно стоит переписать класс. без регулярок выйдет за o(n)
//TODO: * почему-то ломает текстовую ноду. Надо править регулярки
//TODO: Вынести часть реализации в helper
//TODO: Когда появятся тесты, описание можно будет убрать
/**
 * Разбивает html на массив по одному тегу в каждом элементе и при этом тег на первом месте. Пример:
 * <div>content<p>text</p>content2</div> =>
 * ['<div>content', '<p>text', '</p>content2', '</div>']
 */
const HTML_TAG_AND_CONTENT = /\<.*?\>[^\<\>]*/gim;
/**
 * Разбивает тег на массив атрибутов. Пример:
 * <div name={{name}} click={{handler()}} type="test" hidden> =>
 * ['<div', 'name={{name}}', 'click={{handler()}}', 'type="test"', 'hidden']
 */
const TEG_ATTRIBUTES = /([(<|<\/)\w\-]+(?:=)?(?:"|'|\{\{|\}\})?[\w\-|\(|\)|\.]+(?:"|'|\{\{|\}\})?)/gim;
/**
 * Выделяет тег. Пример:
 * '<div hidden name={{name}}> content text' => ['<div hidden name={{name}}>']
 */
const TEG = /^\<.*?\>/;
/**
 * Начинается не с </
 */
const OPEN_TEG = /^\<\//;
/**
 * Выделяет из строки всё, кроме '<', '/' и пробелов
 */
const TEG_NAME = /[^</\s]+/;
/**
 * Проверяет содержит ли атрибут значение в двойных фигурных скобках. Примеры:
 * name="test" => false
 * name={{getName()}} => true
 */
const IS_CUSTOM_ATTRIBUTE = /[A-z]+[\s]*\=[\s]*[\{]{2}[\s]*[A-z\.\(\)]+[\s]*[\}]{2}/;
/**
 * Проверяет есть ли в теге знак равенства. Примеры:
 * 'hidden' => false
 * 'name="name"' => true
 */
const HAS_VALUE = /.*=.*/;
/**
 * Достаёт из текста строки в двойных фигурных скобках. Пример:
 * 'server has bin started on port {{PORT}}' => ['{{PORT}}']
 */
const VARIEBLES = /[\{]{2}[\s]*[A-z\.\(\)]+[\s]*[\}]{2}/g;
/**
 * Получает строку состоящую из букв, точек и круглых скобок. Пример:
 * '{{ api.test.getValue()}}' => ['api.test.getValue()']
 */
const VARIEBLE_VALUE = /[A-z\.\(\)]+/;

type customAttribute = {
    name: string;
    value: string;
}

export type RenderOptions = {
    content?: HTMLElement[],
};

type Context = {[key: string]: any};

export class Templator {
    bindTextNodesMap: Map<string, Text[]> = new Map();
    bindEventsMap: Map<HTMLElement, customAttribute[]> = new Map();
    slotsMap: Map<HTMLElement, HTMLElement[]> = new Map();
    contentElement: HTMLElement;
    template: string;
    nodes: HTMLElement[];

    constructor(template = '') {
        if (typeof template !== 'string') throw Error('Templator: template is not string');

        this.template = template;
        this.nodes = this.initTemplate(template);
    }

    initTemplate(str): HTMLElement[] {
        const outNodes = [];
        const addToChain = (node, content) => {
            const getParent = () => {
                //из-за того что есть не закрывающиеся теги
                const parentIndex = htmlElements[htmlElements.length - 1] !== node
                    ? htmlElements.length - 1
                    : htmlElements.length - 2;

                if(!htmlElements[parentIndex]) {
                    throw new Error('Templator: the parent could not be found, most likely the element with the "slot" attribute lies in the root of the template');
                }

                return htmlElements[parentIndex];
            }

            if (node.hasAttribute('slot')) {
                const parent = getParent();

                if (this.slotsMap.has(parent)) {
                    this.slotsMap.get(parent).push(node);
                } else {
                    this.slotsMap.set(parent, [node]);
                };

                return;
            }

            if (htmlElements.length > 1) {
                const parent = getParent();

                parent.appendChild(node);
                parent.appendChild(this.initBindTextNode(content));
            } else {
                outNodes.push(node);
                outNodes.push(this.initBindTextNode(content));
            }
        }
        // получаем массив, который содержит один тег и контент до следующего тега
        //TODO: Не даёт писать атрибу
        const htmlConfig = str.match(HTML_TAG_AND_CONTENT)
            .map(str => {
                // выбираем только тег
                const tagStr = str.match(TEG)[0];
                const content = str.split(tagStr)[1];
                // разбиваем тег на массив из имени тега и атрибутов (также элементы могут быть в {} и [])
                //TODO: нужно переписать логику на что-нибудь менее страшное
                const tagArray = tagStr.match(TEG_ATTRIBUTES);

                const tag = {
                    isOpen: !(OPEN_TEG.test(tagStr)),
                    name: tagArray[0].match(TEG_NAME)[0],
                    attributes: tagArray.slice(1),
                };

                return {tag, content};
            })

        const htmlElements = [];

        for (let item of htmlConfig) {
            if (item.tag.isOpen) {
                const element = document.createElement(item.tag.name);

                for (var attribute of item.tag.attributes) {
                    if (!IS_CUSTOM_ATTRIBUTE.test(attribute)) {
                        const atr = HAS_VALUE.test(attribute) ? attribute.split('=') : [attribute, ''];
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

    initBindTextNode(content: string): Text {
        const node = document.createTextNode(content.trim());

        const varieblesArr = content.match(VARIEBLES);
        
        if (!varieblesArr) return node;

        const variebles = varieblesArr.map(value => value.match(VARIEBLE_VALUE)[0]);

        for (var varieble of variebles) {
            if (this.bindTextNodesMap.has(varieble)) {
                this.bindTextNodesMap.get(varieble).push(node);
            } else {
                this.bindTextNodesMap.set(varieble, [node]);
            }
        }

        return node;
    }

    render(context: Context, options: RenderOptions = {}): void {
        if (options.content && this.contentElement) this.setContent(options.content);

        this.setContext(context);
        this.setAttributesAndEventListeners(context);
        this.setSlots();
    }

    setContent(content: HTMLElement[] = []): void {
        for (var node of content) {
            this.contentElement.appendChild(node);
        }
    }

    setSlots(): void {
        for (let parent of this.getMapKeys(this.slotsMap)) {
            for (var slot of this.slotsMap.get(parent)) {
                const slotNode =  this.getSlotNode(parent, slot.getAttribute('slot'));

                if (slotNode) slotNode.appendChild(slot);
            }
        }
    }

    setAttributesAndEventListeners(context: Context): void {
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

    setContext(context: Context): void {
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
                node.textContent = node.textContent.replace(reg, String(value));
            }
        }
    }
    //TODO: вынести в утилиту
    getMapKeys<key, value>(map: Map<key, value>): key[] {
        const keys = [];

        map.forEach((value, key) => keys.push(key));

        return keys;
    }

    isSolloTag(element: HTMLElement): boolean {
        const solloTags = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'hr', 'img',
            'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'content'];
        return solloTags.includes(element.tagName.toLowerCase());
    }

    isContentElement(element: HTMLElement): boolean {
        return element.tagName.toLowerCase() === 'content';
    }

    // node.querySelector("slot[name="name"]")
    getSlotNode(node: Element, name: string): Element | null {
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