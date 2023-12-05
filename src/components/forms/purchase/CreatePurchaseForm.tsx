/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { RadioChangeEvent } from "antd";
import {
  Alert,
  Button,
  // Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Radio,
  Select,
  Space,
  Upload
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";

import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile, UploadFileStatus } from "antd/es/upload/interface";
import AppAxios from "@/services/AppAxios";

import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const dateFormat = "YYYY-MM-DD";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
interface FormData {
  supplier_bill_no: string;
  cf_rate: number;
  gst: number;
  lc_cost: number;
  other_cost: number;
}

const CreatePurchaseForm = () => {
  const [form] = Form.useForm();
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  // const [isActive, setIsActive] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [cfs, setCfs] = useState([]);
  const [selectedCf, setSelectedCf] = useState(null);

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [lcs, setLcs] = useState([]);
  const [selectedLc, setSelectedLc] = useState(null);

  const [productOrigins, setProductOrigins] = useState([]);
  const [selectedProductOrigin, setSelectedProductOrigin] = useState(null);

  const [selectedType, setSelectedType] = useState("local");

  const [supplierBillDate, setSupplierBillDate] = useState(dayjs());
  const [purchaseDate, setPurchaseDate] = useState(dayjs());

  // image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState(0);
  const handleCancel = () => setPreviewOpen(false);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const token = Cookies.get("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  /*  const handleActive = (e: any) => {
     setIsActive(e.target.checked ? true : false);
   };
  */
  const handleTypeChange = (e: RadioChangeEvent) => {
    setSelectedSupplier(null);
    setSuppliers([]);
    form.setFieldsValue({ supplier: null });
    // console.log("radio checked", e.target.value);
    form.setFieldsValue({ type: e.target.value });
    setSelectedType(e.target.value);
  };

  const onSupplierDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    const newDate = dayjs(dateString);
    setSupplierBillDate(newDate);
  };

  const onPurchaseDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    const newDate = dayjs(dateString);
    setPurchaseDate(newDate);
  };

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
        "/api/v1/images/single/purchase",
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
      }
    } catch (err) {
      console.log("Error: ", err);
      onError({ err });
    }
  };

  const getCFs = async () => {
    const res = await AppAxios.get("/api/v1/common/all-cfs");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.company_name,
            value: item.id
          };
        });
        setCfs(items);
      }
    }
  };

  const handleCFChange = (value: any) => {
    setSelectedCf(value as any);
    form.setFieldsValue({ cf: value });
  };

  const getSuppliers = async (type: string) => {
    const res = await AppAxios.get(
      `/api/v1/common/all-suppliers-by-purchase-type/${type}`
    );
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.shop_name,
            value: item.id
          };
        });
        setSuppliers(items);
      }
    }
  };

  const handleSupplierChange = (value: any) => {
    setSelectedSupplier(value as any);
    form.setFieldsValue({ supplier: value });
  };

  const getLcs = async () => {
    const res = await AppAxios.get("/api/v1/common/all-lcs");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setLcs(items);
      }
    }
  };

  const handleLcChange = (value: any) => {
    setSelectedLc(value as any);
    form.setFieldsValue({ lc: value });
  };

  const getProductOrigins = async () => {
    const res = await AppAxios.get("/api/v1/common/all-product-origins");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setProductOrigins(items);
      }
    }
  };

  const handleProductOriginChange = (value: any) => {
    setSelectedProductOrigin(value as any);
    form.setFieldsValue({ productOrigin: value });
  };

  const getCurrencies = async () => {
    const res = await AppAxios.get("/api/v1/common/all-currencies");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setCurrencies(items);
      }
    }
  };

  const handleCurrencyChange = (value: any) => {
    setSelectedCurrency(value as any);
    form.setFieldsValue({ currency: value });
  };

  useEffect(() => {
    getCFs();

    getLcs();
    getProductOrigins();
    getCurrencies();

    form.setFieldsValue({
      supplier_bill_date: supplierBillDate,
      purchase_date: purchaseDate,
      type: selectedType,
      supplier: selectedSupplier,
      cf: selectedCf,
      lc: selectedLc,
      productOrigin: selectedProductOrigin,
      currency: selectedCurrency
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedType) {
      getSuppliers(selectedType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const onSubmit = async (data: FormData) => {
    const { supplier_bill_no, cf_rate, gst, lc_cost, other_cost } = data;

    const formData = {
      type: selectedType,
      supplier_bill_no: supplier_bill_no,
      supplier_bill_date: dayjs(supplierBillDate).format("YYYY-MM-DD"),
      purchase_date: dayjs(purchaseDate).format("YYYY-MM-DD"),
      cf_rate: cf_rate,
      gst: gst,
      lc_cost: lc_cost,
      other_cost: other_cost,

      supplier_id: selectedSupplier,
      cf_id: selectedCf,
      currency_id: selectedCurrency,
      lc_id: selectedLc,
      product_origin_id: selectedProductOrigin,

      // is_active: isActive,
      is_active: false,
      images: fileList.map(item => item.uid)
    };
    try {
      await AppAxios.post(`/api/v1/purchases`, formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Added successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/purchase/purchase/draft");
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
      {showError && <Alert message={errorMessages} type="error" showIcon />}

      <div className="mt-3">
        <Form
          // {...layout}
          autoComplete="off"
          onFinish={onSubmit}
          form={form}
          initialValues={{
            type: selectedType,
            supplier_id: selectedSupplier,
            cf_id: selectedCf,
            lc_id: selectedLc,
            product_origin_id: selectedProductOrigin,
            currency_id: selectedCurrency,
            supplier_bill_no: "",
            supplier_bill_date: supplierBillDate,
            purchase_date: purchaseDate,
            cf_rate: "",
            gst: "",
            lc_cost: "",
            other_cost: ""
          }}
          style={{ maxWidth: "100%" }}
          name="wrap"
          layout="vertical"
          colon={false}
          scrollToFirstError
        >
          {/* Type */}
          <Form.Item
            label="Type"
            style={{
              marginBottom: 0
            }}
            name="type"
            rules={[
              {
                required: true,
                message: "Please input your Type!"
              }
            ]}
          >
            <Radio.Group
              name="type"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <Radio value="local">Local Purchase</Radio>
              <Radio value="foreign">Foreign Purchase</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Supplier */}
          <Form.Item
            label="Supplier"
            name="supplier"
            style={{
              marginBottom: 0
            }}
            rules={[
              {
                required: true,
                message: "Please input your Supplier!"
              }
            ]}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleSupplierChange}
                options={suppliers}
                value={selectedSupplier}
              />
            </Space>
          </Form.Item>
          {/* Supplier Bill No */}
          <Form.Item
            label="Supplier Bill No"
            style={{
              marginBottom: 0
            }}
            name="supplier_bill_no"
            rules={[
              {
                required: true,
                message: "Please input your Supplier Bill No!"
              }
            ]}
          >
            <Input
              type="text"
              placeholder="Supplier Bill No"
              className={`form-control`}
              name="supplier_bill_no"
            />
          </Form.Item>

          {/* Supplier Bill Date */}
          <Form.Item
            label="Supplier Bill Date"
            style={{
              marginBottom: 0
            }}
            name="supplier_bill_date"
            rules={[
              {
                required: true,
                message: "Please input your Supplier Bill Date!"
              }
            ]}
          >
            <DatePicker
              showToday={true}
              style={{ width: "100%" }}
              onChange={onSupplierDateChange}
              value={supplierBillDate}
              format={dateFormat}
              name="supplier_bill_date"
              placeholder="Supplier Bill Date"
            />
          </Form.Item>

          {/* Purchase Date */}
          <Form.Item
            label="Purchase Date"
            style={{
              marginBottom: 0,
              width: "100%"
            }}
            name="purchase_date"
            rules={[
              {
                required: true,
                message: "Please input your Purchase Date!"
              }
            ]}
          >
            <DatePicker
              showToday={true}
              style={{ width: "100%" }}
              onChange={onPurchaseDateChange}
              value={purchaseDate}
              format={dateFormat}
              name="purchase_date"
              placeholder="Purchase Date"
            />
          </Form.Item>

          {/* Currency */}
          {selectedType === "foreign" && (
            <Form.Item
              label="Currency"
              name="currency"
              style={{
                marginBottom: 0
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your Currency!"
                }
              ]}
            >
              <Space style={{ width: "100%" }} direction="vertical">
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleCurrencyChange}
                  options={currencies}
                  value={selectedCurrency}
                />
              </Space>
            </Form.Item>
          )}

          {/* lc */}
          {selectedType === "foreign" && (
            <Form.Item
              label="lc"
              name="lc"
              style={{
                marginBottom: 0
              }}
            >
              <Space style={{ width: "100%" }} direction="vertical">
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleLcChange}
                  options={lcs}
                  value={selectedLc}
                />
              </Space>
            </Form.Item>
          )}

          {/* cf */}
          {selectedType === "foreign" && (
            <Form.Item
              label="C & F"
              name="cf"
              style={{
                marginBottom: 0
              }}
              rules={[
                {
                  required: true,
                  message: "Please select your C & F!"
                }
              ]}
            >
              <Space style={{ width: "100%" }} direction="vertical">
                <Select
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleCFChange}
                  options={cfs}
                  value={selectedCf}
                />
              </Space>
            </Form.Item>
          )}
          {/* C & F Rate ( 1 Kg rate ) */}
          {selectedType === "foreign" && (
            <Form.Item
              label="C & F Rate ( 1 Kg rate )"
              style={{
                marginBottom: 0
              }}
              name="cf_rate"
              rules={[
                {
                  required: true,
                  message: "Please input your C & F Rate ( 1 Kg rate )!"
                }
              ]}
            >
              <Input
                type="text"
                placeholder="C & F Rate ( 1 Kg rate )"
                className={`form-control`}
                name="cf_rate"
              />
            </Form.Item>
          )}

          {/* Product Origin */}
          <Form.Item
            label="Product Origin"
            name="productOrigin"
            style={{
              marginBottom: 0
            }}
            rules={[
              {
                required: true,
                message: "Please input your Product Origin!"
              }
            ]}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleProductOriginChange}
                options={productOrigins}
                value={selectedProductOrigin}
              />
            </Space>
          </Form.Item>

          {/* GST */}
          <Form.Item
            label="GST"
            style={{
              marginBottom: 0
            }}
            name="gst"
            rules={[
              {
                required: true,
                message: "Please input your GST!"
              }
            ]}
          >
            <Input
              type="number"
              placeholder="GST"
              className={`form-control`}
              name="gst"
            />
          </Form.Item>

          {/* LC Cost */}
          {selectedType === "foreign" && (
            <Form.Item
              label="LC Cost"
              style={{
                marginBottom: 0
              }}
              name="lc_cost"
              rules={[
                {
                  required: true,
                  message: "Please input your LC Cost!"
                }
              ]}
            >
              <Input
                type="number"
                placeholder="LC Cost"
                className={`form-control`}
                name="lc_cost"
              />
            </Form.Item>
          )}

          {/* Other Cost */}
          <Form.Item
            label="Other Cost"
            style={{
              marginBottom: 0
            }}
            name="other_cost"
            rules={[
              {
                required: true,
                message: "Please input your Other Cost!"
              }
            ]}
          >
            <Input
              type="number"
              placeholder="Other Cost"
              className={`form-control`}
              name="other_cost"
            />
          </Form.Item>

          {/* image */}
          <Form.Item
            label=""
            style={{
              marginBottom: 0
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
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
                {fileList.length >= 15 ? null : uploadButton}
              </Upload>
              {progress > 0 ? <Progress percent={progress} /> : null}

              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="image" style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </Space>
          </Form.Item>

          {/* status */}
          {/*   <Form.Item
            label=""
            style={{
              marginBottom: 0
            }}
          >
            <Checkbox onChange={handleActive} checked={isActive}>
              Active
            </Checkbox>
          </Form.Item> */}

          {/* submit */}
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

export default CreatePurchaseForm;
