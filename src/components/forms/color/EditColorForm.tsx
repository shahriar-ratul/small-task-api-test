/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  Input,
  Row,
  Space
} from "antd";

import AppAxios from "@/services/AppAxios";

import type { Color, ColorPickerProps } from "antd/es/color-picker";
import type { ColorModel } from "@/interfaces/ColorModel";

interface FormData {
  name: string;
  display_name: string;
}

interface PropData {
  item: ColorModel;
}

const EditColorForm = ({ item }: PropData) => {
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [colorHex, setColorHex] = useState<Color | string>("#1677ff");
  const [formatHex, setFormatHex] = useState<ColorPickerProps["format"]>("hex");

  const hexString = useMemo(
    () => (typeof colorHex === "string" ? colorHex : colorHex.toHexString()),
    [colorHex]
  );

  useEffect(() => {
    if (item) {
      setIsActive(item.base.is_active);
      setColorHex(item.code);
    }
  }, [item]);

  const handleActive = (e: any) => {
    setIsActive(e.target.checked ? true : false);
  };

  const onSubmit = async (data: FormData) => {
    const { name, display_name } = data;

    let displayName = display_name;

    if (
      display_name === "" &&
      display_name === null &&
      display_name === undefined
    ) {
      displayName = name;
    }

    if (!displayName) {
      displayName = name;
    }

    const formData = {
      code: hexString,
      name: name,
      display_name: displayName,
      is_active: isActive
    };
    try {
      await AppAxios.put(`/api/v1/colors/${item.id}`, formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Item Added successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/purchase/color");
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
          method="post"
          encType="multipart/form-data"
          initialValues={{
            name: item.name || "",
            display_name: item.display_name || ""
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

          {/* display_name */}
          <Form.Item
            label="Display Name"
            style={{
              marginBottom: 0
            }}
            name="display_name"
          >
            <Input
              type="text"
              placeholder="display name"
              className={`form-control`}
              name="display_name"
            />
          </Form.Item>

          <Form.Item
            label="Color Code"
            style={{
              marginBottom: 0
            }}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Row align="middle">
                <Space>
                  <Col>
                    <ColorPicker
                      format={formatHex}
                      value={colorHex}
                      onChange={setColorHex}
                      onFormatChange={setFormatHex}
                    />
                  </Col>
                  <Col>
                    HEX: <span>{hexString}</span>
                  </Col>
                </Space>
              </Row>
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
    </>
  );
};

export default EditColorForm;
