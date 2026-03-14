'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/header/header';
// import Loader from '@/components/loader/loader';
import Mission from '@/components/mission/mission';
import Loading from '@/components/loader/loader';
import Link from 'next/link';

export default function HomePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {   
        const query = `
          query {
            students {
              mission_name
              launch_success
              launch_year
              flight_number
              launch_date_local
            }
          }
        `;

        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const { data } = await response.json();
        setStudents(data.students || []);
        console.log(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]); 
      } finally {

        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <Header /> 
      <Mission></Mission>
  
      {loading ? (
        <Loading /> 
      ) : (
        <>
          <h1 className='text-center text-lg sm:text-xl md:text-2xl ring-1 m-2 sm:m-4'>All Launches Details are Here</h1>
          
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {students.map((student, index) => (
              <div key={index} className='p-4 sm:p-6 md:p-8 rounded-md bg-neutral-800'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center'>
                  <p style={{color: 'darkgray'}} className='text-lg sm:text-xl'>
                    {student.flight_number}.
                  </p>
                  <h1 style={{color: 'darkgray'}} className='text-xl sm:text-2xl ml-0 sm:ml-1'>Mission: </h1>
                  
                  <h1 className='text-xl sm:text-2xl ml-0 sm:ml-1 font-bold'
                    style={{color:student.launch_success ? 'darkgreen' : 'darkred'}}
                  >
                    {student.mission_name}
                  </h1>
                </div>
                
                <p className='text-gray-600 text-xs sm:text-sm mb-4'>Date:{student.launch_date_local}</p>
                <button className='bg-gray-700 py-1 px-2 sm:py-2 sm:px-4 rounded-full hover:bg-slate-800 font-bold'>
                  <Link href={`/params/${student.flight_number}`}>
                    Details
                  </Link>
                </button>
                
              </div>
            ))}
          </div>
        
        </>
      )}
    </div>
  );
}
