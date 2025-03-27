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
import { useCreateFoodMutation } from '../services/foodManagementApi'; // Modify with the actual API mutation
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const AddList = ({ visible, onCancel, onSave, initialValues, isView }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [createFood] = useCreateFoodMutation(); // This would be the API for creating new food
    const [uploading, setUploading] = useState(false); // State for upload loading

    useEffect(() => {
        if (initialValues) {
            const formattedValues = {
                ...initialValues,
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
                    formData.append(key, value);
                }
            });

            // Append photo URL to formData
            if (fileList.length > 0) {
                formData.append('imageUrl', fileList[0]?.url);
            }

            await createFood(formData).unwrap();
            message.success('Food item added successfully!');

            form.resetFields();
            setFileList([]);
            onSave();
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error(error.message || 'Failed to save food item');
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
        'Other'
    ];

    return (
        <Modal
            title={<Title level={4}>{isView ? 'View Food Item' : initialValues ? 'Edit Food Item' : 'Add New Food Item'}</Title>}
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
                        {initialValues ? 'Update' : 'Save'} Food Item
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
                    label={<Text strong>Food Name</Text>}
                    name="foodName"
                    rules={[{ required: true, message: 'Please input the food name!' }]}
                >
                    <Input readOnly={isView} placeholder="What food item are you adding?" size="large" />
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
                            label={<Text strong>Price</Text>}
                            name="price"
                            rules={[{ required: true, message: 'Please input the price!' }]}
                        >
                            <Input
                                readOnly={isView}
                                placeholder="Price of the food item"
                                size="large"
                                type="number"
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                </Row>

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

export default AddList;
