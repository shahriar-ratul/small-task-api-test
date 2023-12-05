/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Upload
} from "antd";

import AppAxios from "@/services/AppAxios";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile, UploadFileStatus } from "antd/es/upload/interface";
import AppImageLoader from "@/components/loader/AppImageLoader";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface AdminFormData {
  email: string;
  password: string;
  username: string;
  phone: string;
}

const CreateAdminForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  // ** States
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<any[]>([]);

  const [roles, setRoles] = useState<any[]>([]);

  const [checkedList, setCheckedList] = useState<any[]>([]);

  const [isActive, setIsActive] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  const [owners, setOwners] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [progress, setProgress] = useState(0);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url ?? (file.preview as string));
    setPreviewOpen(true);

    if (file.name) {
      setPreviewTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setPreviewTitle("Image");
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileList(filteredList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSingleUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    // check file type
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
        ? true
        : false;
    if (!isJpgOrPng) {
      MySwal.fire({
        title: "Error",
        text: "You can only upload JPG/PNG/JPEG file!",
        icon: "error"
      });
      return;
    }

    // check file size
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      MySwal.fire({
        title: "Error",
        text: "Image must smaller than 2MB!",
        icon: "error"
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await AppAxios.post(
        "/api/v1/images/single/admin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgress(percent);
              if (percent === 100) {
                setTimeout(() => setProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");
        //  add new file to the list of files
        fileList.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({
          err: data.message
        });
        setShowError(true);
        setErrorMessages(data.message);
      }
    } catch (err: any) {
      console.log("Error: ", err);
      onError({ err });
      setShowError(true);
      setErrorMessages(err.message);
    }
  };

  const handleActive = (e: any) => {
    setIsActive(e.target.checked ? true : false);
  };

  const handleIsOwner = (e: any) => {
    setIsOwner(e.target.checked ? true : false);
  };

  const handleIsEmployee = (e: any) => {
    setIsEmployee(e.target.checked ? true : false);
  };

  const handleOwnerChange = (value: any) => {
    setSelectedOwner(value as any);
  };

  const handleEmployeeChange = (value: any) => {
    setSelectedEmployee(value as any);
  };

  const getEmployees = async () => {
    const res = await AppAxios.get("/api/v1/common/all-employees");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.first_name + " " + item.last_name,
            value: item.id
          };
        });
        setEmployees(items);
      }
    }
  };

  const getOwners = async () => {
    const res = await AppAxios.get("/api/v1/common/all-owners");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.full_name,
            value: item.id
          };
        });

        setOwners(items);
      }
    }
  };

  const getRoles = async () => {
    const res = await AppAxios.get("/api/v1/common/all-roles");
    if (res.data.success) {
      if (res.data.data.roles.length > 0) {
        const items = res.data.data.roles.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });

        setRoles(items);
      }
    }
  };
  useEffect(() => {
    getRoles();
    getOwners();
    getEmployees();
  }, []);

  const handleRoleChange = (value: any[]) => {
    // console.log("checked = ", value);
    setCheckedList(value as any[]);
  };

  const onSubmit = async (data: AdminFormData) => {
    setLoading(true);

    const { phone, email, password, username } = data;

    // remove all space and all lowercase
    const usernameTrim = username.replace(/\s+/g, "").toLowerCase();

    const formData = {
      is_owner: isOwner,
      is_employee: isEmployee,
      owner_id: selectedOwner,
      employee_id: selectedEmployee,
      email: email,
      password: password,
      username: usernameTrim,
      phone: phone,
      is_active: isActive,
      roles: checkedList,
      images: fileList.map(item => item.uid)
    };
    try {
      await AppAxios.post("/api/v1/admins", formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Admin Added successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/settings/user-management/admin");
          });
        })
        .catch(err => {
          MySwal.fire({
            title: "Error",
            text: err.response.data.message || "Something went wrong",
            icon: "error"
          });

          setShowError(true);
          setErrorMessages(err.response.data.message);
        });
    } catch (err: any) {
      // console.log(err)
      setShowError(true);
      setErrorMessages(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showError &&
        errorMessages.length > 0 &&
        errorMessages.map((error, index) => (
          <Alert message={error} type="error" showIcon key={index} />
        ))}

      {loading && (
        <>
          <AppImageLoader />
        </>
      )}

      {!loading && (
        <div className="mt-3">
          <Form
            // {...layout}
            autoComplete="off"
            form={form}
            onFinish={onSubmit}
            style={{ maxWidth: "100%" }}
            name="wrap"
            layout="vertical"
            colon={false}
            method="post"
            encType="multipart/form-data"
            initialValues={{
              email: "",
              password: "",
              confirm_password: "",
              username: "",
              phone: ""
            }}
          >
            <Form.Item
              label="Owner"
              style={{
                marginBottom: 0
              }}
            >
              <Checkbox onChange={handleIsOwner} checked={isOwner}>
                Is Owner
              </Checkbox>
            </Form.Item>

            {isOwner && (
              <Form.Item
                label="Owners"
                style={{
                  marginBottom: 0
                }}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleOwnerChange}
                    options={owners}
                  />
                </Space>
              </Form.Item>
            )}

            <Form.Item
              label="Employee"
              style={{
                marginBottom: 0
              }}
            >
              <Checkbox onChange={handleIsEmployee} checked={isEmployee}>
                Is Employee
              </Checkbox>
            </Form.Item>

            {isEmployee && (
              <Form.Item
                label="Employees"
                style={{
                  marginBottom: 0
                }}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleEmployeeChange}
                    options={employees}
                  />
                </Space>
              </Form.Item>
            )}

            <Form.Item
              label="Roles"
              style={{
                marginBottom: 0
              }}
            >
              <Space style={{ width: "100%" }} direction="vertical">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleRoleChange}
                  options={roles}
                />
              </Space>
            </Form.Item>

            <Form.Item
              label="Username"
              style={{
                marginBottom: 0
              }}
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!"
                }
              ]}
            >
              <Input
                type="text"
                placeholder="Username"
                className={`form-control`}
                name="username"
              />
            </Form.Item>

            {/* email */}
            <Form.Item
              label="Email"
              style={{
                marginBottom: 0
              }}
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!"
                },
                {
                  required: true,
                  message: "Please input your E-mail!"
                },
                {
                  pattern: /^[A-Za-z0-9_\-@.]+$/,
                  message:
                    "Only letters, numbers, underscores and hyphens allowed"
                }
              ]}
            >
              <Input
                type="email"
                placeholder="Email"
                className={`form-control`}
                name="email"
              />
            </Form.Item>

            {/* password */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!"
                },
                {
                  min: 6,
                  message: "Password must be minimum 6 characters."
                }
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            {/* confirm password */}
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!"
                },

                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "confirm password that you entered do not match with password!"
                      )
                    );
                  }
                })
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Phone"
              style={{
                marginBottom: 0
              }}
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your Phone!"
                },
                {
                  pattern: /^(01)[0-9]{9}$/,
                  message: "Please enter correct BD Phone number."
                }
              ]}
            >
              <Input
                addonBefore="+88"
                type="text"
                placeholder="phone"
                className={`form-control`}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              style={{
                marginBottom: 0,
                marginTop: 10
              }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <Upload
                  customRequest={handleSingleUpload}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  defaultFileList={fileList}
                  accept="image/jpeg,image/png,image/jpg"
                  multiple={true}
                >
                  {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                {progress > 0 ? <Progress percent={progress} /> : null}

                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="image"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </Space>
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default CreateAdminForm;
