import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Divider,
  Progress
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  StockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import InventoryChart from './InventoryChart';

const { Title } = Typography;

export default function Dashboard() {
  // Mock data - replace with your actual data source
  const inventoryStats = {
    totalProducts: 1248,
    totalValue: 89500,
    outOfStock: 18,
    lowStock: 42,
    categories: 12,
    expiringSoon: 27
  };

  const categoryDistribution = [
    { name: 'Electronics', value: 35 },
    { name: 'Clothing', value: 25 },
    { name: 'Food', value: 20 },
    { name: 'Home Goods', value: 15 },
    { name: 'Other', value: 5 }
  ];

  const stockStatus = [
    { type: 'In Stock', value: 82 },
    { type: 'Low Stock', value: 12 },
    { type: 'Out of Stock', value: 6 }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Inventory Dashboard</Title>
      <Divider />
      
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Total Products"
              value={inventoryStats.totalProducts}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Inventory Value"
              value={inventoryStats.totalValue}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Categories"
              value={inventoryStats.categories}
              prefix={<StockOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={inventoryStats.expiringSoon}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Inventory Overview">
            <Row gutter={16}>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={92}
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>1,188</div>
                      <div>In Stock</div>
                    </>
                  )}
                />
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={8}
                  status="normal"
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>42</div>
                      <div>Low Stock</div>
                    </>
                  )}
                />
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={2}
                  status="exception"
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>18</div>
                      <div>Out of Stock</div>
                    </>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Category Distribution">
            <InventoryChart 
              data={categoryDistribution} 
              type="pie" 
              colors={['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d']}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Stock Status">
            <InventoryChart 
              data={stockStatus} 
              type="bar" 
              colors={['#52c41a', '#faad14', '#f5222d']}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity/Alerts */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Inventory Alerts">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <WarningOutlined style={{ color: '#f5222d', marginRight: '8px' }} />
              <span>5 items have expired this week</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <ClockCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
              <span>12 items will expire in the next 7 days</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <span>42 items recently restocked</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}