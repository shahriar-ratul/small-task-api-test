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
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Steps,
  Upload
} from "antd";

import AppAxios from "@/services/AppAxios";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile, UploadFileStatus } from "antd/es/upload/interface";

import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import type { CFModel } from "@/interfaces/CFModel";

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
  company_name: string | null;
  mobile: string | null;
  alt_mobile: string | null;
  phone: string | null;
  email: string | null;
  owner_name: string | null;
  owner_phone: string | null;
  owner_alt_phone: string | null;
  owner_email: string | null;
  owner_dob: string | null;
  contact_person_name: string | null;
  contact_person_phone: string | null;
  contact_person_alt_phone: string | null;
  contact_person_email: string | null;
  contact_person_dob: string | null;
  address_1: string | null;
  address_2: string | null;
  zip_code: string | null;
}

const steps = [
  {
    title: "Basic",
    content: "basic"
  },
  {
    title: "Owner",
    content: "owner"
  },
  {
    title: "Contact Person",
    content: "contact_person"
  },
  {
    title: "Attachments",
    content: "attachments"
  }
];

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

interface PropData {
  item: CFModel;
}

const EditCFForm = ({ item }: PropData) => {
  const [form] = Form.useForm();

  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [selectedOwnerGender, setSelectedOwnerGender] = useState(null);
  const [selectedContactGender, setSelectedContactGender] = useState(null);

  const [selectOwnerDob, setSelectOwnerDob] = useState<dayjs.Dayjs | null>(
    null
  );
  const [selectContactDob, setSelectContactDob] = useState<dayjs.Dayjs | null>(
    null
  );

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

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  // image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [progress, setProgress] = useState(0);
  const handleCancel = () => setPreviewOpen(false);

  // certificate image
  const [certificatePreviewOpen, setCertificatePreviewOpen] = useState(false);
  const [certificatePreviewImage, setCertificatePreviewImage] = useState("");
  const [certificatePreviewTitle, setCertificatePreviewTitle] = useState("");
  const [certificateFileList, setCertificateFileList] = useState<UploadFile[]>(
    []
  );

  const [certificateProgress, setCertificateProgress] = useState(0);
  const handleCertificateCancel = () => setCertificatePreviewOpen(false);

  // attachment image

  const [attachmentPreviewOpen, setAttachmentPreviewOpen] = useState(false);
  const [attachmentPreviewImage, setAttachmentPreviewImage] = useState("");
  const [attachmentPreviewTitle, setAttachmentPreviewTitle] = useState("");
  const [attachmentFileList, setAttachmentFileList] = useState<UploadFile[]>(
    []
  );

  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const handleAttachmentCancel = () => setAttachmentPreviewOpen(false);

  // owner image

  const [previewOwnerOpen, setPreviewOwnerOpen] = useState(false);
  const [previewOwnerImage, setPreviewOwnerImage] = useState("");
  const [previewOwnerTitle, setPreviewOwnerTitle] = useState("");
  const [ownerFileList, setOwnerFileList] = useState<UploadFile[]>([]);

  const [ownerFileProgress, setOwnerFileProgress] = useState(0);
  const handleOwnerCancel = () => setPreviewOwnerOpen(false);

  // contact image
  const [previewContactOpen, setPreviewContactOpen] = useState(false);
  const [previewContactImage, setPreviewContactImage] = useState("");
  const [previewContactTitle, setPreviewContactTitle] = useState("");
  const [contactFileList, setContactFileList] = useState<UploadFile[]>([]);

  const [contactFileProgress, setContactFileProgress] = useState(0);
  const handleContactCancel = () => setPreviewContactOpen(false);

  const [formValues, setFormValues] = useState<FormData>({
    company_name: null,
    mobile: null,
    alt_mobile: null,
    phone: null,
    email: null,
    owner_name: null,
    owner_phone: null,
    owner_alt_phone: null,
    owner_email: null,
    owner_dob: null,
    contact_person_name: null,
    contact_person_phone: null,
    contact_person_alt_phone: null,
    contact_person_email: null,
    contact_person_dob: null,
    address_1: null,
    address_2: null,
    zip_code: null
  });

  // steps
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  // steps
  const [current, setCurrent] = useState(0);

  const next = async () => {
    try {
      if (current === 0) {
        await form.validateFields([
          "company_name",
          // "email",
          "mobile"
          // "alt_mobile",
          // "phone"
        ]);

        setFormValues({
          ...formValues,
          company_name: form.getFieldValue("company_name"),
          email: form.getFieldValue("email"),
          mobile: form.getFieldValue("mobile"),
          alt_mobile: form.getFieldValue("alt_mobile"),
          phone: form.getFieldValue("phone"),
          address_1: form.getFieldValue("address_1"),
          address_2: form.getFieldValue("address_2"),
          zip_code: form.getFieldValue("zip_code")
        });
      } else if (current === 1) {
        /* await form.validateFields([
          "owner_name",
          "owner_phone",
          "owner_alt_phone",
          "owner_email",
          "owner_dob"
        ]); */

        setFormValues({
          ...formValues,
          owner_name: form.getFieldValue("owner_name"),
          owner_phone: form.getFieldValue("owner_phone"),
          owner_alt_phone: form.getFieldValue("owner_alt_phone"),
          owner_email: form.getFieldValue("owner_email"),
          owner_dob: selectOwnerDob ? selectOwnerDob.format("YYYY-MM-DD") : null
        });
      } else if (current === 2) {
        /*  await form.validateFields([
           "contact_person_name",
           "contact_person_phone",
           "contact_person_alt_phone",
           "contact_person_email",
           "contact_person_dob"
         ]); */

        setFormValues({
          ...formValues,
          contact_person_name: form.getFieldValue("contact_person_name"),
          contact_person_phone: form.getFieldValue("contact_person_phone"),
          contact_person_alt_phone: form.getFieldValue(
            "contact_person_alt_phone"
          ),
          contact_person_email: form.getFieldValue("contact_person_email"),
          contact_person_dob: selectContactDob
            ? selectContactDob.format("YYYY-MM-DD")
            : null
        });

        // console.log(validate);
      }

      setCurrent(current + 1);
    } catch {
      // return some msg...
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  // handle certificate image preview
  const handleCertificateImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setCertificatePreviewImage(file.url ?? (file.preview as string));
    setCertificatePreviewOpen(true);
    if (file.name) {
      setCertificatePreviewTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setCertificatePreviewTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setCertificatePreviewTitle("Image");
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

  // handle owner image preview
  const handleOwnerImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewOwnerImage(file.url ?? (file.preview as string));
    setPreviewOwnerOpen(true);
    if (file.name) {
      setPreviewOwnerTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewOwnerTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setPreviewOwnerTitle("Image");
    }
  };

  // handle contact image preview
  const handleContactImagePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewContactImage(file.url ?? (file.preview as string));
    setPreviewContactOpen(true);
    if (file.name) {
      setPreviewContactTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewContactTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setPreviewContactTitle("Image");
    }
  };

  // image change handler
  const handleOwnerChange: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setOwnerFileList(filteredList);
  };
  // image change handler
  const handleContactChange: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setContactFileList(filteredList);
  };

  // handle id image change
  const handleCertificateImageChange: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setCertificateFileList(filteredList);
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

  // owner
  const handleOwnerImageUpload = async (options: any) => {
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
        "/api/v1/images/single/cf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setOwnerFileProgress(percent);
              if (percent === 100) {
                setTimeout(() => setOwnerFileProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        ownerFileList.push({
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

  // contact
  const handleContactImageUpload = async (options: any) => {
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
        "/api/v1/images/single/cf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setContactFileProgress(percent);
              if (percent === 100) {
                setTimeout(() => setContactFileProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        contactFileList.push({
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
        "/api/v1/images/single/cf",
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
  const handleCertificateImageUpload = async (options: any) => {
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
        "/api/v1/images/single/cf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setCertificateProgress(percent);
              if (percent === 100) {
                setTimeout(() => setCertificateProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        certificateFileList.push({
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
        "/api/v1/images/single/cf",
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

  const handleOwnerGenderChange = (value: any) => {
    form.setFieldsValue({ gender: value });
    setSelectedOwnerGender(value);
  };

  const handleContactPersonGenderChange = (value: any) => {
    form.setFieldsValue({ gender: value });
    setSelectedContactGender(value);
  };

  const onOwnerDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (dateString !== "") {
      const newDate = dayjs(dateString);
      setSelectOwnerDob(newDate);
      form.setFieldsValue({ owner_dob: newDate });
    } else {
      setSelectOwnerDob(null);
      form.setFieldsValue({ owner_dob: null });
    }
  };

  const onContactDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    if (dateString !== "") {
      const newDate = dayjs(dateString);
      setSelectContactDob(newDate);
      form.setFieldsValue({ contact_person_dob: newDate });
    } else {
      setSelectContactDob(null);
      form.setFieldsValue({ contact_person_dob: null });
    }
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
      setFormValues({
        ...formValues,
        company_name: item.company_name,
        mobile: item.mobile,
        alt_mobile: item.alt_mobile,
        phone: item.phone,
        email: item.email,
        owner_name: item.owner_name,
        owner_phone: item.owner_phone,
        owner_alt_phone: item.owner_alt_phone,
        owner_email: item.owner_email,
        owner_dob: item.owner_dob
          ? dayjs(item.owner_dob).format("YYYY-MM-DD")
          : null,
        contact_person_name: item.contact_person_name,
        contact_person_phone: item.contact_person_phone,
        contact_person_alt_phone: item.contact_person_alt_phone,
        contact_person_email: item.contact_person_email,
        contact_person_dob: item.contact_person_dob
          ? dayjs(item.contact_person_dob).format("YYYY-MM-DD")
          : null
      });

      form.setFieldsValue({
        company_name: item.company_name,
        mobile: item.mobile,
        alt_mobile: item.alt_mobile,
        phone: item.phone,
        email: item.email,
        owner_name: item.owner_name,
        owner_phone: item.owner_phone,
        owner_alt_phone: item.owner_alt_phone,
        owner_email: item.owner_email,
        owner_dob: item.owner_dob ? dayjs(item.owner_dob) : null,
        contact_person_name: item.contact_person_name,
        contact_person_phone: item.contact_person_phone,
        contact_person_alt_phone: item.contact_person_alt_phone,
        contact_person_email: item.contact_person_email,
        contact_person_dob: item.contact_person_dob
          ? dayjs(item.contact_person_dob)
          : null
      });

      setIsActive(item.base.is_active);
      const files = item.images.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.company_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setFileList(files);

      const certificateFiles = item.certificates.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.company_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setCertificateFileList(certificateFiles);

      const attachmentFiles = item.attachments.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.company_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setAttachmentFileList(attachmentFiles);

      const ownerFiles = item.ownerImages.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.company_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setOwnerFileList(ownerFiles);

      const contactFiles = item.contactPersonImages.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.company_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setContactFileList(contactFiles);

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

        setFormValues({
          ...formValues,
          address_1: item.addresses[0].address.address_1,
          address_2: item.addresses[0].address.address_2,
          zip_code: item.addresses[0].address.zip_code
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onSubmit = async () => {
    const {
      company_name,
      mobile,
      alt_mobile,
      phone,
      email,
      owner_name,
      owner_phone,
      owner_alt_phone,
      owner_email,
      owner_dob,
      contact_person_name,
      contact_person_phone,
      contact_person_alt_phone,
      contact_person_email,
      contact_person_dob,
      address_1,
      address_2,
      zip_code
    } = formValues;

    const formData = {
      company_name: company_name,
      mobile: mobile,
      alt_mobile: alt_mobile,
      phone: phone,
      email: email,

      owner_name: owner_name,
      owner_phone: owner_phone,
      owner_alt_phone: owner_alt_phone,
      owner_email: owner_email,
      owner_dob: owner_dob,
      owner_gender: selectedOwnerGender,
      contact_person_name: contact_person_name,
      contact_person_phone: contact_person_phone,
      contact_person_alt_phone: contact_person_alt_phone,
      contact_person_email: contact_person_email,
      contact_person_dob: contact_person_dob,
      contact_person_gender: selectedContactGender,

      country_id: selectedCountry,
      state_id: selectedState,
      city_id: selectedCity,
      postOffice_id: selectedPostOffice,

      address_1: address_1,
      address_2: address_2,
      zip_code: zip_code,

      is_active: isActive,
      certificates: certificateFileList.map(item => item.uid),
      images: fileList.map(item => item.uid),
      attachments: attachmentFileList.map(item => item.uid),
      ownerImages: ownerFileList.map(item => item.uid),
      contactPersonImages: contactFileList.map(item => item.uid)
    };
    try {
      await AppAxios.put(`/api/v1/cfs/${item.id}`, formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Updated successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/csrm/cf");
          });
        })
        .catch(err => {
          MySwal.fire({
            title: "Error",
            text: err.response.data.message || "Something went wrong",
            icon: "error"
          });
          // console.log(err);
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

      <div>
        <div className="flex justify-content-between mb-10 ">
          <Steps
            size="small"
            current={current}
            items={items}
            direction="horizontal"
          />
        </div>
      </div>

      <div className="mt-3">
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onFinish={onSubmit}
          style={{ maxWidth: "100%" }}
          colon={false}
          method="post"
          encType="multipart/form-data"
          initialValues={{
            company_name: "",
            mobile: "",
            alt_mobile: "",
            phone: "",
            email: "",
            owner_name: "",
            owner_phone: "",
            owner_alt_phone: "",
            owner_email: "",
            owner_dob: null,
            contact_person_name: "",
            contact_person_phone: "",
            contact_person_alt_phone: "",
            contact_person_email: "",
            contact_person_dob: null,
            address_1: "",
            address_2: "",
            zip_code: ""
          }}
        >
          {current === 0 && (
            <>
              <Form.Item
                label="Shop Name"
                style={{
                  marginBottom: 0
                }}
                name="company_name"
                rules={[
                  {
                    required: true,
                    message: "Please input Name!"
                  }
                ]}
              >
                <Input
                  type="text"
                  placeholder="Shop Name"
                  className={`form-control`}
                  name="company_name"
                />
              </Form.Item>

              {/* mobile */}
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
                  }
                  /*  {
                     pattern: new RegExp(/^(01)[0-9]{9}$/),
                     message: "Please enter correct BD Phone number."
                   } */
                ]}
              >
                <Input
                  // addonBefore="+88"
                  type="text"
                  placeholder="mobile"
                  className={`form-control`}
                  name="mobile"
                />
              </Form.Item>

              {/* alt_mobile */}
              <Form.Item
                label="Alt Mobile"
                style={{
                  marginBottom: 0
                }}
                name="alt_mobile"
                /* rules={[
          {
            pattern: new RegExp(/^(01)[0-9]{9}$/),
            message: "Please enter correct BD Phone number."
          }
        ]} */
              >
                <Input
                  // addonBefore="+88"
                  type="text"
                  placeholder="alt_mobile"
                  className={`form-control`}
                  name="alt_mobile"
                />
              </Form.Item>

              {/* phone */}
              <Form.Item
                label="phone"
                style={{
                  marginBottom: 0
                }}
                name="phone"
                /*  rules={[
           {
             required: true,
             message: "Please input your phone!"
           }
         ]} */
              >
                <Input
                  type="text"
                  placeholder="phone"
                  className={`form-control`}
                  name="phone"
                />
              </Form.Item>

              {/* email */}
              <Form.Item
                label="email"
                style={{
                  marginBottom: 0
                }}
                name="email"
                rules={[
                  /*  {
                     required: true,
                     message: "Please input your email!"
                   }, */
                  {
                    type: "email",
                    message: "Please enter a validate email!"
                  }
                ]}
              >
                <Input
                  type="email"
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
                      option?.label
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
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
                      option?.label
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
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
                      option?.label
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
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
                      option?.label
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
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
                /*  rules={[
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
            </>
          )}

          {current === 1 && (
            <>
              {/* owner_name */}
              <Form.Item
                label="owner_name"
                style={{
                  marginBottom: 0
                }}
                name="owner_name"
                /*  rules={[
           {
             required: true,
             message: "Please input your owner_name!"
           }
         ]} */
              >
                <Input
                  type="owner_name"
                  placeholder="owner_name"
                  className={`form-control`}
                  name="owner_name"
                />
              </Form.Item>

              {/* owner_phone */}
              <Form.Item
                label="owner_phone"
                style={{
                  marginBottom: 0
                }}
                name="owner_phone"
                /*  rules={[
           {
             required: true,
             message: "Please input your owner_phone!"
           }
         ]} */
              >
                <Input
                  type="owner_phone"
                  placeholder="owner_phone"
                  className={`form-control`}
                  name="owner_phone"
                />
              </Form.Item>

              {/* owner_alt_phone */}
              <Form.Item
                label="owner_alt_phone"
                style={{
                  marginBottom: 0
                }}
                name="owner_alt_phone"
                /*   rules={[
            {
              required: true,
              message: "Please input your owner_alt_phone!"
            }
          ]} */
              >
                <Input
                  type="owner_alt_phone"
                  placeholder="owner_alt_phone"
                  className={`form-control`}
                  name="owner_alt_phone"
                />
              </Form.Item>
              {/* owner_email */}
              <Form.Item
                label="owner_email"
                style={{
                  marginBottom: 0
                }}
                name="owner_email"
                /*  rules={[
           {
             required: true,
             message: "Please input your owner_email!"
           }
         ]} */
              >
                <Input
                  type="owner_email"
                  placeholder="owner_email"
                  className={`form-control`}
                  name="owner_email"
                />
              </Form.Item>

              {/* owner gender */}
              <Form.Item
                label="Owner Gender"
                style={{
                  marginBottom: 0
                }}
                name="owner_gender"
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleOwnerGenderChange}
                    options={gendersOptions}
                    value={selectedOwnerGender}
                  />
                </Space>
              </Form.Item>

              {/* owner dob */}
              <Form.Item
                label="Owner DOB"
                name="owner_dob"
                /*  style={{
               minWidth: 180,
               margin: "20px",
               display: "flex",
               justifyContent: "center",
               alignItems: "center"
             }} */
              >
                <DatePicker
                  style={{
                    width: "100%"
                  }}
                  // defaultValue={dayjs(selectOwnerDob, dateFormat)}
                  onChange={onOwnerDateChange}
                  value={selectOwnerDob}
                  format={dateFormat}
                  allowClear
                />
              </Form.Item>

              {/* OwnerImage */}
              <Form.Item
                label="Owner Image"
                style={{
                  marginBottom: 0
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Upload
                    customRequest={handleOwnerImageUpload}
                    listType="picture-card"
                    fileList={ownerFileList}
                    onPreview={handleOwnerImagePreview}
                    onChange={handleOwnerChange}
                    defaultFileList={ownerFileList}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {ownerFileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  {ownerFileProgress > 0 ? (
                    <Progress percent={ownerFileProgress} />
                  ) : null}

                  <Modal
                    open={previewOwnerOpen}
                    title={previewOwnerTitle}
                    footer={null}
                    onCancel={handleOwnerCancel}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewOwnerImage}
                    />
                  </Modal>
                </Space>
              </Form.Item>
            </>
          )}

          {current === 2 && (
            <>
              {/* contact_person_name */}
              <Form.Item
                label="contact_person_name"
                style={{
                  marginBottom: 0
                }}
                name="contact_person_name"
                /*  rules={[
           {
             required: true,
             message: "Please input your contact_person_name!"
           }
         ]} */
              >
                <Input
                  type="contact_person_name"
                  placeholder="contact_person_name"
                  className={`form-control`}
                  name="contact_person_name"
                />
              </Form.Item>

              {/* contact_person_alt_phone */}
              <Form.Item
                label="contact_person_alt_phone"
                style={{
                  marginBottom: 0
                }}
                name="contact_person_alt_phone"
                /*  rules={[
           {
             required: true,
             message: "Please input your contact_person_alt_phone!"
           }
         ]} */
              >
                <Input
                  type="contact_person_alt_phone"
                  placeholder="contact_person_alt_phone"
                  className={`form-control`}
                  name="contact_person_alt_phone"
                />
              </Form.Item>

              {/* contact_person_email */}
              <Form.Item
                label="contact_person_email"
                style={{
                  marginBottom: 0
                }}
                name="contact_person_email"
                /* rules={[
          {
            required: true,
            message: "Please input your contact_person_email!"
          }
        ]} */
              >
                <Input
                  type="contact_person_email"
                  placeholder="contact_person_email"
                  className={`form-control`}
                  name="contact_person_email"
                />
              </Form.Item>

              {/* contact_person gender */}
              <Form.Item
                label="Contact Person Gender"
                style={{
                  marginBottom: 0
                }}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleContactPersonGenderChange}
                    options={gendersOptions}
                    value={selectedContactGender}
                  />
                </Space>
              </Form.Item>

              {/* contact_person_dob */}
              <Form.Item
                label="Contact Person DOB"
                name="contact_person_dob"
                /*  style={{
               minWidth: 180,
               margin: "20px",
               display: "flex",
               justifyContent: "center",
               alignItems: "center"
             }} */
              >
                <DatePicker
                  style={{
                    width: "100%"
                  }}
                  // defaultValue={dayjs(selectContactDob, dateFormat)}
                  onChange={onContactDateChange}
                  value={selectContactDob}
                  format={dateFormat}
                />
              </Form.Item>

              {/* Contact Person Image */}
              <Form.Item
                label="Contact Person Image"
                style={{
                  marginBottom: 0
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Upload
                    customRequest={handleContactImageUpload}
                    listType="picture-card"
                    fileList={contactFileList}
                    onPreview={handleContactImagePreview}
                    onChange={handleContactChange}
                    defaultFileList={contactFileList}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {contactFileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  {contactFileProgress > 0 ? (
                    <Progress percent={contactFileProgress} />
                  ) : null}

                  <Modal
                    open={previewContactOpen}
                    title={previewContactTitle}
                    footer={null}
                    onCancel={handleContactCancel}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewContactImage}
                    />
                  </Modal>
                </Space>
              </Form.Item>
            </>
          )}

          {current === 3 && (
            <>
              {/* Business Card image */}
              <Form.Item
                label="Business Card Image"
                style={{
                  marginBottom: 0
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
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
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* certificates image */}
              <Form.Item
                label="Certificates Image"
                style={{
                  marginBottom: 0
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Upload
                    customRequest={handleCertificateImageUpload}
                    listType="picture-card"
                    fileList={certificateFileList}
                    onPreview={handleCertificateImagePreview}
                    onChange={handleCertificateImageChange}
                    defaultFileList={certificateFileList}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {certificateFileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  {certificateProgress > 0 ? (
                    <Progress percent={certificateProgress} />
                  ) : null}

                  <Modal
                    open={certificatePreviewOpen}
                    title={certificatePreviewTitle}
                    footer={null}
                    onCancel={handleCertificateCancel}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={certificatePreviewImage}
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
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
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
            </>
          )}

          <Form.Item style={{ margin: "0 8px" }}>
            <div style={{ marginTop: 24 }}>
              {current > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Previous
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditCFForm;
