import {AddRepairModal} from '@/components/AddRepairModal';
import {TableGroup} from '@/components/Table/TableGroup';
import {RepairsPageContext, useRepairsPageContext} from '@/utils/context/RepairsPageContext';
import {useTitle} from '@/utils/hooks';
import {Button, Center, Flex, Spinner, useDisclosure} from '@chakra-ui/react';
import {useEffect} from 'react';

export const Repairs = () => {
	useTitle('Repairs');
	const repairsPageContext = useRepairsPageContext();
	const {data, refetch} = repairsPageContext;
	const createRepairDisclosure = useDisclosure();
	const {onOpen} = createRepairDisclosure;

	useEffect(() => {
		refetch();
	}, []);

	if (!data) {
		return (
			<Center height={'100%'} width={'100%'}>
				<Spinner />
			</Center>
		);
	}

	return (
		<RepairsPageContext.Provider value={repairsPageContext}>
			<Flex flexDirection={'column'} height={'100%'} width={'100%'}>
				<h1 className='page-title'>Repairs</h1>
				<Flex flexDirection={'row-reverse'} marginY={4}>
					<Button onClick={onOpen}>New Repair</Button>
				</Flex>
				<AddRepairModal createRepairDisclosure={createRepairDisclosure} />
				<TableGroup />
			</Flex>
		</RepairsPageContext.Provider>
	);
};
