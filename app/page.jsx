'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Button, DatePicker, Flex, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import Loading from './Loading';
import currencies from './currencylist';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

const MyComponent = () => {
  const [shipmentObj, setShipmentObj] = useState([]);
  const [driverObj, setDriverObj] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [horses, setHorses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorArr, setVendorArr] = useState([]);
  const [vendorStatus, setVendorStatus] = useState([]);
  const [vendorStatusArr, setVendorStatusArr] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [passports, setPassports] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [horseArr, setHorseArr] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currencyRates, setCurrencyRates] = useState([]);
  const [currencyType, setCurrencyType] = useState("INR");
  const [baseCurrency] = useState("INR");
  const [currencyValue, setCurrencyValue] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [modifyCurrency, setModifyCUrrency] = useState(0);
  const [trailerArr, setTrailerArr] = useState([]);
  const [customerArr, setCustomerArr] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dispatchers] = useState([
    {
      label: "DLZ",
      value: "DLZ"
    },
    {
      label: "Vendor",
      value: "Vendor"
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
    Current_Position: ""
  });


  const params = useSearchParams();
  const bookingId = params?.get("bookingId");
  useEffect(() => {
    if (bookingId) {
      const initiate = async () => {
        const query = new URLSearchParams({ reportName: "All_Booking", criteria: `(ID == ${bookingId})` })
        try {
          const response = await fetch(`/api/zoho?${query}`);
          const result = await response.json();
          if (result.records.code === 3000) {
            setEditMode(true);
            const data = result.records.data[0];
            setBookingObj(prev => ({
              ...prev,
              Shipment: data.Shipment?.zc_display_value,
              Commodity: data.Commodity,
              Origin: data.Origin,
              Service_Location: data.Service_Location,
              Destination: data.Destination,
              Vendor_Bill: data.Vendor_Bill,
              Horse: data.Horse?.zc_display_value,
              Horse_Contact_Person: data.Horse_Contact_Person?.zc_display_value,
              GPS: data.GPS,
              Vendor: data.Vendor.zc_display_value,
              st_Trailer: data.st_Trailer.zc_display_value,
              Current_Position: data.Current_Position,
              Vendor_Status: data.Vendor_Status?.zc_display_value,
              nd_Trailer: data.nd_Trailer?.zc_display_value,
              ETA: data?.ETA ? dayjs(data.ETA, "DD-MMM-YYYY") : null,
              Horse_Contact_Number: data.Horse_Contact_Number,
              Tonnage: data.Tonnage,
              LoadingSiteArrival: data?.LoadingSiteArrival ? dayjs(data.LoadingSiteArrival, "DD-MMM-YYYY") : null,
              Dispatcher: data.Dispatcher,
              Vendor_Credit: data.Vendor_Credit,
              Driver: data.Driver?.zc_display_value,
              Passport: data.Passport?.zc_display_value,
              Customer_Name: data.Customer_Name?.zc_display_value,
              Rate_Per_MT: data.Rate_Per_MT,
              Select_Book: data.Select_Book,
              Transporter: data.Transporter,
              Current_Position: data.Current_Position
            }))
          }
        } catch (error) {
          console.log("Error fetching record");
        }

      }
      initiate();
    }

  }, [bookingId])



  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'loading',
      content: editMode ? "Updating Record..." : "Adding Record...",
      duration: 0
    })
  }

  const submitted = () => {
    messageApi.info(editMode ? "Data Updated Successfully!" : "Data Successfullly Added!");
  }
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
        setLoading(true);
        const shipmentResponse = await fetchRecords("All_Shipments", `(Approval_Status == "Approved")`);
        setShipmentObj(shipmentResponse);
        const all_shipments = shipmentResponse.map(record => ({
          label: record.Shipment,
          value: record.Shipment,
        }));
        setShipments(all_shipments);

        // Fetch Horses
        const horseResponse = await fetchRecords("All_Horse", `(Approval_Status == "Approved")`);
        setHorseArr(horseResponse);
        const all_horses = horseResponse.map(record => ({
          label: record.Horse,
          value: record.Horse,
        }));
        setHorses(all_horses);

        // Vendor Response
        const vendorResponse = await fetchRecords("All_Vendors", `(Approval_Status == "Approved")`);
        setVendorArr(vendorResponse);
        const all_vendors = vendorResponse.map(record => ({
          label: record.Vendor,
          value: record.Vendor
        }))
        setVendors(all_vendors);

        // fetch vendor status
        const vendorStatusResponse = await fetchRecords("All_Vendor_Statuses", `(ID != 0)`);
        setVendorStatusArr(vendorStatusResponse);
        const all_vendor_status = vendorStatusResponse.map(record => ({
          label: record.Vendor_Status,
          value: record.Vendor_Status
        }))
        setVendorStatus(all_vendor_status);

        // fetch trailer
        const trailerResponse = await fetchRecords("All_Trailers", `(Approval_Status == "Approved")`);
        setTrailerArr(trailerResponse);
        const all_trailers = trailerResponse.map(record => ({
          label: record.Trailer,
          value: record.Trailer
        }))
        setTrailers(all_trailers);

        // fetch Drivers
        const driverResposne = await fetchRecords("Approved_Drivers", `(Approval_Status == "Approved")`);
        setDriverObj(driverResposne);
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
        const customerResponse = await fetchRecords("All_Customers", "(ID != 0)");
        setCustomerArr(customerResponse);
        const all_customers = customerResponse.map(record => ({
          label: record.Customer_Name,
          value: record.Customer_Name
        }))
        setCustomers(all_customers);
        const currenyObj = currencies.map(curr => {
          return {
            label: curr.code,
            value: curr.code
          }
        });
        setCurrencyRates(currenyObj);

        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    init();
  }, []);

  const handleCurrencyChange = async (value) => {
    setCurrencyType(value);
    try {
      const config = {
        method: "GET",
        accept: "application/json"
      };
      const response = await fetch(`https://v6.exchangerate-api.com/v6/6ae9a8e1204b706244608358/latest/${value}`, config);
      const result = await response.json();
      setCurrencyValue(result.conversion_rates[baseCurrency]);
      setModifyCUrrency(result.conversion_rates[baseCurrency]);
    } catch (error) {
      console.log(error);
    }
  }
  const handleCurrencyModify = () => {
    setCurrencyValue(modifyCurrency);
    setOpenPopup(false);
  }
  const currencyDropdown = (
    <Select
      style={{ width: 80 }}
      value={currencyType}
      onChange={handleCurrencyChange}
      defaultValue="USD"
      options={currencyRates}
      showSearch />
  );

  const handleShipment = (value) => {
    const shipObj = shipmentObj.filter(record => record.Shipment === value);
    if (value && shipObj.length > 0) {
      setBookingObj(prev => ({
        ...prev,
        ["Shipment"]: value,
        ["Commodity"]: shipObj[0].Commodity,
        ["Origin"]: shipObj[0].Origin.zc_display_value,
        ["Service_Location"]: shipObj[0].Service_Locations.zc_display_value,
        ["Destination"]: shipObj[0].Destinations.zc_display_value,
        ["Vendor_Bill"]: shipObj[0].Vendor_Bill,
        ["Customer_Name"]: shipObj[0].Customer.zc_display_value,
        ["Select_Book"]: shipObj[0].Select_Book.zc_display_value,
        ["Rate_Per_MT"]: shipObj[0].Rate_Per_MT
      }))
    }
    else {
      setBookingObj(prev => ({
        ...prev,
        ["Shipment"]: value,
        ["Commodity"]: "",
        ["Origin"]: "",
        ["Service_Location"]: "",
        ["Destination"]: "",
        ["Vendor_Bill"]: "",
        ["Customer_Name"]: "",
        ["Select_Book"]: "",
        ["Rate_Per_MT"]: ""
      }))
    }

  }
  const handleDriverChange = (value) => {
    const passportObj = driverObj.filter(record => {
      const driver_name = record.Name_Driver.first_name + " " + record.Name_Driver.last_name;
      return driver_name === value
    })
    if (value && passportObj.length > 0) {
      setBookingObj(prev => ({
        ...prev,
        ["Driver"]: value,
        ["Passport"]: passportObj[0].Passport
      }))
    }
    else {
      setBookingObj(prev => ({
        ...prev,
        ["Driver"]: value,
        ["Passport"]: ""
      }))
    }
  }

  const handleHorseChange = (value) => {
    const horseObj = horseArr.filter(record => record.Horse === value);
    if (value) {
      setBookingObj(prev => ({
        ...prev,
        ["Horse"]: value,
        ["Vendor"]: horseObj[0].Vendor && horseObj[0].Vendor.zc_display_value,
        ["Vendor_Status"]: horseObj[0].Vendor_Status && horseObj[0].Vendor_Status.zc_display_value,
        ["st_Trailer"]: horseObj[0].defualt_1st_Trailer && horseObj[0].defualt_1st_Trailer.zc_display_value,
        ["nd_Trailer"]: horseObj[0].Defualt_2nd_Trailer && horseObj[0].Defualt_2nd_Trailer.zc_display_value,
        ["GPS"]: horseObj[0].GPS_Status && horseObj[0].GPS_Status,
        ["Horse_Contact_Person"]: horseObj[0].Horse_Contact_PersonH && horseObj[0].Horse_Contact_PersonH.zc_display_value,
        ["Horse_Contact_Number"]: horseObj[0].Horse_Contact_NumberH && horseObj[0].Horse_Contact_NumberH
      }))
    }
    else {
      setBookingObj(prev => ({
        ...prev,
        ["Horse"]: value,
        ["Vendor"]: ""
      }))
    }
  }

  const handleDispathcer = (value) => {
    setBookingObj(prev => ({
      ...prev,
      ["Dispatcher"]: value,
      ["Vendor_Credit"]: value === "DLZ" ? 5 : 0
    }))
  }

  const clearAll = () => {
    setBookingObj(prev => ({
      ...prev,
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
      Current_Position: ""
    }))
    setCurrencyType(baseCurrency);
  }
  // Handle Submission
  const onSubmit = async () => {
    try {
      success();
      setSubmitLoading(true);
      const shipmentID = shipmentObj.find(i => i.Shipment === bookingObj.Shipment)?.ID || "";
      const horseID = horseArr.find(i => i.Horse === bookingObj.Horse)?.ID || "";
      const vendorID = vendorArr.find(i => i.Vendor === bookingObj.Vendor)?.ID || "";
      const vendorStatusId = vendorStatusArr.find(i => i.Vendor_Status === bookingObj.Vendor_Status)?.ID || "";
      const trailer1ID = trailerArr.find(i => i.Trailer === bookingObj.st_Trailer)?.ID || "";
      const trailer2ID = trailerArr.find(i => i.Trailer === bookingObj.nd_Trailer)?.ID || "";
      const driverID = driverObj.find(i => i.Name_Driver.zc_display_value.trim() == bookingObj.Driver.trim())?.ID || "";
      const customerID = customerArr.find(i => i.Customer_Name === bookingObj.Customer_Name)?.ID || "";
      const contactPersonName = bookingObj.Horse_Contact_Person;
      const etaDate = bookingObj.ETA.format("DD-MMM-YYYY");
      const loadingArrivalDate = bookingObj.LoadingSiteArrival.format("DD-MMM-YYYY");
      const bookingData = {
        ...bookingObj,
        Shipment: shipmentID,
        Horse: horseID,
        Vendor: vendorID,
        Vendor_Status: vendorStatusId,
        st_Trailer: trailer1ID,
        nd_Trailer: trailer2ID,
        Driver: driverID,
        Passport: driverID,
        Customer_Name: customerID,
        Approval_Status: "Pending",
        Horse_Contact_Person: {
          first_name: contactPersonName,
          last_name: ""
        },
        ETA: etaDate,
        LoadingSiteArrival: loadingArrivalDate,
        Vendor_Bill_String: currencies.find(c => c.code === currencyType).symbol + " " + bookingObj.Vendor_Bill,
        Rate_Per_MT_String: currencies.find(c => c.code === currencyType).symbol + " " + bookingObj.Rate_Per_MT,
        skip_workflow: ["form_workflow"],
      };
      if (editMode) {
        try {
          const response = await fetch(`/api/updateRecord?id=${bookingId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
          })
          if (!response.ok) {
            throw new Error("Failed to update record");
          }

          const result = await response.json();
          console.log("Record updated:", result);
          setSubmitLoading(false);
          messageApi.destroy();
          submitted();
        } catch (error) {
          console.log(error);
        }
      }
      else {
        try {
          const response = await fetch("api/addBooking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
          })
          console.log(response);
          setSubmitLoading(false);
          messageApi.destroy();
          clearAll();
          submitted();
        } catch (error) {
          console.log(error);
        }
      }


    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };



  return (
    <>
      {
        isLoading ? (
          <>
            <Loading />
          </>
        )
          : (
            <div className='inter p-2'>
              <Form layout='vertical' onFinish={onSubmit}>
                <div className='border-b bortder-t p-2 font-bold text-lg bg-slate-50'>Load Details</div>
                <div className="mt-3">
                  <Flex gap={60}>
                    <Form.Item label='Shipment #' className='w-[300px]' required>
                      <Select
                        showSearch
                        options={shipments}
                        placeholder="Shipment #"
                        allowClear
                        value={bookingObj.Shipment}
                        onChange={(value) => handleShipment(value)}
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
                      <InputNumber
                        addonBefore={currencyDropdown}
                        value={bookingObj.Vendor_Bill}
                        onChange={(value) => handleInputChange("Vendor_Bill", value)}
                      />
                      {baseCurrency != currencyType &&
                        (
                          <div className='p-1 text-xs flex items-center text-blue-500 justify-center gap-[10px]'>
                            <a className=''>{`1 ${currencyType} = ${currencyValue} ${baseCurrency}`}</a>
                            <a onClick={() => setOpenPopup(true)}>Edit</a>
                            <Modal
                              open={openPopup}
                              title="Modify Currency"
                              onClose={() => setOpenPopup(false)}
                              onOk={handleCurrencyModify}
                              onCancel={() => setOpenPopup(false)}>
                              <div>
                                <InputNumber
                                  value={modifyCurrency}
                                  onChange={(value) => setModifyCUrrency(value)} />
                              </div>
                            </Modal>
                          </div>
                        )
                      }

                    </Form.Item>
                  </Flex>
                </div>
                <div className='border-b border-t p-2 font-bold text-lg bg-slate-50'>Truck Details</div>
                <div className="mt-3">
                  <Flex gap={60}>
                    <Form.Item
                      label='Horse'
                      className='w-[300px]'
                    >
                      <Select
                        options={horses}
                        showSearch
                        allowClear
                        value={bookingObj.Horse}
                        onChange={handleHorseChange}
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
                        onChange={(e) => handleInputChange("Tonnage", e.target.value)}
                      />
                    </Form.Item>
                  </Flex>
                  <Flex gap={60}>
                    <Form.Item label='Contact Person' className='w-[300px]'>
                      <Input
                        value={bookingObj.Horse_Contact_Person}
                        onChange={(e) => handleInputChange("Horse_Contact_Person", e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label='Contact Number'>
                      <PhoneInput
                        country={'zm'}
                        className='w-[300px]'
                        value={bookingObj.Horse_Contact_Number}
                        onChange={(value) => handleInputChange("Horse_Contact_Number", "+" + value)}
                      />
                    </Form.Item>
                    <Form.Item label='GPS' className='w-[300px]' required>
                      <Input
                        value={bookingObj.GPS}
                        onChange={(e) => handleInputChange("GPS", e.target.value)}
                      />
                    </Form.Item>
                  </Flex>
                  <Flex gap={60}>
                    <Form.Item label='Current Position' className='w-[300px]'>
                      <Input
                        value={bookingObj.Current_Position}
                        onChange={(e) => handleInputChange("Current_Position", e.target.value)} />
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
                        onChange={handleDispathcer}
                      />
                    </Form.Item>
                    <Form.Item label='Vendor Credit' className='w-[300px]'>
                      <InputNumber
                        className='w-[300px]'
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
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
                        onChange={handleDriverChange}
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
                        onChange={(e) => handleInputChange("Select_Book", e.target.value)}
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
                        addonBefore={currencyDropdown}
                        className='w-[300px]'
                        value={bookingObj.Rate_Per_MT}
                        onChange={(value) => handleInputChange("Rate_Per_MT", value)} />
                      {baseCurrency != currencyType &&
                        (<div className='p-1 text-xs flex items-center text-blue-500 justify-center gap-[10px]'>
                          <a className=''>{`1 ${currencyType} = ${currencyValue} ${baseCurrency}`}</a>
                          <a onClick={() => setOpenPopup(true)}>Edit</a>
                          <Modal
                            open={openPopup}
                            title="Modify Currency"
                            onClose={() => setOpenPopup(false)}
                            onOk={handleCurrencyModify}
                            onCancel={() => setOpenPopup(false)}>
                            <div>
                              <InputNumber
                                value={modifyCurrency}
                                onChange={(value) => setModifyCUrrency(value)}
                                className='w-[200px]' />
                            </div>
                          </Modal>
                        </div>)
                      }
                    </Form.Item>
                  </Flex>
                  <Flex gap={60}>
                    <Form.Item label='Transporter' className='w-[300px]'>
                      <Select
                        options={[
                          {
                            label: "DHAQANE",
                            value: "DHAQANE"
                          }
                        ]}
                        value={bookingObj.Transporter}
                        onChange={(value) => handleInputChange("Transporter", value)} />
                    </Form.Item>
                  </Flex>
                </div>
                <div className='flex gap-3 justify-center'>
                  {contextHolder}
                  <Button type='primary' disabled={submitLoading} htmlType='submit'>{editMode ? "Update" : "Submit"}</Button>
                  <Button onClick={clearAll} variant='outlined' htmlType='reset'>Reset</Button>
                </div>
              </Form>
            </div>
          )
      }
    </>


  );
};

export default function Page() {
  return <Suspense>
    <MyComponent />
  </Suspense>
};
