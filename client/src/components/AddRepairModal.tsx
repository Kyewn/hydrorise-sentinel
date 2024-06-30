import {EditableDate} from '@/components/EditableDate';
import {EditableDropdown} from '@/components/EditableDropdown';
import {EditableField} from '@/components/EditableField';
import {TableData} from '@/components/Table/TableGroup';
import {RepairsData} from '@/utils/const';
import {RepairsPageContext, useRepairsPageContext} from '@/utils/context/RepairsPageContext';
import {
	Button,
	Divider,
	Flex,
	HStack,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spacer,
	UseDisclosureReturn,
	VStack,
	useToast
} from '@chakra-ui/react';
import {useContext, useState} from 'react';
import {BiCheck} from 'react-icons/bi';
import {IoClose} from 'react-icons/io5';

export const AddRepairModal: React.FC<{
	createRepairDisclosure: UseDisclosureReturn;
}> = ({createRepairDisclosure}) => {
	const repairsPageContext = useContext(RepairsPageContext);
	const {data, refetch} = repairsPageContext as ReturnType<typeof useRepairsPageContext>;

	const defaultValues = {
		dt_opened: new Date().toISOString(),
		dt_closed: new Date().toISOString(),
		dt_wo_creation: new Date().toISOString()
	};
	const [newRecord, setNewRecord] = useState<RepairsData>(defaultValues);
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const {isOpen, onClose} = createRepairDisclosure;
	const statuses = (data || [])
		.map((record) => record.status!)
		.filter((stat, i, arr) => stat && arr.indexOf(stat) == i);

	const areMandatoryInputsFilled = () =>
		newRecord.case_number &&
		newRecord.dmz_id &&
		newRecord.location &&
		newRecord.region &&
		newRecord.status &&
		newRecord.action_by &&
		newRecord.subject &&
		newRecord.subcategory &&
		newRecord.actual_problem;

	const handleReset = () => {
		setNewRecord(defaultValues);
		onClose();
	};
	const handleSubmit = async () => {
		if (!areMandatoryInputsFilled()) {
			// TODO dispatch fill input toast
			toast({
				description: 'Please fill in all mandatory inputs.',
				duration: 3000
			});
			return;
		}
		const fetchPostResult = fetch(`http://localhost:8080/repairs/`, {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...newRecord,
				...{case_number: parseInt(newRecord.case_number as string)},
				...(newRecord.dt_opened
					? {dt_opened: new Date(newRecord.dt_opened).toISOString()}
					: undefined),
				...(newRecord.dt_closed
					? {dt_closed: new Date(newRecord.dt_closed).toISOString()}
					: undefined),
				...(newRecord.dt_wo_creation
					? {dt_wo_creation: new Date(newRecord.dt_wo_creation).toISOString()}
					: undefined)
			})
		});
		setLoading(true);
		toast.promise(fetchPostResult, {
			loading: {
				description: 'Creating...'
			},
			success: {
				description: 'Record has been created!',
				duration: 3000
			},
			error: {
				description: 'Failed to create record, please try again',
				duration: 3000
			}
		});
		await fetchPostResult;
		await refetch();
		handleReset();
		setLoading(false);
	};

	const handleChange = (newData: TableData) => {
		setNewRecord((prev) => ({...prev, ...newData}));
	};

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
			<ModalOverlay />
			<ModalContent maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<Heading as={'h2'} size={'md'}>
							Add New Repair
						</Heading>
						<Spacer />
						<HStack>
							<Button
								disabled={loading}
								variant={'secondary'}
								leftIcon={<IoClose />}
								onClick={() => {
									handleReset();
								}}
							>
								Cancel
							</Button>
							<Button isLoading={loading} leftIcon={<BiCheck />} onClick={() => handleSubmit()}>
								Confirm
							</Button>
						</HStack>
					</Flex>
					<Flex flex={1} mt={5}>
						<VStack
							flex={0.7}
							alignItems={'flex-start'}
							spacing={10}
							flexDirection={'column'}
							paddingX={5}
							maxWidth={'unset'}
						>
							<HStack spacing={5} width={'100%'} alignItems={'flex-start'}>
								<EditableField
									label={'Case Number'}
									colKey='case_number'
									value={newRecord.case_number?.toString()}
									valueType='number'
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5} width={'100%'} alignItems={'flex-start'}>
								<EditableDate
									label={'Case Open Date'}
									colKey='dt_opened'
									value={(newRecord.dt_opened && new Date(newRecord.dt_opened)) || new Date()}
									isEditing={true}
									onChange={handleChange}
								/>
								<EditableDate
									label={'Case Close Date'}
									colKey='dt_closed'
									minDate={(newRecord.dt_opened && new Date(newRecord.dt_opened)) || undefined}
									value={
										(newRecord.dt_closed && new Date(newRecord.dt_closed)) ||
										(newRecord.dt_opened && new Date(newRecord.dt_opened)) ||
										new Date()
									}
									isEditing={true}
									onChange={handleChange}
								/>
								<EditableDate
									label={'W/O Creation Date'}
									colKey='dt_wo_creation'
									value={(newRecord.dt_closed && new Date(newRecord.dt_closed)) || new Date()}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5} width={'100%'} alignItems={'flex-start'}>
								<EditableField
									label={'DMZ ID'}
									value={newRecord.dmz_id}
									colKey={'dmz_id'}
									isEditing={true}
									onChange={handleChange}
								/>
								<EditableField
									label={'Region'}
									value={newRecord.region}
									colKey={'region'}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5} width={'100%'}>
								<EditableField
									label={'Location'}
									colKey={'location'}
									value={newRecord.location}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5}>
								<EditableField
									label={'Action By'}
									colKey={'action_by'}
									value={newRecord.action_by}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5}>
								<EditableField
									useTextArea
									label={'Quick Comment'}
									colKey={'quick_comment'}
									value={newRecord.quick_comment}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
						</VStack>
						<Divider orientation='vertical' />
						<VStack
							flex={1}
							alignItems={'flex-start'}
							spacing={10}
							flexDirection={'column'}
							paddingX={5}
							maxWidth={'unset'}
						>
							<HStack width={'70%'} spacing={5} alignItems={'flex-start'}>
								<EditableField
									label={'Subject'}
									colKey='subject'
									value={newRecord.subject}
									isEditing={true}
									onChange={handleChange}
								/>
								<EditableField
									label={'Category'}
									colKey='subcategory'
									value={newRecord.subcategory}
									isEditing={true}
									onChange={handleChange}
								/>
								<EditableField
									label={'Actual Problem'}
									colKey='actual_problem'
									value={newRecord.actual_problem}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5} width={'100%'}>
								<EditableField
									useTextArea
									label={'Description'}
									value={newRecord.description}
									colKey={'description'}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5} width={'100%'}>
								<EditableDropdown
									useTextArea
									label={'Status'}
									values={statuses}
									value={newRecord.status}
									colKey={'status'}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							<HStack spacing={5}>
								<EditableField
									label={'Child Case Reason'}
									colKey={'child_case_reason'}
									value={newRecord.child_case_reason}
									isEditing={true}
									onChange={handleChange}
								/>
							</HStack>
							{newRecord.status?.toLowerCase().includes('complete') && (
								<HStack spacing={5}>
									<EditableField
										label={'Case resolution'}
										colKey={'case_resolution'}
										value={newRecord.case_resolution}
										isEditing={true}
										onChange={handleChange}
									/>
								</HStack>
							)}
							{newRecord.status?.toLowerCase().includes('cancel') && (
								<HStack spacing={5}>
									<EditableField
										useTextArea
										label={'Cancelled Reason'}
										colKey={'cancelled_reason'}
										value={newRecord.cancelled_reason}
										isEditing={true}
										onChange={handleChange}
									/>
									<EditableField
										useTextArea
										label={'Other Cancelled Reasons'}
										colKey={'other_cancelled_reasons'}
										value={newRecord.other_cancelled_reasons}
										isEditing={true}
										onChange={handleChange}
									/>
								</HStack>
							)}
							{newRecord.status?.toLowerCase().includes('decline') && (
								<HStack spacing={5}>
									<EditableField
										useTextArea
										label={'Declined Reason'}
										colKey={'declined_reason'}
										value={newRecord.declined_reason}
										isEditing={true}
										onChange={handleChange}
									/>
									<EditableField
										useTextArea
										label={'Other Declined Reasons'}
										colKey={'other_declined_reasons'}
										value={newRecord.other_declined_reasons}
										isEditing={true}
										onChange={handleChange}
									/>
								</HStack>
							)}
						</VStack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
