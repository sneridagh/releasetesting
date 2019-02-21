const fs = require("fs");

const args = process.argv;

if (process.argv.length < 3) {
  console.log(
    "Not enough arguments. You should supply one of: bump || excerpt || back"
  );
  return;
}

const command = process.argv[2];
console.log(command);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

try {
  const data = fs.readFileSync("CHANGELOG.md", "utf8");
  const [original, version, orig] = data.match(/##\s(.+)\s\((.+)\)/);
  if (orig !== "unreleased") {
    return console.log("Error, the CHANGELOG file is malformed.");
  }
  const currentDate = new Date();
  const date = `${currentDate.getFullYear()}-${`0${currentDate.getMonth() +
    1}`.slice(-2)}-${`0${currentDate.getDate()}`.slice(-2)}`;

  const newLine = original.replace("unreleased", date);
  const newChangelog = data.replace(original, newLine);

  // Save data to disk if command is bump
  if (command === "bump") {
    fs.writeFile("CHANGELOG.md", newChangelog, err => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log("Updated version on CHANGELOG.md");
    });
  }

  if (command === "excerpt") {
    const allReleases = data.match(/##\s(.+)\s\((.+)\)/g);
    // const re = new RegExp(escapeRegExp(allReleases[1]), 'g');
    const index = data.indexOf(allReleases[1]);
    let versionExcerpt = data.slice(0, index);
    versionExcerpt = versionExcerpt.replace("# Change Log\n\n", "");
    process.stdout.write(versionExcerpt);
  }

  if (command === "back") {
    const data = fs.readFileSync("CHANGELOG.md", "utf8");
    const nextversion = process.argv[3];
    const backToDevelTemplate = `\n\n## ${nextversion} (unreleased)\n\n### Added\n\n### Changes`;

    const insertIndex = data.indexOf("\n\n");
    const back = `${data.slice(
      0,
      insertIndex
    )}${backToDevelTemplate}${data.slice(insertIndex)}`;
    console.log(back);
    fs.writeFile("CHANGELOG.md", back, err => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log("Back to development on CHANGELOG.md");
    });
  }

  return;
} catch (e) {
  console.log("Error:", e.stack);
}
