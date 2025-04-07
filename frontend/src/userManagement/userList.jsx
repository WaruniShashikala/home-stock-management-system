import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Typography, message, Tooltip, Modal, Form, Radio, Spin, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAllUsersQuery, useAdminUpdateUserMutation, useAdminDeleteUserMutation } from '../services/authApi';
import { ToastContainer, toast } from 'react-toastify';

const { Title } = Typography;

const UserList = () => {
    const [searchText, setSearchText] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    // RTK Query hooks for users
    const { data: users = [], isLoading, isError, refetch } = useGetAllUsersQuery();
    const [updateUser] = useAdminUpdateUserMutation();
    const [deleteUser] = useAdminDeleteUserMutation();

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    // Filter users based on search text
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText)
    );

    // Determine which data to display based on search
    const displayData = searchText ? filteredUsers : users;

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            password: '' // Don't pre-fill password for security
        });
        setIsPopupVisible(true);
    };

    const handleDelete = async (record) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete user ${record.username}?`);
    
        if (!isConfirmed) return;
    
        try {
            await deleteUser(record._id).unwrap();
            toast.success('User deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            refetch()
        } catch (err) {
            toast.error('Error deleting user!', {
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
                // Only update password if it was changed
                const updateData = values.password 
                    ? values 
                    : { ...values, password: undefined };
                
                await updateUser({ id: editingRecord._id, ...updateData }).unwrap();
                toast.success('User updated successfully!', {
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
            title: 'Username', 
            dataIndex: 'username', 
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username)
        },
        { 
            title: 'Email', 
            dataIndex: 'email', 
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email)
        },
        { 
            title: 'Role', 
            dataIndex: 'role', 
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>
                    {role.toUpperCase()}
                </Tag>
            ),
            sorter: (a, b) => a.role.localeCompare(b.role)
        },
        { 
            title: 'Created At', 
            dataIndex: 'createdAt', 
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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
                            disabled={record.role === 'admin'} // Prevent deleting admin users
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (isError) return <div>Error loading users</div>;

    return (
        <div className="user-list-container">
            <div className="header">
                <Title level={3} style={{ color: '#5e3ea1' }}>User Management</Title>
                <Space>
                    <Input
                        placeholder="Search users..."
                        onChange={handleSearch}
                        style={{ width: 400, padding: '10px' }}
                        allowClear
                    />
                    {/* <Button 
                        onClick={handleAddNew} 
                        style={{ padding: '20px', backgroundColor: '#4f36a8' }} 
                        type="primary" 
                        icon={<PlusOutlined />}
                    >
                        Add New User
                    </Button> */}
                </Space>
            </div>

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={displayData}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    className="user-table"
                />
            </Spin>
            
            <Modal
                title={editingRecord ? 'Edit User' : 'Add New User'}
                visible={isPopupVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
                confirmLoading={isLoading}
                className="user-form-modal"
                bodyStyle={{ padding: '24px 24px 0' }}
            >
                <Form
                    form={form}
                    initialValues={editingRecord || { role: 'user' }}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="user-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input the username!' },
                            { min: 3, message: 'Username must be at least 3 characters!' }
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input the email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    {/* <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { 
                                required: !editingRecord, 
                                message: 'Please input the password!' 
                            },
                            { 
                                min: 6, 
                                message: 'Password must be at least 6 characters!' 
                            }
                        ]}
                    >
                        <Input.Password placeholder={editingRecord ? 'Leave blank to keep current password' : 'Enter password'} />
                    </Form.Item> */}

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Radio.Group>
                            <Space direction="vertical">
                                <Radio value="user">User</Radio>
                                <Radio value="admin">Admin</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserList;