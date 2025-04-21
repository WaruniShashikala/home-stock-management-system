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
    Spin,
    InputNumber
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateWasteMutation, useUpdateWasteMutation } from '../services/wasteManagementApi';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useGetAllCategoriesQuery } from '../services/categoryManagementApi';
import { useGetAllProductsQuery } from '../services/productManagementApi';

const { Title, Text } = Typography;
const { Option } = Select;

const AddWastePopup = ({ visible, onCancel, onSave, initialValues, isView }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [createWaste] = useCreateWasteMutation();
    const [updateWaste] = useUpdateWasteMutation();
    const [uploading, setUploading] = useState(false);
    const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const { data: products = [], isLoading, isError, refetch } = useGetAllProductsQuery();

    // Define available units
    const unitOptions = [
        { value: 'count', label: 'Count (items)' },
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'liter', label: 'Liters (l)' },
        { value: 'packs', label: 'Packs' },
    ];

    useEffect(() => {
        if (initialValues) {
            // Parse quantity and unit if they're stored together in a string
            let quantity = initialValues.quantity;
            let unit = 'count'; // default unit
            
            if (typeof initialValues.quantity === 'string') {
                const parts = initialValues.quantity.split(' ');
                if (parts.length > 1) {
                    quantity = parseFloat(parts[0]);
                    unit = parts[1];
                }
            }

            const formattedValues = {
                ...initialValues,
                quantity: quantity,
                unit: unit,
                date: initialValues.date ? moment(initialValues.date) : null
            };
            
            form.setFieldsValue(formattedValues);

            if (initialValues.imageUrl) {
                setFileList([{
                    uid: '-1',
                    name: 'Uploaded Image',
                    url: initialValues.imageUrl
                }]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
            // Set default unit
            form.setFieldsValue({ unit: 'count' });
        }
    }, [initialValues, visible, form]);

    const handleUploadChange = async ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ml_default');

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dwqizp90f/image/upload',
                    formData
                );
                const imageUrl = response.data.secure_url;
                setFileList([{ ...newFileList[0], url: imageUrl }]);
                message.success('Image uploaded successfully!');
            } catch (error) {
                message.error('Image upload failed!');
                setFileList([]);
            } finally {
                setUploading(false);
            }
        } else {
            setFileList([]);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Combine quantity and unit for storage
            const quantityWithUnit = `${values.quantity} ${values.unit}`;

            const payload = {
                itemName: values.itemName,
                category: values.category,
                quantity: quantityWithUnit, // Store as combined string
                reason: values.reason,
                date: values.date ? values.date.toISOString() : null,
                ...(fileList.length > 0 && { imageUrl: fileList[0]?.url })
            };

            if (initialValues) {
                await updateWaste({
                    id: initialValues._id,
                    ...payload
                }).unwrap();
                toast.success('Waste record updated successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            } else {
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                });

                await createWaste(formData).unwrap();
                toast.success('Waste record created successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            }

            form.resetFields();
            setFileList([]);
            onSave();
        } catch (error) {
            toast.error('Something Went Wrong!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            console.error('Error submitting form:', error);
            message.error(error.message || 'Failed to save waste record');
        }
    };

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
            title={<Title level={4}>{isView ? 'View Waste Record' : initialValues ? 'Edit Waste Record' : 'Add Wasted Item'}</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                !isView && (
                    <Button
                        style={{ backgroundColor: '#825af2', borderColor: '#825af2' }}
                        key="submit"
                        type="primary"
                        onClick={handleSubmit}
                        disabled={uploading}
                    >
                        {initialValues ? 'Update' : 'Save'} Waste Record
                    </Button>
                ),
            ]}
            width={600}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<Text strong>Item Name</Text>}
                    name="itemName"
                    rules={[{ required: true, message: 'Please select an item!' }]}
                >
                    <Select 
                        placeholder="Select an item name" 
                        size="large"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {products.map(product => (
                            <Option
                                disabled={isView}
                                key={product._id}
                                value={product.name}
                            >
                                {product.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Unit</Text>}
                            name="unit"
                            rules={[{ required: true, message: 'Please select a unit!' }]}
                        >
                            <Select 
                                placeholder="Select unit" 
                                size="large"
                                disabled={isView}
                            >
                                {unitOptions.map(unit => (
                                    <Option key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Quantity</Text>}
                            name="quantity"
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Please input the quantity!' 
                                },
                                { 
                                    type: 'number',
                                    min: 0,
                                    message: 'Quantity must be a positive number!'
                                }
                            ]}
                        >
                            <InputNumber 
                                min={0} 
                                step={0.1}
                                style={{ width: '100%' }} 
                                size="large"
                                disabled={isView}
                                placeholder="Amount"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Category</Text>}
                            name="category"
                            rules={[{ required: true, message: 'Please select a category!' }]}
                        >
                            <Select 
                                placeholder="Select a category" 
                                size="large"
                                loading={categoriesLoading}
                            >
                                {categories.map(category => (
                                    <Option
                                        key={category._id}
                                        value={category.name}
                                        disabled={category.status !== 'Active' || isView}
                                    >
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Text strong>Reason for Waste</Text>}
                            name="reason"
                            rules={[{ required: true, message: 'Please select a reason!' }]}
                        >
                            <Select placeholder="Select a reason" size="large">
                                {reasonOptions.map(reason => (
                                    <Option 
                                        disabled={isView} 
                                        key={reason} 
                                        value={reason}
                                    >
                                        {reason}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={<Text strong>Date</Text>}
                    name="date"
                    rules={[{ required: true, message: 'Please select a valid date!' }]}
                >
                    <DatePicker
                        disabled={isView}
                        style={{ width: '100%' }}
                        size="large"
                        format="MM/DD/YYYY"
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
                            disabled={uploading || isView}
                            accept="image/*"
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