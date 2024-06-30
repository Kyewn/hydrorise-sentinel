import '@/styles/Analytics.css';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Button, Spinner} from '@chakra-ui/react';
import {Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react';
import {HydraulicGraphCard} from '@/components/Analytics/HydraulicGraphCard';
import {NRRGraphCard} from '@/components/Analytics/NRRGraphCard';
import {DMZList} from '@/components/Analytics/DMZList';
import {RegionList} from '@/components/Analytics/RegionList';
import {useTitle} from '@/utils/hooks';

const BASE_URL = 'http://localhost:8080';

export const Analytics = () => {
	useTitle('Analytics');

	// Page Actions
	const [isUpdatingNRR, setIsUpdatingNRR] = useState(false);

	const updateNRR = async() => {
		setIsUpdatingNRR(true);

		try {
			await axios.get(`${BASE_URL}/hydraulics/update-nrr`);
		} catch (error) {
			console.error(error);
		} finally {
			if (selectedDmzId)
				getDmzNRR(selectedDmzId);
			if (selectedRegionId)
				getRegionNRR(selectedRegionId);
			getStateNRR();

			setIsUpdatingNRR(false);
		}
	}

	// DMZ Analytics
	const [dmzArray, setDmzArray] = useState([]);
	const [selectedDmzId, setSelectedDmzId] = useState('');
	const [dmzNRR, setDmzNRR] = useState([]);
	const [dmzMNF, setDmzMNF] = useState([]);
	const [dmzTodayFlow, setDmzTodayFlow] = useState([]);
	const [dmzPastFlow, setDmzPastFlow] = useState([]);

	const getAllDMZ = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/dmzs`);
			setDmzArray(response.data.dmzs);
			return response.data.dmzs;
		} catch (error) {
			console.error(error);
		}
	}
	const getDmzNRR = async(dmzId: string) => {
		try {
			const response = await axios.get(`${BASE_URL}/dmzs/${dmzId}/nrr`);
			setDmzNRR(response.data.dmzNRR);
			return response.data.dmzNRR;
		} catch (error) {
			console.error(error);
		}
	}
	const getDmzMNF = async(dmzId: string) => {
		try {
			const response = await axios.get(`${BASE_URL}/dmzs/${dmzId}/mnf`);
			setDmzMNF(response.data.dmzMNF);
			return response.data.dmzMNF;
		} catch (error) {
			console.error(error);
		}
	}
	const getDmzTodayFlow = async(dmzId: string) => {
		try {
			const response = await axios.get(`${BASE_URL}/dmzs/${dmzId}/today-flow`);
			setDmzTodayFlow(response.data.dmzTodayFlow);
			return response.data.dmzTodayFlow;
		} catch (error) {
			console.error(error);
		}
	}
	const getDmzPastFlow = async(dmzId: string) => {
		try {
			const response = await axios.get(`${BASE_URL}/dmzs/${dmzId}/past-flow`);
			setDmzPastFlow(response.data.dmzPastFlow);
			return response.data.dmzPastFlow;
		} catch (error) {
			console.error(error);
		}
	}
	
	// Region Analytics
	const [regionArray, setRegionArray] = useState([]);
	const [selectedRegionId, setSelectedRegionId] = useState('');
	const [regionNRR, setRegionNRR] = useState([]);

	const getAllRegions = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/regions`);
			setRegionArray(response.data.regions);
			return response.data.regions;
		} catch (error) {
			console.error(error);
		}
	}
	const getRegionNRR = async(regionId: string) => {
		try {
			const response = await axios.get(`${BASE_URL}/regions/${regionId}/nrr`);
			setRegionNRR(response.data.regionNRR);
			return response.data.regionNRR;
		} catch (error) {
			console.error(error);
		}
	}
	// const getRegionMNF = async() => {}
	// const getRegionTodayFlow = async() => {}
	// const getRegionPastFlow = async() => {}

	// State Analytics
	const [stateNRR, setStateNRR] = useState([]);

	const getStateNRR = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/state/nrr`);
			setStateNRR(response.data.stateNRR);
			return response.data.stateNRR;
		} catch (error) {
			console.error(error);
		}
	}

	// Tab handling
	const populateTabPanel = async(tabIndex: number) => {
		if (tabIndex == 0) {
			// DMZ
			if (!selectedDmzId) {
				const dmzData = await getAllDMZ();
				const defaultDmzDocId = dmzData[0]['doc_id'];

				getDmzNRR(defaultDmzDocId);
				getDmzMNF(defaultDmzDocId);
				getDmzTodayFlow(defaultDmzDocId);
				getDmzPastFlow(defaultDmzDocId);
			}
		} else if (tabIndex == 1) {
			// Region
			if (!selectedRegionId) {
				const regionData = await getAllRegions();
				const defaultRegionDocId = regionData[0]['doc_id'];

				getRegionNRR(defaultRegionDocId);
			};
		} else if (tabIndex == 2) {
			// State
			getStateNRR();
		}
	}

	useEffect(() => {
		// Populate DMZ tab panel on initial page load
		populateTabPanel(0);
	}, []);

	useEffect(() => {
		// Update DMZ graphs when selected DMZ is changed
		if (selectedDmzId) {
			getDmzNRR(selectedDmzId);
			getDmzMNF(selectedDmzId);
			getDmzTodayFlow(selectedDmzId);
			getDmzPastFlow(selectedDmzId);
		}
	}, [selectedDmzId]);

	useEffect(() => {
		// Update Region graphs when selected Region is changed
		if (selectedRegionId) {
			getRegionNRR(selectedRegionId);
		}
	}, [selectedRegionId]);
	
	return (
		<div className='analytics-container'>
			<div className='analytics-header'>
				<h1 className='page-title'>Analytics</h1>
			</div>
			<div className='analytics-content'>
				<Tabs
					className='analytics-tab-container'
					defaultIndex={0}
					onChange={(index) => populateTabPanel(index)}
				>
					<TabList className='analytics-tablist'>
						<Tab className='analytics-tab' _selected={{ color: 'white !important', bg: 'var(--accent1-color) !important', border: 'none !important' }}>
							DMZ
						</Tab>
						<Tab className='analytics-tab' _selected={{ color: 'white !important', bg: 'var(--accent1-color) !important', border: 'none !important' }}>
							Region
						</Tab>
						<Tab className='analytics-tab' _selected={{ color: 'white !important', bg: 'var(--accent1-color) !important', border: 'none !important' }}>
							State
						</Tab>
						{
							isUpdatingNRR &&
							<div className='update-nrr-loading'>
								<Spinner
									className='loading-spinner'
									thickness='4px'
									speed='0.65s'
									emptyColor='gray.200'
									color='white'
								/>
								<p>Updating NRR</p>
							</div>
						 }
						<Button className='analytics-btn' onClick={updateNRR}>Update NRR</Button>
					</TabList>
					<TabPanels className='analytics-tabpanel-container'>
						<TabPanel className='analytics-tabpanel'>
							<DMZList title='DMZs' data={dmzArray} setSelectedDmzId={setSelectedDmzId}/>
							<div className='graph-container'>
								<NRRGraphCard title='Natural Rate of Rise (NRR)' data={dmzNRR} timeUnit='month' tooltip={true} tooltipMessage='NRR must be updated manually by pressing the "Update NRR" button.' />
								<HydraulicGraphCard title='Minimum Night Flow (MNF)' data={dmzMNF} timeUnit='day' tooltip={false} tooltipMessage='' />
								<HydraulicGraphCard title="Today's Flow Rate" data={dmzTodayFlow} timeUnit='minute' tooltip={false} tooltipMessage='' />
								<HydraulicGraphCard title='Past Flow Rate' data={dmzPastFlow} timeUnit='day' tooltip={false} tooltipMessage='' />
							</div>
						</TabPanel>
						<TabPanel className='analytics-tabpanel'>
							<RegionList title='Regions' data={regionArray} setSelectedRegionId={setSelectedRegionId} />
							<div className='graph-container'>
								<NRRGraphCard title='Natural Rate of Rise (NRR)' data={regionNRR} timeUnit='month' tooltip={true} tooltipMessage='NRR must be updated manually by pressing the "Update NRR" button.' />
								<HydraulicGraphCard title='Minimum Night Flow (MNF)' data={[]} timeUnit='day' tooltip={false} tooltipMessage='' />
								<HydraulicGraphCard title="Today's Flow Rate" data={[]} timeUnit='minute' tooltip={false} tooltipMessage='' />
								<HydraulicGraphCard title='Past Flow Rate' data={[]} timeUnit='day' tooltip={false} tooltipMessage='' />
							</div>
						</TabPanel>
						<TabPanel className='analytics-tabpanel'>
							<div className='state-graph-container'>
								<NRRGraphCard title='Natural Rate of Rise (NRR)' data={stateNRR} timeUnit='month' tooltip={true} tooltipMessage='NRR must be updated manually by pressing the "Update NRR" button.' />
							</div>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</div>
	);
};
