import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const TenantSchema = Yup.object().shape({
  tenant_name: Yup.string().required('Required'),
  tenant_phone_number: Yup.string().required('Required'),
  house_number: Yup.string().required('Required'),
  house_type: Yup.string().required('Required'),
  property_name: Yup.string().required('Required'),
  deposit_paid: Yup.number().required('Required').positive('Must be positive'),
  payment_date: Yup.date().required('Required'),
  receipt_number_deposit: Yup.string().required('Required'),
  rent_amount: Yup.number().required('Required').positive('Must be positive'),
});

const TenantForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        tenant_name: '',
        tenant_phone_number: '',
        house_number: '',
        house_type: '',
        property_name: '',
        deposit_paid: '',
        payment_date: '',
        receipt_number_deposit: '',
        rent_amount: '',
      }}
      validationSchema={TenantSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        axios.post('http://localhost:5000/api/tenants', values)
          .then(response => {
            console.log(response);
            resetForm();
          })
          .catch(error => {
            console.error('Error adding tenant:', error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Field type="text" name="tenant_name" placeholder="Tenant Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="tenant_name" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="tenant_phone_number" placeholder="Phone Number" className="w-full p-2 border rounded" />
            <ErrorMessage name="tenant_phone_number" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="house_number" placeholder="House Number" className="w-full p-2 border rounded" />
            <ErrorMessage name="house_number" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="house_type" placeholder="House Type" className="w-full p-2 border rounded" />
            <ErrorMessage name="house_type" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="property_name" placeholder="Property Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="property_name" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="number" name="deposit_paid" placeholder="Deposit Paid" className="w-full p-2 border rounded" />
            <ErrorMessage name="deposit_paid" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="date" name="payment_date" className="w-full p-2 border rounded" />
            <ErrorMessage name="payment_date" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="text" name="receipt_number_deposit" placeholder="Receipt Number (Deposit)" className="w-full p-2 border rounded" />
            <ErrorMessage name="receipt_number_deposit" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="number" name="rent_amount" placeholder="Rent Amount" className="w-full p-2 border rounded" />
            <ErrorMessage name="rent_amount" component="div" className="text-red-500" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Tenant
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TenantForm;