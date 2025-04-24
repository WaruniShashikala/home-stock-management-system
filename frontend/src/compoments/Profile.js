import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message, Avatar, Spin, Typography } from 'antd';
import { UserOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../slice/authSlice';

const Profile = ({ user, visible, onCancel, onUpdate, updateProfile }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { Text } = Typography;

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email
      });
      setImageUrl(user.profilePicture || '');
    }
  }, [visible, user, form]);

  const handleUpload = async ({ file }) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwqizp90f/image/upload',
        formData
      );
      setImageUrl(response.data.secure_url);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Image upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      const updateData = {
        _id: user._id,
        username: values.username,
        email: values.email,
        profilePicture: imageUrl
      };

      const response = await updateProfile(updateData).unwrap();
      dispatch(updateUser(response));
      message.success('Profile updated successfully!');
      onUpdate();
      onCancel();
    } catch (error) {
      console.error('Update error:', error);
      message.error(error.data?.error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit Profile"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>,
      ]}
      closable={!isSubmitting}
      maskClosable={!isSubmitting}
    >
      <Spin spinning={loading} tip="Loading...">
        <Form
          form={form}
          layout="vertical"
          disabled={isSubmitting}
        >
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 24,
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: 16
            }}>
              <Avatar
                src={imageUrl}
                size={100}
                icon={<UserOutlined />}
                style={{ 
                  border: '3px solid #fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />

              <Upload
                customRequest={handleUpload}
                showUploadList={false}
                accept="image/*"
                disabled={uploading || isSubmitting}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    cursor: uploading || isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#40a9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1890ff';
                  }}
                >
                  {uploading ? <LoadingOutlined style={{ fontSize: 18 }} /> : <UploadOutlined style={{ fontSize: 18 }} />}
                </div>
              </Upload>
            </div>

            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                JPG, PNG (Max 5MB)
              </Text>
            </div>
          </div>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              { max: 20, message: 'Username cannot exceed 20 characters!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input type="email" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Profile;
