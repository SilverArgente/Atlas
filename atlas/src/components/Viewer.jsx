import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Canvas } from '../scripts/classes/Canvas';
import Header from './Header';

export default function Viewer() {
  const { planId } = useParams();
  const canvasRef = useRef(null);
  const [canvasObject, setCanvasObject] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the plan data
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        console.log('Fetching plan:', planId);
        
        const { data, error } = await supabase
          .from('plan')
          .select('*')
          .eq('id', planId)
          .single();

        console.log('Fetched data:', data);

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (!data || !data.data) {
          setError('No plan data found');
          setLoading(false);
          return;
        }

        setPlanData(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  useEffect(() => {
    if (!planData || !canvasRef.current) return;
    try {
      console.log('Initializing canvas...');
      
    } catch (err) {
      console.error('Error initializing canvas:', err);
      setError(err.message);
    }
  }, [planData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <canvas ref={canvasRef} className="w-full h-screen" />
    </div>
  );
}