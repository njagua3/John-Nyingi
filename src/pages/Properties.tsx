import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyForm from '../components/PropertyForm';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Property</h2>
        <PropertyForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Property List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Landlord</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">House Types</th>
                <th className="px-4 py-2 border">Rent</th>
                <th className="px-4 py-2 border">House Number</th>
                <th className="px-4 py-2 border">Occupied</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property: any) => (
                <tr key={property.id}>
                  <td className="px-4 py-2 border">{property.property_name}</td>
                  <td className="px-4 py-2 border">{property.landlord_name}</td>
                  <td className="px-4 py-2 border">{property.location}</td>
                  <td className="px-4 py-2 border">{property.types_of_houses}</td>
                  <td className="px-4 py-2 border">${property.rent_amount}</td>
                  <td className="px-4 py-2 border">{property.house_number}</td>
                  <td className="px-4 py-2 border">{property.is_occupied ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Properties;