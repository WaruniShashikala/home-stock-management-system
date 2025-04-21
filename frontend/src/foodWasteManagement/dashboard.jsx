import React, { useRef, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Statistic,
  Select,
  DatePicker,
  Spin,
  Table
} from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useGetAllWasteQuery } from '../services/wasteManagementApi';
import { useGetAllProductsQuery } from '../services/productManagementApi';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const dashboardRef = useRef();
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'months'), moment()]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Fetch data
  const { data: wastes = [], isLoading: wasteLoading } = useGetAllWasteQuery();
  const { data: products = [], isLoading: productLoading } = useGetAllProductsQuery();

  // Filter data based on date range and category
  const filteredWastes = wastes.filter(waste => {
    const wasteDate = moment(waste.date);
    const categoryMatch = categoryFilter === 'all' || waste.category === categoryFilter;
    const dateMatch = wasteDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    return categoryMatch && dateMatch;
  });

  // Calculate statistics
  const calculateStats = () => {
    const wasteByCategory = {};
    const productByCategory = {};
    let totalWasteValue = 0;
    let totalInventoryValue = 0;
    
    // Process waste data
    filteredWastes.forEach(waste => {
      wasteByCategory[waste.category] = (wasteByCategory[waste.category] || 0) + 1;
      
      // Find matching product to calculate value
      const product = products.find(p => p.name === waste.itemName);
      if (product) {
        const quantity = parseFloat(waste.quantity.split(' ')[0]);
        totalWasteValue += quantity * (product.price || 0);
      }
    });
    
    // Process inventory data
    products.forEach(product => {
      productByCategory[product.category] = (productByCategory[product.category] || 0) + 1;
      const quantity = parseFloat(product.quantity.split(' ')[0]);
      totalInventoryValue += quantity * (product.price || 0);
    });
    
    return {
      wasteByCategory,
      productByCategory,
      totalWasteValue,
      totalInventoryValue,
      wasteCount: filteredWastes.length,
      productCount: products.length,
      wasteRatio: filteredWastes.length / Math.max(1, products.length)
    };
  };
  
  const stats = calculateStats();

  // Prepare chart data
  const prepareChartData = () => {
    const categories = [...new Set([
      ...Object.keys(stats.wasteByCategory),
      ...Object.keys(stats.productByCategory)
    ])];
    
    return {
      comparisonData: {
        labels: categories,
        datasets: [
          {
            label: 'Inventory Items',
            data: categories.map(cat => stats.productByCategory[cat] || 0),
            backgroundColor: '#abb7ed',
            borderColor: '#388e3c'
          },
          {
            label: 'Wasted Items',
            data: categories.map(cat => stats.wasteByCategory[cat] || 0),
            backgroundColor: '#d42453',
            borderColor: '#d32f2f'
          }
        ]
      },
      valueComparisonData: {
        labels: ['Total Value'],
        datasets: [
          {
            label: 'Inventory Value',
            data: [stats.totalInventoryValue],
            backgroundColor: '#abb7ed'
          },
          {
            label: 'Waste Value',
            data: [stats.totalWasteValue],
            backgroundColor: '#d42453'
          }
        ]
      }
    };
  };
  
  const { comparisonData, valueComparisonData } = prepareChartData();

  // Top wasted items table
  const topWastedItems = filteredWastes.reduce((acc, waste) => {
    const existing = acc.find(item => item.name === waste.itemName);
    const product = products.find(p => p.name === waste.itemName);
    const quantity = parseFloat(waste.quantity.split(' ')[0]);
    const value = quantity * (product?.price || 0);
    
    if (existing) {
      existing.count++;
      existing.totalQuantity += quantity;
      existing.totalValue += value;
    } else {
      acc.push({
        name: waste.itemName,
        category: waste.category,
        count: 1,
        totalQuantity: quantity,
        totalValue: value
      });
    }
    return acc;
  }, []).sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

  const handleDownloadPDF = () => {
    const input = dashboardRef.current;
    
    html2canvas(input, {
      scale: 2,
      logging: true,
      useCORS: true
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`waste_report_${moment().format('YYYYMMDD')}.pdf`);
    });
  };

  const isLoading = wasteLoading || productLoading;

  return (
    <div style={{ padding: '24px' }} ref={dashboardRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AntTitle level={2}>Waste & Inventory Analytics</AntTitle>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleDownloadPDF}
          style={{ backgroundColor: '#825af2', borderColor: '#825af2' }}
        >
          Export Report
        </Button>
      </div>
      
      <Divider />
      
      {/* Filters Section */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {/* <Col xs={24} md={12} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              ranges={{
                'Last Month': [moment().subtract(1, 'month'), moment()],
                'Last 3 Months': [moment().subtract(3, 'months'), moment()],
                'Last 6 Months': [moment().subtract(6, 'months'), moment()],
              }}
            />
          </Col> */}
          <Col xs={24} md={12} lg={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
            >
              <Option value="all">All Categories</Option>
              {[...new Set([...Object.keys(stats.wasteByCategory), ...Object.keys(stats.productByCategory)])].map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
      
      {/* Summary Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Inventory Items"
              value={stats.productCount}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#4caf50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Wasted Items"
              value={stats.wasteCount}
              prefix={<DeleteOutlined />}
              valueStyle={{ color: '#f44336' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Inventory Value"
              value={stats.totalInventoryValue.toFixed(2)}
              prefix="Rs."
              valueStyle={{ color: '#4caf50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Waste Value"
              value={stats.totalWasteValue.toFixed(2)}
              prefix="Rs."
              valueStyle={{ color: '#f44336' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Charts Section */}
      <Spin spinning={isLoading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card>
              <AntTitle level={4} style={{ color: '#656466' }}>
                <BarChartOutlined style={{ marginRight: 8 }} />
                Category Comparison
              </AntTitle>
              <div style={{ height: 400 }}>
                <Bar 
                  data={comparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Items' }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <AntTitle level={4} style={{ color: '#656466' }}>
                <PieChartOutlined style={{ marginRight: 8 }} />
                Value Comparison
              </AntTitle>
              <div style={{ height: 400 }}>
                <Bar 
                  data={valueComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Value (Rs.)' }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* Top Wasted Items */}
        <Card style={{ marginTop: 24 }}>
          <AntTitle level={4} style={{ color: '#656466', marginBottom: 16 }}>
            Top 5 Costly Wasted Items
          </AntTitle>
          <Table
            columns={[
              { title: 'Item Name', dataIndex: 'name', key: 'name' },
              { title: 'Category', dataIndex: 'category', key: 'category' },
              { title: 'Times Wasted', dataIndex: 'count', key: 'count' },
              { 
                title: 'Total Quantity', 
                dataIndex: 'totalQuantity', 
                key: 'totalQuantity',
                render: (value, record) => `${value} ${record.name.includes('ml') ? 'ml' : record.name.includes('kg') ? 'kg' : ''}`
              },
              { 
                title: 'Total Value (Rs.)', 
                dataIndex: 'totalValue', 
                key: 'totalValue',
                render: value => value.toFixed(2)
              }
            ]}
            dataSource={topWastedItems}
            rowKey="name"
            pagination={false}
          />
        </Card>
        
        {/* Waste Ratio Insights */}
        <Card style={{ marginTop: 24 }}>
          <AntTitle level={4} style={{ color: '#656466', marginBottom: 16 }}>
            Waste Ratio Insights
          </AntTitle>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card type="inner">
                <Statistic
                  title="Waste to Inventory Ratio"
                  value={(stats.wasteRatio * 100).toFixed(1)}
                  suffix="%"
                  valueStyle={{
                    color: stats.wasteRatio > 0.2 ? '#f44336' : 
                          stats.wasteRatio > 0.1 ? '#ff9800' : '#4caf50'
                  }}
                />
                <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                  {stats.wasteRatio > 0.2 ? 'High waste rate - Needs immediate attention' :
                   stats.wasteRatio > 0.1 ? 'Moderate waste rate - Room for improvement' :
                   'Good waste management'}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card type="inner">
                <Statistic
                  title="Average Waste Value per Item"
                  value={(stats.totalWasteValue / Math.max(1, stats.wasteCount)).toFixed(2)}
                  prefix="Rs."
                />
                <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                  Compared to inventory average of Rs. {(stats.totalInventoryValue / Math.max(1, stats.productCount)).toFixed(2)}
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default Dashboard;