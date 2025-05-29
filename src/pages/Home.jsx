import React, { useState, useRef } from "react";
import {
  Button,
  Modal,
  Table,
  Tag,
  Space,
  notification,
  message,
  Popconfirm,
} from "antd";
import AddForm from "../components/Form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function Home() {
  const { Column, ColumnGroup } = Table;
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const formRef = useRef();
  const queryClient = useQueryClient();

  // Fetch data from API
  const fetchData = async () => {
    const response = await axios.get(
      "https://68370974664e72d28e433992.mockapi.io/api/v1/userrecord/"
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchData,
  });

  // Notification
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (info, msg) => {
    api.info({
      message: msg,
      description: info,
      duration: 2,
      placement: "topRight",
    });
  };

  // Modal actions
  const showModal = () => {
    setEditingRecord(null);
    setOpen(true);
  };

  const handleOk = () => {
    formRef.current?.submitForm();
  };

  const handleCancel = () => {
    setOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (formValues, tags) => {
    const newItem = {
      ...formValues,
      tags,
    };

    try {
      if (editingRecord) {
        await axios.put(
          `https://68370974664e72d28e433992.mockapi.io/api/v1/userrecord/${editingRecord.key}`,
          newItem
        );
        openNotification("User updated successfully", "Updated");
      } else {
        await axios.post(
          "https://68370974664e72d28e433992.mockapi.io/api/v1/userrecord/",
          newItem
        );
        openNotification("User added successfully", "Added");
      }
       setOpen(false);
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      message.error("Error saving data");
    }

   
    setEditingRecord(null);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setOpen(true);
  };

  const DeleteRecord = async (record) => {
    console.log("Deleting record:", record);
    try {
      await axios.delete(
        `https://68370974664e72d28e433992.mockapi.io/api/v1/userrecord/${record.key}`
      );
      message.success("Record deleted successfully");
      queryClient.invalidateQueries(["users"]);
    } catch {
      message.error("Failed to delete record");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      {contextHolder}
      <div className="container mx-auto p-4">
        <h4 className="text-center text-[28px]">User Records</h4>
        <div className="flex justify-end">
          <Button type="primary" className="mb-5" onClick={showModal}>
            + Record
          </Button>
        </div>

        <Modal
          title={editingRecord ? "Edit Record" : "Add Record"}
          open={open}
          onCancel={handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
              {editingRecord ? "Update" : "Create"}
            </Button>,
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <AddForm
            ref={formRef}
            initialValues={editingRecord}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Modal>

        <Table
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ y: 340 }}
          style={{ border: "0.1px solid #ccc" }}
          bordered
        >
          <ColumnGroup title="Name">
            <Column title="First Name" dataIndex="firstName" key="firstName" />
            <Column title="Last Name" dataIndex="lastName" key="lastName" />
          </ColumnGroup>
          <Column title="Age" dataIndex="age" key="age" />
          <Column title="Address" dataIndex="address" key="address" />
          <Column
            title="Tags"
            dataIndex="tags"
            key="tags"
            render={(tags = []) => (
              <>
                {tags.map((tag) => {
                  let color = tag.length > 5 ? "geekblue" : "green";
                  if (tag === "loser") color = "volcano";
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            )}
          />
          <Column
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Button onClick={() => handleEdit(record)}>Edit</Button>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this record?"
                  onConfirm={() => DeleteRecord(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </div>
    </>
  );
}

export default Home;
