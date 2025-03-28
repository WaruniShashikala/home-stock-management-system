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
  Alert
} from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  StockOutlined,
  DollarOutlined
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
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

const Report = () => {
  const dashboardRef = useRef();
  const { data: products = [], isLoading, isError } = useGetAllProductsQuery();

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  }

  if (isError) {
    return <Alert message="Error loading products" type="error" showIcon />;
  }

  // Calculate product statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const expiringSoon = products.filter(product => 
    product.expiryDate && moment(product.expiryDate).diff(moment(), 'days') <= 30
  ).length;

  // Category distribution data
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          '#b7cee8', 
          '#B8AFFF', 
          '#8EC3FF', 
          '#ededed', 
          '#f2c7ff',
          '#FFD166',
          '#06D6A0',
          '#EF476F'
        ],
        borderWidth: 1
      }
    ]
  };

  // Stock level analysis
  const stockLevels = {
    labels: ['Low (<10)', 'Medium (10-50)', 'High (>50)'],
    datasets: [
      {
        label: 'Products by Stock Level',
        data: [
          products.filter(p => p.quantity < 10).length,
          products.filter(p => p.quantity >= 10 && p.quantity <= 50).length,
          products.filter(p => p.quantity > 50).length
        ],
        backgroundColor: [
          '#EF476F',
          '#FFD166',
          '#06D6A0'
        ],
        borderWidth: 1
      }
    ]
  };

  // Expiry status
  const expiryStatus = {
    'Expired': products.filter(p => p.expiryDate && moment(p.expiryDate).isBefore(moment(), 'day')).length,
    'Expiring soon': expiringSoon,
    'Valid': products.filter(p => !p.expiryDate || moment(p.expiryDate).isAfter(moment().add(30, 'days'), 'day')).length
  };

  const expiryData = {
    labels: Object.keys(expiryStatus),
    datasets: [
      {
        data: Object.values(expiryStatus),
        backgroundColor: [
          '#EF476F',
          '#FFD166',
          '#06D6A0'
        ],
        borderWidth: 1
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
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

  const handleDownloadPDF = () => {
    const input = dashboardRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('product_report.pdf');
    });
  };

  return (
    <div style={{ padding: '24px' }} ref={dashboardRef}>
      <Row justify="space-between" align="middle">
        <AntTitle level={2}>Product Inventory Report</AntTitle>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleDownloadPDF}
          style={{ backgroundColor: '#825af2' }}
        >
          Download PDF
        </Button>
      </Row>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Inventory Value"
              value={totalValue.toFixed(2)}
              prefix={<DollarOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={expiringSoon}
              prefix={<StockOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <AntTitle level={3} style={{ marginTop: 24 }}>
        <PieChartOutlined /> Product Distribution
      </AntTitle>

      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4}>By Category</AntTitle>
            <div style={{ height: '300px' }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4}>By Stock Level</AntTitle>
            <div style={{ height: '300px' }}>
              <Bar data={stockLevels} options={{ responsive: true }} />
            </div>
          </Card>
        </Col>
      </Row>

      <AntTitle level={3} style={{ marginTop: 24 }}>
        <LineChartOutlined /> Expiry Status
      </AntTitle>
      <Card style={{ marginTop: 16 }}>
        <div style={{ height: '300px' }}>
          <Pie data={expiryData} options={pieOptions} />
        </div>
      </Card>
    </div>
  );
};

export default Report;