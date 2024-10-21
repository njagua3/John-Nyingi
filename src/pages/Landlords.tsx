import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandlordForm from '../components/LandlordForm';

const Landlords: React.FC = () => {
  const [landlords, setLandlords] = useState([]);

  useEffect(() => {
    fetchLandlords();
  }, []);

  const fetchLandlords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/landlords');
      setLandlords(response.data);
    } catch (error) {
      console.error('Error fetching landlords:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Landlords</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Landlord</h2>
        <LandlordForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Landlord List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Property</th>
              </tr>
            </thead>
            <tbody>
              {landlords.map((landlord: any) => (
                <tr key={landlord.id}>
                  <td className="px-4 py-2 border">{landlord.landlord_name}</td>
                  <td className="px-4 py-2 border">{landlord.phone_number}</td>
                  <td className="px-4 py-2 border">{landlord.property_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Landlords;