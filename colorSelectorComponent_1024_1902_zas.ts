// 代码生成时间: 2025-10-24 19:02:38
 * This component provides a simple interface for color selection with error handling and maintainability.
 */

import React, { useState, useEffect } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { toast } from 'react-toastify';

// Define the GraphQL query for fetching colors
const GET_COLORS = gql`
  query getColors {
    colors {
      id
      name
    }
  }
`;

// Define the GraphQL mutation for selecting a color
const SELECT_COLOR = gql`
  mutation selectColor($id: ID!) {
    selectColor(id: $id) {
      id
      name
    }
  }
`;

export interface Color {
  id: string;
  name: string;
}

interface ColorSelectorProps {
  selectedColor: Color | null;
  onColorSelected: (color: Color) => void;
}

const ColorSelectorComponent: React.FC<ColorSelectorProps> = ({ selectedColor, onColorSelected }) => {
  // State to hold the colors
  const [colors, setColors] = useState<Color[]>([]);
  
  // State to hold the selected color ID
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  
  // Apollo Client instance
  const client = useApolloClient();
  
  // Fetch colors on component mount
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data } = await client.query({ query: GET_COLORS });
        setColors(data.colors);
      } catch (error) {
        toast.error('Failed to fetch colors:', error.message);
      }
    };
    
    fetchColors();
  }, []);
  
  // Handle color selection
  const handleSelectColor = async (id: string) => {
    try {
      const { data } = await client.mutate({ mutation: SELECT_COLOR, variables: { id } });
      onColorSelected(data.selectColor);
      setSelectedColorId(id);
    } catch (error) {
      toast.error('Failed to select color:', error.message);
    }
  };
  
  return (
    <div>
      <h2>Select a Color</h2>
      <ul>
        {colors.map(color => (
          <li key={color.id}
            style={{ color: color.name }}
            onClick={() => handleSelectColor(color.id)}
          >
            {color.name}
          </li>
        ))}
      </ul>
      {selectedColor && (
        <div>
          <h3>Selected Color:</h3>
          <p>{selectedColor.name}</p>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking
export const propTypes = {
  selectedColor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onColorSelected: PropTypes.func.isRequired,
};

export default ColorSelectorComponent;