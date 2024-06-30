import '@/App.css';
import {Sidebar} from '@/components/Sidebar/Sidebar';
import {Outlet} from 'react-router-dom';

function MasterDetailLayout() {
	return (
		<div className='site-container'>
			<Sidebar />
			<div className='page-container'>
				<Outlet />
			</div>
		</div>
	);
}

export default MasterDetailLayout;
