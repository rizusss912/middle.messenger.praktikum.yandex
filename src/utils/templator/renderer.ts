import {Observable} from '../observeble/observeble';
import {Subject} from '../observeble/subject';
import {Subscription} from '../observeble/subscription';

export class Renderer<Context extends object, value> {
    protected readonly context: Context;
    protected readonly $staticValues: Subject<value[]> = new Subject<value[]>();
    protected subscription: Subscription<value[]> | undefined;

    constructor(context: Context) {
    	this.context = context;
    }

    protected getFieldValue(fieldName: string): unknown {
    	let out = this.context;

    	for (const field of fieldName.split('.')) {
    		if (field in out) {
    			// @ts-ignore
    			out = out[field];
    		} else {
    			// Только так мы можем понять что поле отсутствует
    			// Любой корректный выход из этой функции считается найденным значением
    			throw new Error(`field ${fieldName} not found`);
    		}
    	}

    	return out;
    }

    protected needSelectValueInObservable(fieldName: string): boolean {
    	const fieldPath = fieldName.split('.');

    	return fieldPath.length > 1
			&& fieldPath[0].length > 0
			&& this.firstFieldIsObservable(fieldName);
    }

    protected firstFieldIsObservable(fieldName: string): boolean {
    	return this.getFirstFieldByFieldName(fieldName) instanceof Observable;
    }

    protected getSelectedObservable<contextValue>(fieldName: string): Observable<contextValue> {
    	if (!this.firstFieldIsObservable(fieldName)) {
    		throw new Error(`first field is not observable: ${fieldName}`);
    	}

    	return (this.getFirstFieldByFieldName(fieldName) as Observable<contextValue>)
    		.select<contextValue>(this.createSelectorByFieldName(fieldName));
    }

    protected initObserveblesSubscription(
    	observebles: Observable<value>[],
    	onValuesChanged: (value?: value[]) => void,
    ): Subscription<value> {
    	if (this.subscription) {
    		this.subscription.unsubscribe();
    	}

    	this.subscription = this.getObservable(observebles).subscribe(onValuesChanged);

    	return this.subscription;
    }

    // TODO: Изменить реализацию метода, когда появится метод merge у Observeble
    protected getObservable(observebles: Observable<value>[]): Observable<value[]> {
    	// Тут проблема с типами из-за костыльной реализации метода
    	// метод merge должен решить эту проблему
    	return Observable.all<value | value[]>(
    		[
				this.$staticValues.asObserveble() as Observable<value | value[]>,
				...observebles as Observable<value | value[]>[],
    		],
    	)
    		.map(data => data.length > 1
    			? (data[0] as value[]).concat(data.slice(1, data.length) as value[])
    			: data[0] as value[],
    		);
    }

    protected mapTemplateToField(template: string): string {
    	return template.replace(/[\s{}()[\]]+/gim, '');
    }

    private getFirstFieldByFieldName(fieldName: string): unknown {
    	// @ts-ignore
    	return this.context[fieldName.split('.')[0]];
    }

    private createSelectorByFieldName<contextValue>(
    	fieldName: string,
    ): (value: contextValue) => contextValue {
    	const fieldPath = fieldName.split('.');

    	fieldPath.shift();

    	return function (value: contextValue): contextValue {
    		let out = value;

    		for (const fieldName of fieldPath) {
    			if (typeof out !== 'object') {
    				throw new Error(`Templator: invalid selector (${fieldName}) or observeble value`);
    			}

    			// @ts-ignore
    			out = out[fieldName];
    		}

    		return out;
    	};
    }
}
