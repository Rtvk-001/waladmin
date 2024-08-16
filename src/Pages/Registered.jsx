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
      try {
        // Fetch registrations for the given event_id
        const { data: registrationsData, error: registrationsError } = await supabase
          .from('registered')
          .select('user_id, status') // Fetch user_id and status
          .eq('event_id', event_id);

        if (registrationsError) throw registrationsError;

        if (registrationsData.length > 0) {
          // Extract user_ids from the registrations data
          const user_ids = registrationsData.map(r => r.user_id);

          // Fetch user details for all the user_ids
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('user_id, name')
            .in('user_id', user_ids);

          if (usersError) throw usersError;

          // Create a map for quick lookup of usernames by user_id
          const usersMap = new Map(usersData.map(user => [user.user_id, user.username]));

          // Combine the registrations with the usernames
          const enrichedRegistrations = registrationsData.map(registration => ({
            ...registration,
            username: usersMap.get(registration.user_id) || 'Unknown'
          }));

          setRegistrations(enrichedRegistrations);
        } else {
          setRegistrations([]);
        }
      } catch (err) {
        //setError('Error fetching registrations.');
        console.error(err);
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
            <tr key={registration.user_id}>
              <td>{registration.user_id}</td>
              <td>{registration.username}</td>
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