import React, { useState, useRef } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Divider,
  Progress,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  message,
  Flex
} from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  StockOutlined,
  WarningOutlined,
  FileTextOutlined,
  DownloadOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import moment from 'moment';
import { useGetAllFoodsQuery } from '../services/foodManagementApi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Report = () => {
  const [timeRange, setTimeRange] = useState([moment().subtract(1, 'month'), moment()]);
  const [reportType, setReportType] = useState('inventory');
  const { data: foods = [], isLoading } = useGetAllFoodsQuery();
  const reportRef = useRef();

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

  // Stock status
  const stockStatusData = [
    { status: 'Adequate', count: foods.filter(item => item.quantity >= item.restockQuantity).length },
    { status: 'Low Stock', count: foods.filter(item => 
      item.quantity < item.restockQuantity && item.quantity > 0
    ).length },
    { status: 'Out of Stock', count: foods.filter(item => item.quantity <= 0).length }
  ];

  // Expiry analysis
  const expiryData = [
    { status: 'Expired', count: expiredItems },
    { status: 'Expiring Soon', count: foods.filter(item => 
      item.expiryDate && 
      moment(item.expiryDate).isAfter(moment()) && 
      moment(item.expiryDate).diff(moment(), 'days') <= 7
    ).length },
    { status: 'Valid', count: foods.filter(item => 
      !item.expiryDate || moment(item.expiryDate).isAfter(moment().add(7, 'days'))
    ).length }
  ];

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

  const stockChartData = {
    labels: stockStatusData.map(item => item.status),
    datasets: [{
      label: 'Items',
      data: stockStatusData.map(item => item.count),
      backgroundColor: ['#52c41a', '#faad14', '#f5222d'],
      borderWidth: 1
    }]
  };

  const expiryChartData = {
    labels: expiryData.map(item => item.status),
    datasets: [{
      label: 'Items',
      data: expiryData.map(item => item.count),
      backgroundColor: ['#f5222d', '#faad14', '#52c41a'],
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
      title: 'Restock Level', 
      dataIndex: 'restockQuantity', 
      key: 'restockQuantity',
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
  ).sort((a, b) => a.quantity - b.quantity);

  // PDF Download Function
  const handleDownloadPdf = () => {
    const input = reportRef.current;
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
      pdf.save(`food-inventory-report-${moment().format('YYYY-MM-DD')}.pdf`);
    }).catch((error) => {
      message.destroy();
      message.error('Failed to generate PDF: ' + error.message);
    });
  };

  return (
    <div style={{ padding: '24px' }} ref={reportRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Food List Report
        </Title>
        
        <Flex gap="middle">
          <Select 
            value={reportType}
            onChange={setReportType}
            style={{ width: 180 }}
          >
            <Option value="inventory">Inventory Overview</Option>
            <Option value="stock">Stock Analysis</Option>
            <Option value="expiry">Expiry Analysis</Option>
          </Select>  
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleDownloadPdf}
          
          >
            Export PDF
          </Button>
        </Flex>
      </div>
      
      <Divider />
      
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={8}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Total Food Items"
              value={totalItems}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Total Quantity"
              value={totalQuantity}
              prefix={<StockOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Low Stock Items"
              value={lowStockItems}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={8} md={6}>
          <Card style={{ background: 'rgb(224 235 255)', borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title="Expired Items"
              value={expiredItems}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col> */}
      </Row>
      
      {/* Main Report Content */}
      {reportType === 'inventory' && (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title={
                <>
                  <PieChartOutlined style={{ marginRight: 8 }} />
                  Category Distribution
                </>
              }>
                <div style={{ height: 300 }}>
                  <Pie data={categoryChartData} options={{ responsive: true }} />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title={
                <>
                  <BarChartOutlined style={{ marginRight: 8 }} />
                  Stock Status
                </>
              }>
                <div style={{ height: 300 }}>
                  <Bar data={stockChartData} options={{ responsive: true }} />
                </div>
              </Card>
            </Col>
          </Row>
          
          <Card title="Low Stock Items" style={{ marginTop: '24px', background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Table
              columns={lowStockColumns}
              dataSource={lowStockItemsData}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              loading={isLoading}
            />
          </Card>
        </>
      )}
      
      {reportType === 'stock' && (
        <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title="Detailed Stock Analysis">
          <div style={{ height: 400 }}>
            <Bar 
              data={stockChartData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Stock Status Distribution' }
                }
              }} 
            />
          </div>
        </Card>
      )}
      
      {reportType === 'expiry' && (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title="Expiry Status">
              <div style={{ height: 300 }}>
                <Pie data={expiryChartData} options={{ responsive: true }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ background: 'rgb(255 255 255)', borderRadius: 12,   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} title="Expiry Insights">
              <div style={{ lineHeight: '32px' }}>
                <Text strong>Items expiring in next 7 days:</Text> {expiryData[1].count}
                <br />
                <Text strong>Most common expiring category:</Text> {
                  Object.entries(
                    foods
                      .filter(item => item.expiryDate && moment(item.expiryDate).diff(moment(), 'days') <= 7)
                      .reduce((acc, item) => {
                        const category = item.category || 'Uncategorized';
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                      }, {})
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
                }
                <br />
                <Text strong>Highest value expiring items:</Text> {
                  foods
                    .filter(item => item.expiryDate && moment(item.expiryDate).diff(moment(), 'days') <= 7)
                    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
                    .slice(0, 3)
                    .map(item => item.name)
                    .join(', ') || 'None'
                }
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Report;