'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/components/loader/loader';

export default function FlightDetails() {
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  
  const flight_number = params?.flight_number;

  console.log("flight-number:", flight_number);

  useEffect(() => {
    if (!flight_number) return;

    async function fetchFlightDetails() {
      setLoading(true);
      try {
           const query = `
 query GetFlightDetails($flight_number: Int!) {
            flight(flight_number: $flight_number) {
              flight_number
              mission_name
              launch_year
              launch_date_local
              upcomingn
              launch_success
              details
              static_fire_date_utc
              static_fire_date_unix
            }
          }
        `;

        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { flight_number: parseInt(flight_number) } }),
        });

        const result = await response.json();
        console.log("API Response:", result);

        if (result?.data?.flight) {
          setFlightDetails(result.data.flight);
        } else {
          setFlightDetails(null);
        }
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setFlightDetails(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFlightDetails();
  }, [flight_number]);

  console.log("Flight Details:", flightDetails);

  if (loading) {
    return <Loading />;
  }

  if (!flightDetails) {
    return (
      <p className="text-center text-xl text-red-500">
        Flight details not available for flight number: {flight_number}
      </p>
    );
  }

  return (
    <div className="w-[70%] m-auto mt-8">
      <h1 className="text-center text-3xl mb-6">Flight Details</h1>
      <div className="bg-neutral-800 rounded-md p-6">
        <div className="flex">
          
          <h1 style={{ color: 'darkgray' }} className="text-2xl ml-1">Mission
            { flightDetails.flight_number}: </h1>
          <h1
            className="text-2xl ml-1 font-bold"
            style={{ color: flightDetails.upcoming ? 'darkgreen' : 'darkred' }}
          >
            {flightDetails.mission_name}
          </h1>
        </div>
        <p className="text-gray-600 text-xs mb-4">Launch Year: {flightDetails.launch_year}</p>
        <p className="text-gray-600 text-xs mb-4">
          Launch Date: {flightDetails.launch_date_local}
        </p>
      </div>
      <h1 className='text-center text-4xl my-7'>Launch Info</h1>
      <div className="bg-neutral-800 rounded-md p-6">
        <h1 className='text-xl'>
        Details:
        </h1>
        <p className="text-gray-400  mb-4">
           {flightDetails.details || 'N/A'}
        </p>
        <p className="text-gray-200  mb-4">
          Static Fire Date UTC: {flightDetails.static_fire_date_utc || 'N/A'}
        </p>
      </div>
    </div>
  );
}