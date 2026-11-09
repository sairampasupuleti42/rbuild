import { readFile, writeFile } from 'node:fs/promises';

const outputPath = 'dist/rbuild/browser/index.html';
const placeholder = '__BUILD_TIMESTAMP__';

const parts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
}).formatToParts(new Date());
const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
const timestamp = `${values.day}-${values.month}-${values.year} ${values.hour}:${values.minute}:${values.second} ${values.dayPeriod.toUpperCase()}`;

const html = await readFile(outputPath, 'utf8');
const occurrences = html.split(placeholder).length - 1;
if (occurrences !== 1) {
  throw new Error(`Expected one build timestamp placeholder in ${outputPath}, found ${occurrences}.`);
}

await writeFile(outputPath, html.replace(placeholder, timestamp));
console.log(`Stamped build time: ${timestamp} IST`);
