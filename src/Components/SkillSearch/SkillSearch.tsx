import React from "react";

interface SkillSearchProps {
  onSkillSelect: (selectedSkill: { label: string }) => void; // Definizione della prop
}

const SkillSearch: React.FC<SkillSearchProps> = ({ onSkillSelect }) => {
  const skills = [
    { label: "JavaScript" },
    { label: "React" },
    { label: "TypeScript" },
    { label: "Node.js" },
  ]; // Esempio di skill disponibili

  const handleSkillClick = (skill: { label: string }) => {
    onSkillSelect(skill); // Chiama la funzione di callback con la skill selezionata
  };

  return (
    <div className="skill-search">
      <h3>Seleziona una Skill</h3>
      <ul>
        {skills.map((skill, index) => (
          <li key={index} onClick={() => handleSkillClick(skill)}>
            {skill.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillSearch;
