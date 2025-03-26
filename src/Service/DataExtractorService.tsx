import { useState, useEffect } from "react";

interface Label {
  id: string;
  label: string;
  shortLabel: string;
}

interface Value {
  id: string;
  skill: string;
  value: number;
}

type Data = Label[] | Value[];

const DataExtractorService = ({
  labelsData,
  valuesData,
}: {
  labelsData?: Data;
  valuesData?: Data;
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  const extractData = (data: Data, key: string): string[] | number[] => {
    return data.map((item: any) => item[key]);
  };

  useEffect(() => {
    if (labelsData) {
      const extractedLabels = extractData(labelsData, "shortLabel") as string[];
      setLabels(extractedLabels);
    }

    if (valuesData) {
      const extractedValues = extractData(valuesData, "value") as number[];
      setValues(extractedValues);
    }
  }, [labelsData, valuesData]);

  return {
    labels,
    values,
  };
};

export default DataExtractorService;
