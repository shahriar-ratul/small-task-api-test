/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Alert, Form, Input } from "antd";

import {
  SignInButton,
  StyledSign,
  StyledSignContent,
  StyledSignForm
} from "./index.styled";
import { useRouter } from "next/router";
import AppAxios from "@/services/AppAxios";
import Cookies from "js-cookie";
import LoginAppLoader from "@/components/loader/LoginAppLoader";
import { useAppDispatch } from "@/store/hooks";

const LoginComponent = () => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const [showError, setShowError] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState([]);

  const { returnUrl } = router.query;

  const dispatch = useAppDispatch();

  const signInUser = async (values: any) => {
    const { email, password } = values;
    setLoading(true);

    try {
      AppAxios.post("/api/auth/login", {
        username: email,
        password: password
      })
        .then(async response => {
          const { data } = response;

          if (data.success === false) {
            setShowError(true);
            setErrorMessage(data.message);
            return;
          }

          Cookies.set("token", data.data.access_token);

          dispatch({ type: "auth/setIsLoggedIn", payload: true });

          setLoading(false);
          if (returnUrl) {
            router.replace(returnUrl as string);
          } else {
            router.replace("/admin");
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setShowError(true);
          if (err.response) {
            setErrorMessage(err.response.data.message);
          } else {
            const { message } = err;

            if (message) {
              //  convert string to array
              const messageArray = message.split(":");
              setErrorMessage(messageArray);
            }
          }

          // if (err.response.status === 401) {
          // setErrorMessage(err.response.data.message)
          // } else {
          // setErrorMessage('Something went wrong. Please try again later.')
          // }
        });
    } catch (err) {
      console.log(err);
      /*  setShowError(true)
       setErrorMessage(err) */
    }

    console.log("Success:");

    return false;
  };

  const onFinishFailed = () => {
    console.log("Failed:");
  };

  return loading ? (
    <LoginAppLoader />
  ) : (
    <StyledSign>
      <StyledSignContent>
        <div>
          {showError &&
            errorMessage.length > 0 &&
            errorMessage.map((message: string, index: number) => (
              <Alert
                key={index}
                message={message}
                type="error"
                showIcon
                style={{ marginBottom: "10px" }}
              />
            ))}
        </div>

        <StyledSignForm
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
            /* email: "admin@admin.com",
            password: "password" */
            email: "",
            password: ""
          }}
          onFinish={signInUser}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your Email!"
              }
            ]}
          >
            <Input placeholder="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your Password!"
              }
            ]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>

          <div className="form-btn-field">
            <SignInButton type="primary" htmlType="submit">
              Login
            </SignInButton>
          </div>
        </StyledSignForm>
      </StyledSignContent>
    </StyledSign>
  );
};

export default LoginComponent;
