import { useState } from 'react';
import { 
  Button, 
  Form, 
  Input, 
  Card, 
  Typography, 
  Alert, 
  Spin,
  Checkbox
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'; // We'll create this CSS file

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Signup values:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration - replace with real API call
      if (values.email && values.password) {
        navigate('/login'); // Redirect to login after successful signup
      } else {
        setError('Please fill all required fields');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signup-container">
      <Card className="signup-card" bordered={false}>
        <div className="signup-header">
          <Title level={3} className="signup-title">Create Your Account</Title>
          <Text className="signup-subtitle">Join us to manage your home inventory</Text>
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
            initialValues={{ remember: true }}
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
                { type: 'email', message: 'Please enter a valid email!' }
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
                { min: 8, message: 'Password must be at least 8 characters' }
              ]}
              className="signup-form-item"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
              className="signup-form-item"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')) },
              ]}
              className="signup-form-item"
            >
              <Checkbox>
                I agree to the <Link to="/terms">Terms and Conditions</Link>
              </Checkbox>
            </Form.Item>

            <Form.Item className="signup-form-item">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="signup-form-button"
                loading={loading}
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>
          <div className="signup-footer">
            Already have an account?{' '}
            <Link to="/login">
              <Text strong>Login</Text>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;