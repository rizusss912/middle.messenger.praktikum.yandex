import { Observable } from "../observeble/observeble";
import {Renderer} from "./renderer";

interface Attribute {
    name: string;
    value?: string;
}

interface CustomAttribute {
    name: string;
    value: unknown;
}


/**
 * Разбивает тег на массив атрибутов. Пример:
 * <div name={{name}} click={{handler()}} type="test" hidden> =>
 * ['<div', 'name={{name}}', 'click={{handler()}}', 'type="test"', 'hidden']
 */
 const TEG_ATTRIBUTES = /([(<|<\/)\w\-]+(?:=)?(?:"|'|\{\{|\}\})?[\w\-|\(|\)|\.|\$]+(?:"|'|\{\{|\}\})?)/gim;

export class HTMLElementRenderer<Context extends object> extends Renderer<Context, CustomAttribute> {
    public readonly element: HTMLElement;

    private readonly customAttributes: Map<string,string> = new Map<string,string>();
    private readonly eventListenersMap: Map<string, Function[]> = new Map<string, Function[]>();

    constructor(tagStr: string, context: Context) {
        super(context);

        const tagArr = tagStr.match(TEG_ATTRIBUTES);
        const tagName = tagArr[0].replace(/\</g, '');
        const tagAttributeStrs = tagArr.splice(1);

        this.element = document.createElement(tagName);

        for (var attributeStr of tagAttributeStrs) {
            const attribute: Attribute = this.mapStrToAttribute(attributeStr);

            if (this.isCustomAttribute(attribute)) {
                this.customAttributes.set(attribute.name, attribute.value);
            } else {
                this.element.setAttribute(
                    attribute.name,
                    this.mapAttributeValueToValue(attribute.value),
                );
            }
        }
    }

    public render(): void {
        const observebles: Observable<CustomAttribute>[] = [];
        const staticValues: CustomAttribute[] = [];

        for (var customAttributeEntries of this.customAttributes.entries()) {
            try {
                const value = this.getFieldValue(this.mapTemplateToField(customAttributeEntries[1]));
                const customAttribute = {name: customAttributeEntries[0], valueTemplate: customAttributeEntries[1]};

                if (value instanceof Observable) {
                    this.addObservable(observebles, value, customAttribute.name, customAttribute.valueTemplate);
                } else {
                    staticValues.push({...customAttribute, value});
                }
            } catch (e) {
                console.error(`Error when rendering attribute in ${this.element.tagName} HTMLElement: ${e}`);
            }
        }

        if (!this.subscription) {
            this.initObserveblesSubscription(observebles, values => this.onValuesChanged(values));
        }

        this.$staticValues.next(staticValues);
    }

    private onValuesChanged(values: CustomAttribute[]): void {
        for (var value of values) {
            this.onValueChanged(value);
        }
    }

    private onValueChanged(attribute: CustomAttribute): void {
        switch(typeof attribute.value) {
            case "function":
                if (
                    this.eventListenersMap.has(attribute.name)
                    && this.eventListenersMap.get(attribute.name).includes(attribute.value)
                ) return;

                this.eventListenersMap.has(attribute.name)
                    ? this.eventListenersMap.get(attribute.name).push(attribute.value)
                    : this.eventListenersMap.set(attribute.name, [attribute.value]);

                this.element.addEventListener(attribute.name, (e) => (attribute.value as Function).call(this.context, e));
                break;
            case "string":
                this.element.setAttribute(attribute.name, attribute.value);
                break;
            case "boolean":
                if (attribute.value) {
                    if (!this.element.hasAttribute(attribute.name)) this.element.setAttribute(attribute.name, '');
                } else {
                    this.element.removeAttribute(attribute.name);
                }
                break;
            default:
                this.element.setAttribute(attribute.name, String(attribute.value));
                break;
          }
    }

    private addObservable(
        observebles: Observable<CustomAttribute>[],
        observeble: Observable<unknown>,
        name: string,
        valueTemplate: string,
        ) {
        observebles.push(
            observeble.map(value => {return {name, value, valueTemplate}}),
        );
    }

    private mapStrToAttribute(str: string): Attribute {
        const strArr = str.split('=');

        return strArr.length > 1
            ? {name: strArr[0], value: strArr[1]}
            : {name: strArr[0]};
    }

    private mapAttributeValueToValue(template: string | undefined): string | undefined {
        if (!template) return;

        return String(template).replace(/[\'\"]+/g, '');
    }

    private isCustomAttribute(attribute: Attribute): boolean {
        if (!attribute.value) return false;

        return  /[\{]{2}(.+)[\}]{2}/.test(String(attribute.value));
    }
}