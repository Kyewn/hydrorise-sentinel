import '@/App.css';
import {
	SidebarDataTop,
	SidebarDataBottom
} from '@/components/Sidebar/SidebarData';
import {useLocation, useNavigate} from 'react-router-dom';

export const Sidebar = () => {
	// Use React Router DOM for routing purposes
	// Because hooks like useNavigate() is useful when we want to pass data/state to different components/pages by using this syntax:
	// navigate('/path', {state: data});

	const location = useLocation();
	const navigate = useNavigate();

	const pathName: string = location.pathname;

	return (
		<nav className='sidebar'>
			<h2 className='sidebar-title'>HydroRise Sentinel</h2>
			<ul className='sidebar-list-top'>
				{SidebarDataTop.map((val, key) => {
					return (
						<li
							key={key}
							className={
								pathName == val.path
									? 'sidebar-item nav-active'
									: 'sidebar-item'
							}
							onClick={() => {
								navigate(val.path);
							}}
						>
							<div className='sidebar-item-icon'>{val.icon}</div>
							<div className='sidebar-item-text'>{val.title}</div>
						</li>
					);
				})}
			</ul>
			<ul className='sidebar-list-bottom'>
				{SidebarDataBottom.map((val, key) => {
					return (
						<li
							key={key}
							className={
								pathName == val.path
									? 'sidebar-item nav-active'
									: 'sidebar-item'
							}
							onClick={() => {
								if (val.path) {
									navigate(val.path);
									return;
								}

								// Logout function
							}}
						>
							<div className='sidebar-item-icon'>{val.icon}</div>
							<div className='sidebar-item-text'>{val.title}</div>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
