/* eslint-disable @typescript-eslint/naming-convention */
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
import type { BranchModel } from "@/interfaces/BranchModel";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface BranchFormData {
  name: string;
  code: string;
  email: string;
  phone: string;
  mobile: string;
  alt_mobile: string;
  address_1: string;
  address_2: string;
  zip_code: string;
}
interface PropData {
  item: BranchModel;
}

const EditBranchForm = ({ item }: PropData) => {
  const [form] = Form.useForm();
  // ** States
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const [postOffices, setPostOffices] = useState<any[]>([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState<number | null>(
    null
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [progress, setProgress] = useState(0);

  const handleCancel = () => setPreviewOpen(false);

  // handle id image preview
  const [idPreviewOpen, setIdPreviewOpen] = useState(false);
  const [idPreviewImage, setIdPreviewImage] = useState("");
  const [idPreviewTitle, setIdPreviewTitle] = useState("");
  const [idFileList, setIdFileList] = useState<UploadFile[]>([]);

  const [idProgress, setIdProgress] = useState(0);
  const handleIdCancel = () => setIdPreviewOpen(false);

  // business
  const [businessPreviewOpen, setBusinessPreviewOpen] = useState(false);
  const [businessPreviewImage, setBusinessPreviewImage] = useState("");
  const [businessPreviewTitle, setBusinessPreviewTitle] = useState("");
  const [businessFileList, setBusinessFileList] = useState<UploadFile[]>([]);

  const [businessProgress, setBusinessProgress] = useState(0);
  const handleBusinessCancel = () => setBusinessPreviewOpen(false);

  // attachment
  const [attachmentPreviewOpen, setAttachmentPreviewOpen] = useState(false);
  const [attachmentPreviewImage, setAttachmentPreviewImage] = useState("");
  const [attachmentPreviewTitle, setAttachmentPreviewTitle] = useState("");
  const [attachmentFileList, setAttachmentFileList] = useState<UploadFile[]>(
    []
  );
  // handle attachment image preview
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const handleAttachmentCancel = () => setAttachmentPreviewOpen(false);

  // handle business image preview
  const handleBusinessImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setBusinessPreviewImage(file.url ?? (file.preview as string));
    setBusinessPreviewOpen(true);
    if (file.name) {
      setBusinessPreviewTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setBusinessPreviewTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setBusinessPreviewTitle("Image");
    }
  };

  // handle id image preview
  const handleIdImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setIdPreviewImage(file.url ?? (file.preview as string));
    setIdPreviewOpen(true);
    if (file.name) {
      setIdPreviewTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setIdPreviewTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setIdPreviewTitle("Image");
    }
  };

  // handle attachment image preview

  const handleAttachmentImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setAttachmentPreviewImage(file.url ?? (file.preview as string));
    setAttachmentPreviewOpen(true);

    if (file.name) {
      setAttachmentPreviewTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setAttachmentPreviewTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setAttachmentPreviewTitle("Image");
    }
  };

  // handle image preview
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

  // handle business image change
  const handleBusinessImageChange: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setBusinessFileList(filteredList);
  };

  // handle id image change
  const handleIdImageChange: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setIdFileList(filteredList);
  };

  // handle attachment image change
  const handleAttachmentImageChange: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setAttachmentFileList(filteredList);
  };

  // image change handler
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

  const handleImageUpload = async (options: any) => {
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
        "/api/v1/images/single/branch",
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
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  const handleIdImageUpload = async (options: any) => {
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
        "/api/v1/images/single/branch",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setIdProgress(percent);
              if (percent === 100) {
                setTimeout(() => setIdProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        idFileList.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  const handleBusinessImageUpload = async (options: any) => {
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
        "/api/v1/images/single/branch",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setBusinessProgress(percent);
              if (percent === 100) {
                setTimeout(() => setBusinessProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        businessFileList.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // attachment image upload
  const handleAttachmentImageUpload = async (options: any) => {
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
        "/api/v1/images/single/branch",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setAttachmentProgress(percent);
              if (percent === 100) {
                setTimeout(() => setAttachmentProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        attachmentFileList.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  const handleActive = (e: any) => {
    setIsActive(e.target.checked ? true : false);
  };

  // country
  const handleCountryChange = (value: any) => {
    if (value) {
      setSelectedCountry(value as any);
      setStates([]);
      setCities([]);
      setPostOffices([]);
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedPostOffice(null);
    }
  };

  const getCountries = async () => {
    const res = await AppAxios.get("/api/v1/common/all-countries");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setCountries(items);
      }
    }
  };

  // state
  const handleStateChange = (value: any) => {
    if (value) {
      setSelectedState(value as any);
      setCities([]);
      setPostOffices([]);
      setSelectedCity(null);
      setSelectedPostOffice(null);
    }
  };

  const getStates = async (id: number) => {
    const res = await AppAxios.get(`/api/v1/common/states-by-country/${id}`);
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setStates(items);
      }
    }
  };

  // city
  const handleCityChange = (value: any) => {
    if (value) {
      setSelectedCity(value as any);
      setPostOffices([]);
      setSelectedPostOffice(null);
    }
  };

  const getCities = async (id: number) => {
    const res = await AppAxios.get(`/api/v1/common/cities-by-state/${id}`);
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setCities(items);
      }
    }
  };

  // post office
  const handlePostOfficeChange = (value: any) => {
    setSelectedPostOffice(value as any);
  };

  const getPostOffices = async (id: number) => {
    const res = await AppAxios.get(`/api/v1/common/post-offices-by-city/${id}`);
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setPostOffices(items);
      }
    }
  };

  useEffect(() => {
    if (selectedCity) {
      getPostOffices(selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (item) {
      setIsActive(item.base.is_active);

      form.setFieldsValue({
        name: item.name,
        code: item.code,
        email: item.email,
        phone: item.phone,
        mobile: item.mobile,
        alt_mobile: item.alt_mobile
      });

      if (item.addresses.length > 0) {
        if (item.addresses[0].address.country) {
          setSelectedCountry(item.addresses[0].address.country.id);
          getStates(item.addresses[0].address.country.id);
        }
        if (item.addresses[0].address.state) {
          setSelectedState(item.addresses[0].address.state.id);
          getCities(item.addresses[0].address.state.id);
        }

        if (item.addresses[0].address.city) {
          setSelectedCity(item.addresses[0].address.city.id);
          getPostOffices(item.addresses[0].address.city.id);
        }

        if (item.addresses[0].address.postOffice) {
          setSelectedPostOffice(item.addresses[0].address.postOffice.id);
        }

        form.setFieldsValue({
          address_1: item.addresses[0].address.address_1,
          address_2: item.addresses[0].address.address_2,
          zip_code: item.addresses[0].address.zip_code
        });
      }

      const files = item.images.map((img: any) => {
        return {
          uid: img.image.id,
          name: item.name,
          status: "done" as UploadFileStatus,
          url: img.image.path
        };
      });

      setFileList(files);

      const businessFiles = item.certificates.map((image: any) => {
        return {
          uid: image.image.id,
          name: item.name,
          status: "done" as UploadFileStatus,
          url: image.image.path
        };
      });

      setBusinessFileList(businessFiles);

      const attachmentFiles = item.attachments.map((image: any) => {
        return {
          uid: image.image.id,
          name: item.name,
          status: "done" as UploadFileStatus,
          url: image.image.path
        };
      });

      setAttachmentFileList(attachmentFiles);

      const card_images = item.card_images.map((image: any) => {
        return {
          uid: image.image.id,
          name: item.name,
          status: "done" as UploadFileStatus,
          url: image.image.path
        };
      });

      setIdFileList(card_images);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onSubmit = async (data: BranchFormData) => {
    const {
      name,
      code,
      email,
      phone,
      mobile,
      alt_mobile,
      address_1,
      address_2,
      zip_code
    } = data;

    const formData = {
      name: name,
      code: code,
      email: email,
      phone: phone,
      mobile: mobile,
      alt_mobile: alt_mobile,
      is_active: isActive,

      country_id: selectedCountry,
      state_id: selectedState,
      city_id: selectedCity,
      postOffice_id: selectedPostOffice,

      address_1: address_1,
      address_2: address_2,
      zip_code: zip_code,

      images: Array.from(new Set(fileList.map(item => item.uid))),
      card_images: Array.from(new Set(idFileList.map(item => item.uid))),
      attachments: Array.from(
        new Set(attachmentFileList.map(item => item.uid))
      ),
      certificates: Array.from(new Set(businessFileList.map(item => item.uid)))
    };
    try {
      await AppAxios.put(`/api/v1/branches/${item.id}`, formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Updated successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/settings/branch");
          });
        })
        .catch(err => {
          MySwal.fire({
            title: "error",
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
            code: "",
            email: "",
            phone: "",
            mobile: "",
            alt_mobile: "",
            address_1: "",
            address_2: "",
            zip_code: ""
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
            label="code"
            style={{
              marginBottom: 0
            }}
            name="code"
            rules={[
              {
                required: true,
                message: "Please input your code!"
              }
            ]}
          >
            <Input
              type="text"
              placeholder="code"
              className={`form-control`}
              name="code"
            />
          </Form.Item>

          <Form.Item
            label="mobile"
            style={{
              marginBottom: 0
            }}
            name="mobile"
            rules={[
              {
                required: true,
                message: "Please input your mobile!"
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
              placeholder="mobile"
              className={`form-control`}
              name="mobile"
            />
          </Form.Item>

          <Form.Item
            label="alt_mobile"
            style={{
              marginBottom: 0
            }}
            name="alt_mobile"
            rules={[
              {
                pattern: /^(01)[0-9]{9}$/,
                message: "Please enter correct BD Phone number."
              }
            ]}
          >
            <Input
              addonBefore="+88"
              type="text"
              placeholder="alt_mobile"
              className={`form-control`}
              name="alt_mobile"
            />
          </Form.Item>

          <Form.Item
            label="phone"
            style={{
              marginBottom: 0
            }}
            name="phone"
          >
            <Input
              type="text"
              placeholder="phone"
              className={`form-control`}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="email"
            style={{
              marginBottom: 0
            }}
            name="email"
          >
            <Input
              type="text"
              placeholder="email"
              className={`form-control`}
              name="email"
            />
          </Form.Item>

          {/* country */}
          <Form.Item
            label="Country"
            style={{
              marginBottom: 0
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleCountryChange}
                options={countries}
                value={selectedCountry}
                showSearch
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Space>
          </Form.Item>

          {/* state */}
          <Form.Item
            label="State"
            style={{
              marginBottom: 0
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleStateChange}
                options={states}
                value={selectedState}
                showSearch
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Space>
          </Form.Item>

          {/* city */}
          <Form.Item
            label="City"
            style={{
              marginBottom: 0
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleCityChange}
                options={cities}
                value={selectedCity}
                showSearch
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Space>
          </Form.Item>

          {/* post office */}
          <Form.Item
            label="Post Office"
            style={{
              marginBottom: 0
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handlePostOfficeChange}
                options={postOffices}
                value={selectedPostOffice}
                showSearch
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Space>
          </Form.Item>

          {/* address 1 */}
          <Form.Item
            label="address line 1"
            style={{
              marginBottom: 0
            }}
            name="address_1"
            /* rules={[
        {
          required: true,
          message: "Please input your address_1!"
        }
      ]} */
          >
            <Input
              type="address_1"
              placeholder="address_1"
              className={`form-control`}
              name="address_1"
            />
          </Form.Item>

          {/* address 2 */}
          <Form.Item
            label="address line 2"
            style={{
              marginBottom: 0
            }}
            name="address_2"
            /*  rules={[
         {
           required: true,
           message: "Please input your address_2!"
         }
       ]} */
          >
            <Input
              type="address_2"
              placeholder="address_2"
              className={`form-control`}
              name="address_2"
            />
          </Form.Item>

          {/* zip code */}
          <Form.Item
            label="zip_code"
            style={{
              marginBottom: 0
            }}
            name="zip_code"
            /*  rules={[
         {
           required: true,
           message: "Please input your zip_code!"
         }
       ]} */
          >
            <Input
              type="zip_code"
              placeholder="zip_code"
              className={`form-control`}
              name="zip_code"
            />
          </Form.Item>

          {/* profile image */}
          <Form.Item
            label="Profile Image"
            style={{
              marginBottom: 0
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Upload
                customRequest={handleImageUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                defaultFileList={fileList}
                accept="image/jpeg,image/png,image/jpg"
                multiple
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
                <img alt="image" style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </Space>
          </Form.Item>

          {/* Visiting image */}
          <Form.Item
            label="Visiting Card Image"
            style={{
              marginBottom: 0
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Upload
                customRequest={handleIdImageUpload}
                listType="picture-card"
                fileList={idFileList}
                onPreview={handleIdImagePreview}
                onChange={handleIdImageChange}
                defaultFileList={idFileList}
                accept="image/jpeg,image/png,image/jpg"
                multiple
              >
                {idFileList.length >= 5 ? null : uploadButton}
              </Upload>
              {idProgress > 0 ? <Progress percent={idProgress} /> : null}

              <Modal
                open={idPreviewOpen}
                title={idPreviewTitle}
                footer={null}
                onCancel={handleIdCancel}
              >
                <img
                  alt="image"
                  style={{ width: "100%" }}
                  src={idPreviewImage}
                />
              </Modal>
            </Space>
          </Form.Item>

          {/* Business image */}
          <Form.Item
            label="Business Certificate"
            style={{
              marginBottom: 0
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Upload
                customRequest={handleBusinessImageUpload}
                listType="picture-card"
                fileList={businessFileList}
                onPreview={handleBusinessImagePreview}
                onChange={handleBusinessImageChange}
                defaultFileList={businessFileList}
                accept="image/jpeg,image/png,image/jpg"
                multiple
              >
                {businessFileList.length >= 5 ? null : uploadButton}
              </Upload>
              {businessProgress > 0 ? (
                <Progress percent={businessProgress} />
              ) : null}

              <Modal
                open={businessPreviewOpen}
                title={businessPreviewTitle}
                footer={null}
                onCancel={handleBusinessCancel}
              >
                <img
                  alt="image"
                  style={{ width: "100%" }}
                  src={businessPreviewImage}
                />
              </Modal>
            </Space>
          </Form.Item>

          {/* Other  image */}
          <Form.Item
            label="Other Image"
            style={{
              marginBottom: 0
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Upload
                customRequest={handleAttachmentImageUpload}
                listType="picture-card"
                fileList={attachmentFileList}
                onPreview={handleAttachmentImagePreview}
                onChange={handleAttachmentImageChange}
                defaultFileList={attachmentFileList}
                accept="image/jpeg,image/png,image/jpg"
                multiple
              >
                {attachmentFileList.length >= 5 ? null : uploadButton}
              </Upload>
              {attachmentProgress > 0 ? (
                <Progress percent={attachmentProgress} />
              ) : null}

              <Modal
                open={attachmentPreviewOpen}
                title={attachmentPreviewTitle}
                footer={null}
                onCancel={handleAttachmentCancel}
              >
                <img
                  alt="image"
                  style={{ width: "100%" }}
                  src={attachmentPreviewImage}
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
    </>
  );
};

export default EditBranchForm;