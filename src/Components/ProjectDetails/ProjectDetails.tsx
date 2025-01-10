import { useParams } from "react-router-dom";
import PolygonalLevelIndicator from "../PoligonLevel/PoligonLevel";

const ProjectDetails = () => {
  const { id } = useParams(); // Leggi l'ID del progetto dalla rotta

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Details</h1>
      <p>Project ID: {id}</p>
      <PolygonalLevelIndicator
        levels={[10, 5, 10, 2, 3, 5, 1]}
        labels={["A", "B", "C", "C", "C", "C", "C"]}
      />
    </div>
  );
};

export default ProjectDetails;
