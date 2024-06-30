import {TableGroup} from '@/components/Table/TableGroup';
import {AlertsPageContext, useAlertsPageContext} from '@/utils/context/AlertsPageContext';
import {useTitle} from '@/utils/hooks';
import {
	Button,
	Center,
	Flex,
	Spacer,
	Spinner,
	Tab,
	TabList,
	Tabs,
	useToast
} from '@chakra-ui/react';
import {useEffect} from 'react';
import {LuCheckCheck} from 'react-icons/lu';

export const Alerts = () => {
	useTitle('Alerts');
	const alertsPageContext = useAlertsPageContext();
	const {data, refetch} = alertsPageContext;
	const {handleStatusTabChange} = alertsPageContext;
	const toast = useToast();
	const hasUnreadAlerts = data?.filter((alert) => alert.status?.includes('unread')).length;

	const handleMarkAllAsRead = async () => {
		console.log(hasUnreadAlerts);
		if (!hasUnreadAlerts) {
			toast({description: 'No alerts to mark as read!', status: 'info', duration: 3000});
			return;
		}

		const markAllAsRead = async () => {
			await fetch('http://localhost:8080/alerts/mark-all-as-read', {
				method: 'POST'
			});
			await refetch();
		};
		toast.promise(markAllAsRead(), {
			loading: {
				description: 'Marking all alerts...'
			},
			success: {
				description: 'All alerts marked as read!',
				duration: 3000
			},
			error: {
				description: 'Failed to mark all alerts as read, please try again.',
				duration: 3000
			}
		});
	};

	const handleTabChange = (index: number) => {
		if (index === 0) {
			handleStatusTabChange('unread');
		} else {
			handleStatusTabChange('all');
		}
	};

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
		<AlertsPageContext.Provider value={alertsPageContext}>
			<Flex flexDirection={'column'} height={'100%'} width={'100%'}>
				<h1 className='page-title'>Alerts</h1>
				<Flex marginY={4}>
					<Tabs
						onChange={(index) => handleTabChange(index)}
						variant={'soft-rounded'}
						colorScheme='cyan'
					>
						<TabList>
							<Tab>Unread</Tab>
							<Tab>All</Tab>
						</TabList>
					</Tabs>
					<Spacer />
					<Button leftIcon={<LuCheckCheck />} onClick={handleMarkAllAsRead}>
						Mark All as Read
					</Button>
				</Flex>
				<TableGroup />
			</Flex>
		</AlertsPageContext.Provider>
	);
};
