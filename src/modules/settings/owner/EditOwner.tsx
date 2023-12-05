/* eslint-disable @typescript-eslint/no-explicit-any */

import EditOwnerForm from "@/components/forms/owner/EditOwnerForm";
import type { OwnerModel } from "@/interfaces/OwnerModel";
import AppLoader from "@/lib/AppLoader";
import AppRowContainer from "@/lib/AppRowContainer";
import AppAxios from "@/services/AppAxios";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Card } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const EditOwner = ({ id }: any) => {
  const [item, SetItem] = useState<OwnerModel | null>(null);
  const fetchData = async () => {
    const token = Cookies.get("token");
    AppAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const { data } = await AppAxios.get(`/api/v1/owners/${id}`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["owner-list", id],
    queryFn: async () => {
      const { data } = await fetchData();
      return data;
    },
    onSuccess(data: any) {
      if (data) {
        SetItem(data.item);
      }
    },
    onError(error: any) {
      console.log("error", error);
    }
  });

  useEffect(() => {
    if (item) {
      SetItem(item);
    }
  }, [item]);

  return (
    <>
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
              title: <Link href="/admin/settings/owner">Owner</Link>
            },
            {
              title: "Edit Owner"
            }
          ]}
        />

        <Card
          title="Edit Owner"
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

          {!isLoading && item && <EditOwnerForm item={item} />}
        </Card>
      </AppRowContainer>
    </>
  );
};

export default EditOwner;
