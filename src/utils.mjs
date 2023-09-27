/**
 * Finds the key in an object by its value.
 *
 * @param {Object} object - The object to search.
 * @param {*} value - The value to search for.
 * @returns {string|undefined} The key of the found value or undefined if not found.
 */
export function findKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

/**
 * Formats a number as a hexadecimal byte string.
 *
 * @param {number} num - The number to format.
 * @returns {string} The formatted hexadecimal string.
 */
export function formatHexByte(num) {
  return `0x${num.toString(16).toUpperCase().padStart(2, '0')}`;
}

/**
 * Formats a number as a decimal string with padding.
 *
 * @param {number} value - The number to format.
 * @param {number} [width=7] - The width to pad to.
 * @returns {string} The formatted decimal string.
 */
export function formatDecimal(value, width = 7) {
  return value.toString().padStart(width);
}

/**
 * Formats a number as a binary string with padding.
 *
 * @param {number} value - The number to format.
 * @param {number} [width=8] - The width to pad to.
 * @returns {string} The formatted binary string.
 */
export function formatBinary(value, width = 8) {
  return value.toString(2).padStart(width, '0');
}

/**
 * Formats a number as a hexadecimal address string.
 *
 * @param {number} value - The number to format.
 * @param {number} [width=2] - The width to pad to.
 * @returns {string} The formatted address string.
 */
export function formatAddress(value, width = 2) {
  return `0x${value.toString(16).toUpperCase().padStart(width, '0')}`;
}

/**
 * Waits for a keypress from the user. If CTRL+C is pressed, the promise is rejected.
 *
 * @returns {Promise<void>} A promise that resolves when any key is pressed.
 * @throws {Error} If CTRL+C is detected.
 */
export async function waitForKeypress() {
  return new Promise((resolve, reject) => {
    console.log('Press any key to continue... (CTRL+C to exit)');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', (data) => {
      const key = data.toString('utf8');
      process.stdin.setRawMode(false);
      process.stdin.pause();

      if (key === '\u0003') { // CTRL+C
        console.log('\nExiting...');
        reject(new Error('CTRL+C detected'));
      } else {
        resolve();
      }
    });
  });
}
