import React, { useState, useEffect } from "react";
import "./SearchDropdown.css"; // Importa il file CSS

interface SearchDropdownProps {
  placeholder: string; // Testo del placeholder per l'input
  fetchItems: (query: string) => Promise<any[]>; // Funzione per effettuare la chiamata API
  onItemSelect: (item: any) => void; // Callback per la selezione di un elemento
  initialValue?: string; // Valore iniziale da mostrare nell'input
  readOnly?: boolean; // Se true, disabilita l'input
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder,
  fetchItems,
  onItemSelect,
  initialValue = "",
  readOnly = false,
}) => {
  const [items, setItems] = useState<any[]>([]); // Elementi della dropdown
  const [searchQuery, setSearchQuery] = useState<string>(initialValue); // Valore dell'input
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Visibilità della dropdown
  const [isLoading, setIsLoading] = useState(false); // Stato di caricamento

  // Sincronizza searchQuery con initialValue quando initialValue cambia
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchItems(searchQuery); // Chiamata API
        setItems(response);
      } catch (error) {
        console.error("Errore nel caricamento degli elementi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Effettua la chiamata API solo se c'è un valore nel campo di ricerca
    if (!readOnly && searchQuery.trim().length > 0) {
      fetchData();
    } else {
      setItems([]); // Svuota la lista se l'input è vuoto
    }
  }, [searchQuery, fetchItems, readOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownVisible(value.trim().length > 0); // Mostra la dropdown solo se c'è testo
  };

  const handleItemSelect = (item: any) => {
    onItemSelect(item); // Chiama la callback con l'elemento selezionato
    setSearchQuery(item.name || ""); // Imposta il valore selezionato nell'input
    setIsDropdownVisible(false); // Nasconde la dropdown
    setItems([]); // Svuota la lista
  };

  return (
    <div className="search-dropdown">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={readOnly} // Disabilita l'input in modalità readOnly
      />
      {isLoading && <div>Loading...</div>}
      {isDropdownVisible && items.length > 0 && !isLoading && (
        <div className="dropdown-list">
          {items.map((item, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleItemSelect(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
      {isDropdownVisible && items.length === 0 && !isLoading && (
        <div className="dropdown-no-results">Nessun risultato trovato</div>
      )}
    </div>
  );
};

export default SearchDropdown;
