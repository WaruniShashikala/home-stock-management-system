import { useState } from 'react';
import { 
  Button, 
  Form, 
  Input, 
  Card, 
  Typography, 
  Alert, 
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../services/authApi';
import './Signup.css'

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    console.log(values)
    try {
      await register(values).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <Card className="signup-card" bordered={false}>
        <div className="signup-header">
          <Title level={3} className="signup-title">Create Account</Title>
          <Text className="signup-subtitle">Join to manage your home inventory</Text>
        </div>
        
        <div className="signup-body">
          {error && (
            <Alert 
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            name="signup"
            onFinish={onFinish}
            autoComplete="off"
            className="signup-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 4, message: 'Username must be at least 4 characters' }
              ]}
              className="signup-form-item"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
              className="signup-form-item"
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              className="signup-form-item"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item className="signup-form-item">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="signup-form-button"
                loading={isLoading}
                disabled={isLoading}
                block
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <div className="signup-footer">
            Already have an account?{' '}
            <Link to="/login">
              <Text strong>Log in</Text>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;