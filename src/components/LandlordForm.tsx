import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const LandlordSchema = Yup.object().shape({
  landlord_name: Yup.string().required('Required'),
  phone_number: Yup.string().required('Required'),
  property_name: Yup.string().required('Required'),
});

const LandlordForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        landlord_name: '',
        phone_number: '',
        property_name: '',
      }}
      validationSchema={LandlordSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        axios.post('http://localhost:5000/api/landlords', values)
          .then(response => {
            console.log(response);
            resetForm();
          })
          .catch(error => {
            console.error('Error adding landlord:', error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Field type="text" name="landlord_name" placeholder="Landlord Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="landlord_name" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="phone_number" placeholder="Phone Number" className="w-full p-2 border rounded" />
            <ErrorMessage name="phone_number" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="property_name" placeholder="Property Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="property_name" component="div" className="text-red-500" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Landlord
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LandlordForm;