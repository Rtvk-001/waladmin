import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/HomePage.css';
import supabase from "../createClient.js";

const HomePage = () => {
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUpcomingEvent = async () => {
        const { data, error } = await supabase
          .from('events')
          .select('name, date')
          .order('date', { ascending: true })
          .gte('date', new Date().toISOString())
          .limit(1);
        
        if (error) {
          console.error('Error fetching upcoming event:', error);
        } else {
          setUpcomingEvent(data[0] || null);
        }
      };
  
      fetchUpcomingEvent();
    }, []);
  
    const handleEventClick = () => {
      navigate('/manageEvents');
    };
  
    return (
      <div className="homepage">
        <h1 className="title">WalAdmin</h1>
        <button className="add-product-btn" onClick={() => navigate('/add-products')}>
          + Add Product
        </button>
        
        <div className="event-tile" onClick={handleEventClick}>
          {upcomingEvent ? (
            <>
              <div className="event-name">{upcomingEvent.name}</div>
              <div className="event-date">{new Date(upcomingEvent.date).toLocaleDateString()}</div>
            </>
          ) : (
            <div className="event-name">No more events</div>
          )}
        </div>
      </div>
    );
  };
  
  export default HomePage;
