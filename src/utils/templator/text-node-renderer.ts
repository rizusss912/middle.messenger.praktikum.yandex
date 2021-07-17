import {Observable} from "../observeble/observeble";
import { Renderer } from "./renderer";

/**
* Шаблон для поиска вставляемого элемента
* 'server has bin started on port {{PORT}}' => ['{{PORT}}']
*/
const VARIEBLES = /[\{]{2}[\s]*[^\s]+[\s]*[\}]{2}/g;

type contextValue = {
    tempate: string;
    value: unknown;
}

export class TextNodeRenderer<Context extends object> extends Renderer<Context, contextValue> {
    public readonly node: Text;

    private readonly content: string;
    private readonly variablesNames: Map<string, string>;

    constructor(content: string, context: Context) {
        super(context);

        this.content = content;
        this.node = document.createTextNode(content);
        this.variablesNames = this.getFieldsNamesFromContent(this.content);
    }

    public render(): void {
        const observebles: Observable<contextValue>[] = [];
        const staticValues: contextValue[] = [];

        for (var [fieldTemplate, fieldName] of this.variablesNames.entries()) {
            try {
                var fieldValue = this.getFieldValue(fieldName);

                if (typeof fieldValue === 'function') {
                    fieldValue = fieldValue.call(this.context);
                }

                if (fieldValue instanceof Observable) {
                    this.addObservable(observebles, fieldTemplate, fieldValue);
                } else {
                    staticValues.push({tempate: fieldTemplate, value: fieldValue});
                }
            } catch (e) {
                console.error(`Error when rendering text: ${e}`);
            }
        }

        if (!this.subscription) {
            this.initObserveblesSubscription(observebles, values => this.onValuesChanged(values));
        }

        this.$staticValues.next(staticValues);
    }

    private getFieldsNamesFromContent(text: string): Map<string, string> {
        return new Map(
                [... new Set<string>(text.match(VARIEBLES) || [])]
                .map(fieldTemplate => [fieldTemplate, this.mapTemplateToField(fieldTemplate)])
            );
    }

    private addObservable(observebles: Observable<contextValue>[], fieldTemplate: string, fieldValue: Observable<unknown>): void {
        observebles.push(
            fieldValue.map(value => {return {tempate: fieldTemplate, value}})
        );
    }

    private onValuesChanged(values: contextValue[]): void {
        var content = this.content;

        for (var value of values) {
            switch(typeof value.value) {
                case 'function':
                    content = content.replaceAll(value.tempate, value.value.call(this.context));
                    break;
                default:
                    content = content.replaceAll(value.tempate, String(value.value));

            }
        }

        this.node.textContent = content;
    }
}