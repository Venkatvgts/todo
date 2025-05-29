import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { CloseOutlined,EnterOutlined } from '@ant-design/icons';

const AddForm = forwardRef(({ initialValues, onSubmit }, ref) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useImperativeHandle(ref, () => ({
    submitForm: () => form.submit()
  }));

  useEffect(() => {
    form.setFieldsValue(initialValues || {
      firstName: "",
      lastName: "",
      age: "",
      address: ""
    });
    setTags(initialValues?.tags || []);
  }, [initialValues]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFinish = (values) => {
    onSubmit(values, tags);
    form.resetFields();
    setTags([]);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item label="First Name" name="firstName" rules={[{ required: true }]} className='mb-2'>
        <Input />
      </Form.Item>

      <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]} className='mb-2'>
        <Input />
      </Form.Item>

      <Form.Item label="Age" name="age" rules={[{ required: true }]} className='mb-2'>
        <Input type="number" />
      </Form.Item>

      <Form.Item label="Address" name="address" rules={[{ required: true }]}  className='mb-2'>
        <Input />
      </Form.Item>

      <Form.Item label="Tags">
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onPressEnter={handleAddTag}
            placeholder="Enter a tag and press Enter"
            suffix={<EnterOutlined />}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#f0f0f0",
                padding: "5px 10px",
                borderRadius: "20px",
              }}
            >
              {tag}
              <CloseOutlined
                onClick={() => handleRemoveTag(tag)}
                style={{ marginLeft: 8, cursor: "pointer", fontSize: 12 }}
              />
            </span>
          ))}
        </div>
      </Form.Item>
    </Form>
  );
});

export default AddForm;
