import React from 'react';
import ReactDOM from 'react-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, Configure, Highlight } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/algolia-min.css';
import './index.css';
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz',
    nodes: [
      {
        host: 'localhost',
        port: '8108',
        protocol: 'http',
      },
    ],
  },
  additionalSearchParameters: {
    queryBy: 'title,ingredients',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const Hit = ({ hit }) => (
  <div className="hit-item">
    <div className="hit-name">
      <Highlight attribute="title" hit={hit} />
    </div>
    <div className="hit-ingredients">
      <Highlight attribute="ingredients" hit={hit} separator=", " />
    </div>
    <div className="hit-type">{hit.type}</div>
    <div className="hit-dietary-restrictions">
      {hit.dietary_restrictions.join(', ')}
    </div>
    <a href={hit.url} target="_blank" rel="noopener noreferrer">Ver Receta</a>
  </div>
);

const CustomSearchBox = ({ currentRefinement, refine }) => (
  <input
    type="text"
    placeholder="¿Qué receta vas a buscar hoy?"
    value={currentRefinement}
    onChange={event => refine(event.currentTarget.value)}
    style={{
      padding: '10px',
      width: '100%',
      borderRadius: '5px',
      border: '1px solid #ccc'
    }}
  />
);

const App = () => (
  <InstantSearch indexName="recipes" searchClient={searchClient}>
    <header>
    <h1 className="title">Recetario Libre</h1>
      <SearchBox translations={{ placeholder: '¿Qué receta vas a buscar hoy?' }} />
    </header>
    <main>
      <div className="filters">
        <RefinementList attribute="type" />
        <RefinementList attribute="dietary_restrictions" />
      </div>
      <div className="results">
        <Hits hitComponent={Hit} />
        <Pagination />
      </div>
      <Configure hitsPerPage={8} />
    </main>
  </InstantSearch>
);

ReactDOM.render(<App />, document.getElementById('root'));
