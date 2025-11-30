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

  // Initialize canvas after planData is loaded
  useEffect(() => {
    if (!planData || !canvasRef.current) return;

    try {
      console.log('Initializing canvas...');
      
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const canvasObj = new Canvas(
        canvas,
        0, 0, 0, 0, false, 1.0,
        'viewer',
        { setLayers: () => {}, setPrereqLayers: () => {} }
      );
      
      const jsonBlob = new Blob([JSON.stringify(planData)], { type: 'application/json' });
      const file = new File([jsonBlob], 'map.json', { type: 'application/json' });
      const fakeInput = { files: [file] };

      canvasObj.import(fakeInput);
      
      console.log('Import complete, adding listeners...');
      
      canvasObj.addEventListeners();
      canvasObj.draw();

      setCanvasObject(canvasObj);
      
      console.log('Canvas ready');
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