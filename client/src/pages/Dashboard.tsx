import {getColor, NRRLegend} from '@/components/NRRLegend';
import {RankingCard} from '@/components/RankingCard';
import {StatsCard} from '@/components/StatsCard';
import '@/styles/Dashboard.css';
import {IDMZ} from '@/types';
import {useTitle} from '@/utils/hooks';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import {useEffect, useState} from 'react';
import {FaGlobeAsia, FaRegBell} from 'react-icons/fa';
import {LiaCitySolid} from 'react-icons/lia';
import {SlWrench} from 'react-icons/sl';
import {TbDropletUp} from 'react-icons/tb';
import {LayerGroup, LayersControl, MapContainer, Polygon, TileLayer, Tooltip} from 'react-leaflet';

const BASE_URL = 'http://localhost:8080';

export const Dashboard = () => {
	useTitle('Dashboard');
	
	// Stats Cards
	const [stateNRR, setStateNRR] = useState(0);
	const [highNrrRegionCount, setHighNrrRegionCount] = useState(0);
	const [highNrrDmzCount, setHighNrrDmzCount] = useState(0);
	const [unreadAlerts, setUnreadAlerts] = useState([]);
	const [ongoingRepairs, setOngoingRepairs] = useState([]);

	const getStateNRR = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/state/latest-nrr`);
			setStateNRR(response.data.stateNRR);
			return response.data.stateNRR;
		} catch (error) {
			console.error(error);
		}
	}
	const getUnreadAlerts = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/alerts/unread`);
			setUnreadAlerts(response.data.unreadAlerts);
			return response.data.unreadAlerts;
		} catch (error) {
			console.error(error);
		}
	}
	const getOngoingRepairs = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/repairs/ongoing`);
			setOngoingRepairs(response.data.ongoingRepairs);
			return response.data.ongoingRepairs;
		} catch (error) {
			console.error(error);
		}
	}

	// NRR Overview
	const [dmzArray, setDmzArray] = useState([]);
	const [regionArray, setRegionArray] = useState([]);
	const [map, setMap] = useState<any>(null);

	const getAllDMZ = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/dmzs`);
			const dmzArr = response.data.dmzs;
			setDmzArray(dmzArr);

			// Calculate median NRR
			const middleIndex = Math.floor((dmzArr.length-1) / 2);
			let medianNRR: number;
			if (dmzArr.length % 2) {
				medianNRR = dmzArr[middleIndex].latest_nrr;
			} else {
				medianNRR = (dmzArr[middleIndex].latest_nrr + dmzArr[middleIndex + 1].latest_nrr) / 2.0;
			}
			
			// Count high NRR DMZs
			let count: number = 0;
			dmzArr.forEach((dmz: IDMZ) => {
				if (dmz.latest_nrr > medianNRR) {
					count++;
				}
			});
			setHighNrrDmzCount(count);

			return response.data.dmzs;
		} catch (error) {
			console.error(error);
		}
	}
	const getAllRegions = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/regions`);
			const regionArr = response.data.regions;
			setRegionArray(regionArr);

			// Calculate median NRR
			const middleIndex = Math.floor((regionArr.length-1) / 2);
			let medianNRR: number;
			if (regionArr.length % 2) {
				medianNRR = regionArr[middleIndex].latest_nrr;
			} else {
				medianNRR = (regionArr[middleIndex].latest_nrr + regionArr[middleIndex + 1].latest_nrr) / 2.0;
			}
			
			// Count high NRR DMZs
			let count: number = 0;
			regionArr.forEach((region: IDMZ) => {
				if (region.latest_nrr > medianNRR) {
					count++;
				}
			});
			setHighNrrRegionCount(count);

			return response.data.regions;
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		(async() => {
			await getStateNRR();
			getAllRegions();
			getAllDMZ();
			getUnreadAlerts();
			getOngoingRepairs();
		})()
	}, []);

	

	return (
		<div className='dashboard-container'>
			<div className='dashboard-header'>
				<h1 className='page-title'>Dashboard</h1>
			</div>
			<div className='dashboard-content'>
				<div className='stats-card-list'>
					<StatsCard
						title='State NRR'
						value={stateNRR}
						icon={<TbDropletUp />}
					/>
					<StatsCard
						title='Regions (High NRR)'
						value={highNrrRegionCount}
						icon={<FaGlobeAsia />}
					/>
					<StatsCard
						title='DMZs (High NRR)'
						value={highNrrDmzCount}
						icon={<LiaCitySolid />}
					/>
					<StatsCard
						title='Alerts'
						value={unreadAlerts ? unreadAlerts.length : 0}
						icon={<FaRegBell />}
					/>
					<StatsCard
						title='Ongoing Repairs'
						value={ongoingRepairs ? ongoingRepairs.length : 0}
						icon={<SlWrench />}
					/>
				</div>

				<div className='nrr-overview'>
					<div className='nrr-map'>
						<h6 className='map-title'>NRR Overview</h6>
						<MapContainer
							className='nrr-map-container'
							center={[2.9553940634602722, 101.69978758174776]}
							zoom={12}
							ref={setMap}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
							/>
							<NRRLegend map={map} />
							<LayersControl position='topright'>
								<LayersControl.Overlay checked name='Regions'>
									<LayerGroup>
										{regionArray.map((val, key) => {
											let geometry: [number, number][][] = JSON.parse(val['geometry'])
											geometry = geometry.map((subArray: number[][]) => {
												return subArray.map((item: number[]) => {
													// Swap the positions of the two numbers
													return [item[1], item[0]];
												});
											});

											return (
												<Polygon
													key={key}
													pathOptions={{
														lineJoin: 'round',
														lineCap: 'round',
														dashArray: '4',
														fillColor: getColor(val['latest_nrr']),
														color: '#FFF'
													}}
													fillOpacity={0.8}
													fill={true}
													positions={geometry}
												>
													<div style={{zIndex: 501}}>
														<Tooltip sticky>
															<p className='map-tooltip-title'>Region: {val['name']}</p>
															<p>NRR: {(Math.round(val['latest_nrr'] * 100) / 100).toFixed(2)} m3/day/year</p>
														</Tooltip>
													</div>
												</Polygon>
											);
										})}
									</LayerGroup>
								</LayersControl.Overlay>
								<LayersControl.Overlay name='DMZs'>
									<LayerGroup>
										{dmzArray.map((val, key) => {
											let geometry: [number, number][][] = JSON.parse(val['geometry'])
											geometry = geometry.map((subArray: number[][]) => {
												return subArray.map((item: number[]) => {
													// Swap the positions of the two numbers
													return [item[1], item[0]];
												});
											});

											return (
												<Polygon
													key={key}
													pathOptions={{
														lineJoin: 'round',
														lineCap: 'round',
														dashArray: '3',
														fillColor: getColor(val['latest_nrr']),
														color: '#000'
													}}
													fillOpacity={0.8}
													fill={true}
													positions={geometry}
												>
													<div style={{zIndex: 501}}>
														<Tooltip sticky>
															<p className='map-tooltip-title'>DMZ: {val['name']}</p>
															<p>NRR: {(Math.round(val['latest_nrr'] * 100) / 100).toFixed(2)} m3/day/year</p>
														</Tooltip>
													</div>
												</Polygon>
											);
										})}
									</LayerGroup>
								</LayersControl.Overlay>
							</LayersControl>
						</MapContainer>
					</div>

					<div className='nrr-ranking-list'>
						<RankingCard title='Regions (Highest NRR)' data={regionArray} />
						<RankingCard title='DMZs (Highest NRR)' data={dmzArray} />
					</div>
				</div>
			</div>
		</div>
	);
};
