// Keep clearing on the same input/change path as typing, including search and saved fields.
export function bindClearableInputs(root, host, label) {
  root.querySelectorAll('input.rl-search, input.rl-input').forEach((input) => {
    if (input.readOnly || input.disabled || input.closest('.rl-clearable')) return;
    const wrapper = host.document.createElement('div');
    wrapper.className = `rl-clearable${input.classList.contains('rl-number') ? ' rl-clearable-number' : ''}`;
    input.before(wrapper);
    wrapper.appendChild(input);
    const button = host.document.createElement('button');
    button.type = 'button';
    button.className = 'rl-input-clear';
    button.textContent = '×';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.onpointerdown = (event) => event.preventDefault();
    button.onclick = () => {
      input.value = '';
      input.focus();
      input.dispatchEvent(new host.Event('input', { bubbles: true }));
      input.dispatchEvent(new host.Event('change', { bubbles: true }));
    };
    wrapper.appendChild(button);
  });
}
