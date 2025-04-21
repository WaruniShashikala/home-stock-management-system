import React from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Spin,
    message,
    Button
} from 'antd';
import moment from 'moment';
import { useGetAllCategoriesQuery } from '../services/categoryManagementApi';

const { Option } = Select;

const BudgetFormModal = ({
    visible,
    onCancel,
    onOk,
    form,
    editingRecord,
    confirmLoading,
    onFinish,
    isView
}) => {

    const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery();


    return (
        <Modal
            title={isView ? 'View Budget' : (editingRecord ? 'Edit Budget' : 'Add New Budget')}
            visible={visible}
            onOk={isView ? null : onOk}
            onCancel={onCancel}
            okText={editingRecord ? "Update Budget" : "Add Budget"}
            cancelText="Cancel"
            confirmLoading={confirmLoading}
            className="budget-form-modal"
            bodyStyle={{ padding: '24px 24px 0' }}
            width={700}
            footer={isView ? null : [
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={confirmLoading} onClick={onOk}>
                    {editingRecord ? "Update Budget" : "Add Budget"}
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                className="budget-form"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Budget Name"
                    name="budgetName"
                    rules={[{ required: true, message: 'Please input the budget name!' }]}
                >
                    <Input placeholder="Enter budget name" disabled={isView} />
                </Form.Item>

                <Form.Item
                    label="Category"
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

                <Form.Item
                    label="Total Amount (Rs)"
                    name="totalAmount"
                    rules={[{
                        required: true,
                        message: 'Please input the total amount!',
                        type: 'number',
                        min: 0
                    }]}
                >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} disabled={isView} />
                </Form.Item>

                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: 'Please select start date!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                            const endDate = form.getFieldValue('endDate');
                            return endDate ? current && current > moment(endDate).endOf('day') : false;
                        }}
                        disabled={isView}
                    />
                </Form.Item>

                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: 'Please select end date!' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                            const startDate = form.getFieldValue('startDate');
                            return startDate ? current && current < moment(startDate).endOf('day') : false;
                        }}
                        disabled={isView}
                    />
                </Form.Item>

                <Form.Item
                    label="Payment Method"
                    name="paymentMethod"
                    rules={[{ required: true, message: 'Please select payment method!' }]}
                >
                    <Select placeholder="Select payment method" disabled={isView}>
                        <Option value="Cash">Cash</Option>
                        <Option value="Credit Card">Credit Card</Option>
                        <Option value="Bank Transfer">Bank Transfer</Option>
                        <Option value="Mobile Payment">Mobile Payment</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BudgetFormModal;