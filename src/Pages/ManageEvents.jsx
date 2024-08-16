import React, { useEffect, useState } from 'react';
import supabase from '../createClient.js';
import { useNavigate } from 'react-router-dom';
import '../CSS/ManageEvents.css'

//******************************************************* */
// cannot update events
//****************************************************** */

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '' });
  const [editedEvent, setEditedEvent] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (eventsError) {
        setError('Error fetching events.');
      } else {
        setEvents(eventsData || []);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const eventDate = new Date(newEvent.date);
      const currentDate = new Date();

      const eventStatus = eventDate > currentDate ? 'active' : 'inactive';

      const { error } = await supabase
        .from('events')
        .insert([{ name: newEvent.name, date: newEvent.date, active: eventStatus }]);

      if (error) throw error;

      setNewEvent({ name: '', date: '' });
      setShowAddEventForm(false);
      alert('Event added successfully!');

      // Refresh the events list
      fetchEvents();
    } catch (error) {
      setError('Error adding event.');
    }
  };

  const handleEditEvent = async () => {
    try {
      const eventDate = new Date(editedEvent.date);
      const currentDate = new Date();

      const eventStatus = eventDate > currentDate ? 'active' : 'inactive';

      const { error } = await supabase
        .from('events')
        .update({
          name: editedEvent.name,
          date: editedEvent.date,
          active: eventStatus
        })
        .eq('event_id', editedEvent.event_id);

      if (error) throw error;

      setEditedEvent(null);
      alert('Event updated successfully!');

      // Navigate back to /manageEvents
      navigate('/manageEvents');
    } catch (error) {
      setError('Error updating event.');
    }
  };

  const handleManageEventsClick = () => {
    setShowManageEvents(true);
  };

  const handleViewEventsClick = () => {
    setShowManageEvents(false);
  };

  const handleRegistrationsClick = (eventId) => {
    navigate(`/registered/${eventId}`);
  };

  return (
    <div className="manage-events">
      <h1>Manage Events</h1>

      <div className="action-buttons">
        <button onClick={() => setShowAddEventForm(!showAddEventForm)}>
          {showAddEventForm ? 'Cancel' : 'Add Event'}
        </button>
        <button onClick={handleManageEventsClick}>Manage Events</button>
        <button onClick={handleViewEventsClick}>View Events</button>
      </div>

      {showManageEvents ? (
        <div>
          <div className="events-table">
            <h2>All Events</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Actions</th>
                  <th>Registrations</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.event_id}>
                    <td>
                      {editedEvent && editedEvent.event_id === event.event_id ? (
                        <input
                          type="text"
                          value={editedEvent.name}
                          onChange={(e) => setEditedEvent({ ...editedEvent, name: e.target.value })}
                        />
                      ) : (
                        event.name
                      )}
                    </td>
                    <td>
                      {editedEvent && editedEvent.event_id === event.event_id ? (
                        <input
                          type="date"
                          value={editedEvent.date}
                          onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                        />
                      ) : (
                        new Date(event.date).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {editedEvent && editedEvent.event_id === event.event_id ? (
                        <button onClick={() => handleEditEvent()}>Save</button>
                      ) : (
                        <button onClick={() => setEditedEvent(event)}>Edit</button>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleRegistrationsClick(event.event_id)}>Registrations</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {events.length === 0 && <p>No events found.</p>}
        </div>
      ) : (
        <div>
          <div className="previous-events">
            <h2>Previous Events</h2>
            <ul>
              {events.filter(event => new Date(event.date) < new Date()).map(event => (
                <li key={event.event_id}>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </li>
              ))}
              {events.filter(event => new Date(event.date) < new Date()).length === 0 && <p>Looks empty here.</p>}
            </ul>
          </div>

          <div className="upcoming-events">
            <h2>Upcoming Events</h2>
            <ul>
              {events.filter(event => new Date(event.date) >= new Date()).map(event => (
                <li key={event.event_id}>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </li>
              ))}
              {events.filter(event => new Date(event.date) >= new Date()).length === 0 && <p>No events scheduled.</p>}
            </ul>
          </div>
        </div>
      )}

      {showAddEventForm && (
        <form onSubmit={handleAddEvent} className="add-event-form">
          <label>
            Event Name:
            <input
              type="text"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </label>
          <label>
            Event Date:
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </label>
          <button type="submit">Add Event</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ManageEvents;

