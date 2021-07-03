//TODO: Вынести все регулярки в константы
export class Templator {
    isAppend = false;
    bindTextNodesMap = new Map();

    constructor(template = '') {
        if (typeof template !== 'string') throw Error('Templator: template is not string');

        this.template = template;
        this.nodes = this.initTemplate(template);
    }

    initTemplate(str) {
        const addToChain = (node, content) => {
            if (htmlElements.length > 1) {
                const parent = htmlElements[htmlElements.length - 2];

                parent.appendChild(node);
                parent.appendChild(this.initBindTextNode(content));
            } else {
                outNodes.push(node);
                outNodes.push(this.initBindTextNode(content));
            }
        }
        const outNodes = [];
        // получаем массив, который содержит один тег и контент до следующего тега
        const htmlConfig = str.match(/\<.*?\>[^\<.*?\>]*/g)
            .map(str => {
                // выбираем только тег
                const tagStr = str.match(/^\<.*?\>/)[0];
                const content = str.split(tagStr)[1];
                // разбиваем тег на массив из имени тега и атрибутов (также элементы могут быть в {} и [])
                const tagArray = tagStr.match(/([(<|<\/)\w\-|\{\[]+(?:=)?(?:"|')?[\w\-|\}|\]]+(?:"|')?)/gim);
                const tag = {
                    isOpen: !(/^\<\//.test(tagStr)),
                    name: tagArray[0].match(/[^</ ]+/)[0],
                    attributes: tagArray.slice(1),
                };

                return {tag, content};
            })

        const htmlElements = [];
        
        for (var item of htmlConfig) {
            if (item.tag.isOpen) {
                const element = document.createElement(item.tag.name);

                for (var attribute of item.tag.attributes) {
                    if (!/\{\{.*\}\}/.test(attribute)) {
                        const atr = /.*=.*/.test(attribute) ? attribute.split('=') : [attribute, ''];
                        atr[1] = atr[1].match(/[^"']/) || '';
                        element.setAttribute(...atr);
                    } else {
                        //TODO: тут мы динамически привязываем кастомные атрибуты к классу
                    }
                }

                if (!this.isSolloTag(element)) {
                    element.appendChild(this.initBindTextNode(item.content));
                    htmlElements.push(element);
                } else {
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
        const varieblesArr = content.match(/[\{]{2}[ ]*[A-z\.\(\)]+[ ]*[\}]{2}/g)

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

    render(context) {
        this.setContent(context);
    }

    setContent(context) {
        for (var varieble of this.getMapKeys(this.bindTextNodesMap)) {
            if (varieble in context) {
                const reg = RegExp(`\{\{[ ]*${varieble}[ ]*\}\}`, "gi");
                for(var node of this.bindTextNodesMap.get(varieble)) {
                    //TODO: добавить поддержку функций в шаблоне
                    node.textContent = node.textContent.replace(reg, context[varieble]);
                }
            }
        }
    }
    //TODO: вынести в утилиту
    getMapKeys(map) {
        return [...map].map(value => value[0]);
    }

    isSolloTag(element) {
        const solloTags = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'hr', 'img',
            'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        return solloTags.includes(element.tagName.toLowerCase());
    }
}