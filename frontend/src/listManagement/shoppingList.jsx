import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Table, Button, Input, Space, Typography, message, Tooltip, Modal, Form, Spin, Radio, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import {
    useGetAllListItemsQuery,
    useCreateListItemMutation,
    useUpdateListItemMutation,
    useDeleteListItemMutation,
    useSearchListItemsQuery
} from '../services/shoppingListManagementApi';
import './FoodList.css';
import './shoppingList.css';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Title } = Typography;

const ShoppingList = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const componentRef = useRef();

    // Extract quantity and unit from existing items
    const parseQuantity = (quantityString) => {
        if (!quantityString) return { quantity: '', unit: 'count' };
        const parts = quantityString.toString().split(' ');
        if (parts.length === 1) return { quantity: parts[0], unit: 'count' };
        const unit = parts.pop();
        return { quantity: parts.join(' '), unit };
    };


    // PDF Download Function
    const handlePrint = () => {
        const input = componentRef.current;
        message.loading('Generating PDF...', 0);

        html2canvas(input, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            scrollY: -window.scrollY
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            message.destroy();
            pdf.save(`my-shopping-list-${moment().format('YYYY-MM-DD')}.pdf`);
        }).catch((error) => {
            message.destroy();
            message.error('Failed to generate PDF: ' + error.message);
        });
    };

    // RTK Query hooks for shopping list
    const {
        data: items = [],
        isLoading,
        isError,
        refetch
    } = useGetAllListItemsQuery();

    console.log(items)

    const { data: searchResults = [] } = useSearchListItemsQuery(searchText, {
        skip: searchText.length < 2
    });

    const [createListItem] = useCreateListItemMutation();
    const [updateListItem] = useUpdateListItemMutation();
    const [deleteListItem] = useDeleteListItemMutation();

    // Search handler
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Filter items based on search text
    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Determine which data to display based on search
    const displayData = searchText.length >= 2 ? searchResults : filteredItems;

    // Add new item handler
    const handleAddNew = () => {
        setEditingItem(null);
        form.resetFields();
        form.setFieldsValue({ unit: 'count' }); // Set default unit
        setIsModalVisible(true);
    };

    // Edit item handler
    const handleEdit = (record) => {
        setEditingItem(record);
        const { quantity, unit } = parseQuantity(record.Quantity);
        form.setFieldsValue({
            itemName: record.itemName,
            Quantity: quantity,
            unit: unit || 'count'
        });
        setIsModalVisible(true);
    };

    // Delete item handler
    const handleDelete = async (record) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this record?');
        if (!isConfirmed) return;
        try {
            await deleteListItem(record._id).unwrap();
            message.success(`${record.itemName} deleted successfully!`);
            refetch();
        } catch (err) {
            message.error(`Failed to delete: ${err.message}`);
        }
    };

    // Form submit handler
    const handleSubmit = async (values) => {
        try {
            const itemData = {
                itemName: values.itemName,
                Quantity: `${values.Quantity} ${values.unit}`
            };

            if (editingItem) {
                await updateListItem({
                    id: editingItem._id,
                    ...itemData
                }).unwrap();
                message.success(`${values.itemName} updated successfully!`);
            } else {
                await createListItem(itemData).unwrap();
                message.success(`${values.itemName} added to your list!`);
            }
            setIsModalVisible(false);
            form.resetFields();
            refetch();
        } catch (err) {
            message.error(`Operation failed: ${err.message}`);
        }
    };

    // Table columns
    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
            render: (text, record) => (
                <span style={{
                    textDecoration: record.purchased ? 'line-through' : 'none',
                    color: record.purchased ? '#999' : 'inherit'
                }}>
                    {text}
                </span>
            )
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
            render: (text) => <span>{text}</span>
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

    if (isError) return <div>Error loading shopping list items</div>;

    return (
        <div className="food-list-container shopping-list">
            <div className="header shopping-header">
                <Title level={3} style={{ color: '#5e3ea1' }}>Shopping List</Title>
                <Space>
                    <Input
                        placeholder="Search items..."
                        onChange={handleSearch}
                        style={{ width: 400, padding: '10px' }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddNew}
                        style={{ padding: '20px', backgroundColor: '#4f36a8' }}
                    >
                        Add Item
                    </Button>
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                        style={{ padding: '20px', backgroundColor: '#449ae9' }}
                        disabled={items.length === 0}
                    >
                        Save as PDF
                    </Button>
                </Space>
            </div>

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={displayData}
                    rowKey="_id"
                    pagination={false}
                    className="food-table"
                />
            </Spin>

            {/* Hidden printable content */}
            <div className="hide-on-print" ref={componentRef}>
                <div style={{ padding: '20px' }}>
                    <h3 className="print-header">My Shopping List</h3>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Item</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="print-footer">
                        <p>Generated on: {new Date().toLocaleDateString()}</p>
                        <p>Total items: {items.length}</p>
                    </div>
                </div>
            </div>

            {/* Add/Edit Item Modal */}
            <Modal
                title={editingItem ? 'Edit Item' : 'Add New Item'}
                visible={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => {
                    form.resetFields();
                    setIsModalVisible(false);
                }}
                okText={editingItem ? 'Update' : 'Add'}
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Item Name"
                        name="itemName"
                        rules={[{ required: true, message: 'Please enter item name!' }]}
                    >
                        <Input placeholder="Enter item name" />
                    </Form.Item>

                    <Form.Item
                        label="Unit of Measurement"
                        name="unit"
                        rules={[{ required: true, message: 'Please select a unit!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value="count">Count</Radio.Button>
                            <Radio.Button value="kg">Kilogram (kg)</Radio.Button>
                            <Radio.Button value="liter">Liter (l)</Radio.Button>
                            <Radio.Button value="packs">Packs</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="Quantity"
                        rules={[{ required: true, message: 'Please enter quantity!' }]}
                    >
                        <InputNumber
                            placeholder="Enter quantity"
                            style={{ width: '100%' }}
                            min={0}
                        />
                    </Form.Item>


                </Form>
            </Modal>
        </div>
    );
};

export default ShoppingList;