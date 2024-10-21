import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const PropertySchema = Yup.object().shape({
  property_name: Yup.string().required('Required'),
  landlord_name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  types_of_houses: Yup.string().required('Required'),
  rent_amount: Yup.number().required('Required').positive('Must be positive'),
  house_number: Yup.string().required('Required'),
  is_occupied: Yup.boolean().required('Required'),
});

const PropertyForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        property_name: '',
        landlord_name: '',
        location: '',
        types_of_houses: '',
        rent_amount: '',
        house_number: '',
        is_occupied: false,
      }}
      validationSchema={PropertySchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        axios.post('http://localhost:5000/api/properties', values)
          .then(response => {
            console.log(response);
            resetForm();
          })
          .catch(error => {
            console.error('Error adding property:', error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Field type="text" name="property_name" placeholder="Property Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="property_name" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="landlord_name" placeholder="Landlord Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="landlord_name" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="location" placeholder="Location" className="w-full p-2 border rounded" />
            <ErrorMessage name="location" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="types_of_houses" placeholder="Types of Houses" className="w-full p-2 border rounded" />
            <ErrorMessage name="types_of_houses" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="number" name="rent_amount" placeholder="Rent Amount" className="w-full p-2 border rounded" />
            <ErrorMessage name="rent_amount" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="house_number" placeholder="House Number" className="w-full p-2 border rounded" />
            <ErrorMessage name="house_number" component="div" className="text-red-500" />
          </div>
          <div>
            <label className="flex items-center">
              <Field type="checkbox" name="is_occupied" className="mr-2" />
              <span>Is Occupied</span>
            </label>
            <ErrorMessage name="is_occupied" component="div" className="text-red-500" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Property
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyForm;