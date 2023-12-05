/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Checkbox, Col, Space, Tag } from "antd";
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
import Link from "next/link";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
import type { AdminModel } from "@/interfaces/AdminModel";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

const AdminList: React.FC = () => {
  const [tableData, setTableData] = useState<AdminModel[]>([]);

  const [page, SetPage] = useState(1);
  const [limit, SetLimit] = useState(10);
  const [order, SetOrder] = useState("ASC");
  const [sort, SetSort] = useState("id");

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  async function handleDelete(id: number) {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#570DF8",
        cancelButtonColor: "#EB0808",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        const { data } = await AppAxios.delete(`/api/v1/admins/${id}`);

        if (data.success) {
          MySwal.fire("Deleted!", data.data.message, "success").then(() => {
            router.reload();
          });
        } else {
          MySwal.fire("Error!", data.data.message, "error");
        }
      } else if (result.isDismissed) {
        MySwal.fire("Cancelled", "Your Data is safe :)", "error");
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data.message.join("<br/>"));
        // convert array to string
        MySwal.fire(
          "Error!",
          error.response.data.message.join("<br/>"),
          "error"
        );
      } else {
        MySwal.fire("Error!", "Something went wrong", "error");
      }
    }
  }

  async function handleChange(id: number) {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#570DF8",
        cancelButtonColor: "#EB0808",
        confirmButtonText: "Yes, Change Status!"
      });

      if (result.isConfirmed) {
        const { data } = await AppAxios.post(`/api/v1/admins/${id}/status`);
        // console.log(data);
        if (data.success) {
          // console.log(data.data.message);

          MySwal.fire("Status Changed!", data.data.message, "success");

          const newData = tableData.map((item: AdminModel) => {
            if (item.id === id) {
              item.base.is_active = !item.base.is_active;
            }
            return item;
          });
          setTableData(newData);
        } else {
          MySwal.fire("Error!", data.message, "error");
        }
      } else if (result.isDismissed) {
        MySwal.fire("Cancelled", "Operation has been cancelled", "error");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        MySwal.fire("Error!", error.response.data.message, "error");
      } else {
        MySwal.fire("Error!", "Something went wrong", "error");
      }
    }
  }

  const columns: ColumnsType<AdminModel> = [
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
      title: "Image",
      dataIndex: "images",
      sorter: false,
      render: (text: any, row: any) => {
        return (
          <Space size="middle" align="center" wrap>
            {row.images.length > 0 ? (
              <img
                src={row.images[row.images.length - 1].image.path}
                alt={row.username}
                style={{ width: "50px", height: "50px" }}
              />
            ) : null}
          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    },
    {
      title: "username",
      dataIndex: "username",
      sorter: true,
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "email",
      dataIndex: "email",
      sorter: true,
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "phone",
      dataIndex: "phone",
      sorter: true,
      render: (text: any, record: any) => {
        return (
          <Space size="middle" align="center" wrap>
            {record.phone ? record.phone : "-"}
          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "roles",
      dataIndex: "roles",
      sorter: false,
      render: (text: any, record: any) => {
        return (
          <Space size="middle" align="center" wrap>
            {record.roles.map((item: any) => {
              return (
                <Tag color="#108ee9" key={item.id}>
                  {item.name}
                </Tag>
              );
            })}
          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "Status",
      dataIndex: "base.is_active",
      sorter: true,
      render: (text: any, record: any) => {
        return (
          <Space size="middle" align="center" wrap>
            {record.base.is_active ? (
              <Tag color="#108ee9">Active</Tag>
            ) : (
              <Tag color="#FF5630">Inactive</Tag>
            )}
          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "Active",
      dataIndex: "base.is_active",
      sorter: false,
      render: (text: any, record: any) => {
        return (
          <Space size="middle" align="center">

            <Space size="middle" align="center" wrap>
              <Checkbox
                checked={record.base.is_active}
                value={record}
                onClick={() => handleChange(record.id)}
              />
            </Space>

          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "Action",
      dataIndex: "action",
      sorter: false,
      render: (text: any, record: any) => {
        return (
          <>
            <Space size="middle" align="center">

              <Space size="middle" align="center" wrap>
                <Link
                  href={`/admin/settings/user-management/admin/${record.id}/edit`}
                >
                  <Button type="primary" icon={<EditOutlined />} />
                </Link>
              </Space>

              <Space size="middle" align="center" wrap>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#EB0808",
                    borderColor: "#EB0808",
                    color: "#ffffff"
                  }}
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                />
              </Space>

            </Space>
          </>
        );
      },
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
    AppAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const { data } = await AppAxios.get(
      `/api/v1/admins?page=${page}&limit=${limit}&order=${order}&sort=${sort}`
    );
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["admin-list", page, limit, order, sort],
    queryFn: async () => {
      const { data } = await fetchData(page, limit, order, sort);
      return data;
    },
    onSuccess(data: any) {
      if (data.data) {
        // console.log("data.data", data.data);
        setTableData(data.data);
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
    if (tableData) {
      setTableData(tableData);
    }
  }, [tableData]);

  // console.log(error, isLoading, isError)

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<AdminModel> | SorterResult<AdminModel>[]
  ) => {
    SetPage(pagination.current as number);
    SetLimit(pagination.pageSize as number);

    if (sorter && (sorter as SorterResult<AdminModel>).order) {
      // console.log((sorter as SorterResult<AdminModel>).order)

      SetOrder(
        (sorter as SorterResult<AdminModel>).order === "ascend" ? "ASC" : "DESC"
      );
    }
    if (sorter && (sorter as SorterResult<AdminModel>).field) {
      // console.log((sorter as SorterResult<AdminModel>).field)

      SetSort((sorter as SorterResult<AdminModel>).field as string);
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
            title="Admins List"
            hasLink={true}
            addLink="/admin/settings/user-management/admin/create"
            permission="admin.create"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px",
              overflow: "auto"
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
                dataSource={tableData}
                pagination={tableParams.pagination}
                loading={isLoading || isFetching}
                onChange={handleTableChange}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  padding: "10px",
                  overflow: "auto"
                }}
              />
            </Space>
          </TableCard>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default AdminList;
