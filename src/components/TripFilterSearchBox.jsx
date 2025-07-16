import React from "react";
import { TextInput, Button, Group, Autocomplete, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Avatar } from "@mantine/core";




const TripFilterSearchBox = ({ searchQuery, setSearchQuery, usersData, setSelectedUsers, selectedUsers, setCurrentUser, setSelectedFilters, selectedFilters}) => {


  const renderAutocompleteOption = ({ option }) => (
    <Group gap="sm">
      <Avatar src={usersData[option.value].image} size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {usersData[option.value].email}
        </Text>
      </div>
    </Group>
  );
//   const [setAddedUsers, setSelectedUsers] = useState("");
  
function handleAddUser() {
    setSelectedUsers([...selectedUsers, searchQuery]);
    setSelectedFilters([...selectedFilters, usersData[searchQuery].filter]);
    setCurrentUser(searchQuery);

}
const names = Object.keys(usersData);

console.log(searchQuery, "input");
  return (
    <Group gap="sm" justify="center">
     <Autocomplete
      data={searchQuery.trim().length > 0 ? names.filter(user => user.toLowerCase().includes(searchQuery.toLowerCase())) : []}
      value={searchQuery}
      renderOption={renderAutocompleteOption}
      onChange={setSearchQuery}
      maxDropdownHeight={300}
      placeholder="Search for User"
      
    />
      <Button onClick={() => handleAddUser()}> Add </Button>
    </Group>
  );
};

export default TripFilterSearchBox;
