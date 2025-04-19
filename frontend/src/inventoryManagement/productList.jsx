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
    Image,
    Form
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import ProductFormModal from './ProductFormModal';
import {
    useGetAllProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from '../services/productManagementApi';
import './ProductList.css';

const { Title } = Typography;

const ProductList = () => {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isView, setIsView] = useState(false);

    // RTK Query hooks
    const { data: products = [], isLoading, isError, refetch } = useGetAllProductsQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const parseQuantity = (quantityString) => {
        if (!quantityString) return { quantity: '', unit: 'count' };
        const str = quantityString.toString().trim();
        const parts = str.split(' ');
        if (parts.length === 1) {
            return {
                quantity: parseFloat(parts[0]) || 0,
                unit: 'count'
            };
        }

        const unit = parts.pop();
        const quantity = parseFloat(parts.join(' ')) || 0;

        return { quantity, unit };
    };

    const handleView = (record) => {
        setIsView(true);
        setEditingRecord(record);
        const { quantity, unit } = parseQuantity(record.quantity);

        const formValues = {
            ...record,
            quantity: quantity,
            unit: unit || 'count',
            manufactureDate: record?.manufactureDate ? moment(record.manufactureDate) : null,
            expiryDate: record?.expiryDate ? moment(record.expiryDate) : null
        };

        form.setFieldsValue(formValues);

        if (record.image) {
            setFileList([{
                uid: '-1',
                name: 'product-image',
                status: 'done',
                url: record.image
            }]);
        } else {
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        const { quantity, unit } = parseQuantity(record.quantity); // Make sure this matches your API response field name

        const formValues = {
            ...record,
            quantity: quantity,
            unit: unit || 'count', // Default to 'count' if unit is not specified
            manufactureDate: record?.manufactureDate ? moment(record.manufactureDate) : null,
            expiryDate: record?.expiryDate ? moment(record.expiryDate) : null
        };

        form.setFieldsValue(formValues);

        if (record.image) {
            setFileList([{
                uid: '-1',
                name: 'product-image',
                status: 'done',
                url: record.image
            }]);
        } else {
            setFileList([]);
        }

        setIsModalVisible(true);
        setIsView(false);
    };

    const handleDelete = async (record) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this product?');
        if (!isConfirmed) return;

        try {
            await deleteProduct(record._id).unwrap();
            toast.success('Product Deleted Successfully!', {
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
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            // Format dates before submitting
            const formattedValues = {
                ...values,
                manufactureDate: values.manufactureDate && moment.isMoment(values.manufactureDate)
                    ? values.manufactureDate.format('YYYY-MM-DD')
                    : values.manufactureDate,
                expiryDate: values.expiryDate && moment.isMoment(values.expiryDate)
                    ? values.expiryDate.format('YYYY-MM-DD')
                    : values.expiryDate,
                image: fileList[0]?.url || '',
                quantity: `${values.quantity} ${values.unit}`
            };

            if (editingRecord) {
                await updateProduct({ id: editingRecord._id, ...formattedValues }).unwrap();
                toast.success('Product Updated Successfully!', {
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
                await createProduct(formattedValues).unwrap();
                toast.success('Product Added Successfully!', {
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
            setFileList([]);
            refetch(); // Refresh the data
        } catch (err) {
            message.error(`Operation failed: ${err.message}`);
        }
    };

    // Filter products based on search text
    const filteredProducts = products.filter(product => {
        if (!searchText) return true;

        return (
            product.name.toLowerCase().includes(searchText) ||
            (product.category && product.category.toLowerCase().includes(searchText))
        );
    });

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => image ? (
                <Image
                    src={image}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                    alt="Product"
                />
            ) : null
        },
        { title: 'Item Name', dataIndex: 'name', key: 'name' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text) => text.toLocaleString()
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `Rs: ${text.toFixed(2)}`
        },
        {
            title: 'Manufacture Date',
            dataIndex: 'manufactureDate',
            key: 'manufactureDate',
            render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A'
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A'
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

    if (isError) return <div>Error loading products</div>;

    return (
        <div className="product-list-container">
            <div className="header">
                <Title level={3} style={{ color: '#5e3ea1' }}>Product Inventory</Title>
                <Space>
                    <Input
                        placeholder="Search Products..."
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
                        Add New Product
                    </Button>
                </Space>
            </div>

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    className="product-table"
                />
            </Spin>

            <ProductFormModal
                visible={isModalVisible}
                onCancel={() => {
                    form.resetFields();
                    setFileList([]);
                    setEditingRecord(null);
                    setIsModalVisible(false);
                    setIsView(false)
                }}
                onOk={() => form.submit()}
                form={form}
                onFinish={handleSubmit}
                editingRecord={editingRecord}
                fileList={fileList}
                setFileList={setFileList}
                uploading={uploading}
                setUploading={setUploading}
                confirmLoading={isLoading}
                isView={isView}
            />
        </div>
    );
};

export default ProductList;