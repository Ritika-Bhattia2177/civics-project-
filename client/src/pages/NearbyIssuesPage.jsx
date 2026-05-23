import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import api from '../api';
import { Link } from 'react-router-dom';

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || !points.length) return;
    const heatPoints = points.map((p) => [Number(p.lat), Number(p.lng), 0.6]);
    // @ts-ignore: leaflet.heat added to L
    const heat = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);
    return () => {
      if (map && heat) map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function NearbyIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [category, setCategory] = useState('All');
  const [center, setCenter] = useState([20.5937, 78.9629]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/issues?scope=public');
        setIssues(data.issues || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set((issues || []).map((i) => i.category).filter(Boolean)))], [issues]);

  const filtered = useMemo(() => (category === 'All' ? issues : (issues || []).filter((i) => i.category === category)), [issues, category]);

  const points = useMemo(() => filtered.filter((i) => i.location && i.location.lat && i.location.lng).map((i) => ({ lat: i.location.lat, lng: i.location.lng, id: i._id })), [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border-2 border-blue-200 p-6 bg-blue-50 ">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold">Nearby Issues</h2>
            <p className="text-slate-400">Explore recent reports on the map. Use filters and the heatmap to spot hotspots.</p>
          </div>

          <div className="flex items-center gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-3 py-2">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="h-[620px] rounded-xl overflow-hidden border-2 border-blue-200">
          <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <HeatmapLayer points={points} />
            {points.map((p) => (
              <Marker key={p.id} position={[Number(p.lat), Number(p.lng)]}>
                <Popup>
                  <div className="max-w-xs">
                    <div className="font-bold">Issue</div>
                    <div className="mt-1"><Link to={`/complaint/${p.id}`} className="text-civic-400">Open Complaint</Link></div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {points.map((p) => (
              <CircleMarker key={`c-${p.id}`} center={[Number(p.lat), Number(p.lng)]} radius={6} pathOptions={{ color: '#f97316', fillColor: '#fb923c', fillOpacity: 0.7 }} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
