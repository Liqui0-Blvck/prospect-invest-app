import { useFormik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ReminderForm = () => {
  
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
      time: '',
    },
    onSubmit: values => {
      console.log(values)
    }
  })


  return (
    <View>
      
    </View>
  );
}

const styles = StyleSheet.create({})

export default ReminderForm;
