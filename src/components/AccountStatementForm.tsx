import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const AccountStatementSchema = Yup.object().shape({
  property_name: Yup.string().required('Required'),
  month: Yup.date().required('Required'),
});

const AccountStatementForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        property_name: '',
        month: '',
      }}
      validationSchema={AccountStatementSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:5000/api/account_statement', values, {
            headers: { Authorization: token }
          });
          console.log(response.data);
          // Here you can handle the response, e.g., display the statement or offer a download
          resetForm();
        } catch (error) {
          console.error('Error generating account statement:', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Field type="text" name="property_name" placeholder="Property Name" className="w-full p-2 border rounded" />
            <ErrorMessage name="property_name" component="div" className="text-red-500" />
          </div>
          <div>
            <Field type="month" name="month" className="w-full p-2 border rounded" />
            <ErrorMessage name="month" component="div" className="text-red-500" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Generate Account Statement
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AccountStatementForm;