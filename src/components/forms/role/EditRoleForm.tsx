// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Alert, Button, Checkbox, Col, Form, Input, Row, Space } from "antd";
import AppAxios from "@/services/AppAxios";
import { type CheckboxValueType } from "antd/es/checkbox/Group";
import { type CheckboxChangeEvent } from "antd/lib/checkbox";
import type { RoleFormData, RoleModel } from "@/interfaces/RoleModel";
import type { Permission, PermissionData } from "@/interfaces/PermissionModel";

interface PropData {
  item: RoleModel;
}

const EditRoleForm = ({ item }: PropData) => {
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [checkedList, setCheckedList] = useState<number[]>([]);

  const [isActive, setIsActive] = useState(false);

  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [totalPermissions, setTotalPermissions] = useState(0);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const handleActive = (e: CheckboxChangeEvent) => {
    setIsActive(e.target.checked ? true : false);
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log("checked = ", checkedValues);
    setCheckedList(checkedValues as number[]);
  };

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      // Add all permission to the checkedPermissions array
      const allCheckedPermission = permissions.flatMap(group =>
        group.permissions.map(permission => permission.id)
      );
      setCheckedList(allCheckedPermission);
    } else {
      // Clear the checkedPermissions array
      setCheckedList([]);
    }
  };

  const getPermissions = async () => {
    const res = await AppAxios.get("/api/v1/common/all-permissions");
    if (res.data.success) {
      // console.log(res.data.data.permissions);
      setTotalPermissions(res.data.data.total);
      setPermissions(res.data.data.permissions);
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (item) {
      const checked = item.permissions.map(permission => permission.id);
      setCheckedList(checked);

      setIsActive(item.base.is_active);
    }
  }, [item]);

  const onSubmit = async (data: RoleFormData) => {
    const { name } = data;
    try {
      await AppAxios.put(`/api/v1/roles/${item.id}`, {
        name: name,
        is_active: isActive,
        permissions: checkedList
      })
        .then(res => {
          // console.log(res);
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Role created successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/settings/user-management/role");
          });
        })
        .catch(err => {
          MySwal.fire({
            title: "Error",
            text: err.response.data.message || "Something went wrong",
            icon: "error"
          });
          console.log(err);
          setShowError(true);
          setErrorMessages(err.response.data.message);
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // console.log(err);
      setShowError(true);
      setErrorMessages(err.message);
    }
  };

  return (
    <>
      {showError &&
        errorMessages.length > 0 &&
        errorMessages.map((error, index) => (
          <Alert message={error} type="error" showIcon key={index} />
        ))}

      <div className="mt-3">
        <Form
          // {...layout}
          autoComplete="off"
          onFinish={onSubmit}
          style={{ maxWidth: "100%" }}
          name="wrap"
          layout="vertical"
          colon={false}
          initialValues={{
            name: item ? item.name : ""
          }}
        >
          <Form.Item
            label="Name"
            style={{
              marginBottom: 0
            }}
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Name!"
              }
            ]}
          >
            <Input
              type="text"
              placeholder="Name"
              className={`form-control`}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label=""
            style={{
              marginBottom: 0
            }}
          >
            <Checkbox onChange={handleActive} checked={isActive}>
              Active
            </Checkbox>
          </Form.Item>

          <Space
            direction="vertical"
            style={{
              display: "flex",
              justifyContent: "left",
              textTransform: "capitalize",
              marginBottom: 10,
              textAlign: "left"
            }}
          >
            <Checkbox
              indeterminate={
                checkedList.length > 0 && checkedList.length < totalPermissions
              }
              checked={checkedList.length === totalPermissions}
              onChange={handleCheckAllChange}
            >
              Check All
            </Checkbox>
          </Space>

          <Form.Item label="" name="permissions" valuePropName="checked">
            <Checkbox.Group onChange={onChange} value={checkedList}>
              <Row>
                {permissions.map((permission: PermissionData, index) => {
                  return (
                    <Col span={24} key={index}>
                      <h5
                        style={{
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          marginBottom: 10,
                          fontSize: 16
                        }}
                      >
                        {permission.groupName}
                      </h5>

                      <Row
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          textTransform: "capitalize",
                          marginBottom: 10
                        }}
                      >
                        {permission &&
                          permission.permissions.map(
                            (item: Permission, key: number) => {
                              return (
                                <Col span={6} md={6} sm={8} xs={12} key={key}>
                                  <Checkbox
                                    value={item.id}
                                    style={{
                                      display: "flex",
                                      justifyContent: "left",
                                      textTransform: "capitalize"
                                    }}
                                  >
                                    {item.name}
                                  </Checkbox>
                                </Col>
                              );
                            }
                          )}
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditRoleForm;
