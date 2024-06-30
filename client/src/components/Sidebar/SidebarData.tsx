import '@/App.css';
import {Icon} from '@chakra-ui/react';
import {BiLogOut} from 'react-icons/bi';
import {FaBell, FaCog, FaWrench} from 'react-icons/fa';
import {MdDashboard, MdSensors} from 'react-icons/md';
import {SiSimpleanalytics} from 'react-icons/si';
import {paths} from '@/utils/paths';

export const SidebarDataTop = [
	{
		title: 'Dashboard',
		icon: <Icon as={MdDashboard} />,
		path: paths.dashboard
	},
	{
		title: 'Analytics',
		icon: <Icon as={SiSimpleanalytics} />,
		path: paths.analytics
	},
	{
		title: 'Alerts',
		icon: <Icon as={FaBell} />,
		path: paths.alerts
	},
	{
		title: 'Repairs',
		icon: <Icon as={FaWrench} />,
		path: paths.repairs
	},
	{
		title: 'Sensor Log',
		icon: <Icon as={MdSensors} />,
		path: paths.sensorLog
	}
];

export const SidebarDataBottom = [
	{
		title: 'Settings',
		icon: <Icon as={FaCog} />,
		path: paths.settings
	},
	{
		title: 'Logout',
		icon: <Icon as={BiLogOut} />
	}
];
