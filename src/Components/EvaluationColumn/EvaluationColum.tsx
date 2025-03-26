import React, { useState } from "react";
import { Evaluation } from "../../Interfaces/Evalutation";

interface EvaluationColumnProps<T> {
  header: string;
  data: T;
  onHeaderClick?: () => void;
}

const EvaluationColumn: React.FC<EvaluationColumnProps<any>> = ({
  header,
  data,
  onHeaderClick,
}) => {
  const [isHeaderClicked, setIsHeaderClicked] = useState(false);

  const handleClick = () => {
    setIsHeaderClicked(!isHeaderClicked);
    onHeaderClick && onHeaderClick();
  };

  return (
    <div className="table-column">
      <h3
        className={`header ${isHeaderClicked ? "clicked" : ""}`}
        onClick={handleClick}
      >
        {header}
      </h3>
      <ul>
        {data.map((item: any, index: any) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default EvaluationColumn;
