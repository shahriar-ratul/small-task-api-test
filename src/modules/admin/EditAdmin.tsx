/* eslint-disable @typescript-eslint/no-explicit-any */

import EditAdminForm from "@/components/forms/admin/EditAdminForm";
import type { AdminModel } from "@/interfaces/AdminModel";
import AppLoader from "@/lib/AppLoader";
import AppRowContainer from "@/lib/AppRowContainer";
import Forbidden from "@/modules/errorPage/Forbidden";
import AppAxios from "@/services/AppAxios";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Card } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const EditAdmin = ({ id }: any) => {
  const [unauthorized, setUnauthorized] = useState(false);

  const [item, SetItem] = useState<AdminModel | null>(null);
  const fetchData = async () => {
    const token = Cookies.get("token");
    // console.log('token', token)
    AppAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const { data } = await AppAxios.get(`/api/v1/admins/${id}`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["admin-list", id],
    queryFn: async () => {
      const { data } = await fetchData();
      return data;
    },
    onSuccess(data: any) {
      if (data) {
        SetItem(data.user);
      }
    },
    onError(error: any) {
      console.log("error", error);
    }
  });

  useEffect(() => {
    // console.log('data -b', data)
    if (item) {
      // console.log('data', data)
      SetItem(item);
    }
  }, [item]);

  useEffect(() => {
    if (Number(id) === 1) {
      setUnauthorized(true);
    }
  }, [id]);

  return (
    <>
      {unauthorized ? (
        <>
          <Forbidden />
        </>
      ) : (
        <AppRowContainer>
          <Breadcrumb
            style={{
              margin: "10px 30px",
              textAlign: "left"
            }}
            items={[
              {
                title: <Link href="/admin">Home</Link>
              },
              {
                title: <Link href="/admin/settings">Settings Dashboard</Link>
              },
              {
                title: (
                  <Link href="/admin/settings/user-management/admin">
                    Admins
                  </Link>
                )
              },
              {
                title: "Edit Admin"
              }
            ]}
          />

          <Card
            title="Edit Admin"
            style={{
              width: "80%",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              margin: "0 auto",
              textAlign: "center"
            }}
          >
            {isLoading && isFetching && <AppLoader />}

            {isError && <div>{error.message}</div>}

            {!isLoading && !unauthorized && item && (
              <EditAdminForm item={item} />
            )}
          </Card>
        </AppRowContainer>
      )}
    </>
  );
};

export default EditAdmin;
