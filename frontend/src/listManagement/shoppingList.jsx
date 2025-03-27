import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Typography, message, Tooltip, Modal, InputNumber, Form, Radio, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import './FoodList.css';
import { 
  useGetAllFoodsQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useSearchFoodsQuery
} from '../services/foodManagementApi';

const { Title } = Typography;

const ShoppingList = () => {
    const [searchText, setSearchText] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // RTK Query hooks
    const { data: foods = [], isLoading, isError, refetch } = useGetAllFoodsQuery();
    const { data: searchResults = [] } = useSearchFoodsQuery(searchText, {
        skip: searchText.length < 2 // Only search when query has at least 2 characters
    });
    const [createFood] = useCreateFoodMutation();
    const [updateFood] = useUpdateFoodMutation();
    const [deleteFood] = useDeleteFoodMutation();

    const handleSearch = (e) => setSearchText(e.target.value.toLowerCase());

    const handleAddToList = (record) => {
        message.success(`Added ${record.name} to the list!`);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsPopupVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: `Are you sure you want to delete ${record.name}?`,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteFood(record._id).unwrap();
                    message.success(`${record.name} deleted successfully!`);
                } catch (err) {
                    message.error(`Failed to delete ${record.name}: ${err.message}`);
                }
            }
        });
    };

    const handleAddNew = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsPopupVisible(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsPopupVisible(false);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRecord) {
                await updateFood({ id: editingRecord._id, ...values }).unwrap();
                message.success(`${values.name} updated successfully!`);
            } else {
                await createFood(values).unwrap();
                message.success(`${values.name} added successfully!`);
            }
            setIsPopupVisible(false);
            form.resetFields();
            refetch(); // Refresh the data
        } catch (err) {
            message.error(`Operation failed: ${err.message}`);
        }
    };

    // Determine which data to display based on search
    const displayData = searchText.length >= 2 ? searchResults : foods;

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { 
            title: 'Restock Quantity', 
            dataIndex: 'restockQuantity', 
            key: 'restockQuantity',
            render: (text, record) => `${text} ${record.unit}`
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Delete">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (isError) return <div>Error loading food items</div>;

    return (
        <div className="food-list-container">
            <div className="header">
                <Title level={3} style={{ color: '#5e3ea1' }}>Shopping List</Title>
                <Space>
                    <Input
                        placeholder="Search Food..."
                        onChange={handleSearch}
                        style={{ width: 400, padding: '10px' }}
                        allowClear
                    />
                </Space>
            </div>

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={displayData}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    className="food-table"
                />
            </Spin>
        </div>
    );
};

export default ShoppingList;