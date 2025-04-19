import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Divider,
  Button,
  Alert,
  Progress,
  Spin,
  Tag
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  StockOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  AppstoreOutlined,
  DownloadOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import moment from 'moment';
import { useGetAllCategoriesQuery } from '../services/categoryManagementApi';
import { useGetAllProductsQuery } from '../services/productManagementApi';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

export default function Dashboard() {
  // Fetch data from APIs
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    isError: isCategoriesError 
  } = useGetAllCategoriesQuery();

  const { 
    data: products = [], 
    isLoading: isProductsLoading, 
    isError: isProductsError 
  } = useGetAllProductsQuery();

// Helper function to parse quantity string and return the numeric value
const parseQuantityValue = (quantityStr) => {
  if (!quantityStr) return 0;
  const parts = quantityStr.toString().split(' ');
  return parseFloat(parts[0]) || 0;
};

  // Calculate inventory statistics
  const calculateStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, product) => sum + (product.price * parseQuantityValue(product.quantity)), 
      0
    );
    const outOfStock = products.filter(p => (p.quantity || 0) <= 0).length;
    const lowStock = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= 5).length;
    const expiringSoon = products.filter(p => 
      p.expiryDate && moment(p.expiryDate).diff(moment(), 'days') <= 30
    ).length;
    const expiredProducts = products.filter(p => 
      p.expiryDate && moment(p.expiryDate).isBefore(moment(), 'day')
    ).length;

    return {
      totalProducts,
      totalValue,
      outOfStock,
      lowStock,
      expiringSoon,
      expiredProducts
    };
  };

  // Process data for charts - creates new arrays to avoid mutation
  const processChartData = () => {
    // Create a copy of the products array to avoid mutation
    const productsCopy = [...products];
    
    // Category distribution
    const categoryCounts = {};
    productsCopy.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const categoryLabels = Object.keys(categoryCounts);
    const categoryData = Object.values(categoryCounts);

    const categoryDistribution = {
      labels: categoryLabels,
      datasets: [
        {
          data: categoryData,
          backgroundColor: [
            '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316',
            '#F59E0B', '#10B981', '#14B8A6', '#0EA5E9', '#3B82F6'
          ].slice(0, categoryLabels.length),
          borderWidth: 0,
          borderRadius: 4
        }
      ]
    };

    // Stock levels
    const stockLevels = {
      labels: ['Critical (<5)', 'Low (5-20)', 'Medium (20-100)', 'High (>100)'],
      datasets: [
        {
          label: 'Products by Stock Level',
          data: [
            productsCopy.filter(p => (p.quantity ) < 5).length,
            productsCopy.filter(p => (p.quantity) >= 5 && (p.quantity || 0) < 20).length,
            productsCopy.filter(p => (p.quantity ) >= 20 && (p.quantity || 0) <= 100).length,
            productsCopy.filter(p => (p.quantity ) > 100).length
          ],
          backgroundColor: [
            '#EF4444', '#F59E0B', '#3B82F6', '#10B981'
          ],
          borderWidth: 0,
          borderRadius: 4
        }
      ]
    };

    return { categoryDistribution, stockLevels };
  };

  const { categoryDistribution, stockLevels } = processChartData();
  const inventoryStats = calculateStats();

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  if (isCategoriesLoading || isProductsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isCategoriesError || isProductsError) {
    return (
      <Alert
        message="Error loading data"
        description="Failed to fetch inventory data. Please try again later."
        type="error"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle">
        <div>
          <AntTitle level={2} style={{ margin: 0 }}>Inventory Dashboard</AntTitle>
          <Text type="secondary">Last updated: {moment().format('MMMM Do YYYY, h:mm a')}</Text>
        </div>
        {/* <Button
          type="primary"
          icon={<DownloadOutlined />}
          style={{
            backgroundColor: '#6366F1',
            borderColor: '#6366F1',
            fontWeight: 500
          }}
        >
          Export Report
        </Button> */}
      </Row>

      <Divider style={{ margin: '16px 0 24px' }} />

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Statistic
              title="Total Products"
              value={inventoryStats.totalProducts}
              prefix={<ShoppingCartOutlined style={{ color: '#6366F1' }} />}
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Statistic
              title="Inventory Value"
              value={inventoryStats.totalValue.toFixed(2)}
              prefix="Rs"
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Statistic
              title="Categories"
              value={categories.length}
              prefix={<AppstoreOutlined style={{ color: '#8B5CF6' }} />}
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Statistic
              title="Expiring Soon"
              value={inventoryStats.expiringSoon}
              prefix={<ClockCircleOutlined style={{ color: '#F59E0B' }} />}
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory Health */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card 
            title={
              <span>
                <BarChartOutlined style={{ marginRight: 8, color: '#3B82F6' }} />
                Inventory Health
              </span>
            }
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Progress
                  type="dashboard"
                  percent={Math.round(((inventoryStats.totalProducts - inventoryStats.lowStock - inventoryStats.outOfStock) / inventoryStats.totalProducts) * 100)}
                  strokeColor="#10B981"
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>
                        {inventoryStats.totalProducts - inventoryStats.lowStock - inventoryStats.outOfStock}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B' }}>In Stock</div>
                    </>
                  )}
                />
              </Col>
              <Col xs={24} md={8}>
                <Progress
                  type="dashboard"
                  percent={Math.round((inventoryStats.lowStock / inventoryStats.totalProducts) * 100)}
                  status="normal"
                  strokeColor="#F59E0B"
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>
                        {inventoryStats.lowStock}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B' }}>Low Stock</div>
                    </>
                  )}
                />
              </Col>
              <Col xs={24} md={8}>
                <Progress
                  type="dashboard"
                  percent={Math.round((inventoryStats.outOfStock / inventoryStats.totalProducts) * 100)}
                  status="exception"
                  strokeColor="#EF4444"
                  format={() => (
                    <>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>
                        {inventoryStats.outOfStock}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Out of Stock</div>
                    </>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <span>
                <PieChartOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
                Category Distribution
              </span>
            }
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <div style={{ height: 300 }}>
              {categoryDistribution.labels.length > 0 ? (
                <Pie data={categoryDistribution} options={pieOptions} />
              ) : (
                <Alert
                  message="No data available"
                  description="There are no products to display category distribution."
                  type="info"
                  showIcon
                />
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={
              <span>
                <BarChartOutlined style={{ marginRight: 8, color: '#3B82F6' }} />
                Stock Levels
              </span>
            }
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <div style={{ height: 300 }}>
              <Bar data={stockLevels} options={barOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Alerts Section */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title="Inventory Alerts" 
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <Alert
              message="Expired Products"
              description={`${inventoryStats.expiredProducts} items have expired`}
              type="error"
              showIcon
              icon={<WarningOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Alert
              message="Products Expiring Soon"
              description={`${inventoryStats.expiringSoon} items will expire within 30 days`}
              type="warning"
              showIcon
              icon={<ClockCircleOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Alert
              message="Low Stock Items"
              description={`${inventoryStats.lowStock} items need restocking`}
              type="info"
              showIcon
              icon={<StockOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      {/* <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title="Recent Activity"
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            {products
              .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
              .slice(0, 5)
              .map(product => (
                <div key={product._id} style={{ marginBottom: 12 }}>
                  <Text strong>{product.name}</Text>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Updated {moment(product.updatedAt || product.createdAt).fromNow()}</Text>
                    <Tag color={product.quantity > 5 ? 'green' : product.quantity > 0 ? 'orange' : 'red'}>
                      {product.quantity} in stock
                    </Tag>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                </div>
              ))}
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}