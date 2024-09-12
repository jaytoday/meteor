const fs = require('fs').promises;
const HEADER_TEMPLATE = `
---
title: Core Package Listing
description: list of all Meteor core packages.
---

[//]: # (Do not edit this file by hand.)

[//]: # (This is a generated file.)

[//]: # (If you want to change something in this file)

[//]: # (go to meteor/docs/generators/packages-listing)

# Core Packages


`

const OUTSIDE_OF_CORE_PACKAGES = [
  {
    name: 'blaze',
    link: 'https://github.com/meteor/blaze'
  },
  {
    name: 'react-packages',
    link: 'https://github.com/meteor/react-packages'
  }
];

const IGNORED = [
  'depracated',
  'non-core'
];
const getPackages = async () => {
  const packages =
  (await fs.readdir('../packages', { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !IGNORED.includes(name))
    .map(name => {
      return  {
        name,
        link: `https://github.com/meteor/meteor/tree/devel/packages/${name}`
      }
    });
    return [...OUTSIDE_OF_CORE_PACKAGES, ...packages, ];
}

const generateMarkdown = (packages) =>
   packages
    .map(({name, link}) => `- [${name}](${link})`)
    .join('\n');



async function main() {
  console.log("🚂 Started listing 🚂");
  const packages = await getPackages();
  const markdown = generateMarkdown(packages);
  const content = HEADER_TEMPLATE + markdown;
  console.log("📝 Writing to file 📝");
  await fs.writeFile('./source/packages/packages-listing.md', content);
  console.log("🚀 Done 🚀");
}

main();
