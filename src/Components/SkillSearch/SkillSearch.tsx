import React, { useState } from "react";

interface SkillSearchProps {
  onSkillSelect: (selectedSkill: { label: string }) => void;
}

const SkillSearch: React.FC<SkillSearchProps> = ({ onSkillSelect }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Stato per il valore dell'input
  const skills = [
    { label: "JavaScript" },
    { label: "React" },
    { label: "TypeScript" },
    { label: "Node.js" },
    { label: "Python" },
  ]; // Lista di skill disponibili

  // Filtra le skill in base al testo digitato
  const filteredSkills = skills.filter((skill) =>
    skill.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSkillClick = (skill: { label: string }) => {
    onSkillSelect(skill); // Chiama la funzione di callback con la skill selezionata
  };

  return (
    <div className="skill-search">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cerca skill"
      />
      <div className="skill-list">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            className="skill-item"
            onClick={() => handleSkillClick(skill)}
          >
            {skill.label}
          </div>
        ))}
        {filteredSkills.length === 0 && <div>Nessuna skill trovata</div>}
      </div>
    </div>
  );
};

export default SkillSearch;
