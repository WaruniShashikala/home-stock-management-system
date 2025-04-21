import React, { useState } from 'react';
import {
    Table,
    Button,
    Input,
    Space,
    Typography,
    message,
    Tooltip,
    Spin,
    Form
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import moment from 'moment';
import BudgetFormModal from './budgetFormModel';
import {
    useGetAllBudgetsQuery,
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
    useDeleteBudgetMutation,
} from '../services/budgetManagementApi';


const { Title } = Typography;

const BudgetList = () => {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isView, setIsView] = useState(false);

    // RTK Query hooks
    const { data: budgets = [], isLoading, isError, refetch } = useGetAllBudgetsQuery();
    const [createBudget] = useCreateBudgetMutation();
    const [updateBudget] = useUpdateBudgetMutation();
    const [deleteBudget] = useDeleteBudgetMutation();

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const handleView = (record) => {
        setIsView(true);
        setEditingRecord(record);
        const formValues = {
            ...record,
            startDate: record?.startDate ? moment(record.startDate) : null,
            endDate: record?.endDate ? moment(record.endDate) : null
        };
        form.setFieldsValue(formValues);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        const formValues = {
            ...record,
            startDate: record?.startDate ? moment(record.startDate) : null,
            endDate: record?.endDate ? moment(record.endDate) : null
        };
        form.setFieldsValue(formValues);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this budget?');
        if (!isConfirmed) return;

        try {
            await deleteBudget(record._id).unwrap();
            toast.success('Budget Deleted Successfully!', {
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
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                startDate: values.startDate && moment.isMoment(values.startDate)
                    ? values.startDate.format('YYYY-MM-DD')
                    : values.startDate,
                endDate: values.endDate && moment.isMoment(values.endDate)
                    ? values.endDate.format('YYYY-MM-DD')
                    : values.endDate
            };

            if (editingRecord) {
                await updateBudget({ id: editingRecord._id, ...formattedValues }).unwrap();
                toast.success('Budget Updated Successfully!', {
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
                await createBudget(formattedValues).unwrap();
                toast.success('Budget Added Successfully!', {
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
            setIsModalVisible(false);
            form.resetFields();
            refetch();
        } catch (err) {
            message.error(`Operation failed: ${err.message}`);
        }
    };

    const filteredBudgets = budgets.filter(budget => {
        if (!searchText) return true;
        return (
            budget.budgetName.toLowerCase().includes(searchText) ||
            (budget.category && budget.category.toLowerCase().includes(searchText)) ||
            (budget.paymentMethod && budget.paymentMethod.toLowerCase().includes(searchText))
        );
    });

    const columns = [
        { title: 'Budget Name', dataIndex: 'budgetName', key: 'budgetName' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => `Rs.${text.toFixed(2)}`
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A'
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A'
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
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

    if (isError) return <div>Error loading budgets</div>;

    return (
        <div className="budget-list-container">
            <div className="header">
                <Title level={3} style={{ color: '#5e3ea1' }}>Budget Management</Title>
                <Space>
                    <Input
                        placeholder="Search Budgets..."
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
                        Add New Budget
                    </Button>
                </Space>
            </div>

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={filteredBudgets}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    className="budget-table"
                />
            </Spin>

            <BudgetFormModal
                visible={isModalVisible}
                onCancel={() => {
                    form.resetFields();
                    setEditingRecord(null);
                    setIsModalVisible(false);
                    setIsView(false);
                }}
                onOk={() => form.submit()}
                form={form}
                onFinish={handleSubmit}
                editingRecord={editingRecord}
                confirmLoading={isLoading}
                isView={isView}
            />
        </div>
    );
};

export default BudgetList;