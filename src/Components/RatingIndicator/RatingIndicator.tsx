import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Icone per valutazione positiva/negativa
import "./RatingIndicator.css";
interface RatingIndicatorProps {
  value: number | null;
}

const RatingIndicator = ({ value }: RatingIndicatorProps) => {
  return (
    <div className="rating-indicator">
      <span>{value ? value.toFixed(1) : 1}</span>{" "}
      {/* Mostra il valore con una cifra decimale */}
      {value && value > 6 ? (
        <FaThumbsUp className="positive-icon" />
      ) : (
        <FaThumbsDown className="negative-icon" />
      )}
    </div>
  );
};

export default RatingIndicator;
