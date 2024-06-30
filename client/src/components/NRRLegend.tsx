import {useEffect} from 'react';
import L, {Control} from 'leaflet';

// Choropleth colour scheme
export const getColor = (nrr: number) => {
    return nrr > 100000 ? '#800026' :
           nrr > 80000  ? '#BD0026' :
           nrr > 60000  ? '#E31A1C' :
           nrr > 40000  ? '#FC4E2A' :
           nrr > 20000  ? '#FD8D3C' :
           nrr > 10000  ? '#FEB24C' :
           nrr > 5000   ? '#FED976' :
                          '#FFEDA0';
}

export const NRRLegend = ({map}: any) => {
    useEffect(() => {
        if (map) {
            const legend = new Control({position: 'bottomright'});
            
            legend.onAdd = () => {
                const div = L.DomUtil.create('div', 'legend');
                const nrrRange = [0, 5000, 10000, 20000, 40000, 60000, 80000, 100000]

                for (let i = 0; i < nrrRange.length; i++) {
                    div.innerHTML +=
                        '<i style="background: ' + getColor(nrrRange[i] + 1) + '"></i>' +
                        nrrRange[i] + (nrrRange[i+1] ? ' &ndash; ' + nrrRange[i+1] + '<br>': '+');
                }

                return div;
            }

            legend.addTo(map);
        }
    }, [map]);

    return null;
}