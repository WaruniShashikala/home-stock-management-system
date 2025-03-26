import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Button,
    Typography,
    message,
    Row,
    Col,
    Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateWasteMutation, useUpdateWasteMutation } from '../services/wasteManagementApi';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const AddWastePopup = ({ visible, onCancel, onSave, initialValues }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [date, setDate] = useState(null);
    const [createWaste] = useCreateWasteMutation();
    const [updateWaste] = useUpdateWasteMutation();
    const [uploading, setUploading] = useState(false); // State for upload loading

    useEffect(() => {
        if (initialValues) {
            const formattedValues = {
                ...initialValues,
                date: initialValues.date ? moment(initialValues.date) : null
            };
            form.setFieldsValue(formattedValues);
            setDate(formattedValues.date); 
        } else {
            form.resetFields();
            setFileList([]);
            setDate(null);
        }
    }, [initialValues, visible, form]);

    const handleUploadChange = async ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            setUploading(true); // Start loading

            // Cloudinary Direct Upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ml_default'); 

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dox9et7mt/image/upload', 
                    formData
                );
                const imageUrl = response.data.secure_url; 

                setFileList([{ ...newFileList[0], url: imageUrl }]);
                message.success('Image uploaded successfully!');
            } catch (error) {
                message.error('Image upload failed!');
                setFileList([]);
            } finally {
                setUploading(false); // Stop loading regardless of success/failure
            }
        } else {
            setFileList([]);
        }
    };

    const handleDateChange = (value) => {
        const momentDate = value ? moment(value) : null; 
        setDate(momentDate);
        form.setFieldsValue({ date: momentDate });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            
            // Append all form values to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            // Append photo URL to formData
            if (fileList.length > 0) {
                formData.append('imageUrl', fileList[0]?.url);
            }

            if (initialValues) {
                await updateWaste({ id: initialValues._id, formData }).unwrap();
                message.success('Waste record updated successfully!');
            } else {
                await createWaste(formData).unwrap();
                message.success('Waste record created successfully!');
            }

            form.resetFields();
            setFileList([]);
            setDate(null);
            onSave();
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error(error.message || 'Failed to save waste record');
        }
    };

    const categoryOptions = [
        'Fruits',
        'Vegetables',
        'Dairy',
        'Bakery',
        'Meat',
        'Seafood',
        'Grains',
        'Snacks',
        'Beverages',
        'Leftovers',
        'Other'
    ];

    const reasonOptions = [
        'Expired',
        'Spoiled',
        'Moldy',
        'Freezer Burn',
        'Overcooked',
        'Didnt Like',
        'Too Much Prepared',
        'Forgot About It',
        'Other'
    ];

    return (
        <Modal
            title={<Title level={4}>{initialValues ? 'Edit Waste Record' : 'Log Wasted Item'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    style={{ backgroundColor: '#825af2', borderColor: '#825af2' }}
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={uploading} // Disable save button while uploading
                >
                    {initialValues ? 'Update' : 'Save'} Waste Record
                </Button>,
            ]}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label={<Text strong>Item Name</Text>}
                    name="itemName"
                    rules={[{ required: true, message: 'Please input the food item!' }]}
                >
                    <Input placeholder="What food item was wasted?" size="large" />
                </Form.Item>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Category</Text>}
                            name="category"
                            rules={[{ required: true, message: 'Please select a category!' }]}
                        >
                            <Select placeholder="Select a category" size="large">
                                {categoryOptions.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Quantity</Text>}
                            name="quantity"
                            rules={[{ required: true, message: 'Please input the quantity!' }]}
                        >
                            <Input placeholder="e.g., 2 cups, 1 loaf, 3 items" size="large" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label={<Text strong>Reason for Waste</Text>}
                    name="reason"
                    rules={[{ required: true, message: 'Please select a reason!' }]}
                >
                    <Select placeholder="Select a reason" size="large">
                        {reasonOptions.map(reason => (
                            <Option key={reason} value={reason}>{reason}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label={<Text strong>Date</Text>}
                    name="date"
                    rules={[{ required: true, message: 'Please select a valid date!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        size="large"
                        format="MM/DD/YYYY"
                        onChange={handleDateChange}
                    />
                </Form.Item>

                <Form.Item label={<Text strong>Photo (Optional)</Text>}>
                    <Spin spinning={uploading} tip="Uploading image...">
                        <Upload
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            listType="picture-card"
                            disabled={uploading} // Disable upload while uploading
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Spin>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddWastePopup;