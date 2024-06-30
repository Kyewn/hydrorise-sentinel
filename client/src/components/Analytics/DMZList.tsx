import {useState} from 'react';
import {List, ListItem} from '@chakra-ui/react';
import {IDMZ} from '@/types';

interface DMZListProps {
    title: string;
    data: IDMZ[];
    setSelectedDmzId: (id: string) => void;
}

export const DMZList = (props: DMZListProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    return (
        <div className='selection-list'>
            <h6 className='list-title'>{props.title}</h6>
            <List className='list-content'>
                {props.data.map((val, key) => {
                    return (
                        <ListItem
                            key={key}
                            className={
                                key == selectedIndex
                                    ? 'list-item list-item-selected'
                                    : 'list-item'
                            }
                            onClick={() => {
                                setSelectedIndex(key);
                                props.setSelectedDmzId(val.doc_id);
                            }}
                        >
                            <p className='list-item-name'>{val.name}</p>
                            {
                                val.latest_nrr > 0
                                ? <p className='list-item-nrr'>NRR: {(Math.round(val.latest_nrr * 100) / 100).toFixed(2)}</p>
                                : <p className='list-item-nrr'>NRR: NA</p>
                            }
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}