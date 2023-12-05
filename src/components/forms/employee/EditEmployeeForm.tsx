/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Steps,
  Upload
} from "antd";
import AppAxios from "@/services/AppAxios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
import type { EmployeeModel } from "@/interfaces/EmployeeModel";

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
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alt_phone: string;
  gender: string;
  blood_group: string;
  dob: any;
  date_of_joining: any;
  date_of_leaving: any;
  religion: string;
  nid_number: string;
  passport_number: string;
  account_number: string;
  bank_name: string;
  bank_branch: string;
  branch_routing_number: string;
  tin_number: string;
  employment_type_id: string;
  department_id: string;
  position_id: string;
  gross_salary: string;
  vat: string;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  post_office_id: number | null;
  address_1: string;
  address_2: string;
  zip_code: string;
}

interface EducationField {
  id: any;
  institute_name: string;
  degree: string;
  passing_year: string;
  result: string;
  duration: string;
}

const steps = [
  {
    title: "Basic",
    content: "basic"
  },
  {
    title: "Employment",
    content: "employment"
  },
  {
    title: "Address",
    content: "address"
  },
  {
    title: "Education",
    content: "education"
  },

  {
    title: "Documents",
    content: "documents"
  }
];

const genders = [
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

const religionOptions = [
  {
    label: "Islam",
    value: "Islam"
  },
  {
    label: "Hindu",
    value: "Hindu"
  },
  {
    label: "Christian",
    value: "Christian"
  },
  {
    label: "Buddhist",
    value: "Buddhist"
  },
  {
    label: "Others",
    value: "Others"
  }
];
interface PropData {
  item: EmployeeModel;
}

const EditEmployeeForm = ({ item }: PropData) => {
  // ** States
  const [form] = Form.useForm();

  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [selectedGender, setSelectedGender] = useState<any>(null);

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<any>(null);

  const [selectedReligion, setSelectedReligion] = useState<any>(null);

  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  const [employmentTypes, setEmploymentTypes] = useState<any[]>([]);
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<any>(null);

  const [employmentPositions, setEmploymentPositions] = useState<any[]>([]);
  const [selectedEmploymentPosition, setSelectedEmploymentPosition] =
    useState<any>(null);

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

  const [selectedDateOfBirth, setSelectedDateOfBirth] = useState<any>(null);
  const [selectedDateOfJoining, setSelectedDateOfJoining] = useState<any>(null);
  const [selectedDateOfLeaving, setSelectedDateOfLeaving] = useState<any>(null);

  const [formValues, setFormValues] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    alt_phone: "",
    gender: "",
    blood_group: "",
    dob: null,
    religion: "",
    nid_number: "",
    passport_number: "",
    date_of_joining: null,
    date_of_leaving: null,
    account_number: "",
    bank_name: "",
    bank_branch: "",
    branch_routing_number: "",
    tin_number: "",
    employment_type_id: "",
    department_id: "",
    position_id: "",
    gross_salary: "",
    vat: "",
    country_id: null,
    state_id: null,
    city_id: null,
    post_office_id: null,
    address_1: "",
    address_2: "",
    zip_code: ""
  });

  const [isActive, setIsActive] = useState(false);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  // image list

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [progress, setProgress] = useState(0);
  const handleCancel = () => setPreviewOpen(false);

  // nid image list

  const [previewOpenNid, setPreviewOpenNid] = useState(false);
  const [previewImageNid, setPreviewImageNid] = useState("");
  const [previewTitleNid, setPreviewTitleNid] = useState("");
  const [fileListNid, setFileListNid] = useState<UploadFile[]>([]);

  const [progressNid, setProgressNid] = useState(0);
  const handleCancelNid = () => setPreviewOpenNid(false);

  // Guardian NID
  const [previewOpenGuardianNid, setPreviewOpenGuardianNid] = useState(false);
  const [previewImageGuardianNid, setPreviewImageGuardianNid] = useState("");
  const [previewTitleGuardianNid, setPreviewTitleGuardianNid] = useState("");
  const [fileListGuardianNid, setFileListGuardianNid] = useState<UploadFile[]>(
    []
  );

  const [progressGuardianNid, setProgressGuardianNid] = useState(0);
  const handleCancelGuardianNid = () => setPreviewOpenGuardianNid(false);

  // Utility Bill

  const [previewOpenUtilityBill, setPreviewOpenUtilityBill] = useState(false);
  const [previewImageUtilityBill, setPreviewImageUtilityBill] = useState("");
  const [previewTitleUtilityBill, setPreviewTitleUtilityBill] = useState("");
  const [fileListUtilityBill, setFileListUtilityBill] = useState<UploadFile[]>(
    []
  );

  const [progressUtilityBill, setProgressUtilityBill] = useState(0);
  const handleCancelUtilityBill = () => setPreviewOpenUtilityBill(false);

  // Chairmain / Commissioner certificate

  const [
    previewOpenChairmanCommissionerCertificate,
    setPreviewOpenChairmanCommissionerCertificate
  ] = useState(false);

  const [
    previewImageChairmanCommissionerCertificate,
    setPreviewImageChairmanCommissionerCertificate
  ] = useState("");

  const [
    previewTitleChairmanCommissionerCertificate,
    setPreviewTitleChairmanCommissionerCertificate
  ] = useState("");

  const [
    fileListChairmanCommissionerCertificate,
    setFileListChairmanCommissionerCertificate
  ] = useState<UploadFile[]>([]);

  const [
    progressChairmanCommissionerCertificate,
    setProgressChairmanCommissionerCertificate
  ] = useState(0);

  const handleCancelChairmanCommissionerCertificate = () =>
    setPreviewOpenChairmanCommissionerCertificate(false);

  // Passport

  const [previewOpenPassport, setPreviewOpenPassport] = useState(false);
  const [previewImagePassport, setPreviewImagePassport] = useState("");
  const [previewTitlePassport, setPreviewTitlePassport] = useState("");
  const [fileListPassport, setFileListPassport] = useState<UploadFile[]>([]);

  const [progressPassport, setProgressPassport] = useState(0);
  const handleCancelPassport = () => setPreviewOpenPassport(false);

  // Academic Certificates

  const [previewOpenAcademicCertificates, setPreviewOpenAcademicCertificates] =
    useState(false);

  const [
    previewImageAcademicCertificates,
    setPreviewImageAcademicCertificates
  ] = useState("");

  const [
    previewTitleAcademicCertificates,
    setPreviewTitleAcademicCertificates
  ] = useState("");

  const [fileListAcademicCertificates, setFileListAcademicCertificates] =
    useState<UploadFile[]>([]);

  const [progressAcademicCertificates, setProgressAcademicCertificates] =
    useState(0);

  const handleCancelAcademicCertificates = () =>
    setPreviewOpenAcademicCertificates(false);

  // Experience Certificates

  const [
    previewOpenExperienceCertificates,
    setPreviewOpenExperienceCertificates
  ] = useState(false);

  const [
    previewImageExperienceCertificates,
    setPreviewImageExperienceCertificates
  ] = useState("");

  const [
    previewTitleExperienceCertificates,
    setPreviewTitleExperienceCertificates
  ] = useState("");

  const [fileListExperienceCertificates, setFileListExperienceCertificates] =
    useState<UploadFile[]>([]);

  const [progressExperienceCertificates, setProgressExperienceCertificates] =
    useState(0);

  const handleCancelExperienceCertificates = () =>
    setPreviewOpenExperienceCertificates(false);

  const [educations, setEducations] = useState<EducationField[]>([
    {
      id: null,
      institute_name: "",
      degree: "",
      passing_year: "",
      result: "",
      duration: ""
    }
  ]);

  const addField = () => {
    const updatedEducations = [...educations];
    updatedEducations.push({
      id: "",
      institute_name: "",
      degree: "",
      passing_year: "",
      result: "",
      duration: ""
    });
    setEducations(updatedEducations);
  };

  const removeField = (index: number) => {
    const updatedEducations = [...educations];
    updatedEducations.splice(index, 1);
    setEducations(updatedEducations);
  };

  const handleFieldChange = (
    index: number,
    property: keyof EducationField,
    value: string
  ) => {
    const updatedEducations = [...educations];
    updatedEducations[index][property] = value;
    setEducations(updatedEducations);
  };

  // steps
  const [current, setCurrent] = useState(0);

  const next = async () => {
    try {
      const validate = await form.validateFields([
        "first_name",
        "last_name",
        // "email",
        "phone",
        "gender"
      ]);

      if (current === 0) {
        setFormValues({
          ...formValues,
          first_name: form.getFieldValue("first_name"),
          last_name: form.getFieldValue("last_name"),
          email: form.getFieldValue("email"),
          phone: form.getFieldValue("phone"),
          alt_phone: form.getFieldValue("alt_phone"),
          gender: selectedGender,
          blood_group: selectedBloodGroup,
          dob: form.getFieldValue("dob"),
          religion: selectedReligion,
          nid_number: form.getFieldValue("nid_number"),
          passport_number: form.getFieldValue("passport_number")
        });
      } else if (current === 1) {
        setFormValues({
          ...formValues,
          date_of_joining: form.getFieldValue("date_of_joining"),
          date_of_leaving: form.getFieldValue("date_of_leaving"),
          account_number: form.getFieldValue("account_number"),
          bank_name: form.getFieldValue("bank_name"),
          bank_branch: form.getFieldValue("bank_branch"),
          branch_routing_number: form.getFieldValue("branch_routing_number"),
          tin_number: form.getFieldValue("tin_number"),
          gross_salary: form.getFieldValue("gross_salary"),
          vat: form.getFieldValue("vat"),
          employment_type_id: selectedEmploymentType,
          department_id: selectedDepartment,
          position_id: selectedEmploymentPosition
        });
      } else if (current === 2) {
        setFormValues({
          ...formValues,
          country_id: selectedCountry,
          state_id: selectedState,
          city_id: selectedCity,
          post_office_id: selectedPostOffice,
          address_1: form.getFieldValue("address_1"),
          address_2: form.getFieldValue("address_2"),
          zip_code: form.getFieldValue("zip_code")
        });
      } else if (current === 3) {
        // check if any field is empty
        const emptyFields = educations.filter(row => {
          return (
            row.id == null ||
            row.institute_name === "" ||
            row.degree === "" ||
            row.passing_year === "" ||
            row.result === "" ||
            row.duration === ""
          );
        });

        if (emptyFields.length > 0) {
          MySwal.fire({
            title: "Error",
            text: "Please fill all Education fields",
            icon: "error"
          });
          return;
        }
      }

      setCurrent(current + 1);
    } catch {
      console.log("error");
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map(item => ({ key: item.title, title: item.title }));

  // image upload handler
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
        "/api/v1/images/single/employee",
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
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadNid
  const handleImageUploadNid = async (options: any) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressNid(percent);
              if (percent === 100) {
                setTimeout(() => setProgressNid(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        fileListNid.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadGuardianNid
  const handleImageUploadGuardianNid = async (options: any) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressGuardianNid(percent);
              if (percent === 100) {
                setTimeout(() => setProgressGuardianNid(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        fileListGuardianNid.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadUtilityBill

  const handleImageUploadUtilityBill = async (options: any) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressUtilityBill(percent);
              if (percent === 100) {
                setTimeout(() => setProgressUtilityBill(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );

      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        fileListUtilityBill.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadChairmanCommissionerCertificate
  const handleImageUploadChairmanCommissionerCertificate = async (
    options: any
  ) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressChairmanCommissionerCertificate(percent);
              if (percent === 100) {
                setTimeout(
                  () => setProgressChairmanCommissionerCertificate(0),
                  1000
                );
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );

      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        fileListChairmanCommissionerCertificate.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadPassport
  const handleImageUploadPassport = async (options: any) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressPassport(percent);
              if (percent === 100) {
                setTimeout(() => setProgressPassport(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );

      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files
        fileListPassport.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadAcademicCertificates
  const handleImageUploadAcademicCertificates = async (options: any) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressAcademicCertificates(percent);
              if (percent === 100) {
                setTimeout(() => setProgressAcademicCertificates(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );

      console.log("Data: ", data);

      if (data.success) {
        onSuccess("Ok");
        //  add new file to the list of files
        fileListAcademicCertificates.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        console.log("Error: ", data.message);

        onError({ err: data.message });
      }
    } catch (err) {
      console.log("Error: ", err);
      onError({ err });
    }
  };

  // handleImageUploadExperienceCertificates

  const handleImageUploadExperienceCertificates = async (options: any) => {
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
        "/api/v1/images/single/employee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgressExperienceCertificates(percent);
              if (percent === 100) {
                setTimeout(() => setProgressExperienceCertificates(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );

      if (data.success) {
        onSuccess("Ok");

        //  add new file to the list of files

        fileListExperienceCertificates.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      } else {
        onError({ err: data.message });
      }
    } catch (err) {
      // console.log("Error: ", err);
      onError({ err });
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

  // handle image preview nid
  const handlePreviewNid = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImageNid(file.url ?? (file.preview as string));
    setPreviewOpenNid(true);
    if (file.name) {
      setPreviewTitleNid(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitleNid(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitleNid("Image");
    }
  };

  //
  // handle image preview Guardian NID

  const handlePreviewGuardianNid = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImageGuardianNid(file.url ?? (file.preview as string));

    setPreviewOpenGuardianNid(true);

    if (file.name) {
      setPreviewTitleGuardianNid(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitleGuardianNid(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitleGuardianNid("Image");
    }
  };

  // handle image preview Utility Bill

  const handlePreviewUtilityBill = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImageUtilityBill(file.url ?? (file.preview as string));

    setPreviewOpenUtilityBill(true);

    if (file.name) {
      setPreviewTitleUtilityBill(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitleUtilityBill(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitleUtilityBill("Image");
    }
  };

  // handle image preview Chairman / Commissioner Certificate

  const handlePreviewChairmanCommissionerCertificate = async (
    file: UploadFile
  ) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImageChairmanCommissionerCertificate(
      file.url ?? (file.preview as string)
    );

    setPreviewOpenChairmanCommissionerCertificate(true);

    if (file.name) {
      setPreviewTitleChairmanCommissionerCertificate(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitleChairmanCommissionerCertificate(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitleChairmanCommissionerCertificate("Image");
    }
  };

  // handle image preview Passport

  const handlePreviewPassport = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImagePassport(file.url ?? (file.preview as string));

    setPreviewOpenPassport(true);

    if (file.name) {
      setPreviewTitlePassport(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitlePassport(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitlePassport("Image");
    }
  };

  // handle image preview Academic Certificates

  const handlePreviewAcademicCertificates = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImageAcademicCertificates(file.url ?? (file.preview as string));

    setPreviewOpenAcademicCertificates(true);

    if (file.name) {
      setPreviewTitleAcademicCertificates(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitleAcademicCertificates(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitleAcademicCertificates("Image");
    }
  };

  // handle image preview Experience Certificates

  const handlePreviewExperienceCertificates = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImageExperienceCertificates(file.url ?? (file.preview as string));

    setPreviewOpenExperienceCertificates(true);

    if (file.name) {
      setPreviewTitleExperienceCertificates(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitleExperienceCertificates(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined

      setPreviewTitleExperienceCertificates("Image");
    }
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

  // nid image change handler
  const handleChangeNid: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileListNid(filteredList);
  };

  // Guardian NID image change handler

  const handleChangeGuardianNid: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileListGuardianNid(filteredList);
  };

  // Utility Bill image change handler

  const handleChangeUtilityBill: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileListUtilityBill(filteredList);
  };

  // Chairman / Commissioner Certificate image change handler
  const handleChangeChairmanCommissionerCertificate: UploadProps["onChange"] =
    ({ fileList: newFileList }) => {
      // only remove the files that are not uploaded
      const filteredList = newFileList.filter(
        file =>
          file.status !== "removed" &&
          file.status !== "error" &&
          file.status !== "uploading"
      ) as UploadFile[];

      setFileListChairmanCommissionerCertificate(filteredList);
    };

  // Passport image change handler

  const handleChangePassport: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileListPassport(filteredList);
  };

  // Academic Certificates image change handler

  const handleChangeAcademicCertificates: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileListAcademicCertificates(filteredList);
  };

  // Experience Certificates image change handler

  const handleChangeExperienceCertificates: UploadProps["onChange"] = ({
    fileList: newFileList
  }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileListExperienceCertificates(filteredList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleActive = (e: any) => {
    setIsActive(e.target.checked ? true : false);
  };

  const handleGenderChange = (value: any) => {
    form.setFieldsValue({
      gender: value
    });
    setSelectedGender(value);
  };

  const handleBloodGroupChange = (value: any) => {
    form.setFieldsValue({
      blood_group: value
    });
    setSelectedBloodGroup(value);
  };

  const handleReligionChange = (value: any) => {
    form.setFieldsValue({
      religion: value
    });

    setSelectedReligion(value);
  };

  const handleDepartmentChange = (value: any) => {
    form.setFieldsValue({
      department: value
    });

    setSelectedDepartment(value);
  };

  const handleEmploymentTypeChange = (value: any) => {
    form.setFieldsValue({
      employment_type: value
    });

    setSelectedEmploymentType(value);
  };

  const handleEmploymentPositionChange = (value: any) => {
    form.setFieldsValue({
      employment_position: value
    });

    setSelectedEmploymentPosition(value);
  };

  const handleDateOfBirthChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    if (dateString !== "") {
      const newDate = dayjs(dateString);
      setSelectedDateOfBirth(newDate);
      form.setFieldsValue({ dob: newDate });

      setFormValues({
        ...formValues,
        dob: newDate
      });
    } else {
      setFormValues({
        ...formValues,
        dob: null
      });

      setSelectedDateOfBirth(null);
      form.setFieldsValue({ dob: null });
    }
  };

  const handleJoiningDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    if (dateString !== "") {
      const newDate = dayjs(dateString);
      setSelectedDateOfJoining(newDate);
      form.setFieldsValue({ date_of_joining: newDate });

      setFormValues({
        ...formValues,
        date_of_joining: newDate
      });
    } else {
      setFormValues({
        ...formValues,
        date_of_joining: null
      });

      setSelectedDateOfJoining("");
      form.setFieldsValue({ date_of_joining: "" });
    }
  };

  const handleLeavingDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    if (dateString !== "") {
      const newDate = dayjs(dateString);
      setSelectedDateOfLeaving(newDate);
      form.setFieldsValue({ date_of_leaving: newDate });

      setFormValues({
        ...formValues,
        date_of_leaving: newDate
      });
    } else {
      setFormValues({
        ...formValues,
        date_of_leaving: null
      });

      setSelectedDateOfLeaving("");
      form.setFieldsValue({ date_of_leaving: "" });
    }
  };

  const getDepartments = async () => {
    const res = await AppAxios.get("/api/v1/common/all-departments");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setDepartments(items);
      }
    }
  };

  const getEmploymentTypes = async () => {
    const res = await AppAxios.get("/api/v1/common/all-employment-types");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setEmploymentTypes(items);
      }
    }
  };

  const getEmploymentPositions = async () => {
    const res = await AppAxios.get("/api/v1/common/all-positions");

    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setEmploymentPositions(items);
      }
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
    getDepartments();
    getEmploymentTypes();
    getEmploymentPositions();
  }, []);

  useEffect(() => {
    if (item) {
      setFormValues({
        ...formValues,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone: item.phone,
        alt_phone: item.alt_phone,
        gender: item.gender,
        blood_group: item.blood_group,
        dob: item.dob ? dayjs(item.dob).format("YYYY-MM-DD") : null,
        date_of_joining: item.date_of_joining
          ? dayjs(item.date_of_joining).format("YYYY-MM-DD")
          : null,
        date_of_leaving: item.date_of_leaving
          ? dayjs(item.date_of_leaving).format("YYYY-MM-DD")
          : null,
        religion: item.religion,
        nid_number: item.nid_number,
        passport_number: item.passport_number,
        account_number: item.account_number,
        bank_name: item.bank_name,
        bank_branch: item.bank_branch,
        branch_routing_number: item.branch_routing_number,
        tin_number: item.tin_number,
        gross_salary: item.gross_salary,
        vat: item.vat
      });

      form.setFieldsValue({
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone: item.phone,
        alt_phone: item.alt_phone,
        gender: item.gender,
        blood_group: item.blood_group,
        dob: item.dob ? dayjs(item.dob) : null,
        date_of_joining: item.date_of_joining
          ? dayjs(item.date_of_joining)
          : null,
        date_of_leaving: item.date_of_leaving
          ? dayjs(item.date_of_leaving)
          : null,
        religion: item.religion,
        nid_number: item.nid_number,
        passport_number: item.passport_number,
        account_number: item.account_number,
        bank_name: item.bank_name,
        bank_branch: item.bank_branch,
        branch_routing_number: item.branch_routing_number,
        tin_number: item.tin_number,
        gross_salary: item.gross_salary,
        vat: item.vat
      });

      if (item.date_of_joining) {
        setSelectedDateOfJoining(dayjs(item.date_of_joining));
      }

      if (item.date_of_leaving) {
        setSelectedDateOfLeaving(dayjs(item.date_of_leaving));
      }

      if (item.dob) {
        setSelectedDateOfBirth(dayjs(item.dob));
      }
      setIsActive(item.base.is_active);
      setSelectedGender(item.gender);
      setSelectedBloodGroup(item.blood_group);
      setSelectedReligion(item.religion);

      if (item.department) {
        setSelectedDepartment(item.department.id);
      }

      if (item.employmentType) {
        setSelectedEmploymentType(item.employmentType.id);
      }

      if (item.position) {
        setSelectedEmploymentPosition(item.position.id);
      }

      if (item.employeeAddresses.length > 0) {
        if (item.employeeAddresses[0].address.country) {
          setSelectedCountry(item.employeeAddresses[0].address.country.id);
          getStates(item.employeeAddresses[0].address.country.id);
        }
        if (item.employeeAddresses[0].address.state) {
          setSelectedState(item.employeeAddresses[0].address.state.id);
          getCities(item.employeeAddresses[0].address.state.id);
        }

        if (item.employeeAddresses[0].address.city) {
          setSelectedCity(item.employeeAddresses[0].address.city.id);
          getPostOffices(item.employeeAddresses[0].address.city.id);
        }

        if (item.employeeAddresses[0].address.postOffice) {
          setSelectedPostOffice(
            item.employeeAddresses[0].address.postOffice.id
          );
        }

        form.setFieldsValue({
          address_1: item.employeeAddresses[0].address.address_1,
          address_2: item.employeeAddresses[0].address.address_2,
          zip_code: item.employeeAddresses[0].address.zip_code
        });

        setFormValues({
          ...formValues,
          address_1: item.employeeAddresses[0].address.address_1,
          address_2: item.employeeAddresses[0].address.address_2,
          zip_code: item.employeeAddresses[0].address.zip_code
        });
      }

      const files = item.employeeImages.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.first_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setFileList(files);

      const filesNid = item.employeeNids.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.first_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });
      setFileListNid(filesNid);

      const filesGuardianNid = item.employeeGuardianNids.map(
        (imageFile: any) => {
          const { image } = imageFile;
          return {
            uid: image.id,
            name: item.first_name,
            status: "done" as UploadFileStatus,
            url: image.path
          };
        }
      );

      setFileListGuardianNid(filesGuardianNid);

      const filesUtilityBill = item.employeeUtilityBills.map(
        (imageFile: any) => {
          const { image } = imageFile;
          return {
            uid: image.id,
            name: item.first_name,
            status: "done" as UploadFileStatus,
            url: image.path
          };
        }
      );

      setFileListUtilityBill(filesUtilityBill);

      const filesChairmanCommissionerCertificate =
        item.employeeCommissionerCertificates.map((imageFile: any) => {
          const { image } = imageFile;
          return {
            uid: image.id,
            name: item.first_name,
            status: "done" as UploadFileStatus,
            url: image.path
          };
        });

      setFileListChairmanCommissionerCertificate(
        filesChairmanCommissionerCertificate
      );

      const filesPassport = item.employeePassports.map((imageFile: any) => {
        const { image } = imageFile;
        return {
          uid: image.id,
          name: item.first_name,
          status: "done" as UploadFileStatus,
          url: image.path
        };
      });

      setFileListPassport(filesPassport);

      const filesAcademicCertificates = item.employeeAcademicCertificates.map(
        (imageFile: any) => {
          const { image } = imageFile;
          return {
            uid: image.id,
            name: item.first_name,
            status: "done" as UploadFileStatus,
            url: image.path
          };
        }
      );

      setFileListAcademicCertificates(filesAcademicCertificates);

      const filesExperienceCertificates =
        item.employeeExperienceCertificates.map((imageFile: any) => {
          const { image } = imageFile;
          return {
            uid: image.id,
            name: item.first_name,
            status: "done" as UploadFileStatus,
            url: image.path
          };
        });

      setFileListExperienceCertificates(filesExperienceCertificates);

      const educations = item.employeeEducations.map((education: any) => {
        return {
          id: education.id,
          institute_name: education.institute_name,
          degree: education.degree,
          passing_year: education.passing_year,
          duration: education.duration,
          result: education.result,
          board: education.board,
          description: education.description
        };
      });

      setEducations(educations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const formatDate = (date: any) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
    return null;
  };

  const onSubmit = async () => {
    const {
      first_name,
      last_name,
      email,
      phone,
      alt_phone,
      gender,
      blood_group,
      dob,
      date_of_joining,
      date_of_leaving,
      religion,
      nid_number,
      passport_number,
      account_number,
      bank_name,
      bank_branch,
      branch_routing_number,
      tin_number,

      gross_salary,
      vat,

      address_1,
      address_2,
      zip_code
    } = formValues;

    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      alt_phone: alt_phone,
      gender: gender,
      blood_group: blood_group,
      dob: formatDate(dob),
      date_of_joining: formatDate(date_of_joining),
      date_of_leaving: formatDate(date_of_leaving),
      religion: religion,
      nid_number: nid_number,
      passport_number: passport_number,
      account_number: account_number,
      bank_name: bank_name,
      bank_branch: bank_branch,
      branch_routing_number: branch_routing_number,
      tin_number: tin_number,
      employment_type_id: selectedEmploymentType,
      department_id: selectedDepartment,
      position_id: selectedEmploymentPosition,
      is_active: isActive,

      gross_salary: gross_salary,
      vat: vat,

      country_id: selectedCountry,
      state_id: selectedState,
      city_id: selectedCity,
      postOffice_id: selectedPostOffice,

      address_1: address_1,
      address_2: address_2,
      zip_code: zip_code,

      images: fileList.map(item => item.uid),
      nid_images: fileListNid.map(item => item.uid),
      guardian_nid_images: fileListGuardianNid.map(item => item.uid),
      utility_bill_images: fileListUtilityBill.map(item => item.uid),
      commissioner_certificate_images:
        fileListChairmanCommissionerCertificate.map(item => item.uid),
      passport_images: fileListPassport.map(item => item.uid),
      academic_certificate_images: fileListAcademicCertificates.map(
        item => item.uid
      ),
      experience_certificate_images: fileListExperienceCertificates.map(
        item => item.uid
      ),

      employee_educations: educations
    };

    try {
      await AppAxios.put(`/api/v1/employees/${item.id}`, data)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Updated successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/hr/employee");
          });
        })
        .catch(err => {
          // console.log(err);

          MySwal.fire({
            title: "Error",
            text: err.response.data.message || "Error occurred",
            icon: "error"
          });

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
          form={form}
          autoComplete="off"
          onFinish={onSubmit}
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            alt_phone: "",
            gender: "",
            blood_group: "",
            dob: "",
            date_of_joining: "",
            date_of_leaving: "",
            religion: "",
            nid_number: "",
            passport_number: "",
            account_number: "",
            bank_name: "",
            bank_branch: "",
            branch_routing_number: "",
            tin_number: "",
            employment_type_id: "",
            department_id: "",
            position_id: ""
          }}
          style={{ maxWidth: "100%" }}
          name="wrap"
          layout="vertical"
          colon={false}
          method="post"
          encType="multipart/form-data"
        >
          {current === 0 && (
            <>
              {/* first name */}
              <Form.Item
                label="First Name"
                style={{
                  marginBottom: 0
                }}
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name!"
                  }
                ]}
              >
                <Input
                  type="text"
                  placeholder="First Name"
                  className={`form-control`}
                  name="first_name"
                />
              </Form.Item>

              {/* last name */}
              <Form.Item
                label="Last Name"
                style={{
                  marginBottom: 0
                }}
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Last Name!"
                  }
                ]}
              >
                <Input
                  type="text"
                  placeholder="Last Name"
                  className={`form-control`}
                  name="last_name"
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
                  /*   {
                      required: true,
                      message: "Please input your Email!"
                    }, */
                  {
                    type: "email",
                    message: "Please input valid Email!"
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

              {/* phone */}
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
                  }
                ]}
              >
                <Input
                  addonBefore="+88"
                  type="text"
                  placeholder="Phone"
                  className={`form-control`}
                  name="phone"
                />
              </Form.Item>

              {/* Alternative Phone */}
              <Form.Item
                label="Alternative Phone"
                style={{
                  marginBottom: 0
                }}
                name="alt_phone"
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
                  placeholder="Alternative Phone"
                  className={`form-control`}
                  name="alt_phone"
                />
              </Form.Item>

              {/* gender */}
              <Form.Item
                label="Gender"
                style={{
                  marginBottom: 0
                }}
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Gender is required"
                  }
                ]}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleGenderChange}
                    options={genders}
                    value={selectedGender}
                  />
                </Space>
              </Form.Item>

              {/* date of birth */}
              <Form.Item
                label="Date of Birth"
                style={{
                  marginBottom: 0
                }}
                name="dob"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  className={`form-control`}
                  name="dob"
                  placeholder="Date of Birth"
                  value={selectedDateOfBirth}
                  format={"YYYY-MM-DD"}
                  allowClear
                  onChange={handleDateOfBirthChange}
                />
              </Form.Item>

              {/* blood group */}

              <Form.Item
                label="Blood Group"
                style={{
                  marginBottom: 0
                }}
                name="blood_group"
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

              {/* religion */}
              <Form.Item
                label="Religion"
                style={{
                  marginBottom: 0
                }}
                name="religion"
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleReligionChange}
                    options={religionOptions}
                    value={selectedReligion}
                  />
                </Space>
              </Form.Item>

              {/* Nid */}
              <Form.Item
                label="Nid Number"
                style={{
                  marginBottom: 0
                }}
                name="nid_number"
              >
                <Input
                  type="text"
                  placeholder="Nid"
                  className={`form-control`}
                  name="nid_number"
                />
              </Form.Item>

              {/* passport */}
              <Form.Item
                label="Passport Number"
                style={{
                  marginBottom: 0
                }}
                name="passport_number"
              >
                <Input
                  type="text"
                  placeholder="Passport"
                  className={`form-control`}
                  name="passport_number"
                />
              </Form.Item>
            </>
          )}

          {current === 1 && (
            <>
              {/* date_of_joining */}
              <Form.Item
                label="Date of Joining"
                style={{
                  marginBottom: 0
                }}
                name="date_of_joining"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  className={`form-control`}
                  name="date_of_joining"
                  placeholder="Date of Joining"
                  value={selectedDateOfJoining}
                  format={"YYYY-MM-DD"}
                  allowClear
                  onChange={handleJoiningDateChange}
                />
              </Form.Item>

              {/* date_of_leaving */}
              <Form.Item
                label="date of leaving"
                style={{
                  marginBottom: 0
                }}
                name="date_of_leaving"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  className={`form-control`}
                  name="date_of_leaving"
                  placeholder="date of leaving"
                  value={selectedDateOfLeaving}
                  format={"YYYY-MM-DD"}
                  allowClear
                  onChange={handleLeavingDateChange}
                />
              </Form.Item>

              {/* account number */}
              <Form.Item
                label="Account Number"
                style={{
                  marginBottom: 0
                }}
                name="account_number"
              >
                <Input
                  type="text"
                  placeholder="Account Number"
                  className={`form-control`}
                  name="account_number"
                />
              </Form.Item>

              {/* bank name */}
              <Form.Item
                label="Bank Name"
                style={{
                  marginBottom: 0
                }}
                name="bank_name"
              >
                <Input
                  type="text"
                  placeholder="Bank Name"
                  className={`form-control`}
                  name="bank_name"
                />
              </Form.Item>

              {/* bank branch */}
              <Form.Item
                label="Bank Branch"
                style={{
                  marginBottom: 0
                }}
                name="bank_branch"
              >
                <Input
                  type="text"
                  placeholder="Bank Branch"
                  className={`form-control`}
                  name="bank_branch"
                />
              </Form.Item>

              {/* branch routing number */}
              <Form.Item
                label="Branch Routing Number"
                style={{
                  marginBottom: 0
                }}
                name="branch_routing_number"
              >
                <Input
                  type="text"
                  placeholder="Branch Routing Number"
                  className={`form-control`}
                  name="branch_routing_number"
                />
              </Form.Item>

              {/* TIN No */}
              <Form.Item
                label="TIN No"
                style={{
                  marginBottom: 0
                }}
                name="tin_number"
              >
                <Input
                  type="text"
                  placeholder="TIN No"
                  className={`form-control`}
                  name="tin_number"
                />
              </Form.Item>

              {/* Salary */}
              <Form.Item
                label="Gross Salary"
                style={{
                  marginBottom: 0
                }}
                name="gross_salary"
              >
                <Input
                  type="text"
                  placeholder="Gross Salary"
                  className={`form-control`}
                  name="gross_salary"
                />
              </Form.Item>

              {/* vat */}
              <Form.Item
                label="Vat"
                style={{
                  marginBottom: 0
                }}
                name="vat"
              >
                <Input
                  type="text"
                  placeholder="Vat"
                  className={`form-control`}
                  name="vat"
                />
              </Form.Item>

              {/* employment type */}
              <Form.Item
                label="Employment Type"
                style={{
                  marginBottom: 0
                }}
                name="employment_type_id"
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleEmploymentTypeChange}
                    options={employmentTypes}
                    value={selectedEmploymentType}
                  />
                </Space>
              </Form.Item>

              {/* department */}
              <Form.Item
                label="Department"
                style={{
                  marginBottom: 0
                }}
                name="department_id"
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleDepartmentChange}
                    options={departments}
                    value={selectedDepartment}
                  />
                </Space>
              </Form.Item>

              {/* employment position */}

              <Form.Item
                label="Employment Position"
                style={{
                  marginBottom: 0
                }}
                name="position_id"
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleEmploymentPositionChange}
                    options={employmentPositions}
                    value={selectedEmploymentPosition}
                  />
                </Space>
              </Form.Item>
            </>
          )}

          {current === 2 && (
            <>
              {/* country */}
              <Form.Item
                label="Country"
                style={{
                  marginBottom: 0
                }}
                name={"country_id"}
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
                name={"state_id"}
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
                name={"city_id"}
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
                name={"post_office_id"}
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
            </>
          )}

          {current === 3 && (
            <>
              {educations.map((field, index) => (
                <Row key={index} gutter={16}>
                  <Col lg={8} md={24}>
                    <Form.Item label={`Institute Name`}>
                      <Input
                        value={field.institute_name}
                        onChange={e =>
                          handleFieldChange(
                            index,
                            "institute_name",
                            e.target.value
                          )
                        }
                        placeholder="Institute Name"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={24}>
                    <Form.Item label={`Degree`}>
                      <Input
                        value={field.degree}
                        onChange={e =>
                          handleFieldChange(index, "degree", e.target.value)
                        }
                        placeholder="Degree"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={24}>
                    <Form.Item label={`Passing Year`}>
                      <Input
                        value={field.passing_year}
                        onChange={e =>
                          handleFieldChange(
                            index,
                            "passing_year",
                            e.target.value
                          )
                        }
                        placeholder="Passing Year"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={24}>
                    <Form.Item label={`Result`}>
                      <Input
                        value={field.result}
                        onChange={e =>
                          handleFieldChange(index, "result", e.target.value)
                        }
                        placeholder="Result"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={24}>
                    <Form.Item label={`Duration`}>
                      <Input
                        value={field.duration}
                        onChange={e =>
                          handleFieldChange(index, "duration", e.target.value)
                        }
                        placeholder="Duration"
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={24}>
                    <Button
                      onClick={() => removeField(index)}
                      style={{
                        marginTop: "32px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none"
                      }}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button onClick={addField}>Add Row</Button>
              </Form.Item>
            </>
          )}

          {current === 4 && (
            <>
              {/* Profile Picture */}
              <Form.Item
                label="Profile Picture"
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

              {/* NID */}
              <Form.Item
                label="NID"
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
                    customRequest={handleImageUploadNid}
                    listType="picture-card"
                    fileList={fileListNid}
                    onPreview={handlePreviewNid}
                    onChange={handleChangeNid}
                    defaultFileList={fileListNid}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListNid.length >= 5 ? null : uploadButton}
                  </Upload>
                  {progressNid > 0 ? <Progress percent={progressNid} /> : null}

                  <Modal
                    open={previewOpenNid}
                    title={previewTitleNid}
                    footer={null}
                    onCancel={handleCancelNid}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImageNid}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* Guardian NID */}
              <Form.Item
                label="Guardian NID"
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
                    customRequest={handleImageUploadGuardianNid}
                    listType="picture-card"
                    fileList={fileListGuardianNid}
                    onPreview={handlePreviewGuardianNid}
                    onChange={handleChangeGuardianNid}
                    defaultFileList={fileListGuardianNid}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListGuardianNid.length >= 5 ? null : uploadButton}
                  </Upload>
                  {progressGuardianNid > 0 ? (
                    <Progress percent={progressGuardianNid} />
                  ) : null}

                  <Modal
                    open={previewOpenGuardianNid}
                    title={previewTitleGuardianNid}
                    footer={null}
                    onCancel={handleCancelGuardianNid}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImageGuardianNid}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* Utility Bill */}

              <Form.Item
                label="Utility Bill"
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
                    customRequest={handleImageUploadUtilityBill}
                    listType="picture-card"
                    fileList={fileListUtilityBill}
                    onPreview={handlePreviewUtilityBill}
                    onChange={handleChangeUtilityBill}
                    defaultFileList={fileListUtilityBill}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListUtilityBill.length >= 5 ? null : uploadButton}
                  </Upload>
                  {progressUtilityBill > 0 ? (
                    <Progress percent={progressUtilityBill} />
                  ) : null}

                  <Modal
                    open={previewOpenUtilityBill}
                    title={previewTitleUtilityBill}
                    footer={null}
                    onCancel={handleCancelUtilityBill}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImageUtilityBill}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* Chairmain / Commissioner certificate */}

              <Form.Item
                label="Chairmain / Commissioner certificate"
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
                    customRequest={
                      handleImageUploadChairmanCommissionerCertificate
                    }
                    listType="picture-card"
                    fileList={fileListChairmanCommissionerCertificate}
                    onPreview={handlePreviewChairmanCommissionerCertificate}
                    onChange={handleChangeChairmanCommissionerCertificate}
                    defaultFileList={fileListChairmanCommissionerCertificate}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListChairmanCommissionerCertificate.length >= 5
                      ? null
                      : uploadButton}
                  </Upload>
                  {progressChairmanCommissionerCertificate > 0 ? (
                    <Progress
                      percent={progressChairmanCommissionerCertificate}
                    />
                  ) : null}

                  <Modal
                    open={previewOpenChairmanCommissionerCertificate}
                    title={previewTitleChairmanCommissionerCertificate}
                    footer={null}
                    onCancel={handleCancelChairmanCommissionerCertificate}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImageChairmanCommissionerCertificate}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* Passport */}
              <Form.Item
                label="Passport"
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
                    customRequest={handleImageUploadPassport}
                    listType="picture-card"
                    fileList={fileListPassport}
                    onPreview={handlePreviewPassport}
                    onChange={handleChangePassport}
                    defaultFileList={fileListPassport}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListPassport.length >= 5 ? null : uploadButton}
                  </Upload>
                  {progressPassport > 0 ? (
                    <Progress percent={progressPassport} />
                  ) : null}

                  <Modal
                    open={previewOpenPassport}
                    title={previewTitlePassport}
                    footer={null}
                    onCancel={handleCancelPassport}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImagePassport}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* Academic Certificates */}

              <Form.Item
                label="Academic Certificates"
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
                    customRequest={handleImageUploadAcademicCertificates}
                    listType="picture-card"
                    fileList={fileListAcademicCertificates}
                    onPreview={handlePreviewAcademicCertificates}
                    onChange={handleChangeAcademicCertificates}
                    defaultFileList={fileListAcademicCertificates}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListExperienceCertificates.length >= 5
                      ? null
                      : uploadButton}
                  </Upload>
                  {progressAcademicCertificates > 0 ? (
                    <Progress percent={progressAcademicCertificates} />
                  ) : null}

                  <Modal
                    open={previewOpenExperienceCertificates}
                    title={previewTitleExperienceCertificates}
                    footer={null}
                    onCancel={handleCancelExperienceCertificates}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImageExperienceCertificates}
                    />
                  </Modal>
                </Space>
              </Form.Item>

              {/* Experience Certificates */}

              <Form.Item
                label="Experience Certificates"
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
                    customRequest={handleImageUploadExperienceCertificates}
                    listType="picture-card"
                    fileList={fileListExperienceCertificates}
                    onPreview={handlePreviewExperienceCertificates}
                    onChange={handleChangeExperienceCertificates}
                    defaultFileList={fileListExperienceCertificates}
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                  >
                    {fileListExperienceCertificates.length >= 5
                      ? null
                      : uploadButton}
                  </Upload>
                  {progressExperienceCertificates > 0 ? (
                    <Progress percent={progressExperienceCertificates} />
                  ) : null}

                  <Modal
                    open={previewOpenAcademicCertificates}
                    title={previewTitleAcademicCertificates}
                    footer={null}
                    onCancel={handleCancelAcademicCertificates}
                  >
                    <img
                      alt="image"
                      style={{ width: "100%" }}
                      src={previewImageAcademicCertificates}
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

export default EditEmployeeForm;
