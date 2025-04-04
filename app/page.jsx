"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import Loading from "./Loading";
import currencies from "./currencylist";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { set } from "rc-util";

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
  const [currencyType, setCurrencyType] = useState("ZMW");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [currencyValue, setCurrencyValue] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [modifyCurrency, setModifyCurrency] = useState(0);
  const [trailerArr, setTrailerArr] = useState([]);
  const [customerArr, setCustomerArr] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [convertedCurrrencyValue, setConvertedCurrencyValue] = useState(0);
  const [vendorBill, setVendorBill] = useState(null);
  const [ratePerMt, setRatePerMt] = useState(null);
  const [ratePerMtConverted, setRatePerMtConverted] = useState(null);
  const [dispatchers] = useState([
    {
      label: "DLZ",
      value: "DLZ",
    },
    {
      label: "Vendor",
      value: "Vendor",
    },
  ]);

  const params = useSearchParams();
  const bookingId = params?.get("bookingId");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (bookingId) {
      const initiate = async () => {
        const query = new URLSearchParams({
          reportName: "All_Booking",
          criteria: `(ID == ${bookingId})`,
        });
        try {
          const response = await fetch(`/api/zoho?${query}`);
          const result = await response.json();
          if (result.records.code === 3000) {
            setEditMode(true);
            const data = result.records.data[0];
            form.setFieldsValue({
              Shipment: data.Shipment?.zc_display_value,
              Commodity: data.Commodity,
              Origin: data.Origin,
              Service_Location: data.Service_Location,
              Destination: data.Destination,
              Vendor_Bill_Amount: data.Vendor_Bill_Amount,
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
              LoadingSiteArrival: data?.LoadingSiteArrival
                ? dayjs(data.LoadingSiteArrival, "DD-MMM-YYYY")
                : null,
              Dispatcher: data.Dispatcher,
              Vendor_Credit: data.Vendor_Credit,
              Driver: data.Driver?.zc_display_value,
              Passport: data.Passport?.zc_display_value,
              Customer_Name: data.Customer_Name?.zc_display_value,
              Rate_Per_MT_Amount: data.Rate_Per_MT_Amount,
              Select_Book: data.Select_Book,
              Transporter: data.Transporter,
              Current_Position: data.Current_Position,
            });
          }
        } catch (error) {
          console.log("Error fetching record");
        }
      };
      initiate();
    }
  }, [bookingId]);

  const success = () => {
    messageApi.open({
      type: "loading",
      content: editMode ? "Updating Record..." : "Adding Record...",
      duration: 0,
    });
  };

  const submitted = (msg) => messageApi.info(msg);

  const fetchCurrency = async () => {
    try {
      const response = await fetch(`api/currency?baseCurrency=${baseCurrency}`);
      const result = await response.json();
      setCurrencyValue(() => result.conversion_rates[currencyType]);
      setModifyCurrency(() => result.conversion_rates[currencyType]);
    } catch (error) {
      console.log("Error Fething Currency: ", error);
    }
  };

  useEffect(() => {
    const fetchRecords = async (reportName, criteria = null) => {
      try {
        const query = new URLSearchParams({
          reportName,
          ...(criteria && { criteria }),
        });
        const response = await fetch(`/api/zoho?${query}`);
        const result = await response.json();
        if (result && result.records?.data) {
          return result.records.data;
        } else {
          console.error(
            "Error fetching records:",
            result.error || "Unknown error"
          );
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
        await fetchCurrency();
        const shipmentResponse = await fetchRecords(
          "All_Shipments",
          `(Approval_Status == "Approved")`
        );
        setShipmentObj(shipmentResponse);
        const all_shipments = shipmentResponse.map((record) => ({
          label: record.Shipment,
          value: record.Shipment,
        }));
        setShipments(all_shipments);

        // Fetch Horses
        const horseResponse = await fetchRecords(
          "All_Horse",
          `(Approval_Status == "Approved")`
        );
        setHorseArr(horseResponse);
        const all_horses = horseResponse.map((record) => ({
          label: record.Horse,
          value: record.Horse,
        }));
        setHorses(all_horses);

        // Vendor Response
        const vendorResponse = await fetchRecords(
          "All_Vendors",
          `(Approval_Status == "Approved")`
        );
        setVendorArr(vendorResponse);
        const all_vendors = vendorResponse.map((record) => ({
          label: record.Vendor,
          value: record.Vendor,
        }));
        setVendors(all_vendors);

        // fetch vendor status
        const vendorStatusResponse = await fetchRecords(
          "All_Vendor_Statuses",
          `(ID != 0)`
        );
        setVendorStatusArr(vendorStatusResponse);
        const all_vendor_status = vendorStatusResponse.map((record) => ({
          label: record.Vendor_Status,
          value: record.Vendor_Status,
        }));
        setVendorStatus(all_vendor_status);

        // fetch trailer
        const trailerResponse = await fetchRecords(
          "All_Trailers",
          `(Approval_Status == "Approved")`
        );
        setTrailerArr(trailerResponse);
        const all_trailers = trailerResponse.map((record) => ({
          label: record.Trailer,
          value: record.Trailer,
        }));
        setTrailers(all_trailers);

        // fetch Drivers
        const driverResposne = await fetchRecords(
          "Approved_Drivers",
          `(Approval_Status == "Approved")`
        );
        setDriverObj(driverResposne);
        const all_drivers = driverResposne.map((record) => ({
          label: `${record.Name_Driver.first_name} ${record.Name_Driver.last_name}`,
          value: `${record.Name_Driver.first_name} ${record.Name_Driver.last_name}`,
        }));
        setDrivers(all_drivers);
        const all_passports = driverResposne.map((record) => ({
          label: record.Passport,
          value: record.Passport,
        }));
        setPassports(all_passports);

        // fetch customers
        const customerResponse = await fetchRecords(
          "All_Customers",
          "(ID != 0)"
        );
        setCustomerArr(customerResponse);
        const all_customers = customerResponse.map((record) => ({
          label: record.Customer_Name,
          value: record.Customer_Name,
        }));
        setCustomers(all_customers);
        const currenyObj = currencies.map((curr) => {
          return {
            label: curr.code,
            value: curr.code,
          };
        });
        setCurrencyRates(currenyObj);

        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    init();
  }, []);

  const handleBaseCurrencyChange = async (value) => {
    setBaseCurrency(value);
    try {
      const config = {
        method: "GET",
        accept: "application/json",
      };
      const response = await fetch(
        `api/currency?baseCurrency=${value}`,
        config
      );
      const result = await response.json();
      setCurrencyValue(result.conversion_rates[currencyType]);
      setModifyCurrency(result.conversion_rates[currencyType]);
      setConvertedCurrencyValue(
        vendorBill
          ? parseFloat(result.conversion_rates[currencyType]) *
              parseFloat(vendorBill)
          : 0
      );
      setRatePerMtConverted(() =>
        ratePerMt
          ? parseFloat(result.conversion_rates[currencyType]) *
            parseFloat(ratePerMt)
          : 0
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleCurrencyModify = () => {
    setCurrencyValue(modifyCurrency);
    setOpenPopup(false);
    setConvertedCurrencyValue(() =>
      vendorBill ? parseFloat(modifyCurrency) * parseFloat(vendorBill) : 0
    );
    setRatePerMtConverted(() =>
      ratePerMt ? parseFloat(modifyCurrency) * parseFloat(ratePerMt) : 0
    );
  };

  const currencyDropdown = (
    <Select
      style={{ width: 80 }}
      value={baseCurrency}
      onChange={handleBaseCurrencyChange}
      defaultValue="USD"
      options={currencyRates}
      showSearch
    />
  );
  const handleCurrencyChange = async (value) => {
    setCurrencyType(value);
    try {
      const config = {
        method: "GET",
        accept: "application/json",
      };
      const response = await fetch(
        `api/currency?baseCurrency=${baseCurrency}`,
        config
      );
      const result = await response.json();
      setCurrencyValue(result.conversion_rates[value]);
      setModifyCurrency(result.conversion_rates[value]);
      setConvertedCurrencyValue(() =>
        vendorBill
          ? parseFloat(result.conversion_rates[value]) * parseFloat(vendorBill)
          : 0
      );
      setRatePerMtConverted(() =>
        ratePerMt
          ? parseFloat(result.conversion_rates[value] * parseFloat(ratePerMt))
          : 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleVendorBillChange = (value) => {
    setConvertedCurrencyValue(() => {
      return value ? parseFloat(value) * parseFloat(modifyCurrency) : 0;
    });
    setVendorBill(value);
  };

  const currencySelectable = (
    <Select
      style={{ width: 80 }}
      value={currencyType}
      onChange={handleCurrencyChange}
      options={currencyRates}
      showSearch
    />
  );

  const onChangeShipment = (value) => {
    const shipObj = shipmentObj.filter((record) => record.Shipment === value);
    form.setFieldsValue({
      Shipment: value,
      Commodity: value && shipObj.length > 0 ? shipObj[0].Commodity : "",
      Origin:
        value && shipObj.length > 0 ? shipObj[0].Origin.zc_display_value : "",
      Service_Location:
        value && shipObj.length > 0
          ? shipObj[0].Service_Locations.zc_display_value
          : "",
      Destination:
        value && shipObj.length > 0
          ? shipObj[0].Destinations.zc_display_value
          : "",
      Vendor_Bill_Amount:
        value && shipObj.length > 0 ? shipObj[0].Vendor_Bill : "",
      Customer_Name:
        value && shipObj.length > 0 ? shipObj[0].Customer.zc_display_value : "",
      Select_Book:
        value && shipObj.length > 0
          ? shipObj[0].Select_Book.zc_display_value
          : "",
      Rate_Per_MT_Amount:
        value && shipObj.length > 0 ? shipObj[0].Rate_Per_MT : "",
    });
    setVendorBill(value && shipObj.length > 0 ? shipObj[0].Vendor_Bill : 0);
    setRatePerMt(value && shipObj.length > 0 ? shipObj[0].Rate_Per_MT : 0);
    setConvertedCurrencyValue(() =>
      value && shipObj.length > 0
        ? parseFloat(shipObj[0].Vendor_Bill || 0) * parseFloat(currencyValue)
        : 0
    );
    setRatePerMtConverted(() =>
      value && shipObj.length > 0
        ? parseFloat(shipObj[0].Rate_Per_MT || 0) * parseFloat(currencyValue)
        : 0
    );
  };

  const handleDriverChange = (value) => {
    const passportObj = driverObj.filter((record) => {
      const driver_name =
        record.Name_Driver.first_name + " " + record.Name_Driver.last_name;
      return driver_name === value;
    });
    form.setFieldsValue({
      Driver: value,
      Passport: value && passportObj.length > 0 ? passportObj[0].Passport : "",
    });
  };

  const handleHorseChange = (value) => {
    const horseObj = horseArr.filter((record) => record.Horse === value);
    form.setFieldsValue({
      Horse: value,
      Vendor: value
        ? horseObj[0].Vendor && horseObj[0].Vendor.zc_display_value
        : "",
      Vendor_Status: value
        ? horseObj[0].Vendor_Status &&
          horseObj[0].Vendor_Status.zc_display_value
        : "",
      st_Trailer: value
        ? horseObj[0].defualt_1st_Trailer &&
          horseObj[0].defualt_1st_Trailer.zc_display_value
        : "",
      nd_Trailer: value
        ? horseObj[0].Defualt_2nd_Trailer &&
          horseObj[0].Defualt_2nd_Trailer.zc_display_value
        : "",
      GPS: value ? horseObj[0].GPS_Status && horseObj[0].GPS_Status : "",
      Horse_Contact_Person: value
        ? horseObj[0].Horse_Contact_PersonH &&
          horseObj[0].Horse_Contact_PersonH.zc_display_value
        : "",
      Horse_Contact_Number: value
        ? horseObj[0].Horse_Contact_NumberH && horseObj[0].Horse_Contact_NumberH
        : "",
    });
  };

  const handleDispathcer = (value) => {
    form.setFieldsValue({
      Dispatcher: value,
      Vendor_Credit: value === "DLZ" ? 5 : 0,
    });
  };

  const handleRatePerMT = (value) => {
    setRatePerMt(value);
    setRatePerMtConverted(() =>
      value ? parseFloat(value) * parseFloat(modifyCurrency) : 0
    );
  };

  const onSubmit = async (value) => {
    messageApi.error("Error Submitting Record!");
  };

  const onFinish = async (obj) => {
    success();
    const shipmentID =
      shipmentObj.find((i) => i.Shipment === obj.Shipment)?.ID || "";
    const horseID = horseArr.find((i) => i.Horse === obj.Horse)?.ID || "";
    const vendorID = vendorArr.find((i) => i.Vendor === obj.Vendor)?.ID || "";
    const vendorStatusId =
      vendorStatusArr.find((i) => i.Vendor_Status === obj.Vendor_Status)?.ID ||
      "";
    const trailer1ID =
      trailerArr.find((i) => i.Trailer === obj.st_Trailer)?.ID || "";
    const trailer2ID =
      trailerArr.find((i) => i.Trailer === obj.nd_Trailer)?.ID || "";
    const driverID =
      driverObj.find(
        (i) => i.Name_Driver.zc_display_value.trim() == obj.Driver.trim()
      )?.ID || "";
    const customerID =
      customerArr.find((i) => i.Customer_Name === obj.Customer_Name)?.ID || "";
    const contactPersonName = obj.Horse_Contact_Person;
    const etaDate = obj.ETA?.format("DD-MMM-YYYY") || "";
    const loadingArrivalDate =
      obj.LoadingSiteArrival?.format("DD-MMM-YYYY") || "";
    const dataObj = {
      ...obj,
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
      Status: "Not Moved to Tracking",
      Vendor_Credit: `${obj.Vendor_Credit}%`,
      Vendor_Bill_Amount: vendorBill,
      Rate_Per_MT_Amount: ratePerMt,
      Vendor_Bill:
        currencies.find((c) => c.code === baseCurrency).symbol +
        " " +
        vendorBill,
      Rate_Per_MT:
        currencies.find((c) => c.code === baseCurrency).symbol +
        " " +
        ratePerMt,
      Horse_Contact_Person: {
        first_name: contactPersonName,
        last_name: "",
      },
      ETA: etaDate,
      LoadingSiteArrival: loadingArrivalDate,
      Vendor_Bill_Converted:
        currencies.find((c) => c.code === currencyType).symbol +
        " " +
        convertedCurrrencyValue,
      Rate_Per_MT_Converted:
        currencies.find((c) => c.code === currencyType).symbol +
        " " +
        ratePerMtConverted,
    };
    console.log(dataObj);
    if (editMode) {
      try {
        const response = await fetch(`/api/updateRecord?id=${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataObj),
        });
        if (!response.ok) {
          throw new Error("Failed to update record");
        }

        const result = await response.json();
        console.log("Record updated:", result);
        setSubmitLoading(false);
        messageApi.destroy();
        submitted("Data added successfully");
        form.resetFields();
        setConvertedCurrencyValue(0);
        setRatePerMtConverted(0);
      } catch (error) {
        console.log(error);
        submitted("Failed to add data!");
      }
    } else {
      try {
        const response = await fetch("api/addBooking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataObj),
        });
        console.log(response);
        setSubmitLoading(false);
        messageApi.destroy();
        submitted("Data added successfully");
        form.resetFields();
        setConvertedCurrencyValue(0);
        setRatePerMtConverted(0);
      } catch (error) {
        console.log(error);
        submitted("Failed to add data!");
      }
    }
  };

  const onError = (values) => {
    console.log("Failure : ", values);
    submitted("Failed to add data!");
  };

  const onReset = () => {
    form.resetFields();
  };
  return (
    <>
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <div className="inter p-2">
          <Form
            layout="vertical"
            onFinish={onSubmit}
            onFinishFailed={onError}
            initialValues={{ remember: true }}
            autoComplete="off"
            form={form}
          >
            <div className="border-b bortder-t p-2 font-bold text-lg bg-slate-50">
              Load Details
            </div>
            <div className="mt-3">
              <Flex gap={60}>
                <Form.Item
                  label="Shipment #"
                  className="w-[250px]"
                  name="Shipment"
                  rules={[
                    { required: true, message: "Please select the Shipment" },
                  ]}
                >
                  <Select
                    showSearch
                    options={shipments}
                    placeholder="Shipment #"
                    allowClear
                    onChange={onChangeShipment}
                  />
                </Form.Item>
                <Form.Item
                  label="Commodity"
                  className="w-[250px]"
                  name="Commodity"
                  rules={[{ required: true, message: "Please fill the value" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Origin"
                  name="Origin"
                  className="w-[250px]"
                  rules={[{ required: true, message: "Please fill the value" }]}
                >
                  <Input />
                </Form.Item>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="Service Location"
                  name="Service_Location"
                  className="w-[250px]"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Destination"
                  className="w-[250px]"
                  name="Destination"
                >
                  <Input />
                </Form.Item>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="Vendor Bill"
                  className="w-[250px]"
                  name="Vendor_Bill_Amount"
                >
                  <InputNumber
                    addonBefore={currencyDropdown}
                    onChange={handleVendorBillChange}
                    className="w-[250px]"
                  />
                </Form.Item>
                <div>
                  <Form.Item label="Vendor Bill Converted" className="mb-1">
                    <InputNumber
                      addonBefore={currencySelectable}
                      className="w-[250px]"
                      value={convertedCurrrencyValue}
                    />
                  </Form.Item>
                  {baseCurrency != currencyType && (
                    <div className="p-1 text-xs flex items-center text-blue-500 justify-center gap-[10px]">
                      <a className="">{`1 ${baseCurrency} = ${currencyValue} ${currencyType}`}</a>
                      <a onClick={() => setOpenPopup(true)}>Edit</a>
                      <Modal
                        open={openPopup}
                        title="Modify Currency"
                        onClose={() => setOpenPopup(false)}
                        onOk={handleCurrencyModify}
                        onCancel={() => setOpenPopup(false)}
                      >
                        <div>
                          <InputNumber
                            value={modifyCurrency}
                            onChange={(value) => setModifyCurrency(value)}
                          />
                        </div>
                      </Modal>
                    </div>
                  )}
                </div>
              </Flex>
            </div>
            <div className="border-b border-t p-2 font-bold text-lg bg-slate-50">
              Truck Details
            </div>
            <div className="mt-3">
              <Flex gap={60}>
                <Form.Item
                  label="Horse"
                  className="w-[250px]"
                  name="Horse"
                  rules={[{ required: true, message: "Please select a Horse" }]}
                >
                  <Select
                    options={horses}
                    showSearch
                    allowClear
                    onChange={handleHorseChange}
                  />
                </Form.Item>
                <Form.Item label="Vendor" name="Vendor" className="w-[250px]">
                  <Select options={vendors} showSearch allowClear />
                </Form.Item>
                <Form.Item
                  label="Vendor Status"
                  className="w-[250px]"
                  name="Vendor_Status"
                >
                  <Select options={vendorStatus} showSearch allowClear />
                </Form.Item>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="1st Trailer #"
                  className="w-[250px]"
                  name="st_Trailer"
                >
                  <Select options={trailers} showSearch allowClear />
                </Form.Item>
                <Form.Item
                  label="2nd Trailer #"
                  className="w-[250px]"
                  name="nd_Trailer"
                >
                  <Select options={trailers} showSearch allowClear />
                </Form.Item>
                <Form.Item
                  label="Tonnage"
                  className="w-[250px]"
                  name="Tonnage"
                  rules={[{ required: true, message: "Please fill the value" }]}
                >
                  <Input type="number" className="w-[250px]" />
                </Form.Item>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="Contact Person"
                  className="w-[250px]"
                  name="Horse_Contact_Person"
                  rules={[{ required: true, message: "Please fill the value" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Contact Number" name="Horse_Contact_Number">
                  <PhoneInput
                    country={"zm"}
                    className="w-[250px]"
                    inputStyle={{ width: 250 }}
                    rules={[
                      { required: true, message: "Please fill the value" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="GPS"
                  className="w-[250px]"
                  rules={[{ required: true, message: "Please fill the value" }]}
                  name="GPS"
                >
                  <Input />
                </Form.Item>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="Current Position"
                  className="w-[250px]"
                  name="Current_Position"
                  rules={[{ required: true, message: "Please fill the value" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="ETA" className="w-[250px]" name="ETA">
                  <DatePicker
                    className="w-[250px]"
                    format="DD-MMM-YYYY"
                    rules={[
                      { required: true, message: "Please fill the value" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Loading Site Arrival"
                  className="w-[250px]"
                  name="LoadingSiteArrival"
                >
                  <DatePicker className="w-[250px]" format="DD-MMM-YYYY" />
                </Form.Item>
              </Flex>
              <div className="border-b border-t p-2 mb-3 font-bold text-lg bg-slate-50">
                Dispatcher Details
              </div>
              <Flex gap={60}>
                <Form.Item
                  label="Dispatcher"
                  className="w-[250px]"
                  name="Dispatcher"
                  rules={[
                    { required: true, message: "Please select the Dispatcher" },
                  ]}
                >
                  <Select
                    options={dispatchers}
                    allowClear
                    onChange={handleDispathcer}
                  />
                </Form.Item>
                <Form.Item
                  label="Vendor Credit"
                  className="w-[250px]"
                  name="Vendor_Credit"
                >
                  <InputNumber
                    className="w-[250px]"
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                  />
                </Form.Item>
              </Flex>
              <div className="border-b border-t p-2 mb-3 font-bold text-lg bg-slate-50">
                Driver Details
              </div>
              <Flex gap={60}>
                <Form.Item
                  label="Driver"
                  className="w-[250px]"
                  name="Driver"
                  rules={[
                    { required: true, message: "Please select the Driver" },
                  ]}
                >
                  <Select
                    options={drivers}
                    allowClear
                    showSearch
                    onChange={handleDriverChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Passport"
                  className="w-[250px]"
                  name="Passport"
                  rules={[
                    { required: true, message: "Please select the Passport" },
                  ]}
                >
                  <Select options={passports} allowClear showSearch />
                </Form.Item>
                <Form.Item
                  label="Select Book"
                  className="w-[250px]"
                  name="Select_Book"
                >
                  <Input />
                </Form.Item>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="Customer Name"
                  className="w-[250px]"
                  name="Customer_Name"
                >
                  <Select options={customers} allowClear showSearch />
                </Form.Item>
                <Form.Item
                  label="Rate Per MT"
                  className="w-[250px] mb-0"
                  name="Rate_Per_MT_Amount"
                >
                  <InputNumber
                    addonBefore={currencyDropdown}
                    className="w-[250px]"
                    onChange={handleRatePerMT}
                  />
                </Form.Item>
                <div>
                  <Form.Item
                    label="Rate Per Mt Converted"
                    className="w-[250px] mb-1"
                  >
                    <InputNumber
                      addonBefore={currencySelectable}
                      value={ratePerMtConverted}
                      className="w-[250px]"
                    />
                  </Form.Item>
                  {baseCurrency != currencyType && (
                    <div className="p-1 text-xs flex items-center text-blue-500 justify-center gap-[10px]">
                      <a className="">{`1 ${baseCurrency} = ${currencyValue} ${currencyType}`}</a>
                      <a onClick={() => setOpenPopup(true)}>Edit</a>
                      <Modal
                        open={openPopup}
                        title="Modify Currency"
                        onClose={() => setOpenPopup(false)}
                        onOk={handleCurrencyModify}
                        onCancel={() => setOpenPopup(false)}
                      >
                        <div>
                          <InputNumber
                            value={modifyCurrency}
                            onChange={(value) => setModifyCurrency(value)}
                            className="w-[200px]"
                          />
                        </div>
                      </Modal>
                    </div>
                  )}
                </div>
              </Flex>
              <Flex gap={60}>
                <Form.Item
                  label="Transporter"
                  className="w-[250px]"
                  name="Transporter"
                >
                  <Select
                    options={[
                      {
                        label: "DHAQANE",
                        value: "DHAQANE",
                      },
                    ]}
                  />
                </Form.Item>
              </Flex>
            </div>
            <div className="flex gap-3 justify-center">
              {contextHolder}
              <Button type="primary" disabled={submitLoading} htmlType="submit">
                {editMode ? "Update" : "Submit"}
              </Button>
              <Button onClick={onReset} variant="outlined" htmlType="button">
                Reset
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <MyComponent />
    </Suspense>
  );
}
