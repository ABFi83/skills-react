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
  const [searchQuery, setSearchQuery] = useState<string>(name); // Query di ricerca
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!readOnly) {
      setSearchQuery(name);
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

    if (!readOnly && searchQuery) {
      fetchClients();
    }
  }, [searchQuery, readOnly]);

  const handleClientSelect = (clientCode: string) => {
    onClientSelect(clientCode); // Chiama la callback onClientSelect con il codice del cliente
    setSearchQuery(""); // Pulisce la barra di ricerca
  };

  return (
    <div className="client-search">
      {readOnly ? (
        <div className="client-display">
          {/* In modalità readOnly, mostriamo solo il nome del cliente */}
          <span>{name || "Seleziona un cliente"}</span>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca cliente"
            disabled={readOnly} // Disabilita la ricerca in modalità readOnly
          />
          {isLoading && <div>Loading...</div>}
          {clients.length > 0 && !isLoading && (
            <div className="client-list">
              {clients.map((client) => (
                <div
                  key={client.code}
                  className="client-item"
                  onClick={() => handleClientSelect(client.code)}
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
