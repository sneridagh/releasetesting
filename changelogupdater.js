const fs = require('fs');

try {
  const data = fs.readFileSync('CHANGELOG.md', 'utf8');
  const [original, version, orig] = data.match(/##\s(.+)\s\((.+)\)/);
  if (orig !== 'unreleased') {
    return console.log('Error, the CHANGELOG file is malformed.');
  }
  const currentDate = new Date();
  const date = `${currentDate.getFullYear()}-${`0${currentDate.getMonth() +
    1}`.slice(-2)}-${`0${currentDate.getDate()}`.slice(-2)}`;

  const newLine = original.replace('unreleased', date);
  const result = data.replace(original, newLine);
  // console.log(result);
  process.stdout.write(result);
  return result;
} catch (e) {
  console.log('Error:', e.stack);
}
