import {TableGroup} from '@/components/Table/TableGroup';
import {SensorLogPageContext, useSensorLogPageContext} from '@/utils/context/SensorLogPageContext';
import {useTitle} from '@/utils/hooks';
import {Center, Flex, Spinner} from '@chakra-ui/react';
import {useEffect} from 'react';

export const SensorLog = () => {
	useTitle('Sensor Log');
	const sensorLogPageContext = useSensorLogPageContext();
	const {data, refetch} = sensorLogPageContext;

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
		<SensorLogPageContext.Provider value={sensorLogPageContext}>
			<Flex flexDirection={'column'} height={'100%'} width={'100%'}>
				<h1 className='page-title'>Sensor Log</h1>
				<TableGroup />
			</Flex>
		</SensorLogPageContext.Provider>
	);
};
