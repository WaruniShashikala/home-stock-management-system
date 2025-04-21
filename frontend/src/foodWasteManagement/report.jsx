import React, { useRef, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Select,
  DatePicker,
  Spin,
  Statistic
} from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  DownloadOutlined,
  CalendarOutlined,
  FilterOutlined
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
import { useGetAllWasteQuery } from '../services/wasteManagementApi';
import moment from 'moment';

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
  
  // Fetch actual waste data
  const { data: wastes = [], isLoading, isError } = useGetAllWasteQuery();
  
  // Process data based on filters
  const filteredWastes = wastes.filter(waste => {
    const wasteDate = moment(waste.date);
    const categoryMatch = categoryFilter === 'all' || waste.category === categoryFilter;
    const dateMatch = wasteDate.isBetween(dateRange[0], dateRange[1], null, '[]');
    return categoryMatch && dateMatch;
  });

  // Calculate category distribution from actual data
  const categoryDistribution = filteredWastes.reduce((acc, waste) => {
    acc[waste.category] = (acc[waste.category] || 0) + 1;
    return acc;
  }, {});

  const totalWastes = filteredWastes.length;
  
  // Prepare pie chart data
  const pieData = {
    labels: Object.keys(categoryDistribution),
    datasets: [
      {
        data: Object.values(categoryDistribution),
        backgroundColor: [
          '#b7cee8', 
          '#B8AFFF', 
          '#8EC3FF', 
          '#ededed', 
          '#f2c7ff',
          '#a0d9b4',
          '#ffd8a6'
        ],
        hoverBackgroundColor: [
          '#9ab7d1',
          '#9E8AFF',
          '#6DA8FF',
          '#d9d9d9',
          '#e5b3f2',
          '#85c99e',
          '#ffc078'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare monthly trend data
  const monthlyTrends = filteredWastes.reduce((acc, waste) => {
    const monthYear = moment(waste.date).format('YYYY-MM');
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyTrends).sort();
  const barData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Waste Count',
        data: sortedMonths.map(month => monthlyTrends[month]),
        backgroundColor: '#8EC3FF',
        borderColor: '#6DA8FF',
        borderWidth: 1
      }
    ]
  };

  // Calculate top wasted items
  const topWastedItems = filteredWastes.reduce((acc, waste) => {
    const existingItem = acc.find(item => item.name === waste.itemName);
    if (existingItem) {
      existingItem.count++;
    } else {
      acc.push({ name: waste.itemName, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 3);

  const handleDownloadPDF = () => {
    const input = dashboardRef.current;
    setDateRange([...dateRange]); // Force state update for rendering
    
    html2canvas(input, {
      scale: 2,
      logging: true,
      useCORS: true,
      async: true
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`waste_report_${moment().format('YYYYMMDD')}.pdf`);
    });
  };

  if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  if (isError) return <Text type="danger">Failed to load waste data</Text>;

  return (
    <div style={{ padding: '24px' }} ref={dashboardRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <AntTitle level={2}>Waste Management Dashboard</AntTitle>
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
        <AntTitle level={5} style={{ marginBottom: 16 }}>
          <FilterOutlined style={{ marginRight: 8 }} />
          Filter Data
        </AntTitle>
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
              suffixIcon={<CalendarOutlined />}
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
              {Object.keys(categoryDistribution).map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
      
      {/* Summary Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Wasted Items"
              value={totalWastes}
              valueStyle={{ color: '#3f8600' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Top Wasted Item"
              value={topWastedItems[0]?.name || 'N/A'}
              valueStyle={{ color: '#cf1322' }}
              suffix={topWastedItems[0] ? `(${topWastedItems[0].count} times)` : ''}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Average Monthly Waste"
              value={(totalWastes / Math.max(1, sortedMonths.length)).toFixed(1)}
              valueStyle={{ color: '#096dd9' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Charts Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4} style={{ color: '#656466' }}>
              <PieChartOutlined style={{ marginRight: 8 }} />
              Waste by Category
            </AntTitle>
            {totalWastes > 0 ? (
              <div style={{ height: 300, width: '100%', position: 'relative' }}>
                <Pie 
                  data={pieData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const percentage = ((context.raw / totalWastes) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} items (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 100 }}>
                No waste data available for selected filters
              </Text>
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <AntTitle level={4} style={{ color: '#656466' }}>
              <BarChartOutlined style={{ marginRight: 8 }} />
              Monthly Waste Trends
            </AntTitle>
            {sortedMonths.length > 0 ? (
              <div style={{ height: 300 }}>
                <Bar 
                  data={barData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Wasted Items'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Month'
                        }
                      }
                    }
                  }} 
                />
              </div>
            ) : (
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 100 }}>
                No trend data available for selected period
              </Text>
            )}
          </Card>
        </Col>
      </Row>
      
      {/* Top Wasted Items Section */}
      {topWastedItems.length > 0 && (
        <Card style={{ marginTop: 24 }}>
          <AntTitle level={4} style={{ color: '#656466', marginBottom: 16 }}>
            Top Wasted Items
          </AntTitle>
          <Row gutter={[16, 16]}>
            {topWastedItems.map((item, index) => (
              <Col xs={24} sm={8} key={item.name}>
                <Card>
                  <Statistic
                    title={`#${index + 1} ${item.name}`}
                    value={item.count}
                    suffix="times wasted"
                    valueStyle={{ 
                      color: index === 0 ? '#cf1322' : index === 1 ? '#d46b08' : '#d48806'
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;