'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/components/loader/loader';

export default function FlightDetails() {
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { flight_number } = useParams();

  useEffect(() => {
    if (!flight_number) return;

    async function fetchFlight() {
      setLoading(true);
      const query = `
        query GetFlightDetails($flight_number: Int!) {
          flight(flight_number: $flight_number) {
            flight_number
            mission_name
            launch_year
            launch_date_local
            upcoming
            launch_success
            details
            static_fire_date_utc
            static_fire_date_unix
          }
        }
      `;

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { flight_number: parseInt(flight_number) } }),
      });

      const result = await res.json();
      console.log(result);
      setFlightDetails(result?.data?.flight || null);
      setLoading(false);
    }

    fetchFlight();
  }, [flight_number]);

  if (loading) return <Loading />;
  if (!flightDetails) return <div className="text-center mt-10 text-red-500 text-xl">Flight details not found</div>;

  const getStatusColor = (isSuccess) => isSuccess ? 'bg-blue-600' : 'bg-red-600';
  const getStatusText = (isSuccess) => isSuccess ? 'Successful' : 'Failed';
  const getTextColor = (isSuccess) => isSuccess ? 'text-blue-500' : 'text-red-500';
  const getHeaderColor = (isSuccess) => isSuccess ? 'text-blue-400' : 'text-red-400';
  const getDataColor = (isSuccess) => isSuccess ? 'text-white' : 'text-red-400';

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={`text-5xl font-bold mb-2 ${getTextColor(flightDetails.launch_success)}`}>{flightDetails.mission_name}</h1>
          <div className="h-1 w-24 bg-white"></div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-4 mb-8">
          <div className={`${getStatusColor(flightDetails.launch_success)} px-6 py-2 rounded-lg font-semibold text-white`}>
            {getStatusText(flightDetails.launch_success)}
          </div>
         
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className={`${flightDetails.launch_success ? 'border-blue-500' : 'border-red-600'} border-2 bg-gray-900 rounded-lg p-6 hover:${flightDetails.launch_success ? 'border-blue-400' : 'border-red-400'} transition`}>
            <h2 className={`${getHeaderColor(flightDetails.launch_success)} text-sm uppercase tracking-wide font-bold mb-4`}>Flight Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Flight Number</p>
                <p className="text-white text-2xl font-bold">{flightDetails.flight_number}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Launch Year</p>
                <p className="text-white text-xl font-semibold">{flightDetails.launch_year}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
         <div className={`${flightDetails.launch_success ? 'border-blue-500' : 'border-red-600'} border-2 bg-gray-900 rounded-lg p-6 hover:${flightDetails.launch_success ? 'border-blue-400' : 'border-red-400'} transition`}>
            <h2 className={`${getHeaderColor(flightDetails.launch_success)} text-sm uppercase tracking-wide font-bold mb-4`}>Launch Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Launch Date (Local)</p>
                <p className= "text-lg font-semibold">{new Date(flightDetails.launch_date_local).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              {flightDetails.static_fire_date_utc && (
                <div>
                  <p className="text-gray-400 text-sm">Static Fire Date</p>
                  <p className={`${getDataColor(flightDetails.launch_success)} text-sm`}>{new Date(flightDetails.static_fire_date_utc).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        {flightDetails.details && (
          <div className="border-2 border-gray-700 bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className={`${getHeaderColor(flightDetails.launch_success)} text-sm uppercase tracking-wide font-bold mb-4`}>Mission Details</h2>
            <p className={`${flightDetails.launch_success ? 'text-gray-100' : 'text-red-300'} leading-relaxed line-clamp-6`}>{flightDetails.details}</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm py-6 border-t border-gray-800">
          <p>Flight ID: <span className={`${getTextColor(flightDetails.launch_success)}`}>{flightDetails.flight_number}</span></p>
        </div>
      </div>
    </div>
  );
}