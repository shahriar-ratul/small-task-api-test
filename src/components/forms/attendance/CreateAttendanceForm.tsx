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
  Select,
  Space,
  TimePicker
} from "antd";
import AppAxios from "@/services/AppAxios";

import dayjs from "dayjs";
import type { DatePickerProps, TimePickerProps } from "antd";
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

interface FormData {
  start_time: string;
  end_time: string;
  date: string;
  is_half_day: boolean;
  is_active: boolean;
  note: string;
  employee_id: string;
}

const CreateAttendanceForm = () => {
  const [form] = Form.useForm();
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [isHalfDay, setIsHalfDay] = useState(false);

  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState<any>(dayjs());

  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const handleActive = (e: any) => {
    setIsActive(e.target.checked ? true : false);
  };

  const handleHalfDay = (e: any) => {
    setIsHalfDay(e.target.checked ? true : false);
  };

  const handleEmployeeChange = (value: any) => {
    setSelectedEmployee(value as any);
    form.setFieldsValue({ employee_id: value });
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

  useEffect(() => {
    getEmployees();
  }, []);

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (dateString !== "") {
      const newDate = dayjs(dateString);
      setSelectedDate(newDate);
      form.setFieldsValue({ date: newDate });
    } else {
      setSelectedDate(dayjs());
      form.setFieldsValue({ date: dayjs() });
    }
  };

  const onChange: TimePickerProps["onChange"] = (
    time: any,
    timeString: any
  ) => {
    if (timeString !== "") {
      const newDate = dayjs(timeString, "HH:mm:ss");
      setStartTime(newDate);

      form.setFieldsValue({ start_time: newDate });
    } else {
      setStartTime(null);
      form.setFieldsValue({ start_time: null });
    }
  };

  const onEndChange: TimePickerProps["onChange"] = (
    time: any,
    timeString: any
  ) => {
    if (timeString !== "") {
      const newDate = dayjs(timeString, "HH:mm:ss");
      setEndTime(newDate);
      form.setFieldsValue({ end_time: newDate });
    } else {
      setEndTime(null);
      form.setFieldsValue({ end_time: null });
    }
  };

  const onSubmit = async (data: FormData) => {
    const { start_time, end_time, date, note } = data;

    if (!selectedEmployee) {
      MySwal.fire({
        title: "Error",
        text: "Please select employee",
        icon: "error"
      });
      return;
    }

    if (!selectedDate) {
      MySwal.fire({
        title: "Error",
        text: "Please select date",
        icon: "error"
      });
      return;
    }

    // check end time is greater than start time
    if (startTime && endTime) {
      if (startTime.isSame(endTime)) {
        MySwal.fire({
          title: "Error",
          text: "End time must be greater than start time",
          icon: "error"
        });
        return;
      }

      if (startTime.isAfter(endTime)) {
        MySwal.fire({
          title: "Error",
          text: "End time must be greater than start time",
          icon: "error"
        });
        return;
      }
    }

    const formData = {
      start_time: start_time ? dayjs(start_time).format("HH:mm:ss") : null,
      end_time: end_time ? dayjs(end_time).format("HH:mm:ss") : null,
      date: date ? dayjs(date).format("YYYY-MM-DD") : null,
      note: note,
      employee_id: selectedEmployee,
      is_half_day: isHalfDay,
      is_active: isActive
    };
    try {
      await AppAxios.post("/api/v1/attendances", formData)
        .then(res => {
          const { data } = res;

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Item Added successfully",
            icon: "success"
          }).then(() => {
            router.replace("/admin/hr/attendance/attendance");
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
      MySwal.fire({
        title: "Error",
        text: err.response.data.message || "Something went wrong",
        icon: "error"
      });
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
            start_time: "",
            end_time: "",
            date: "",
            is_half_day: false,
            is_active: false,
            note: "",
            employee_id: ""
          }}
        >
          <Form.Item
            name="employee_id"
            label="Employees"
            style={{
              marginBottom: 0
            }}
            rules={[
              {
                required: true,
                message: "Please input your start time!"
              }
            ]}
          >
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleEmployeeChange}
                options={employees}
                value={selectedEmployee}
              />
            </Space>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            style={{
              minWidth: 180,
              width: "100%"
            }}
            rules={[
              {
                required: true,
                message: "Please input your date!"
              }
            ]}
          >
            <DatePicker
              style={{
                width: "100%"
              }}
              // defaultValue={dayjs(selectedDate, dateFormat)}
              onChange={onDateChange}
              value={selectedDate}
              format={dateFormat}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Start Time"
            style={{
              marginBottom: 0
            }}
            name="start_time"
            rules={[
              {
                required: true,
                message: "Please input your start time!"
              }
            ]}
          >
            <TimePicker
              style={{
                width: "100%",
                marginBottom: 10
              }}
              onChange={onChange}
              value={startTime}
              format="HH:mm:ss"
              minuteStep={1}
              allowClear
            />
          </Form.Item>

          {/* end time */}
          <Form.Item
            label="End Time"
            style={{
              marginBottom: 10
            }}
            name="end_time"
          >
            <TimePicker
              style={{
                width: "100%"
              }}
              onChange={onEndChange}
              value={endTime}
              format="HH:mm:ss"
              minuteStep={1}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Note"
            style={{
              marginBottom: 0
            }}
            name="note"
          >
            <Input.TextArea
              placeholder="note"
              className={`form-control`}
              name="note"
            />
          </Form.Item>

          <Form.Item
            label="Half Day"
            style={{
              marginBottom: 0
            }}
          >
            <Checkbox onChange={handleHalfDay} checked={isHalfDay}>
              Half Day
            </Checkbox>
          </Form.Item>

          <Form.Item
            label="Status"
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

export default CreateAttendanceForm;
