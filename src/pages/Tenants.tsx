import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TenantForm from '../components/TenantForm';
import { Pencil, Trash2 } from 'lucide-react';

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState([]);
  const [editingTenant, setEditingTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tenants', {
        headers: { Authorization: token }
      });
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tenants/${id}`, {
          headers: { Authorization: token }
        });
        fetchTenants();
      } catch (error) {
        console.error('Error deleting tenant:', error);
      }
    }
  };

  const isLateRent = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tenants</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
        </h2>
        <TenantForm
          tenant={editingTenant}
          onSubmit={() => {
            fetchTenants();
            setEditingTenant(null);
          }}
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Tenant List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">House</th>
                <th className="px-4 py-2 border">Property</th>
                <th className="px-4 py-2 border">Rent</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant: any) => (
                <tr key={tenant.id} className={isLateRent(tenant.due_date) ? 'bg-red-100' : ''}>
                  <td className="px-4 py-2 border">{tenant.tenant_name}</td>
                  <td className="px-4 py-2 border">{tenant.tenant_phone_number}</td>
                  <td className="px-4 py-2 border">{tenant.house_number}</td>
                  <td className="px-4 py-2 border">{tenant.property_name}</td>
                  <td className="px-4 py-2 border">${tenant.rent_amount}</td>
                  <td className="px-4 py-2 border">{tenant.due_date}</td>
                  <td className="px-4 py-2 border">
                    {isLateRent(tenant.due_date) ? 'Late' : 'On Time'}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tenant.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tenants;