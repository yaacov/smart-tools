/**
 * This function is a tag for template literals, intended to trigger
 * syntax highlighting for lit-html templates in editors with the appropriate
 * plugin installed.
 *
 * @param {TemplateStringsArray} strings - The template strings.
 * @param {...*} values - The values to interpolate into the template.
 * @returns {string} - The constructed template string with interpolated values.
 */
export function html(strings, ...values) {
  let result = '';
  for (let i = 0; i < values.length; i++) {
    result += strings[i] + values[i];
  }
  result += strings[strings.length - 1];
  return result;
}

export default html;
