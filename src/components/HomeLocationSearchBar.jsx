import { TextInput, Button, Group, NativeSelect, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';






// creates all time values once for the right section start time and end time
const generateTimeOptions = () => {
 const times = [];
 for (let hour = 0; hour < 24; hour++) {
   for (let minute = 0; minute < 60; minute += 30) {
     const period = hour < 12 ? 'AM' : 'PM';
     const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
     const displayMinute = minute === 0 ? '00' : String(minute);
     const timeString = `${displayHour}:${displayMinute} ${period}`;
     times.push({ value: timeString, label: timeString });
   }
 }
 return times;
};




const timeOptions = generateTimeOptions();




const HomeLocationSearchBar = () => {
 const navigate = useNavigate();


 const [startTime, setStartTime] = useState(timeOptions[0]?.value || '');
 const [endTime, setEndTime] = useState(timeOptions[timeOptions.length - 1]?.value || '');






 const rightSectionContent = (
   <Group gap={0} wrap="nowrap" style={{ height: '100%', alignItems: 'center' }}>
     {/* START TIME OPTION */}
     {/* TODO: could limit to only have showing my 5 times at a time to not overwhelm user's screen with time options */}
     <NativeSelect
       data={timeOptions}
       value={startTime}
       onChange={(event) => setStartTime(event.currentTarget.value)}
       aria-label="Select start time"
       size="lg"
       rightSectionWidth={28}
       styles={{
         input: {
           fontWeight: 500,
           borderRadius: 0,
           width: 120,
           paddingRight: 0,
         },
       }}
     />
     {/* END TIME OPTION */}
     <NativeSelect
       data={timeOptions}
       value={endTime}
       onChange={(event) => setEndTime(event.currentTarget.value)}
       aria-label="Select end time"
       size="lg"
       rightSectionWidth={28}
       styles={{
         input: {
           fontWeight: 500,
           borderRadius: 0,
           width: 120,
           paddingRight: 0,
         },
       }}
     />
     {/* GO BUTTON */}
     <Button
       onClick={() => navigate("/tripfilter")}
       size="lg"
       style={{
         borderTopLeftRadius: 0,
         borderBottomLeftRadius: 0,
       }}
     >
       Go
     </Button>
   </Group>
 );
 

 return (
   <Group gap="sm" justify="center" mb={42}>
   <TextInput
     placeholder="Search for a location (ex: San Francisco)"
     w="50%"
     size="lg"
     styles={{
       input: {
         minHeight: '50px',
         fontSize: '1.1rem',
         paddingRight: '220px',
       },
     }}
     rightSection={rightSectionContent}
     rightSectionWidth={220}
   />
 </Group>
 )
}


export default HomeLocationSearchBar



