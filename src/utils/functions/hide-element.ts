export function hideElement(element: Element): void {
    element.setAttribute('hidden', '');
}

export function showElement(element: Element): void {
    element.removeAttribute('hidden');
}