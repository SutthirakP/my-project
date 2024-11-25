'use client';

import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

const VisitsChart = () => {
  const [visitsData, setVisitsData] = useState<number[]>([]);

  useEffect(() => {
    const fetchVisitsData = async () => {
      try {
        const response = await fetch('/api/visits');
        if (response.ok) {
          const data = await response.json();
          setVisitsData(data.visits.map((v: { count: number }) => v.count));
        } else {
          console.error('Failed to fetch visits data');
        }
      } catch (error) {
        console.error('Error fetching visits data:', error);
      }
    };

    fetchVisitsData();
  }, []);

  const data = {
    labels: ['10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
    datasets: [
      {
        label: 'Website Visits',
        data: visitsData,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
};

export default VisitsChart;
