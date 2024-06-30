import {IHydraulic} from '@/types';
import {Tooltip} from '@chakra-ui/react';
import {IoInformationCircleOutline} from "react-icons/io5";
import {HydraulicLineChart} from './HydraulicLineChart';

interface HydraulicGraphCardProps {
    title: string;
    data: IHydraulic[];
    timeUnit: string;
    tooltip: boolean;
    tooltipMessage: string;
}

export const HydraulicGraphCard = (props: HydraulicGraphCardProps) => {
    return (
        <div className='graph-card'>
            <div className='graph-title'>
                <p>{props.title}</p>
                {
                    props.tooltip
                    &&
                    <Tooltip className='graph-tooltip' label={props.tooltipMessage} placement='right-start' shouldWrapChildren={true}>
                        <IoInformationCircleOutline  className='tooltip-icon'/>
                    </Tooltip>
                }
            </div>
            <div className='graph-content'>
                <HydraulicLineChart title={props.title} data={props.data} timeUnit={props.timeUnit} />
            </div>
        </div>
    );
}