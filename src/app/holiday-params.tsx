'use client';

import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  {
    ssr: false,
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  {
    ssr: false,
  }
);
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {recommendDestinations} from '@/ai/flows/recommend-destinations';
import {generateItinerary} from '@/ai/flows/generate-itinerary';
import {getDestinationDetails} from '@/services/destination-details';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {useToast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  {
    ssr: false,
  }
);

const Icon = dynamic(
  async () => {
    const leaflet = await import('leaflet');
    return () => null; // Return a functional component that renders nothing
  },
  { ssr: false }
);


const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  {
    ssr: false,
  }
);

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/9667/9667298.png',
  iconSize: [38, 38], // size of the icon
});

export default function Home() {
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [timeOfYear, setTimeOfYear] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [destinationDetails, setDestinationDetails] = useState<{
    description: string;
    imageUrls: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {toast} = useToast();

  const handleRecommendation = async () => {
    setError(null);
    try {
      const input = {
        interests: interests,
        budget: budget,
        timeOfYear: timeOfYear,
      };

      const output = await recommendDestinations(input);

      if (output && output.destinations && output.destinations.length > 0) {
        setRecommendations(output.destinations);
        setSelectedDestination(output.destinations[0]); // Select the first destination by default
      } else {
        setError('No destinations recommended based on your preferences.');
        setRecommendations([]); // Clear any previous recommendations
        setSelectedDestination(null); // Clear selected destination
      }
    } catch (e: any) {
      console.error('Error during recommendation:', e);
      setError(`Failed to get recommendations: ${e.message}`);
      setRecommendations([]); // Clear any previous recommendations
      setSelectedDestination(null); // Clear selected destination
    }
  };

  const handleItineraryGeneration = async (destination: string) => {
    setError(null);
    setItinerary(null); // Clear any previous itinerary
    try {
      const input = {
        destination: destination,
        duration: 3, // hardcode to 3 for now.
        interests: interests, // pass interests
      };
      const output = await generateItinerary(input);
      if (output && output.itinerary) {
        setItinerary(output.itinerary);
      } else {
        setError('Could not generate itinerary');
      }
    } catch (e: any) {
      console.error('Error during itinerary generation:', e);
      setError(`Failed to generate itinerary: ${e.message}`);
    }
  };

  const handleDestinationDetails = async (destinationName: string) => {
    setError(null);
    setDestinationDetails(null); // Clear any previous details
    try {
      const details = await getDestinationDetails(destinationName);
      setDestinationDetails(details);
    } catch (e: any) {
      console.error('Error fetching destination details:', e);
      setError(`Failed to fetch destination details: ${e.message}`);
    }
  };

  useEffect(() => {
    if (selectedDestination) {
      handleItineraryGeneration(selectedDestination);
      handleDestinationDetails(selectedDestination);
    }
  }, [selectedDestination, interests]);

  const handleSelectDestination = (destination: string) => {
    setSelectedDestination(destination);
    toast({
      title: 'Destination Selected',
      description: `You have selected ${destination}. Generating itinerary and fetching details...`,
    });
  };

  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const handlePersonaChange = (persona: string) => {
    setSelectedPersona(persona);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Toaster />
      {/* Map and Preferences Section */}
      <div className="w-full md:w-1/2 p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Explore Sardinia</CardTitle>
            <CardDescription>Find your perfect Sardinian adventure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Select Your Travel Persona</h4>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="persona"
                    value="foodie"
                    checked={selectedPersona === 'foodie'}
                    onChange={() => handlePersonaChange('foodie')}
                    className="h-4 w-4"
                  />
                  <span>Foodie</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="persona"
                    value="adventurer"
                    checked={selectedPersona === 'adventurer'}
                    onChange={() => handlePersonaChange('adventurer')}
                    className="h-4 w-4"
                  />
                  <span>Adventurer</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="persona"
                    value="relaxer"
                    checked={selectedPersona === 'relaxer'}
                    onChange={() => handlePersonaChange('relaxer')}
                    className="h-4 w-4"
                  />
                  <span>Relaxer</span>
                </label>
              </div>
              {selectedPersona && (
                <p className="mt-2">You selected: {selectedPersona}</p>
              )}
            </div>
            <MapContainer
              center={[40, 9]}
              zoom={7}
              style={{height: '400px', width: '100%', marginBottom: '1rem'}}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {/* recommendations.map((city, index) => (
                <Marker
                  key={index}
                  position={[40 + index * 2, -10 - index * 3]}
                  icon={customIcon}
                  >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold">{city}</h3>
                      <Button
                        variant="secondary"
                        onClick={() => handleSelectDestination(city)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              )) */}
            </MapContainer>

            {/* Travel Preferences Input */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Your Preferences</h4>
              <div className="mb-2">
                <label className="block text-sm font-medium leading-none pb-1">
                  Interests
                </label>
                <Textarea
                  placeholder="e.g., hiking, museums, beaches"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium leading-none pb-1">
                  Budget
                </label>
                <Input
                  type="text"
                  placeholder="e.g., budget, moderate, luxury"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-none pb-1">
                  Time of Year
                </label>
                <Input
                  type="text"
                  placeholder="e.g., spring, summer, fall"
                  value={timeOfYear}
                  onChange={e => setTimeOfYear(e.target.value)}
                />
              </div>
              <Button className="mt-4 w-full" onClick={handleRecommendation}>
                Get Recommendations
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Destination Details and Itinerary Section */}
      <div className="w-full md:w-1/2 p-4">
        {selectedDestination && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedDestination}</CardTitle>
              <CardDescription>
                Details and suggested itinerary
              </CardDescription>
            </CardHeader>
            <CardContent>
              {destinationDetails && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2">
                    About {selectedDestination}
                  </h4>
                  <p className="text-sm">{destinationDetails.description}</p>
                  {destinationDetails.imageUrls.length > 0 && (
                    <div className="mt-2">
                      {destinationDetails.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${selectedDestination} image`}
                          className="w-full h-auto rounded-md mb-2"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {itinerary && (
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    Sample Itinerary
                  </h4>
                  <div className="text-sm whitespace-pre-line">{itinerary}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
