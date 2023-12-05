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
import type { OwnerModel } from "@/interfaces/OwnerModel";
import AppLoader from "@/lib/AppLoader";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

interface FormData {
  full_name: string;
  phone: string;
  alt_phone: string;
  gender: string;
  blood_group: string;
  address_1: string;
  address_2: string;
  zip_code: string;
}

const gendersOptions = [
  {
    label: "Male",
    value: "male"
  },
  {
    label: "Female",
    value: "female"
  }
];

const bloodGroupOptions = [
  {
    label: "A+",
    value: "A+"
  },
  {
    label: "A-",
    value: "A-"
  },
  {
    label: "B+",
    value: "B+"
  },
  {
    label: "B-",
    value: "B-"
  },
  {
    label: "AB+",
    value: "AB+"
  },
  {
    label: "AB-",
    value: "AB-"
  }
];

interface PropData {
  item: OwnerModel;
}

const EditOwnerForm = ({ item }: PropData) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [selectedGender, setSelectedGender] = useState("male");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("A+");

  const router = useRouter();
  const MySwal = withReactContent(Swal);

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

  const [idPreviewOpen, setIdPreviewOpen] = useState(false);
  const [idPreviewImage, setIdPreviewImage] = useState("");
  const [idPreviewTitle, setIdPreviewTitle] = useState("");
  const [idFileList, setIdFileList] = useState<UploadFile[]>([]);

  const [idProgress, setIdProgress] = useState(0);
  const handleIdCancel = () => setIdPreviewOpen(false);

  const [attachmentPreviewOpen, setAttachmentPreviewOpen] = useState(false);
  const [attachmentPreviewImage, setAttachmentPreviewImage] = useState("");
  const [attachmentPreviewTitle, setAttachmentPreviewTitle] = useState("");
  const [attachmentFileList, setAttachmentFileList] = useState<UploadFile[]>(
    []
  );

  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const handleAttachmentCancel = () => setAttachmentPreviewOpen(false);

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
        "/api/v1/images/single/owner",
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
        "/api/v1/images/single/owner",
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
        "/api/v1/images/single/owner",
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

  const handleGenderChange = (value: any) => {
    setSelectedGender(value);
    form.setFieldsValue({ gender: value });
  };

  const handleBloodGroupChange = (value: any) => {
    setSelectedBloodGroup(value);
    form.setFieldsValue({ blood_group: value });
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
        full_name: item.full_name,
        phone: item.phone,
        alt_phone: item.alt_phone
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

      const files = item.images.map((image: any) => {
        return {
          uid: image ? image.image.id : null,
          name: item.full_name,
          status: "done" as UploadFileStatus,
          url: image ? image.image.path : null
        };
      });

      setFileList(files);

      const idFiles = item.id_images.map((image: any) => {
        return {
          uid: image ? image.image.id : null,
          name: item.full_name,
          status: "done" as UploadFileStatus,
          url: image ? image.image.path : null
        };
      });

      setIdFileList(idFiles);

      const attachmentFiles = item.attachments.map((image: any) => {
        return {
          uid: image ? image.image.id : null,
          name: item.full_name,
          status: "done" as UploadFileStatus,
          url: image ? image.image.path : null
        };
      });

      setAttachmentFileList(attachmentFiles);

      setSelectedGender(item.gender);
      setSelectedBloodGroup(item.blood_group);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onSubmit = async (data: FormData) => {
    const { full_name, phone, alt_phone, address_1, address_2, zip_code } =
      data;

    const formData = {
      full_name: full_name,
      phone: phone,
      alt_phone: alt_phone,
      blood_group: selectedBloodGroup,
      gender: selectedGender,
      is_active: isActive,
      images: Array.from(new Set(fileList.map(item => item.uid))),
      id_card_images: Array.from(new Set(idFileList.map(item => item.uid))),
      attachments: Array.from(
        new Set(attachmentFileList.map(item => item.uid))
      ),

      country_id: selectedCountry,
      state_id: selectedState,
      city_id: selectedCity,
      postOffice_id: selectedPostOffice,

      address_1: address_1,
      address_2: address_2,
      zip_code: zip_code
    };

    try {
      await AppAxios.put(`/api/v1/owners/${item.id}`, formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Owner Added successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/settings/owner");
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
      {showError &&
        errorMessages.length > 0 &&
        errorMessages.map((error, index) => (
          <Alert message={error} type="error" showIcon key={index} />
        ))}

      {loading && (
        <>
          <AppLoader />
        </>
      )}

      <div className="mt-3">
        <Form
          // {...layout}
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={onSubmit}
          style={{ maxWidth: "100%" }}
          name="wrap"
          colon={false}
          method="post"
          encType="multipart/form-data"
          initialValues={{
            full_name: "",
            phone: "",
            alt_phone: "",
            address_1: "",
            address_2: "",
            zip_code: ""
          }}
        >
          <Form.Item
            label="Full Name"
            style={{
              marginBottom: 0
            }}
            name="full_name"
            rules={[
              {
                required: true,
                message: "Please input your full Name!"
              }
            ]}
          >
            <Input
              type="text"
              placeholder="Full Name"
              className={`form-control`}
              name="full_name"
            />
          </Form.Item>

          {/* phone */}
          <Form.Item
            label="phone"
            style={{
              marginBottom: 0
            }}
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone!"
              }
            ]}
          >
            <Input
              type="phone"
              placeholder="phone"
              className={`form-control`}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Alt Phone"
            style={{
              marginBottom: 0
            }}
            name="alt_phone"
          >
            <Input
              type="text"
              placeholder="alt_phone"
              className={`form-control`}
              name="alt_phone"
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            style={{
              marginBottom: 0
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleGenderChange}
                options={gendersOptions}
                value={selectedGender}
              />
            </Space>
          </Form.Item>

          <Form.Item
            label="Blood Group"
            style={{
              marginBottom: 0
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleBloodGroupChange}
                options={bloodGroupOptions}
                value={selectedBloodGroup}
              />
            </Space>
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

          {/* id image */}
          <Form.Item
            label="NID & Passport Image"
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

export default EditOwnerForm;
