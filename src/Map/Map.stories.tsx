import {
    useEffect,
    useState
} from 'react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';
import {
    ComponentStory,
    ComponentMeta
} from '@storybook/react';
import {
    Map as Map
} from './Map';
import {
    Button,
    Box,
    ChakraProvider,
    Flex,
    IconButton,
    Link,
    List,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    extendTheme,
    useClipboard,
    useDisclosure
} from '@chakra-ui/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
//import {hoursIsValid} from '../components/HoursFormatter';
import reactToText from 'react-to-text';


export default {
    title: 'Components/Map',
    component: Map
} as ComponentMeta<typeof Map>;

import food_pantries from './stories_data/food_pantries.json';
import soup_kitchens from './stories_data/soup_kitchens.json';
import mms from './stories_data/mms.json';
import mm_truck from './stories_data/mm_truck.png';
import cpds from './stories_data/cpds.json';
import cpd_truck from './stories_data/cpd_truck.png';

const theme = extendTheme({
    components: {
	Link: {
	    variants: {
		primary: ({ colorScheme = 'green' }) => ({
		    color: `${colorScheme}.500`,
		    _hover: {
			color: `${colorScheme}.400`,
		    },
		}),
	    },
	    defaultProps: {
		variant: "primary",
	    },
	}
    }
});

const privacyPolicy = `**Privacy Policy**

We want to ensure transparency and clarity about the data collection practices related to the Food Access Map hosted on our website. The Hunter College NYC Food Policy Center and City Harvest are committed to enhancing food access and conducting valuable research to benefit our community. To achieve this, we collect anonymous aggregated data, and we would like to emphasize that your privacy and personal information remain paramount to us.

**Data Collection and Usage**

- **Anonymous Aggregated Data Only**: The data collected from users of the Food Access Map is completely anonymous and aggregated. This means that no personally identifiable information (PII) will be associated with the collected data. We are solely interested in patterns, trends, and overall insights to improve food access.
- **No Personalized Information**: We want to assure you that we do not collect, store, or utilize any personalized information through the Food Access Map. Your privacy is our priority, and we have taken measures to ensure that no personal information will be linked to the data you provide.
- **Research and Improvement**: The primary purpose of collecting this data is for research and to enhance food access in our community. By analyzing aggregated data, we can identify areas for improvement, target resources effectively, and develop strategies to make positive changes.
- **No Cookies or Local Data**: Our website does not use cookies or collect any information from your computer or your usage of the website. You can use the Food Access Map without concerns about any data being stored locally or on your device.

  
Rest assured that our commitment to privacy extends to every aspect of our data collection and analysis process. We adhere to strict ethical standards and legal requirements to ensure that your trust in us is well-placed.

Thank you for being a part of our effort to improve food access for everyone in our community. If you have any questions or concerns about our data practices, please feel free to reach out to us through the provided contact information.`;

const PrivacyPolicy = () => {
    const {isOpen: isModalOpen, onOpen: openModal, onClose: closeModal} = useDisclosure();
    return (
	<>
	    <Box mt={4}>
	    <Text fontSize='sm'>
		Important Data Collection Notice for Food Access Map Users
	    </Text>
	    <Text fontSize='sm' mt={2}>
		Your Privacy Matters: Hunter College NYC Food Policy Center and City Harvest collect only anonymous, aggregated data from the Food Access Map. No personalized information is used or stored, ensuring your privacy. This data aids research and enhances food access without the use of cookies or local storage. <Link onClick={openModal}>Read more.</Link>
	    </Text>
	    <Modal isOpen={isModalOpen} onClose={closeModal}>
		<ModalOverlay />
		<ModalContent>
		    <ModalHeader />
		    <ModalCloseButton />
		    <ModalBody>
			<ReactMarkdown components={ChakraUIRenderer()} children={privacyPolicy} skipHtml />
		    </ModalBody>
		</ModalContent>
	    </Modal>
	    </Box>
	    
	</>
    );
}

const PlentifulRegex = new RegExp(/^\s*\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])/g);

const formatData = (data: any) => {
    return (
`**${data.name}**  
${data.address}    
${data.city}, ${data.state} ${data.zipcode}  
[get directions](https://www.google.com/maps/dir/${data.lat},${data.lng}//@${data.lat},${data.lng},18.5z?entry=ttu)
${data.website ? '\nvisit the [website](' + data.website + ')' :''}
${data.hours && data.hours.trim() !== '&' && true ? '\n\n**Hours of Operation**\n' + data.hours.trim().split('\n').map((hour: string) => `- ${hour}`).join('\n') : ''}
${data.notes && data.notes.trim() !== '' ? '\n\n**Notes**  \n' + data.notes : ''}
${data.trackedBy && data.trackedBy.includes('Plentiful') ? '\n  \nBook an appointment on [plentiful](https://plentifulapp.com/)' : ''}
`
    );
}

const Renderer = ({data}: any) => {
    const {onCopy, value: clipboardValue, setValue: setClipboardValue, hasCopied} = useClipboard("");
    useEffect(() => {
	if(data !== null){
	    setClipboardValue(formatData(data));
	}
    }, [JSON.stringify(data)]);
    if(data === null){
	return (
	    <>
		<Text>
		    Welcome to the City Harvest Resource Map! Here are all of the food pantries, soup kitchens, community partners. Click on any marker for more information.
		</Text>
		<PrivacyPolicy />
	    </>
	);
    }else{
	return (
	    <>
		<Button
		    isDisabled={hasCopied}
		    onClick={onCopy}
		    color='blue'
		    size='xs'
		>
		    {hasCopied ? 'copied!' : 'copy'}
		</Button>
		<ReactMarkdown linkTarget='_blank' components={ChakraUIRenderer()} children={formatData(data)} skipHtml />
	    </>
	);
    }
}

const Template: ComponentStory<typeof Map> = (args) =>
    <ChakraProvider theme={theme}>
	<Map
	{...args}
	    layers={[
		{
		    name: 'Community Partner Distributions',
		    geojson: cpds,
		    color: '#23B0F0',
		    icon: {
			src: cpd_truck,
			scale: 0.6
		    }
		},
		{
		    name: 'Mobile Markets',
		    geojson: mms,
		    color: '#388e3d',
		    icon: {
			src: mm_truck,
			scale: 0.6
		    }
		},
		{
		    name: 'Food Pantries',
		    geojson: food_pantries,
		    color: '#64A70B'
		},
		{
		    name: 'Soup Kitchens',
		    geojson: soup_kitchens,
			color: '#FFD100'
		}
	    ]}
	center={{
	    lat: 40.7127281,
	    lng: -74.0060152
	}}
	renderer={Renderer}
	onClick={() => {}}
	onCenter={() => {}}
	routerUrl='http://router.project-osrm.org'
	/>
    </ChakraProvider>
;

export const Primary = Template.bind({});

Primary.args = {
    geocoderPlatform: 'nominatim',
    geocoderUrl: 'https://nominatim.openstreetmap.org/search'
};

export const GoogleGeocoder = Template.bind({});

GoogleGeocoder.args = {
    geocoderPlatform: 'google'
};
