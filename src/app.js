import React from 'react';
import ReactDOM from 'react-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, Configure, Highlight } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/algolia-min.css';
import './index.css';
import { FaClock, FaUserFriends, FaUtensils, FaLeaf, FaCarrot } from 'react-icons/fa';

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
    <img src={hit.image_url} alt={hit.title} className="hit-image" />
    <div className="hit-content">
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-ingredients">
        <FaCarrot /> <Highlight attribute="ingredients" hit={hit} separator=", " />
      </div>
      <div className="hit-type">
        <FaUtensils /> {hit.type}
      </div>
      <div className="hit-dietary-restrictions">
        <FaLeaf /> {hit.dietary_restrictions.join(', ')}
      </div>
      <div className="hit-preparation-time">
        <FaClock /> Tiempo de preparación: {hit.preparation_time}
      </div>
      <div className="hit-servings">
        <FaUserFriends /> Porciones: {hit.servings}
      </div>
      <a href={hit.url} target="_blank" rel="noopener noreferrer" className="hit-url">
        Ver Receta
      </a>
    </div>
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
      border: '1px solid #ccc',
    }}
  />
);

const App = () => (
  <div>
    <InstantSearch indexName="recipes" searchClient={searchClient}>
      <header>
        <h1 className="title">Recetario Libre</h1>
        <SearchBox translations={{ placeholder: '¿Qué receta vas a buscar hoy?' }} />
      </header>
      <main>
        <div className="filters">
          <h2>Tipo de comida</h2>
          <RefinementList attribute="type" />
          <h2>Restricción Alimenticia</h2>
          <RefinementList attribute="dietary_restrictions" />
        </div>
        <div className="results">
          <Hits hitComponent={Hit} />
          <div className="pagination-container">
            <Pagination />
          </div>
        </div>
        <Configure hitsPerPage={8} />
      </main>
    </InstantSearch>
    <footer>
      © 2024 Recetario Libre. Todos los derechos reservados.
    </footer>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
