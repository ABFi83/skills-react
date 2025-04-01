import { useState, useEffect } from "react";

import "./ClientSearch.css";
import { getClients } from "../../Service/ClientService";

interface ClientSearchProps {
  value: string;
  name: string;
  onChange: (value: string) => void;
  onClientSelect: (clientCode: string) => void;
  readOnly: boolean; // Aggiunta la prop readOnly
}

const ClientSearch = ({
  value,
  name,
  onChange,
  onClientSelect,
  readOnly,
}: ClientSearchProps) => {
  const [clients, setClients] = useState<any[]>([]); // Array di clienti
  const [searchQuery, setSearchQuery] = useState<string>(name); // Mostra il vecchio valore
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Controlla la visibilità della dropdown
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!readOnly) {
      setSearchQuery(name); // Mostra il vecchio valore quando entri in modalità edit
      setIsDropdownVisible(false); // Nascondi la dropdown inizialmente
    }
  }, [name, readOnly]);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await getClients(searchQuery);
        setClients(response); // Impostiamo la lista dei clienti
      } catch (error) {
        console.error("Errore nel caricamento dei clienti:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Effettua la chiamata API solo se c'è un valore nel campo di ricerca
    if (!readOnly && searchQuery.trim().length > 0) {
      fetchClients();
    } else {
      setClients([]); // Svuota la lista se l'input è vuoto
    }
  }, [searchQuery, readOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownVisible(value.trim().length > 0); // Mostra la dropdown solo se c'è testo
  };

  const handleClientSelect = (clientCode: string, clientName: string) => {
    onClientSelect(clientCode); // Chiama la callback con il codice del cliente
    setSearchQuery(clientName); // Imposta il nome del cliente nell'input
    setIsDropdownVisible(false); // Nasconde la dropdown dopo la selezione
    setClients([]); // Svuota la lista dei clienti
  };

  return (
    <div className="client-search">
      {readOnly ? (
        <div className="client-display">
          <span>{name || "Seleziona un cliente"}</span>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Cerca cliente"
            disabled={readOnly} // Disabilita la ricerca in modalità readOnly
          />
          {isLoading && <div>Loading...</div>}
          {isDropdownVisible && clients.length > 0 && !isLoading && (
            <div className="client-list">
              {clients.map((client) => (
                <div
                  key={client.code}
                  className="client-item"
                  onClick={() => handleClientSelect(client.code, client.name)}
                >
                  <span>{client.name}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientSearch;
