import '@/App.css';
import MasterDetailLayout from '@/layout/MasterDetailLayout';
import {Alerts} from '@/pages/Alerts';
import {Analytics} from '@/pages/Analytics';
import {Dashboard} from '@/pages/Dashboard';
import {Error404} from '@/pages/Error404';
import {Repairs} from '@/pages/Repairs';
import {SensorLog} from '@/pages/SensorLog';
import Settings from '@/pages/Settings';
import {swrFetcher} from '@/utils/const';
import {AppContext, appContextInitialState, appContextReducer} from '@/utils/context/AppContext';
import {paths} from '@/utils/paths';
import {themes} from '@/utils/themes';
import {ChakraBaseProvider} from '@chakra-ui/react';
import {useReducer} from 'react';
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from 'react-router-dom';
import {SWRConfig} from 'swr';

const routes = createRoutesFromElements(
	<Route path='/' element={<MasterDetailLayout />} errorElement={<Error404 />}>
		<Route index element={<Dashboard />} />
		<Route path={paths.analytics} element={<Analytics />} />
		<Route path={paths.alerts} element={<Alerts />} />
		<Route path={paths.repairs} element={<Repairs />} />
		<Route path={paths.sensorLog} element={<SensorLog />} />
		<Route path={paths.settings} element={<Settings />} />
	</Route>
);
const router = createBrowserRouter(routes);

function App() {
	const [appState, appDispatch] = useReducer(appContextReducer, appContextInitialState);

	return (
		<AppContext.Provider value={{appState, appDispatch}}>
			<SWRConfig value={{fetcher: swrFetcher}}>
				<ChakraBaseProvider theme={themes}>
					<RouterProvider router={router} />
				</ChakraBaseProvider>
			</SWRConfig>
		</AppContext.Provider>
	);
}

export default App;
