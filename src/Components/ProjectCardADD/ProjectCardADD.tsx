import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa"; // Importiamo l'icona "+" da react-icons
import "./ProjectCardADD.css"; // Puoi aggiungere gli stili specifici

const ProjectCardADD = () => {
  return (
    <Link to="/project/new" className="project-card-link">
      <div className="project-card project-card-add">
        <div className="icon-container">
          <FaPlus size={50} color="white" />{" "}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCardADD;
