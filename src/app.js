import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, Configure, Highlight, connectSearchBox, connectRefinementList } from 'react-instantsearch-dom';
import Modal from 'react-modal';
import 'instantsearch.css/themes/algolia-min.css';
import './index.css';
import { FaClock, FaUserFriends, FaUtensils, FaCarrot, FaChevronDown, FaChevronUp, FaSearch, FaGithub } from 'react-icons/fa';
import gluten_free from './gluten_free.png';
import sin_lactosa from './sin_lactosa.png';
import vegano from './vegano.png';


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

const Hit = ({ hit }) => {
  const getDietaryIcons = () => {
    const icons = [];
    if (hit.dietary_restrictions.includes("Celiaco")) {
      icons.push(<img src={gluten_free} alt="Celiaco" style={{ width: 50, height: 50, marginRight: 5 }} />);
    }
    if (hit.dietary_restrictions.includes("Vegetariano")) {
      icons.push(<img src={vegano} alt="Vegetariano" style={{ width: 50, height: 50, marginRight: 5 }} />);
    }
    if (hit.dietary_restrictions.includes("Intolerante a la lactosa")) {
      icons.push(<img src={sin_lactosa} alt="Intolerante a la lactosa" style={{ width: 50, height: 50, marginRight: 5 }} />);
    }
    return icons.length > 0 ? icons : null;
  };

  return (
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
          {getDietaryIcons()} 
        </div>
        <div className="hit-preparation-time">
          <FaClock /> Tiempo de preparación: {hit.preparation_time} mins
        </div>
        <div className="hit-servings">
          <FaUserFriends /> {hit.servings} {hit.servings > 1 ? 'Porciones' : 'Porción'}
        </div>
        <a href={hit.url} target="_blank" rel="noopener noreferrer" className="hit-url">
          Ver Receta
        </a>
      </div>
    </div>
  );
};

const CustomSearchBox = ({ currentRefinement, refine }) => {
  const handleInputChange = (event) => {
    const validChars = /^[a-zA-Z0-9 '|" ñ]*$/;
    const input = event.currentTarget.value;
    if (validChars.test(input)) {
      refine(input);
    }
  };

  return (
    <div className="custom-search-box">
      <input
        type="text"
        placeholder="¿Qué receta vas a buscar hoy?"
        value={currentRefinement}
        onChange={handleInputChange}
        className="custom-search-input"
      />
      <FaSearch className="search-icon" />
    </div>
  );
};

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
  const sortedItems = items.sort((a, b) => b.label - a.label);

  return (
    <ul className="custom-refinement-list">
      {sortedItems.map(item => (
        <li key={item.label} className="custom-refinement-item">
          <label className="custom-refinement-label">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="custom-refinement-checkbox"
            />
            <span className="custom-refinement-label-text">{item.label}</span>
            <span className="custom-refinement-count">{item.count}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

const ConnectedRefinementList = connectRefinementList(CustomRefinementList);


const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <InstantSearch indexName="recipes" searchClient={searchClient}>
        <header className="header-container">
          <h1 className="title">Recetario Libre 🥘</h1>
          <SearchBoxWithSuggestions />
          <button className="symbol-button" onClick={() => setModalIsOpen(true)}>
            Simbología
          </button>
        </header>
        <main>
          <div className="filters">
            <h2 className="filters-title">Filtros</h2>
            <hr />
            <CollapsibleSection title="Tipo de Comida">
              <RefinementList attribute="type" />
            </CollapsibleSection>
            <CollapsibleSection title="Restricción Alimenticia">
              <RefinementList attribute="dietary_restrictions" />
            </CollapsibleSection>
            <CollapsibleSection title="Ingredientes">
              <RefinementList attribute="ingredients" limit={12} />
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
      <span>© 2024 Recetario Libre. Todos los derechos reservados.  </span>
      <span>Desarrollado utilizando <a href="https://typesense.org" target="_blank">Typesense. <br></br> </a></span>
      <a href="https://github.com/PodssilDev/RecetarioLibre" target="_blank" className="github-link">
        <FaGithub />
      </a>
    </footer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Simbología"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Simbología de Restricciones Alimenticias</h2>
        <ul>
          <li><img src={gluten_free} alt="Celiaco" style={{ width: 30, height: 30, marginRight: 5 }} /> Celiaco</li>
          <li><img src={vegano} alt="Vegetariano" style={{ width: 30, height: 30, marginRight: 5 }} /> Vegetariano</li>
          <li><img src={sin_lactosa} alt="Intolerante a la lactosa" style={{ width: 30, height: 30, marginRight: 5 }} /> Intolerante a la lactosa</li>
        </ul>
        <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));