// ** React Imports
import { useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Alert, Button, Form, Input } from "antd";
import AppAxios from "@/services/AppAxios";
import type { PermissionFormData } from "@/interfaces/PermissionModel";

const CreatePermissionForm = () => {
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const onSubmit = (data: PermissionFormData) => {
    const { name, group, slug } = data;
    try {
      AppAxios.post("/api/v1/permissions", {
        name: name,
        group: group,
        slug: slug
      })
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Permission created successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/settings/user-management/permission");
          });
        })
        .catch(err => {
          console.log(err);
          setShowError(true);
          setErrorMessages(err.response.data.message);
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
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
            name: "",
            slug: "",
            group: ""
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
            label="Slug"
            style={{
              marginBottom: 0
            }}
            name="slug"
            rules={[
              {
                required: true,
                message: "Please input your Slug!"
              }
            ]}
          >
            <Input
              type="text"
              placeholder="Slug"
              className={`form-control`}
              name="slug"
            />
          </Form.Item>

          <Form.Item
            label="Group"
            style={{
              marginBottom: 0
            }}
            name="group"
            rules={[
              {
                required: true,
                message: "Please input your Group!"
              }
            ]}
          >
            <Input
              type="text"
              placeholder="Group"
              className={`form-control`}
              name="group"
            />
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

export default CreatePermissionForm;
