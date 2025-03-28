import React from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Upload,
    Spin,
    message,
    Button
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;

const ProductFormModal = ({
    visible,
    onCancel,
    onOk,
    form,
    editingRecord,
    fileList,
    setFileList,
    uploading,
    setUploading,
    confirmLoading,
    onFinish,
    isView
}) => {
    const handleUploadChange = async ({ fileList: newFileList }) => {
        if (!isView && newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            setUploading(true);

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
                form.setFieldsValue({ image: imageUrl });
            } catch (error) {
                message.error('Image upload failed!');
                setFileList([]);
            } finally {
                setUploading(false);
            }
        } else {
            setFileList([]);
            form.setFieldsValue({ image: '' });
        }
    };

    return (
        <Modal
            title={isView ? 'View Product' : (editingRecord ? 'Edit Product' : 'Add New Product')}
            visible={visible}
            onOk={isView ? null : onOk}  // Disable OK button in view mode
            onCancel={onCancel}
            okText={editingRecord ? "Edit Product" : "Add New Product"}
            cancelText="Cancel"
            confirmLoading={confirmLoading}
            className="product-form-modal"
            bodyStyle={{ padding: '24px 24px 0' }}
            width={700}
            footer={isView ? null : [ // Hide footer buttons in view mode
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={confirmLoading} onClick={onOk}>
                    {editingRecord ? "Edit Product" : "Add New Product"}
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                className="product-form"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Item Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the product name!' }]}
                >
                    <Input placeholder="Enter product name" disabled={isView} />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select placeholder="Select category" disabled={isView}>
                        <Option value="Electronics">Electronics</Option>
                        <Option value="Clothing">Clothing</Option>
                        <Option value="Food">Food</Option>
                        <Option value="Beverages">Beverages</Option>
                        <Option value="Home & Garden">Home & Garden</Option>
                        <Option value="Health & Beauty">Health & Beauty</Option>
                        <Option value="Sports">Sports</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{
                        required: true,
                        message: 'Please input the quantity!',
                        type: 'number',
                        min: 0
                    }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} disabled={isView} />
                </Form.Item>

                <Form.Item
                    label="Price ($)"
                    name="price"
                    rules={[{
                        required: true,
                        message: 'Please input the price!',
                        type: 'number',
                        min: 0
                    }]}
                >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} disabled={isView} />
                </Form.Item>

                <Form.Item
                    label="Manufacture Date"
                    name="manufactureDate"
                    rules={[{ required: true, message: 'Please select manufacture date!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                        onChange={(date) => {
                            const expiryDate = form.getFieldValue('expiryDate');
                            if (expiryDate && date && expiryDate.isBefore(date)) {
                                form.setFieldsValue({ expiryDate: null }); // Reset expiry if it's invalid
                            }
                        }}
                        disabled={isView}
                    />
                </Form.Item>

                <Form.Item
                    label="Expiry Date"
                    name="expiryDate"
                    rules={[{ required: true, message: 'Please select expiry date!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                            const manufactureDate = form.getFieldValue('manufactureDate');
                            return manufactureDate ? current && current < manufactureDate.endOf('day') : false;
                        }}
                        disabled={isView}
                    />
                </Form.Item>

                <Form.Item label="Product Image" name="image">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        maxCount={1}
                        accept="image/*"
                        disabled={isView}
                        showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: false
                        }}
                    >
                        {fileList.length >= 1 || isView ? null : (
                            <div>
                                {uploading ? <Spin /> : <UploadOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductFormModal;