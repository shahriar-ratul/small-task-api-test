/* eslint-disable @typescript-eslint/no-explicit-any */

import EditRoleForm from "@/components/forms/role/EditRoleForm";
import type { RoleModel } from "@/interfaces/RoleModel";
import AppLoader from "@/lib/AppLoader";
import AppRowContainer from "@/lib/AppRowContainer";
import Forbidden from "@/modules/errorPage/Forbidden";
import AppAxios from "@/services/AppAxios";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Card } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface PropData {
  id: string | string[] | undefined;
}

const EditRole = ({ id }: PropData) => {
  const [unauthorized, setUnauthorized] = useState(false);

  const [item, SetItem] = useState<RoleModel | null>(null);
  const fetchData = async () => {
    const token = Cookies.get("token");
    // console.log('token', token)
    AppAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const { data } = await AppAxios.get(`/api/v1/roles/${id}`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["role-list", id],
    queryFn: async () => {
      const { data } = await fetchData();
      return data;
    },
    onSuccess(data: any) {
      if (data) {
        console.log("data", data);

        SetItem(data);
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
    if (id) {
      // check id is string or not
      const idString = id.toString();
      console.log("id", idString);
      if (idString !== "1") {
        setUnauthorized(false);
      } else {
        setUnauthorized(true);
      }
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
                title: <Link href="/admin/settings">Settings</Link>
              },
              {
                title: (
                  <Link href="/admin/settings/user-management/role">Roles</Link>
                )
              },
              {
                title: "Edit Role"
              }
            ]}
          />

          <Card
            title="Edit Role"
            style={{
              width: "90%",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              margin: "0 auto",
              textAlign: "center"
            }}
          >
            {isLoading && isFetching && <AppLoader />}

            {isError && <div>{error.message}</div>}

            {!isLoading && !unauthorized && item && (
              <EditRoleForm item={item} />
            )}
          </Card>
        </AppRowContainer>
      )}
    </>
  );
};

export default EditRole;
