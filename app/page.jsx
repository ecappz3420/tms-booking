'use client'
import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Flex, Form, Input, InputNumber, Select } from 'antd';

const App = () => {

  const [shipments, setShipments] = useState([]);
  const [options, setOptions] = useState([
    {
      label: 'Choice 1',
      value: 'Choice 1'
    },
    {
      label: 'Choice 2',
      value: 'Choice 2'
    },
  ]);



  const [bookingObj, setBookingObj] = useState({
    Shipment: "",
    Commodity: "",
    Origin: "",
    Service_Location: "",
    Destination: "",
    Vendor_Bill: "",
    Horse: "",
    Horse_Contact_Person: "",
    GPS: "",
    Vendor: "",
    st_Trailer: "",
    Current_Position: "",
    Vendor_Status: "",
    nd_Trailer: "",
    ETA: "",
    Horse_Contact_Number: "",
    Tonnage: "",
    LoadingSiteArrival: "",
    Dispatcher: "",
    Vendor_Credit: "",
    Driver: "",
    Passport: "",
    Customer_Name: "",
    Rate_Per_MT: "",
    Select_Book: "",
    Transporter: "",
  });

  const handleInputChange = (field, value) => {
    setBookingObj((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchRecords = async (reportName, criteria = null) => {
      const query = new URLSearchParams({ reportName, ...(criteria && { criteria }) });
      const response = await fetch(`/api/zoho?${query}`);
      const result = await response.json();
      if (result) {
        const all_shipments = result.records.data.map(record => {
          return {
            label: record.Shipment,
            value: record.Shipment
          }

        })
        setShipments(all_shipments);
      } else {
        console.error(result.error);
      }
    };

    fetchRecords("All_Shipments", null);
  }, []);


  const phoneCode = (
    <Select defaultValue='+260' showSearch style={{ width: 80 }}>
      <Select.Option value='+91'>+91</Select.Option>
      <Select.Option value='+260'>+260</Select.Option>
      <Select.Option value='+1'>+1</Select.Option>
    </Select>
  );

  const onSubmit = () => {
    console.log(bookingObj);
  }

  return (
    <div className='inter p-2'>
      <Form layout='vertical' onFinish={onSubmit}>
        <div className='border-b bortder-t p-2 font-bold text-lg bg-slate-50'>Load Details</div>
        <div className="mt-3">
          <Flex gap={60}>
            <Form.Item label='Shipment #' className='w-[300px]'>
              <Select
                showSearch
                options={shipments}
                placeholder='Shipment #'
                allowClear
                value={bookingObj.Shipment}
                onChange={(value) => handleInputChange("Shipment", value)}
              />
            </Form.Item>
            <Form.Item label='Commodity' className='w-[300px]'>
              <Input
                value={bookingObj.Commodity}
                onChange={(e) => handleInputChange("Commodity", e.target.value)}
              />
            </Form.Item>
            <Form.Item label='Origin' className='w-[300px]'>
              <Input
                value={bookingObj.Origin}
                onChange={(e) => handleInputChange("Origin", e.target.value)}
              />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Service Location' className='w-[300px]'>
              <Input
                value={bookingObj.Service_Location}
                onChange={(e) => handleInputChange("Service_Location", e.target.value)}
              />
            </Form.Item>
            <Form.Item label='Destination' className='w-[300px]'>
              <Input
                value={bookingObj.Destination}
                onChange={(e) => handleInputChange("Destination", e.target.value)}
              />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Vendor Bill' className='w-[300px]'>
              <Input
                value={bookingObj.Vendor_Bill}
                onChange={(e) => handleInputChange("Vendor_Bill", e.target.value)}
              />
            </Form.Item>
          </Flex>
        </div>
        <div className='border-b border-t p-2 font-bold text-lg bg-slate-50'>Truck Details</div>
        <div className="mt-3">
          <Flex gap={60}>
            <Form.Item label='Horse' className='w-[300px]'>
              <Select
                options={options}
                showSearch
                allowClear
                value={bookingObj.Horse}
                onChange={(value) => handleInputChange("Horse", value)}
              />
            </Form.Item>
            <Form.Item label='Vendor' className='w-[300px]'>
              <Select
                options={options}
                showSearch
                allowClear
                value={bookingObj.Vendor}
                onChange={(value) => handleInputChange("Vendor", value)}
              />
            </Form.Item>
          </Flex>
        </div>
        <div className='flex gap-3 justify-center'>
          <Button type='primary' htmlType='submit'>Submit</Button>
          <Button variant='outlined' htmlType='reset'>Reset</Button>
        </div>
      </Form>
    </div>
  );
};

export default App;
