import React, { useState } from 'react';
import { Input, Card, List, Button, Typography, Tag, Space, Popconfirm, message, Dropdown, Menu, Spin, Image, Pagination } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useGetAllWasteQuery, useDeleteWasteMutation } from '../services/wasteManagementApi';

const { Search } = Input;
const { Title, Text } = Typography;

const DashboardList = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default items per page

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


  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsPopupVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteWaste(id).unwrap();
      refetch();
      message.success('Waste record deleted successfully!');
    } catch (err) {
      message.error('Failed to delete waste record');
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

  const actionMenu = (item) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />}>View Details</Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditClick(item)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
        <Popconfirm
          title="Are you sure to delete this record?"
          onConfirm={() => handleDelete(item._id)}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

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

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ 
          maxHeight: 'calc(100vh - 500px)', 
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
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#f0f0f0',
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
                      <Text style={{ padding: '10px', textAlign: 'center', alignItems:'center', display:'flex' }} type="secondary">No image</Text>
                    )}
                  </div>
                  <div style={{ flex: 1, marginLeft: '16px' }}>
                    <Title level={5}>{item.itemName}</Title>
                    <Text>{item.quantity} <Tag color={reasonColors[item.reason] || 'default'}>{item.reason}</Tag></Text><br/>
                    <Text type="secondary">{new Date(item.date).toLocaleDateString()}</Text>
                  </div>
                  <Dropdown overlay={actionMenu(item)} trigger={['click']}>
                    <Button
                      type="text"
                      icon={<MoreOutlined />}
                      style={{ marginLeft: '16px' }}
                    />
                  </Dropdown>
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
    </div>
  );
};

export default DashboardList;