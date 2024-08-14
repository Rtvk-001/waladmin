import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../createClient.js';


//******************************************************* */
// error 400 (why but why??)
//****************************************************** */


const Registered = () => {
  const { event_id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      const { data: registrationsData, error: registrationsError } = await supabase
        .from('registered')
        .select('*, users (username)')
        .eq('event_id', event_id);

      if (registrationsError) {
        setError('Error fetching registrations.');
      } else {
        setRegistrations(registrationsData || []);
      }
    };

    fetchRegistrations();
  }, [event_id]);

  return (
    <div className="registered">
      <h1>Registrations for Event {event_id}</h1>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr key={registration.uuid}>
              <td>{registration.uuid}</td>
              <td>{registration.users?.username || 'Unknown'}</td>
              <td>{registration.status}</td>
            </tr>
          ))}
          {registrations.length === 0 && <tr><td colSpan="3">No registrations found.</td></tr>}
        </tbody>
      </table>

      <button onClick={() => navigate('/manageEvents')}>Back to Manage Events</button>
    </div>
  );
};

export default Registered;
