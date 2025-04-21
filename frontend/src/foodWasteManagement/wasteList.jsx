import React, { useState } from 'react';
import { Input, Card, List, Button, Typography, Tag, Space, Divider, Popconfirm, message, Dropdown, Menu, Spin, Image, Pagination } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import AddWastePopup from './addWastePopup';
import { useGetAllWasteQuery, useDeleteWasteMutation } from '../services/wasteManagementApi';
import { ToastContainer, toast } from 'react-toastify';

const { Search } = Input;
const { Title, Text } = Typography;

const WasteList = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isView, setIsView] = useState(false);

  const { data: wastes, error, isLoading, refetch } = useGetAllWasteQuery();
  const [deleteWaste] = useDeleteWasteMutation();

  const filteredData = wastes?.filter(item =>
    item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddWaste = () => {
    setIsPopupVisible(false);
    refetch();
    message.success('Waste record added successfully!');
  };

  const handleEditWaste = () => {
    setEditingItem(null);
    setIsPopupVisible(false);
    refetch();
    message.success('Waste record updated successfully!');
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsPopupVisible(true);
  };

  const handleViewClick = (item) => {
    setEditingItem(item);
    setIsPopupVisible(true);
    setIsView(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteWaste(id).unwrap();
      refetch();
      toast.success('Record Delete Success!', {
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
      toast.error('Record Delete Error!', {
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

  const reasonColors = {
    'Expired': 'red',
    'Spoiled': 'volcano',
    'Moldy': 'purple',
    'Freezer Burn': 'blue',
    'Overcooked': 'geekblue',
    'Didnt Like': 'magenta',
    'Too Much Prepared': 'gold',
    'Forgot About It': 'cyan',
    'Other': 'gray'
  };

  if (isLoading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <Spin size="large" />
    </div>
  );
  if (error) return <Text type="danger">Error loading waste records</Text>;

  const iconButtonStyle = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    color: '#555',
  };

  const hoverStyle = {
    backgroundColor: '#f0f0f0',
    color: '#333',
    transform: 'scale(1.1)',
  };

  const viewButtonStyle = {
    ...iconButtonStyle,
    ':hover': hoverStyle,
  };

  const editButtonStyle = {
    ...iconButtonStyle,
    ':hover': {
      ...hoverStyle,
      color: '#1890ff',
      backgroundColor: '#e6f7ff',
    },
  };

  const deleteButtonStyle = {
    ...iconButtonStyle,
    ':hover': {
      ...hoverStyle,
      color: '#ff4d4f',
      backgroundColor: '#fff1f0',
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>Waste Records</Title>
          <Button
            type="primary"
            style={{ backgroundColor: '#825af2', borderColor: '#825af2', boxShadow: '0 4px 12px rgba(130, 90, 242, 0.3)' }}
            icon={<PlusOutlined />}
            onClick={() => setIsPopupVisible(true)}
          >
            Add New Waste
          </Button>
        </div>

        <Search
          placeholder="Search waste records..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: '24px' }}
        />

        <Divider />

        <div style={{
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          <List
            itemLayout="horizontal"
            dataSource={paginatedData}
            renderItem={item => (
              <Card
                hoverable
                style={{
                  marginBottom: '16px',
                  borderRadius: '12px',
                  transition: 'transform 0.5s ease-in-out',
                  margin: '10px',
                  backgroundColor: 'rgb(238 238 246)',
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                  
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.itemName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        preview={{ mask: <EyeOutlined />, maskClassName: 'custom-image-mask' }}
                      />
                    ) : (
                      <Text style={{ padding: '10px', textAlign: 'center', alignItems: 'center', display: 'flex' }} type="secondary">No image</Text>
                    )}
                  </div>
                  <div style={{ flex: 1, marginLeft: '16px' }}>
                    <Title level={5}>{item.itemName}</Title>
                    <Text>{item.quantity} <Tag color={reasonColors[item.reason] || 'default'}>{item.reason}</Tag></Text><br />
                    <Text type="secondary">{new Date(item.date).toLocaleDateString()}</Text>
                  </div>
                  <Space size="middle" style={{ marginLeft: '16px' }}>
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewClick(item)}
                      title="View Details"
                      style={{border: '1px solid black'}}
                    />
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditClick(item)}
                      title="Edit"
                      style={{border: '1px solid blue'}}
                    />
                    <Popconfirm
                      title="Are you sure to delete this record?"
                      onConfirm={() => handleDelete(item._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        title="Delete"
                        style={{border: '1px solid red'}}
                      />
                    </Popconfirm>
                  </Space>
                </div>
              </Card>
            )}
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      </Space>

      <AddWastePopup
        visible={isPopupVisible}
        onCancel={() => {
          setIsPopupVisible(false);
          setEditingItem(null);
          setIsView(false);
        }}
        onSave={editingItem ? handleEditWaste : handleAddWaste}
        initialValues={editingItem}
        isView={isView}
      />
    </div>
  );
};

export default WasteList;