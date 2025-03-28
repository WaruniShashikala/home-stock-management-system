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
import { ToastContainer, toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const AddWastePopup = ({ visible, onCancel, onSave, initialValues, isView }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
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

            if (initialValues.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'Uploaded Image',
                        url: initialValues.imageUrl
                    }
                ]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
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
                setFileList();
            } finally {
                setUploading(false); // Stop loading regardless of success/failure
            }
        } else {
            setFileList([]);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            // Append all form values to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // Convert moment date to ISO string before sending
                    if (key === 'date' && moment.isMoment(value)) {
                        formData.append(key, value.toISOString());
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            // Append photo URL to formData
            if (fileList.length > 0) {
                formData.append('imageUrl', fileList[0]?.url);
            }

            if (initialValues) {
                await updateWaste({ id: initialValues._id, formData }).unwrap();
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
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label={<Text strong>Item Name</Text>}
                    name="itemName"
                    rules={[{ required: true, message: 'Please input the food item!' }]}
                >
                    <Input readOnly={isView} placeholder="What food item was wasted?" size="large" />
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
                                    <Option disabled={isView} key={category} value={category}>{category}</Option>
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
                            <Input readOnly={isView} placeholder="e.g., 2 cups, 1 loaf, 3 items" size="large" />
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
                            <Option disabled={isView} key={reason} value={reason}>{reason}</Option>
                        ))}
                    </Select>
                </Form.Item>

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
                            disabled={uploading || isView} // Disable upload while uploading
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