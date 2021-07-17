export const template = `
    <label for={{name}}>
        <slot name="label"></slot>
    </label>
    <input type="text" name={{name}} id={{name}} @focus={{onFocus}} @blur={{onBlur}} @input={{onInput}}>
`;