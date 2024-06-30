interface StatsCardProps {
    title: string;
    value: number;
    icon: JSX.Element;
}

export const StatsCard = (props: StatsCardProps) => {
    return (
        <div className='stats-card'>
            <div className='stats-card-text'>
                <p className='stats-title'>{props.title}</p>
                <p className='stats-value'>{(Math.round(props.value * 100) / 100).toFixed(0)}</p>
            </div>
            <div className='stats-card-icon'>
                <div className="stats-card-icon-holder">{props.icon}</div>
            </div>
        </div>
    );
};
