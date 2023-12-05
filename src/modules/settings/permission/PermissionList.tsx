/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Space } from "antd";
import AppRowContainer from "@/lib/AppRowContainer";
import TableCard from "@/lib/TableCard";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

import AppAxios from "@/services/AppAxios";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import type { AlignType } from "rc-table/lib/interface";
interface DataType {
  id: number;
  name: string;
  slug: string;
  group: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

const PermissionList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);

  const [page, SetPage] = useState(1);
  const [limit, SetLimit] = useState(10);
  const [order, SetOrder] = useState("ASC");
  const [sort, SetSort] = useState("name");

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Serial",
      dataIndex: "id",
      sorter: true,
      render: (id, row, index) => {
        return (
          <>
            <Space>
              {page !== 1 ? index + 1 + (page - 1) * limit : index + 1}
            </Space>
          </>
        );
      },
      width: "10%",
      align: "center" as AlignType
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: "20%",
      align: "center" as AlignType
    },
    {
      title: "Slug",
      dataIndex: "slug",
      sorter: true,
      width: "20%",
      align: "center" as AlignType
    },
    {
      title: "Group",
      dataIndex: "group",
      sorter: true,
      width: "20%",
      align: "center" as AlignType
    }
  ];

  const fetchData = async (
    page: number,
    limit: number,
    order: string,
    sort: string
  ) => {
    const token = Cookies.get("token");
    // console.log('token', token)
    AppAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const { data } = await AppAxios.get(
      `/api/v1/permissions?page=${page}&limit=${limit}&order=${order}&sort=${sort}`
    );
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["permissions-list", page, limit, order, sort],
    queryFn: async () => {
      const { data } = await fetchData(page, limit, order, sort);
      return data;
    },
    onSuccess(data: any) {
      if (data.data) {
        console.log("data.data", data.data);

        setData(data.data);
        setTableParams({
          pagination: {
            total: data.meta.total,
            pageSize: data.meta.limit,
            current: data.meta.page,
            pageSizeOptions: ["10", "20", "30", "40", "50"]
          }
        });
      }
    },
    onError(error: any) {
      console.log("error", error);
    }
  });

  useEffect(() => {
    // console.log('data -b', data)
    if (data) {
      // console.log('data', data)
      setData(data);
    }
  }, [data]);

  // console.log(error, isLoading, isError)

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    SetPage(pagination.current as number);
    SetLimit(pagination.pageSize as number);

    if (sorter && (sorter as SorterResult<DataType>).order) {
      // console.log((sorter as SorterResult<DataType>).order)

      SetOrder(
        (sorter as SorterResult<DataType>).order === "ascend" ? "ASC" : "DESC"
      );
    }
    if (sorter && (sorter as SorterResult<DataType>).field) {
      // console.log((sorter as SorterResult<DataType>).field)

      SetSort((sorter as SorterResult<DataType>).field as string);
    }
  };

  return (
    <>
      <AppRowContainer>
        <Col span={24} key="data-f">
          {isError && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: " 10px 5px"
                }}
              >
                <Card
                  title="Error"
                  style={{
                    width: 300,
                    color: "#FF5630",
                    backgroundColor: "#ffffff"
                  }}
                >
                  <p>
                    {error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                      ? error.response.data.message
                      : error.message
                      ? error.message
                      : "Something went wrong"}
                  </p>
                </Card>
              </div>
            </>
          )}

          <TableCard
            title="Permissions List"
            hasLink={true}
            addLink="/admin/settings/user-management/permission/create"
            permission="permission.create"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px"
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* <Space style={{ marginBottom: 16 }}>
                <Button >Sort age</Button>
                <Button >Clear filters</Button>
                <Button >Clear filters and sorters</Button>
              </Space> */}
              <Table
                columns={columns}
                rowKey={record => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={isLoading || isFetching}
                onChange={handleTableChange}
              />
            </Space>
          </TableCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default PermissionList;
