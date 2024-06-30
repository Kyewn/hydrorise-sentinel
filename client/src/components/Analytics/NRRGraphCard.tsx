import {INRR} from '@/types';
import {Tooltip} from '@chakra-ui/react';
import {IoInformationCircleOutline} from "react-icons/io5";
import {NRRLineChart} from './NRRLineChart';

interface NRRGraphCardProps {
    title: string;
    data: INRR[];
    timeUnit: string;
    tooltip: boolean;
    tooltipMessage: string;
}

export const NRRGraphCard = (props: NRRGraphCardProps) => {
    return (
        <div className='graph-card'>
            <div className='graph-title'>
                <p>{props.title}</p>
                {
                    props.data.length > 0
                    ? <p className='latest-nrr'>Latest NRR: {(Math.round(props.data[props.data.length-1].value * 100) / 100).toFixed(2)}</p>
                    : <></>
                }
                {
                    props.tooltip
                    &&
                    <Tooltip className='graph-tooltip' label={props.tooltipMessage} placement='right-start' shouldWrapChildren={true}>
                        <IoInformationCircleOutline  className='tooltip-icon'/>
                    </Tooltip>
                }
            </div>
            <div className='graph-content'>
                <NRRLineChart title={props.title} data={props.data} timeUnit={props.timeUnit} />
            </div>
        </div>
    );
}