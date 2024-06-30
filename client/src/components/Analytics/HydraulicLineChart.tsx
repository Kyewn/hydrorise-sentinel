import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    plugins,
    Colors
    
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-luxon';
import {IHydraulic} from '@/types';

ChartJS.register(
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    plugins,
    Colors
);

interface HydraulicLineChartProps {
    title: string;
    data: IHydraulic[];
    timeUnit: string;
}

export const HydraulicLineChart = (props: HydraulicLineChartProps) => {
    if (props.data.length == 0) {
        return <p className='graph-error'>No existing data found.</p>
    } else if (!props.data) {
        return <p className='graph-error'>Graph could not be displayed due to an error.</p>
    }
    
    const chartData = {
        labels: props.data.map((data) => data.dt),
        datasets: [
            {
                label: props.title,
                data: props.data.map((data) => data.flow)
            }
        ]
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: props.timeUnit
                },
                adapters: {
                    date: {
                        zone: 'UTC'
                    }
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Flow (l/s)'
                }
            }
        }
    };
    
    return (
        <Line data={chartData} options={options} />
    );
}