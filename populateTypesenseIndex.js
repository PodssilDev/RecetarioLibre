/* eslint-disable */

// Start Typesense server with `npm run typesenseServer`
// Then run `npm run populateTypesenseIndex` or `node populateTypesenseIndex.js`

const Typesense = require('typesense');

module.exports = (async () => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: 'localhost',
        port: '8108',
        protocol: 'http',
      },
    ],
    apiKey: 'xyz', 
  });

  const schema = {
    name: 'recipes',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'ingredients', type: 'string[]' },
      { name: 'url', type: 'string' },
      { name: 'type', type: 'string', facet: true },
      { name: 'dietary_restrictions', type: 'string[]', facet: true }
    ]
  };

  console.log('Populating index in Typesense');

  try {
    await typesense.collections('recipes').delete();
    console.log('Deleting existing collection: recipes');
  } catch (error) {
    // Do nothing
  }

  console.log('Creating schema: ');
  console.log(JSON.stringify(schema, null, 2));
  await typesense.collections().create(schema);

  console.log('Adding records: ');
  const recipes = require('./data/recipes.json');
  try {
    const returnData = await typesense
      .collections('recipes')
      .documents()
      .import(recipes);
    console.log(returnData);
    console.log('Done indexing.');

    const failedItems = returnData.filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error indexing items ${JSON.stringify(failedItems, null, 2)}`
      );
    }

    return returnData;
  } catch (error) {
    console.log(error);
  }
})();
