'use client'
import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Flex, Form, Input, InputNumber, Select } from 'antd';

const App = () => {

  const [shipments, setShipments] = useState([]);
  const [horses, setHorses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorStatus, setVendorStatus] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [passports, setPassports] = useState([]);
  const [customers,setCustomers] = useState([]);
  const [dispatchers, setDispatchers] = useState([
    {
      label: "DLZ",
      value: "DLZ"
    },
    {
      label: "Vendor",
      value: "Vendor"
    },
  ])
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
      try {
        const query = new URLSearchParams({ reportName, ...(criteria && { criteria }) });
        const response = await fetch(`/api/zoho?${query}`);
        const result = await response.json();
        if (result && result.records?.data) {
          return result.records.data;
        } else {
          console.error("Error fetching records:", result.error || "Unknown error");
          return [];
        }
      } catch (error) {
        console.error("Fetch error:", error);
        return [];
      }
    };

    const init = async () => {
      try {
        // Fetch Shipments
        const shipmentResponse = await fetchRecords("All_Shipments", `(Approval_Status == "Approved")`);
        const all_shipments = shipmentResponse.map(record => ({
          label: record.Shipment,
          value: record.Shipment,
        }));
        setShipments(all_shipments);

        // Fetch Horses
        const horseResponse = await fetchRecords("All_Horse", `(Approval_Status == "Approved")`);
        const all_horses = horseResponse.map(record => ({
          label: record.Horse,
          value: record.Horse,
        }));
        setHorses(all_horses);

        // Vendor Response
        const vendorResponse = await fetchRecords("All_Vendors", `(Approval_Status == "Approved")`);
        const all_vendors = vendorResponse.map(record => ({
          label: record.Vendor,
          value: record.Vendor
        }))
        setVendors(all_vendors);

        // fetch vendor status
        const vendorStatusResponse = await fetchRecords("All_Vendor_Statuses", `(ID != 0)`);
        const all_vendor_status = vendorStatusResponse.map(record => ({
          label: record.Vendor_Status,
          value: record.Vendor_Status
        }))
        setVendorStatus(all_vendor_status);

        // fetch trailer
        const trailerResponse = await fetchRecords("All_Trailers",`(Approval_Status == "Approved")`);
        const all_trailers = trailerResponse.map(record => ({
          label: record.Trailer,
          value: record.Trailer
        }))
        setTrailers(all_trailers);

        // fetch Drivers
        const driverResposne = await fetchRecords("Approved_Drivers",`(Approval_Status == "Approved")`);
        const all_drivers = driverResposne.map(record => ({
          label: `${record.Name_Driver.first_name} ${record.Name_Driver.last_name}`,
          value: `${record.Name_Driver.first_name} ${record.Name_Driver.last_name}`
        }))
        setDrivers(all_drivers);
        const all_passports = driverResposne.map(record => ({
          label: record.Passport,
          value: record.Passport
        }))
        setPassports(all_passports);

        // fetch customers
        const customerResponse = await fetchRecords("All_Customers","(ID != 0)");
        const all_customers = customerResponse.map(record => ({
          label: record.Customer_Name,
          value: record.Customer_Name
        }))
        setCustomers(all_customers);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    init();
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
                options={horses}
                showSearch
                allowClear
                value={bookingObj.Horse}
                onChange={(value) => handleInputChange("Horse", value)}
              />
            </Form.Item>
            <Form.Item label='Vendor' className='w-[300px]'>
              <Select
                options={vendors}
                showSearch
                allowClear
                value={bookingObj.Vendor}
                onChange={(value) => handleInputChange("Vendor", value)}
              />
            </Form.Item>
            <Form.Item label='Vendor Status' className='w-[300px]'>
              <Select
                options={vendorStatus}
                showSearch
                allowClear
                value={bookingObj.Vendor_Status}
                onChange={(value) => handleInputChange("Vendor_Status", value)}
              />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='1st Trailer #' className='w-[300px]'>
              <Select
                options={trailers}
                showSearch
                allowClear
                value={bookingObj.st_Trailer}
                onChange={(value) => handleInputChange("st_Trailer", value)}
              />
            </Form.Item>
            <Form.Item label='2nd Trailer #' className='w-[300px]'>
              <Select
                options={trailers}
                showSearch
                allowClear
                value={bookingObj.nd_Trailer}
                onChange={(value) => handleInputChange("nd_Trailer", value)}
              />
            </Form.Item>
            <Form.Item label='Tonnage' className='w-[300px]'>
              <Input
                type='number'
                className='w-[300px]'
                value={bookingObj.Tonnage}
                onChange={(value) => handleInputChange("Tonnage", value)}
              />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Contact Person' className='w-[300px]'>
              <Input
                value={bookingObj.Horse_Contact_Person}
                onChange={(value) => handleInputChange("Horse_Contact_Person", value)}
              />
            </Form.Item>
            <Form.Item label='Contact Number'>
              <InputNumber
                addonBefore={phoneCode}
                className='w-[300px]'
                maxLength={10}
                value={bookingObj.Horse_Contact_Number}
                onChange={(value) => handleInputChange("Horse_Contact_Number", value)}
              />
            </Form.Item>
            <Form.Item label='GPS' className='w-[300px]' required>
              <Input
                value={bookingObj.GPS}
                onChange={(value) => handleInputChange("GPS", value)} />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Current Position' className='w-[300px]'>
              <Input />
            </Form.Item>
            <Form.Item label='ETA' className='w-[300px]'>
              <DatePicker
                className='w-[300px]'
                format="DD-MMM-YYYY"
                value={bookingObj.ETA}
                onChange={(value) => handleInputChange("ETA", value)}
              />
            </Form.Item>
            <Form.Item label='Loading Site Arrival' className='w-[300px]'>
              <DatePicker
                className='w-[300px]'
                format="DD-MMM-YYYY"
                value={bookingObj.LoadingSiteArrival}
                onChange={(value) => handleInputChange("LoadingSiteArrival", value)}
              />
            </Form.Item>
          </Flex>
          <div className='border-b border-t p-2 mb-3 font-bold text-lg bg-slate-50'>Dispatcher Details</div>
          <Flex gap={60}>
            <Form.Item label='Dispatcher' className='w-[300px]'>
              <Select
                options={dispatchers}
                showSearch
                allowClear
                value={bookingObj.Dispatcher}
                onChange={(value) => handleInputChange("Dispatcher", value)}
              />
            </Form.Item>
            <Form.Item label='Vendor Credit' className='w-[300px]'>
              <InputNumber
                className='w-[300px]'
                value={bookingObj.Vendor_Credit}
                onChange={(value) => handleInputChange("Vendor_Credit", value)}
              />
            </Form.Item>
          </Flex>
          <div className='border-b border-t p-2 mb-3 font-bold text-lg bg-slate-50'>Driver Details</div>
          <Flex gap={60}>
            <Form.Item label='Driver' className='w-[300px]'>
              <Select
                options={drivers}
                allowClear
                showSearch
                value={bookingObj.Driver}
                onChange={(value) => handleInputChange("Driver", value)}
              />
            </Form.Item>
            <Form.Item label='Passport' className='w-[300px]'>
              <Select
                options={passports}
                allowClear
                showSearch
                value={bookingObj.Passport}
                onChange={(value) => handleInputChange("Passport", value)}
              />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Select Book' className='w-[300px]'>
              <Input
                value={bookingObj.Select_Book}
                onChange={(value) => handleInputChange("Select_Book", value)}
              />
            </Form.Item>
            <Form.Item label='Customer Name' className='w-[300px]'>
              <Select
                options={customers}
                allowClear
                showSearch
                value={bookingObj.Customer_Name}
                onChange={(value) => handleInputChange("Customer_Name", value)} />
            </Form.Item>
            <Form.Item label='Rate Per MT' className='w-[300px]'>
              <InputNumber
                className='w-[300px]'
                value={bookingObj.Rate_Per_MT}
                onChange={(value) => handleInputChange("Rate_Per_MT", value)} />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Transporter' className='w-[300px]'>
              <Input
                value={bookingObj.Transporter}
                onChange={(value) => handleInputChange("Transporter", value)} />
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
