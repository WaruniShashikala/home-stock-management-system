import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Divider,
  Progress,
  Table,
  Tag
} from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  StockOutlined,
  WarningOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import moment from 'moment';
import { useGetAllFoodsQuery } from '../services/foodManagementApi';

ChartJS.register(ArcElement);

const { Title, Text } = Typography;

const Dashboard = () => {
  const { data: foods = [], isLoading } = useGetAllFoodsQuery();

  // Calculate statistics
  const totalItems = foods.length;
  const totalQuantity = foods.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = foods.filter(item => item.quantity < item.restockQuantity).length;
  const expiredItems = foods.filter(item => 
    item.expiryDate && moment(item.expiryDate).isBefore(moment())
  ).length;

  // Category distribution
  const categoryData = foods.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        '#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d',
        '#a0d911', '#722ed1', '#eb2f96', '#fa8c16', '#52c41a'
      ],
      borderWidth: 1
    }]
  };

  // Low stock items table
  const lowStockColumns = [
    { title: 'Food Item', dataIndex: 'name', key: 'name' },
    { 
      title: 'Current Stock', 
      dataIndex: 'quantity', 
      key: 'quantity',
      render: (text, record) => `${text} ${record.unit}`
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.quantity <= 0 ? 'red' : 'orange'}>
          {record.quantity <= 0 ? 'Out of Stock' : 'Low Stock'}
        </Tag>
      )
    }
  ];

  const lowStockItemsData = foods.filter(item => 
    item.quantity < item.restockQuantity
  ).sort((a, b) => a.quantity - b.quantity).slice(0, 5);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Food Inventory Dashboard</Title>
      <Text type="secondary">Overview of your current food inventory status</Text>
      <Divider />
      
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Total Items"
              value={totalItems}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Total Quantity"
              value={totalQuantity}
              prefix={<StockOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Low Stock"
              value={lowStockItems}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} md={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Expired"
              value={expiredItems}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col> */}
      </Row>
      
      {/* Inventory Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title="Stock Status">
            <Progress
              percent={Math.round(((totalItems - lowStockItems) / totalItems) * 100)}
              status="active"
              strokeColor={{
                '0%': '#52c41a',
                '100%': '#52c41a'
              }}
              format={percent => `${percent}% Adequate Stock`}
            />
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Tag color="green">{totalItems - lowStockItems} Items Well Stocked</Tag>
              <Tag color="orange">{lowStockItems} Items Need Attention</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title="Categories">
            <div style={{ height: 200 }}>
              <Pie 
                data={categoryChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} 
              />
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Low Stock Items */}
      <Card 
        title={<><WarningOutlined /> Items Needing Restock</>}
        style={{ marginBottom: 24 ,background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Table
          columns={lowStockColumns}
          dataSource={lowStockItemsData}
          rowKey="_id"
          pagination={false}
          loading={isLoading}
          size="small"
        />
      </Card>
      
      {/* Expiry Status */}
      <Card title="Expiry Status">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} size="small">
              <Statistic
                title="Expired Items"
                value={expiredItems}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} size="small">
              <Statistic
                title="Expiring Soon"
                value={foods.filter(item => 
                  item.expiryDate && 
                  moment(item.expiryDate).isAfter(moment()) && 
                  moment(item.expiryDate).diff(moment(), 'days') <= 7
                ).length}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} size="small">
              <Statistic
                title="Valid Items"
                value={foods.filter(item => 
                  !item.expiryDate || moment(item.expiryDate).isAfter(moment().add(7, 'days'))
                ).length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;