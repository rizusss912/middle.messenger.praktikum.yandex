export function Service() {
	return function (constructor: Function) {
		return constructor;
	};
}
