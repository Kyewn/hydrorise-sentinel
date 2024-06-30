import {TableData} from '@/components/Table/TableGroup';
import {Heading, Input, Text, Textarea, VStack} from '@chakra-ui/react';

type Props = {
	label: string;
	colKey: string;
	value?: string;
	valueType?: string;
	isEditing?: boolean;
	useTextArea?: boolean;
	onChange?: (newData: TableData) => void;
};

export const EditableField: React.FC<Props> = ({
	label,
	colKey,
	value,
	valueType,
	isEditing,
	useTextArea,
	onChange
}) => {
	return (
		<VStack width={'100%'} spacing={1} alignItems={'flex-start'}>
			<Heading as={'h2'} size={'sm'}>
				{label}
			</Heading>
			{isEditing ? (
				useTextArea || (value && value.length > 50) ? (
					<Textarea
						minWidth={'250px'}
						onChange={(e) => onChange?.({[colKey]: e.target.value})}
						value={value || ''}
						resize={'both'}
					/>
				) : (
					<Input
						type={valueType}
						onChange={(e) => onChange?.({[colKey]: e.target.value})}
						value={value || ''}
					/>
				)
			) : (
				<Text>{value || '--'}</Text>
			)}
		</VStack>
	);
};
