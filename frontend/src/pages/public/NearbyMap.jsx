import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { getNearbyNgos, getNearbyPets } from "../../api/mapApi";
import { userIcon, petIcon, ngoIcon } from "../../components/MapIcons";

export default function NearbyMap() {
  const [position, setPosition] = useState(null);
  const [pets, setPets] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [error, setError] = useState("");
  const [radiusKm, setRadiusKm] = useState(25);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location access denied. Enable it to see pets near you."),
    );
  }, []);

  useEffect(() => {
    if (!position) return;
    getNearbyPets(position.lat, position.lng, radiusKm).then((res) =>
      setPets(res.data),
    );
    getNearbyNgos(position.lat, position.lng, radiusKm).then((res) =>
      setNgos(res.data),
    );
  }, [position, radiusKm]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-neutral-500">{error}</p>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-primary-600">
            Pets & Shelters Near You
          </h1>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="border rounded-xl px-3 py-1.5 text-sm"
          >
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={50}>Within 50 km</option>
          </select>
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ height: "65vh" }}
        >
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[position.lat, position.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {pets.map((pet) => (
              <Marker
                key={`pet-${pet.id}`}
                position={[pet.latitude, pet.longitude]}
                icon={petIcon}
              >
                <Popup>
                  <div className="w-40">
                    {pet.images?.[0] && (
                      <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className="w-full h-20 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="font-semibold text-sm">{pet.name}</p>
                    <p className="text-xs text-neutral-500 mb-2">
                      {pet.distanceKm.toFixed(1)} km away
                    </p>
                    <Link
                      to={`/pets/${pet.id}`}
                      className="text-xs text-primary-600 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}

            {ngos.map((ngo) => (
              <Marker
                key={`ngo-${ngo.id}`}
                position={[ngo.latitude, ngo.longitude]}
                icon={ngoIcon}
              >
                <Popup>
                  <div className="w-40">
                    <p className="font-semibold text-sm">
                      {ngo.organizationName}
                    </p>
                    <p className="text-xs text-neutral-500">{ngo.address}</p>
                    <p className="text-xs text-neutral-500">
                      {ngo.distanceKm.toFixed(1)} km away
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="flex gap-4 mt-3 text-xs text-neutral-500">
          <span>🔵 You</span>
          <span>🟢 Pets ({pets.length})</span>
          <span>🟠 Shelters ({ngos.length})</span>
        </div>
      </div>
    </div>
  );
}
