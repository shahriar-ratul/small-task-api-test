/* eslint-disable @typescript-eslint/no-explicit-any */

import EditBranchForm from "@/components/forms/branch/EditBranchForm";
import type { BranchModel } from "@/interfaces/BranchModel";
import AppLoader from "@/lib/AppLoader";
import AppRowContainer from "@/lib/AppRowContainer";
import AppAxios from "@/services/AppAxios";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Card } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const EditBranch = ({ id }: any) => {
  const [item, SetItem] = useState<BranchModel | null>(null);
  const fetchData = async () => {
    const token = Cookies.get("token");
    // console.log('token', token)
    AppAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const { data } = await AppAxios.get(`/api/v1/branches/${id}`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["branch-list", id],
    queryFn: async () => {
      const { data } = await fetchData();
      return data;
    },
    onSuccess(data: any) {
      if (data) {
        console.log("data", data.item);

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
              title: <Link href="/admin/settings/branch">Branch</Link>
            },
            {
              title: "Edit Branch"
            }
          ]}
        />

        <Card
          title="Edit Branch"
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

          {!isLoading && item && <EditBranchForm item={item} />}
        </Card>
      </AppRowContainer>
    </>
  );
};

export default EditBranch;
