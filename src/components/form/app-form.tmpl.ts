export const template = `
    <form name={{name}} @submit={{onSubmit}}>
        <slot name="field"></slot>
        <slot name="submit"></slot>
    </form>
`;
