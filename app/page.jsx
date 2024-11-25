'use client'
import React, { useEffect } from 'react'
import { Button, DatePicker, Flex, Form, Input, InputNumber, Select } from 'antd'
import { useState } from 'react'
const App = () => {
  const [options, setOptions] = useState([
    {
      label: 'Choice 1',
      value: 'Choice 1'
    },
    {
      label: 'Choice 2',
      value: 'Choice 2'
    },])

  const phoneCode = (
    <Select defaultValue='+260' showSearch style={{ width: 80 }}>
      <Select.Option value='+91'>+91</Select.Option>
      <Select.Option value='+260'>+260</Select.Option>
      <Select.Option value='+1'>+1</Select.Option>
    </Select>
  )
  return (
    <div className='inter p-2'>
      <Form layout='vertical'>
        <div className='border-b bortder-t p-2 font-bold text-lg bg-slate-50'>Load Details</div>
        <div className="mt-3">
          <Flex gap={60}>
            <Form.Item label='Shipment #' className='w-[300px]'>
              <Select showSearch options={options} placeholder='Shipment #' allowClear />
            </Form.Item>
            <Form.Item label='Commodity' className='w-[300px]' rules={[{ required: true, message: 'Please Input!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='Origin' className='w-[300px]' required>
              <Input />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Service Location' className='w-[300px]'>
              <Input />
            </Form.Item>
            <Form.Item className='w-[300px]'></Form.Item>
            <Form.Item label='Destination' className='w-[300px]' required>
              <Input />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item className='w-[300px]'></Form.Item>
            <Form.Item className='w-[300px]'></Form.Item>
            <Form.Item label='Vendor Bill' className='w-[300px]'>
              <Input />
            </Form.Item>
          </Flex>
        </div>
        <div className='border-b border-t p-2 font-bold text-lg bg-slate-50'>Truck Details</div>
        <div className="mt-3">
          <Flex gap={60}>
            <Form.Item label='Horse' className='w-[300px]'>
              <Select options={options} showSearch allowClear />
            </Form.Item>
            <Form.Item label='Vendor' className='w-[300px]'>
              <Select options={options} showSearch allowClear />
            </Form.Item>
            <Form.Item label='Vendor Status' className='w-[300px]'>
              <Select options={options} showSearch allowClear />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='1st Trailer #' className='w-[300px]'>
              <Select options={options} showSearch allowClear />
            </Form.Item>
            <Form.Item label='2nd Trailer #' className='w-[300px]'>
              <Select options={options} showSearch allowClear />
            </Form.Item>
            <Form.Item label='Tonnage' className='w-[300px]'>
              <Input type='number' className='w-[300px]' />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Contact Person' className='w-[300px]'>
              <Input />
            </Form.Item>
            <Form.Item label='Contact Number'>
              <InputNumber addonBefore={phoneCode} className='w-[300px]' maxLength={10} />
            </Form.Item>
            <Form.Item label='GPS' className='w-[300px]' required>
              <Input />
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Current Position' className='w-[300px]'>
              <Input />
            </Form.Item>
            <Form.Item label='ETA' className='w-[300px]'>
              <DatePicker className='w-[300px]' />
            </Form.Item>
            <Form.Item label='Loading Site Arrival' className='w-[300px]'>
              <DatePicker className='w-[300px]' />
            </Form.Item>
          </Flex>
          <div className='border-b border-t p-2 mb-3 font-bold text-lg bg-slate-50'>Dispatcher Details</div>
          <Flex gap={60}>
            <Form.Item label='Dispatcher' className='w-[300px]'>
              <Select options={options} showSearch allowClear />
            </Form.Item>
            <Form.Item label='Vendor Credit' className='w-[300px]'>
              <InputNumber className='w-[300px]' />
            </Form.Item>
          </Flex>
          <div className='border-b border-t p-2 mb-3 font-bold text-lg bg-slate-50'>Driver Details</div>
          <Flex gap={60}>
            <Form.Item label='Driver' className='w-[300px]'>
              <Select options={options} allowClear showSearch/>
            </Form.Item>
            <Form.Item label='Passport' className='w-[300px]'>
              <Select options={options} allowClear showSearch/>
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Select Book' className='w-[300px]'>
              <Input/>
            </Form.Item>
            <Form.Item label='Customer Name' className='w-[300px]'>
              <Select options={options} allowClear showSearch/>
            </Form.Item>
            <Form.Item label='Rate Per MT' className='w-[300px]'>
              <InputNumber className='w-[300px]'/>
            </Form.Item>
          </Flex>
          <Flex gap={60}>
            <Form.Item label='Transporter' className='w-[300px]'>
              <Input/>
            </Form.Item>
            <Form.Item label='Maximum Fuel' className='w-[300px]'>
              <Select options={options} allowClear showSearch mode='multiple'/>
            </Form.Item>
            <Form.Item label='Maximum Dispatch' className='w-[300px]'>
            <Select options={options} allowClear showSearch mode='multiple'/>
            </Form.Item>
          </Flex>
        </div>
        <div className='flex gap-3 justify-center'>
          <Button type='primary' htmlType='submit'>Submit</Button>
          <Button variant='outlined' htmlType='reset'>Reset</Button>
          </div>
      </Form>
    </div>
  )
}

export default App