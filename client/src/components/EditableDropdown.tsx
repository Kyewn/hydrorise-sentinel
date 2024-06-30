import {TableData} from '@/components/Table/TableGroup';
import {
	Button,
	Heading,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VStack
} from '@chakra-ui/react';
import {BiChevronDown} from 'react-icons/bi';

type Props = {
	label: string;
	colKey: string;
	values?: string[];
	value?: string;
	isEditing?: boolean;
	useTextArea?: boolean;
	onChange?: (newData: TableData) => void;
};

export const EditableDropdown: React.FC<Props> = ({
	label,
	colKey,
	values,
	value,
	isEditing,
	onChange
}) => {
	return (
		<VStack width={'100%'} spacing={1} alignItems={'flex-start'}>
			<Heading as={'h2'} size={'sm'}>
				{label}
			</Heading>
			{isEditing ? (
				<Menu>
					<MenuButton isDisabled={!(values || []).length} as={Button} rightIcon={<BiChevronDown />}>
						{value || label}
					</MenuButton>
					<MenuList>
						{(values || []).map(
							(val) =>
								val && (
									<MenuItem
										key={val}
										onClick={() => {
											onChange?.({[colKey]: val});
										}}
									>
										{val}
									</MenuItem>
								)
						)}
					</MenuList>
				</Menu>
			) : (
				<Text>{value || '--'}</Text>
			)}
		</VStack>
	);
};
