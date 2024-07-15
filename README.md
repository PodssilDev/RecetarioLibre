# Recetario Libre
Buscador de recetas alimenticias enfocado en restricciones alimenticias con distintas opciones de filtro y búsqueda.

* Búsqueda por nombre de receta
* Búsqueda por nombre de ingrediente
* Filtro por tipo de comida (Desayuno, Almuerzo, Snack, Cena, Postre, entre otros)
* Filtro por restricción alimenticia (Vegano, Celiaco, Intolerante a la lactosa)
* Filtro por ingredientes
* Filtro por tiempo de preparación
* Filtro por cantidad de porciones
* Highlighting, sugerencias de búsqueda, más de cien recetas disponibles y más!

## Técnologías

* [React JS](https://react.dev) + [InstantSearch.js](https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/)
* [Typesense](https://typesense.org)
* [Docker](https://www.docker.com)
* [Ubuntu Linux](https://ubuntu.com)
* [Visual Studio Code](https://code.visualstudio.com)

## Comandos importantes

**Estos comandos se deben ejecutar en orden cada vez que se quiere levantar la interfaz.**

* Levantar el servidor de Typesense (Puerto 8108) usando Docker:

```
npm run typesenseServer
```

* Indexar las recetas alimenticias (Archivo recipes.json):

```
npm run populateTypesenseIndex
```

* Levantar la intefaz / Frontend (Puerto 3000):


```
npm install
npm start
```

## Archivos importantes:
* [recipes.json](https://github.com/PodssilDev/RecetarioLibre/blob/main/data/recipes.json): Archivo que contiene las recetas a indexar en el buscador. Todas las recetas tienen un nombre, ingredientes principales, url a la página de donde se obtuvo la receta, tipo de comida, tipo de restricción alimenticia, tiempo de preparación, cantidad de porciones y una url a una imágen representativa.
* [populateTypesenseIndex.js](https://github.com/PodssilDev/RecetarioLibre/blob/main/populateTypesenseIndex.js): Este archivo hace la conexión con el servidor de Typesense en el puerto 8108 y utilizando la apiKey xyz. Luego crea el schema (dataframe) que contiene los atributos de la receta mencionados en la descripción de recipes.json. Tras crear el schema, realiza la indexación de las recetas si es que estas cumplen con los atributos mencionados e informa al usuario si la indexación fue exitosa o no. Se asegura que la indexación no se repita si es que ya se ha realizado antes.
* [app.js](https://github.com/PodssilDev/RecetarioLibre/blob/main/src/app.js): Aquí se crea la interfaz, usando elementos de React.JS e InstantSearch.JS. También se reciben los documentos / recetas indexadas y se muestran en la interfaz. 
