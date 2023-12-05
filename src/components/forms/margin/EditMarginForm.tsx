/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Alert, Button, Checkbox, Form, Input } from "antd";

import AppAxios from "@/services/AppAxios";
import type { MarginModel } from "@/interfaces/MarginModel";
import AppImageLoader from "@/components/loader/AppImageLoader";

interface FormData {
  name: string;
  wholesale_rate: string;
  retail_rate: string;
}

interface PropData {
  item: MarginModel;
}

const EditMarginForm = ({ item }: PropData) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [isDefault, setIsDefault] = useState(true);

  const handleActive = (e: any) => {
    setIsActive(e.target.checked ? true : false);
  };

  const handleDefault = (e: any) => {
    setIsDefault(e.target.checked ? true : false);
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        wholesale_rate: item.wholesale_rate,
        retail_rate: item.retail_rate
      });

      setIsActive(item.base.is_active);
      setIsDefault(item.is_default);
    }
  }, [item]);

  const onSubmit = async (data: FormData) => {
    const { name, wholesale_rate, retail_rate } = data;

    const formData = {
      name: name,
      retail_rate: parseFloat(retail_rate),
      wholesale_rate: parseFloat(wholesale_rate),
      is_default: isDefault,
      is_active: isActive
    };
    try {
      await AppAxios.put(`/api/v1/margins/${item.id}`, formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Item Added successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/purchase/margin");
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
      {loading && (
        <>
          <AppImageLoader />
        </>
      )}

      {showError &&
        errorMessages.length > 0 &&
        errorMessages.map((error, index) => (
          <Alert message={error} type="error" showIcon key={index} />
        ))}

      {!loading && (
        <div className="mt-3">
          <Form
            // {...layout}
            form={form}
            autoComplete="off"
            onFinish={onSubmit}
            style={{ maxWidth: "100%" }}
            name="wrap"
            layout="vertical"
            colon={false}
            method="post"
            encType="multipart/form-data"
            initialValues={{
              name: "",
              wholesale_rate: "",
              retail_rate: ""
            }}
          >
            <Form.Item
              label="name"
              style={{
                marginBottom: 0
              }}
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!"
                }
              ]}
            >
              <Input
                type="text"
                placeholder="name"
                className={`form-control`}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Wholesale Rate"
              style={{
                marginBottom: 0
              }}
              name="wholesale_rate"
              rules={[
                {
                  required: true,
                  message: "Please input your wholesale_rate!"
                }
              ]}
            >
              <Input
                type="number"
                placeholder="wholesale_rate"
                className={`form-control`}
                name="wholesale_rate"
              />
            </Form.Item>
            <Form.Item
              label="Retail Rate"
              style={{
                marginBottom: 0
              }}
              name="retail_rate"
              rules={[
                {
                  required: true,
                  message: "Please input your retail_rate!"
                }
              ]}
            >
              <Input
                type="number"
                placeholder="retail_rate"
                className={`form-control`}
                name="retail_rate"
              />
            </Form.Item>

            <Form.Item
              label=""
              style={{
                marginBottom: 0
              }}
            >
              <Checkbox onChange={handleDefault} checked={isDefault}>
                Default
              </Checkbox>
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

export default EditMarginForm;
