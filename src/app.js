import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, Configure, Highlight, connectSearchBox,  connectRefinementList } from 'react-instantsearch-dom';
import Collapsible from 'react-collapsible';
import 'instantsearch.css/themes/algolia-min.css';
import './index.css';
import { FaClock, FaUserFriends, FaUtensils, FaLeaf, FaCarrot, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

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
        <FaClock /> Tiempo de preparación: {hit.preparation_time} mins
      </div>
      <div className="hit-servings">
        <FaUserFriends /> Porciones: {hit.servings} {hit.servings > 1 ? 'porciones' : 'porción'}
      </div>
      <a href={hit.url} target="_blank" rel="noopener noreferrer" className="hit-url">
        Ver Receta
      </a>
    </div>
  </div>
);

const CustomSearchBox = ({ currentRefinement, refine }) => (
  <div className="custom-search-box">
    <input
      type="text"
      placeholder="¿Qué receta vas a buscar hoy?"
      value={currentRefinement}
      onChange={event => refine(event.currentTarget.value)}
      className="custom-search-input"
    />
    <FaSearch className="search-icon" />
  </div>
);

const SearchBoxWithSuggestions = connectSearchBox(({ currentRefinement, refine }) => {
  const handleSuggestionClick = (suggestion) => {
    refine(suggestion);
  };

  return (
    <div>
      <CustomSearchBox currentRefinement={currentRefinement} refine={refine} />
      <div className="search-suggestions">
        <span>Prueba: </span>
        {['Huevo', 'Ensalada', 'Curry', 'Sin gluten', 'Limón', 'Lentejas'].map((suggestion, index) => (
          <a key={index} href="#" onClick={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}>
            {suggestion}
          </a>
        ))}
      </div>
    </div>
  );
});

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="collapsible-section">
      <div className="collapsible-header" onClick={toggleOpen}>
        <span>{title}</span>
        <span className="collapsible-icon">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {isOpen && <div className="collapsible-content general-refinement-list">{children}</div>}
    </div>
  );
};

const CustomRefinementList = ({ items, refine }) => {
  const sortedItems = items.sort((a, b) => b.label.localeCompare(a.label));

  return (
      <ul className="custom-refinement-list">
          {sortedItems.map(item => (
              <li key={item.label}>
                  <label>
                      <input
                          type="checkbox"
                          checked={item.isRefined}
                          onChange={() => refine(item.value)}
                      />
                      {item.label} ({item.count})
                  </label>
              </li>
          ))}
      </ul>
  );
};


const ConnectedRefinementList = connectRefinementList(CustomRefinementList);


const App = () => (
  <div>
    <InstantSearch indexName="recipes" searchClient={searchClient}>
      <header>
        <h1 className="title">Recetario Libre 🥘</h1>
        <SearchBoxWithSuggestions />
      </header>
      <main>
        <div className="filters">
        <h2 className="filters-title">Filtros</h2>
        <hr />
          <CollapsibleSection title="Tipo de Comida">
            <RefinementList attribute="type"  />
          </CollapsibleSection>
          <CollapsibleSection title="Restricción Alimenticia">
            <RefinementList attribute="dietary_restrictions" />
          </CollapsibleSection>
          <CollapsibleSection title="Ingredientes">
            <RefinementList attribute="ingredients" limit={12}/>
          </CollapsibleSection>
          <CollapsibleSection title="Tiempo de Preparación (Minutos)">
          <ConnectedRefinementList attribute="preparation_time" />
          </CollapsibleSection>
          <CollapsibleSection title="Cantidad de Porciones">
          <ConnectedRefinementList attribute="servings" />
          </CollapsibleSection>
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