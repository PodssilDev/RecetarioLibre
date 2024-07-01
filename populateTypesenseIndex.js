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
      { name: 'ingredients', type: 'string[]', facet: true },
      { name: 'url', type: 'string' },
      { name: 'type', type: 'string', facet: true },
      { name: 'dietary_restrictions', type: 'string[]', facet: true },
      { name: 'preparation_time', type: 'string', facet: true },
      { name: 'servings', type: 'string', facet: true },
      { name: 'image_url', type: 'string' }
    ]
  };
  console.log('Realizando la indexación en Typesense');

  try {
    await typesense.collections('recipes').delete();
    console.log('Eliminando colección anterior.');
  } catch (error) {
    // Do nothing
  }

  console.log('Creando el esquema: ');
  console.log(JSON.stringify(schema, null, 2));
  await typesense.collections().create(schema);

  console.log('Agregando las recetas: ');
  const recipes = require('./data/recipes.json');
  try {
    const returnData = await typesense
      .collections('recipes')
      .documents()
      .import(recipes);
    console.log(returnData);
    console.log('Recetas indexadas correctamente.');

    const failedItems = returnData.filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error al indexar los items ${JSON.stringify(failedItems, null, 2)}`
      );
    }

    return returnData;
  } catch (error) {
    console.log(error);
  }
})();
