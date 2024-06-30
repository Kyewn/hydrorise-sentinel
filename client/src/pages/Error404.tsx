import {useTitle} from '@/utils/hooks';

export const Error404 = () => {
	useTitle('Page not found');

	return (
		<>
			<div className='error-container'>
				<h1>Error 404</h1>
				<h3>Are you sure you are on the right page?</h3>
			</div>
		</>
	);
};
