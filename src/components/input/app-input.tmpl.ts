export const template = `
    <label for={{$name}} status={{$inputStatus}}>
        <slot name="label" instead-of-text={{$labelIsInsteadOfText}}></slot>
    </label>
    <input type="text" name={{$name}} id={{$name}} disabled={{$disabled}} @focus={{onFocus}} @blur={{onBlur}} @input={{onInput}}>
    <div underline={{$inputStatus}}></div>
    <p transparent={{$needHiddenErrors}} class="error">
        {{$errorMessage}}
    </p>
`;
