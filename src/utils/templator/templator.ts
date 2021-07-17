//TODO: Возможно стоит переписать класс. без регулярок выйдет за o(n)
//TODO: * почему-то ломает текстовую ноду. Надо править регулярки
//TODO: Вынести часть реализации в helper
//TODO: Когда появятся тесты, описание можно будет убрать

import { Observable } from "../observeble/observeble";
import { Subscription } from "../observeble/subscription";
import { HTMLElementsRenderManager } from "./html-elements-render-manager";
import { TextNodesRenderManager } from "./text-nodes-render-manager";

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
const TEG_ATTRIBUTES = /([(<|<\/)\w\-]+(?:=)?(?:"|'|\{\{|\}\})?[\w\-|\(|\)|\.|\$]+(?:"|'|\{\{|\}\})?)/gim;
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
 * refactor!
 */
const VARIEBLES = /[\{\[]{2}[\s]*[A-z\.\(\)\$]+[\s]*[\}\]]{2}/g;
/**
 * Получает строку состоящую из букв, точек и круглых скобок. Пример:
 * '{{ api.test.getValue()}}' => ['api.test.getValue()']
 * refactor!
 */
const VARIEBLE_VALUE = /[^\{\}\[\] ]+/;

type customAttribute = {
    name: string;
    value: string;
}

export type RenderOptions = {
    content?: HTMLElement[] | Observable<HTMLElement[]>,
};

//TODO: Разобраться с типизацией страниц и компонентов type Context = {[key: string]: any};

export class Templator<Context extends object> {
    slotsMap: Map<HTMLElement, HTMLElement[]> = new Map();
    contentElement: HTMLElement;
    nodes: HTMLElement[];
    contentSubscription: Subscription<HTMLElement[]> | undefined;

    private readonly template: string;
    private readonly context: Context;
    private readonly textNodesRenderManager: TextNodesRenderManager<Context>;
    private readonly htmlElementRendererManager: HTMLElementsRenderManager<Context>;

    constructor(template = '', context: Context) {
        if (typeof template !== 'string') throw new Error('Templator: template is not string');

        this.context = context;
        this.template = template;
        this.textNodesRenderManager = new TextNodesRenderManager(this.context);
        this.htmlElementRendererManager = new HTMLElementsRenderManager(this.context);
        this.nodes = this.initTemplate(this.template);
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
                parent.appendChild(this.textNodesRenderManager.initTextNode(content));
            } else {
                outNodes.push(node);
                outNodes.push(this.textNodesRenderManager.initTextNode(content));
            }
        }
        // получаем массив, который содержит один тег и контент до следующего тега
        const htmlConfig = str.match(HTML_TAG_AND_CONTENT)
            .map(str => {
                // выбираем только тег
                const tagStr = str.match(TEG)[0];
                const content = str.split(tagStr)[1];
                // разбиваем тег на массив из имени тега и атрибутов (также элементы могут быть в {} и [])
                const tagArray = tagStr.match(TEG_ATTRIBUTES);

                if (!(OPEN_TEG.test(tagStr))) this.htmlElementRendererManager.initNode(tagStr);
                const tag = {
                    isOpen: !(OPEN_TEG.test(tagStr)),
                    name: tagArray[0].match(TEG_NAME)[0],
                    str: tagStr,
                };

                return {tag, content};
            })

        const htmlElements = [];

        for (let item of htmlConfig) {
            if (item.tag.isOpen) {
                const element = this.htmlElementRendererManager.initNode(item.tag.str);

                if (!this.isSolloTag(element)) {
                    element.appendChild(this.textNodesRenderManager.initTextNode(item.content));
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

    render(options: RenderOptions = {}): void {
        if (
            options.content
            && this.contentElement
            && !this.contentSubscription
        ) this.setContent(options.content);

        this.textNodesRenderManager.renderAll();
        this.htmlElementRendererManager.renderAll();
        this.setSlots();
    }

    setContent(content: HTMLElement[] | Observable<HTMLElement[]> = []): void {
        if (content instanceof Observable) {
            this.contentSubscription = content.subscribe(elements => {
                while (this.contentElement.firstChild) {
                    this.contentElement.removeChild(this.contentElement.firstChild);
                }
                
                for (var node of elements) {
                    this.contentElement.appendChild(node);
                }
            });
        } else {
            for (var node of content) {
                this.contentElement.appendChild(node);
            }
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