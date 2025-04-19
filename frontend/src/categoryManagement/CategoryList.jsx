import React, { useState } from 'react';
import { Table, Button, Input, Space, Typography, message, Tooltip, Modal, Form, Radio, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSearchCategoriesQuery
} from '../services/categoryManagementApi';
import { ToastContainer, toast } from 'react-toastify';

const { Title } = Typography;

const CategoryList = () => {
    const [searchText, setSearchText] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // RTK Query hooks
    const { data: categories = [], isLoading, isError, refetch } = useGetAllCategoriesQuery();
    const { data: searchResults = [] } = useSearchCategoriesQuery(searchText, {
        skip: searchText.length < 2 // Only search when query has at least 2 characters
    });
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    // Filter categories based on search text
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchText) ||
        (category.description && category.description.toLowerCase().includes(searchText))
    );

    // Determine which data to display based on search
    const displayData = searchText ? filteredCategories : categories;

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsPopupVisible(true);
    };

    const handleDelete = async (record) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this category?');
    
        if (!isConfirmed) return;
    
        try {
            await deleteCategory(record._id).unwrap();
            toast.success('Category Deleted Successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        } catch (err) {
            toast.error('Error Occurred!', {
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
    };

    const handleAddNew = () => {
        form.resetFields();
        setEditingRecord(null);
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
                await updateCategory({ id: editingRecord._id, ...values }).unwrap();
                toast.success('Category Updated Successfully!', {
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
                await createCategory(values).unwrap();
                toast.success('Category Added Successfully!', {
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
            setIsPopupVisible(false);
            form.resetFields();
            refetch(); // Refresh the data
        } catch (err) {
            message.error(`Operation failed: ${err.message}`);
        }
    };

    const columns = [
        { 
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        { 
            title: 'Description', 
            dataIndex: 'description', 
            key: 'description',
            render: (text) => text || 'N/A'
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => (
                <span style={{ color: status === 'Active' ? '#52c41a' : '#f5222d' }}>
                    {status}
                </span>
            ),
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
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

    if (isError) return <div>Error loading categories</div>;

    return (
        <div className="category-list-container">
            <div className="header">
                <Title level={3} style={{ color: '#5e3ea1' }}>Category Management</Title>
                <Space>
                    <Input
                        placeholder="Search Categories..."
                        onChange={handleSearch}
                        style={{ width: 400, padding: '10px' }}
                        allowClear
                    />
                    <Button 
                        onClick={handleAddNew} 
                        style={{ padding: '20px', backgroundColor: '#4f36a8' }} 
                        type="primary" 
                        icon={<PlusOutlined />}
                    >
                        Add Category
                    </Button>
                </Space>
            </div>

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={displayData}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    className="category-table"
                />
            </Spin>
            
            <Modal
                title={editingRecord ? 'Edit Category' : 'Add New Category'}
                visible={isPopupVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
                confirmLoading={isLoading}
                className="category-form-modal"
                bodyStyle={{ padding: '24px 24px 0' }}
            >
                <Form
                    form={form}
                    initialValues={editingRecord || { status: 'Active' }}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="category-form"
                >
                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[{ 
                            required: true, 
                            message: 'Please input the category name!' 
                        }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea rows={3} placeholder="Enter description (optional)" />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value="Active">Active</Radio>
                            <Radio value="Inactive">Inactive</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default CategoryList;