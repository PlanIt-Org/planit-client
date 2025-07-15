import React from "react";
import { TextInput, Button, Group, Autocomplete } from "@mantine/core";
import { useNavigate } from "react-router-dom"; 
import { IconSearch } from "@tabler/icons-react";

const SearchBar = ({ inputDesc, searchQuery, setSearchQuery, handleSearch, dataPassed}) => {
  const navigate = useNavigate();
  return (
    <Group gap="sm" justify="center">
      <Autocomplete
        placeholder={inputDesc}
        data={dataPassed}
        limit={3} 
        w="50%"
        leftSection={<IconSearch size={16} />}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Button onClick={() => navigate("/tripFilter")}> Go </Button>
    </Group>
  );
};

export default SearchBar;
