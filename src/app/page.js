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
  
     

    <div className='w-[70%] m-auto'>
      <Header /> 
      <Mission></Mission>
  
      {loading ? (
        <Loading /> 
      ) : (
        <>
          <h1 className='text-center text-xl ring-1 m-2'>All Launches Details are Here</h1>
          
            
            <div className='ml-2 mt-6'>
              {students.map((student, index) => (
                <div key={index} className='mb-4 px-12 py-6 rounded-md bg-neutral-800'>
                  <div className='flex'>
                    <p style={{color: 'darkgray'}} className='text-xl'>
                      {student.flight_number}.
                      </p>
                    <h1 style={{color: 'darkgray'}} className='text-2xl ml-1'>Mission: </h1>
                    
                    <h1 className='text-2xl ml-1 font-bold'
                      style={{color:student.launch_success ? 'darkgreen' : 'darkred'}}
                    >
                      {student.mission_name}
                    </h1>
                  </div>
                  
                  <p className='text-gray-600 text-xs mb-4'>Date:{student.launch_date_local}</p>
                  {/* <button className='bg-gray-700 py-2 px-4 rounded-full hover:bg-slate-800 font-bold'>
                    Details
                  </button> */}
                  <button className='bg-gray-700 py-2 px-4 rounded-full hover:bg-slate-800 font-bold'>
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
