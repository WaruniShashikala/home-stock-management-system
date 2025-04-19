import React, { useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Statistic,
  Spin,
  Alert,
  Tag,
  Table
} from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  StockOutlined,
  DollarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useGetAllCategoriesQuery } from '../services/categoryManagementApi';
import { useGetAllProductsQuery } from '../services/productManagementApi';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

const Report = () => {
  const dashboardRef = useRef();
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useGetAllProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery();

  if (productsLoading || categoriesLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  }

  if (productsError) {
    return <Alert message="Error loading products" type="error" showIcon />;
  }
  const parseQuantityValue = (quantityStr) => {
    if (!quantityStr) return 0;
    const parts = quantityStr.toString().split(' ');
    return parseFloat(parts[0]) || 0;
  };

  // Calculate product statistics
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + (product.price * parseQuantityValue(product.quantity)), 
    0
  );
  const expiringSoon = products.filter(product =>
    product.expiryDate && moment(product.expiryDate).diff(moment(), 'days') <= 30
  ).length;
  const expiredProducts = products.filter(p => p.expiryDate && moment(p.expiryDate).isBefore(moment(), 'day')).length;

  // Enhanced category analysis
  const categoryAnalysis = categories.map(category => {
    const categoryProducts = products.filter(p => p.category === category.name);
    const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const expiring = categoryProducts.filter(p =>
      p.expiryDate && moment(p.expiryDate).diff(moment(), 'days') <= 30
    ).length;

    return {
      name: category.name,
      status: category.status,
      count: categoryProducts.length,
      quantity: totalQuantity,
      value: totalValue,
      expiring,
      percentage: Math.round((categoryProducts.length / totalProducts) * 100)
    };
  }).sort((a, b) => b.value - a.value);

  // Category distribution data
  const pieData = {
    labels: categoryAnalysis.map(c => c.name),
    datasets: [
      {
        data: categoryAnalysis.map(c => c.count),
        backgroundColor: [
          '#6366F1', // indigo
          '#8B5CF6', // violet
          '#EC4899', // pink
          '#F43F5E', // rose
          '#F97316', // orange
          '#F59E0B', // amber
          '#10B981', // emerald
          '#14B8A6', // teal
          '#0EA5E9', // sky
          '#3B82F6'  // blue
        ],
        borderWidth: 0,
        borderRadius: 4
      }
    ]
  };

  // Stock level analysis
  const stockLevels = {
    labels: ['Critical (<5)', 'Low (5-20)', 'Medium (20-100)', 'High (>100)'],
    datasets: [
      {
        label: 'Products by Stock Level',
        data: [
          products.filter(p => p.quantity < 5).length,
          products.filter(p => p.quantity >= 5 && p.quantity < 20).length,
          products.filter(p => p.quantity >= 20 && p.quantity <= 100).length,
          products.filter(p => p.quantity > 100).length
        ],
        backgroundColor: [
          '#EF4444', // red
          '#F59E0B', // amber
          '#3B82F6', // blue
          '#10B981'  // emerald
        ],
        borderWidth: 0,
        borderRadius: 4
      }
    ]
  };

  // Expiry timeline (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) =>
    moment().subtract(i, 'months').format('MMM YYYY')
  ).reverse();

  const expiryTimelineData = {
    labels: months,
    datasets: [
      {
        label: 'Products Expired',
        data: months.map(month =>
          products.filter(p =>
            p.expiryDate &&
            moment(p.expiryDate).isSame(moment(month, 'MMM YYYY'), 'month')
          ).length
        ),
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        tension: 0.3
      },
      {
        label: 'Products Expiring',
        data: months.map(month =>
          products.filter(p =>
            p.expiryDate &&
            moment(p.expiryDate).isSame(moment(month, 'MMM YYYY').add(1, 'month'), 'month')
          ).length
        ),
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        tension: 0.3
      }
    ]
  };


  // Top categories table columns
  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Tag color={record.status === 'Active' ? 'green' : 'red'}>
              {record.status}
            </Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Products',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count
    },
    {
      title: 'Total Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: 'Total Value',
      dataIndex: 'value',
      key: 'value',
      render: value => `Rs ${value.toFixed(2)}`,
      sorter: (a, b) => a.value - b.value
    },
    {
      title: 'Expiring Soon',
      dataIndex: 'expiring',
      key: 'expiring',
      sorter: (a, b) => a.expiring - b.expiring
    }
  ];

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalProducts) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
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

  const handleDownloadPDF = () => {
    const input = dashboardRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('inventory_report.pdf');
    });
  };

  return (
    <div style={{ padding: '24px' }} ref={dashboardRef}>
      <Row justify="space-between" align="middle">
        <div>
          <AntTitle level={2} style={{ margin: 0 }}>Inventory Report</AntTitle>
          <Text type="secondary">Last updated: {moment().format('MMMM Do YYYY, h:mm a')}</Text>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#6366F1',
            borderColor: '#6366F1',
            fontWeight: 500
          }}
        >
          Export Report
        </Button>
      </Row>

      <Divider style={{ margin: '16px 0 24px' }} />

      {/* Summary Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined style={{ color: '#6366F1' }} />}
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Inventory Value"
              value={totalValue.toFixed(2)}
              // suffix={<DollarOutlined style={{ color: '#10B981' }} />}
              prefix="Rs"
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Expiring Soon"
              value={expiringSoon}
              prefix={<ClockCircleOutlined style={{ color: '#F59E0B' }} />}
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}
            style={{
              background: 'rgb(224 235 255)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Statistic
              title="Expired Products"
              value={expiredProducts}
              prefix={<StockOutlined style={{ color: '#EF4444' }} />}
              valueStyle={{ color: '#1E293B' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Category Analysis */}
      <AntTitle level={4} style={{ marginTop: 32, display: 'flex', alignItems: 'center' }}>
        <AppstoreOutlined style={{ marginRight: 8, color: '#8B5CF6' }} />
        Category Analysis
      </AntTitle>
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
          >
            <AntTitle level={5} style={{ marginBottom: 24 }}>Product Distribution by Category</AntTitle>
            <div style={{ height: 300 }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
          >
            <AntTitle level={5} style={{ marginBottom: 24 }}>Top Categories</AntTitle>
            <Table
              columns={columns}
              dataSource={categoryAnalysis}
              rowKey="name"
              pagination={false}
              scroll={{ y: 240 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory Health */}
      <AntTitle level={4} style={{ marginTop: 32, display: 'flex', alignItems: 'center' }}>
        <BarChartOutlined style={{ marginRight: 8, color: '#3B82F6' }} />
        Inventory Health
      </AntTitle>
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
          >
            <AntTitle level={5} style={{ marginBottom: 24 }}>Stock Levels</AntTitle>
            <div style={{ height: 300 }}>
              <Bar data={stockLevels} options={barOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
          >
            <AntTitle level={5} style={{ marginBottom: 24 }}>Expiry Timeline</AntTitle>
            <div style={{ height: 300 }}>
              <Line data={expiryTimelineData} options={barOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Report;