import {IDMZ, IRegion} from '@/types';
import {List, ListItem} from '@chakra-ui/react';

interface RankingCardProps {
    title: string;
    data: (IDMZ | IRegion)[];
}

export const RankingCard = (props: RankingCardProps) => {
    if (props.data) {
        props.data.sort((a, b) => (a.latest_nrr > b.latest_nrr ? -1 : 1));
    }

    return (
        <div className='ranking-card'>
            <h6 className='ranking-title'>{props.title}</h6>
            <List className='ranking-list'>
                {props.data.slice(0, 5).map((val, key) => {
                    return (
                        <ListItem
                            key={key}
                            className='ranking-item'
                        >
                            <p className='list-item-name'>{val.name}</p>
                            {
                                val.latest_nrr > 0
                                ? <p className='ranking-item-nrr'>{(Math.round(val.latest_nrr * 100) / 100).toFixed(0)}</p>
                                : <p className='ranking-item-nrr'>NA</p>
                            }
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};
