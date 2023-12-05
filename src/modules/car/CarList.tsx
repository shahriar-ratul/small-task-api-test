/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, Row, Select, Space, Tag } from "antd";
import AppRowContainer from "@/lib/AppRowContainer";
import TableCard from "@/lib/TableCard";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

import { useQuery } from "@tanstack/react-query";
import type { AlignType } from "rc-table/lib/interface";

import type { CarModel } from "@/interfaces/CarModel";
import axios from "axios";
import { format, parseISO } from "date-fns";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

const statusList = [
  {
    label: "True",
    value: true
  },
  {
    label: "False",
    value: false
  }
];

const CarList: React.FC = () => {
  const [tableData, setTableData] = useState<CarModel[]>([]);
  const [items, setItems] = useState<CarModel[]>([]);

  const [page, SetPage] = useState(1);
  const [limit, SetLimit] = useState(10);

  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(
    undefined
  );

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });

  const columns: ColumnsType<CarModel> = [
    {
      title: "Serial",
      dataIndex: "id",
      sorter: false,
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
      title: "brand",
      dataIndex: "brand",
      sorter: true,
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "model",
      dataIndex: "model",
      sorter: true,
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "color",
      dataIndex: "color",
      sorter: true,
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "isInProduction",
      dataIndex: "isInProduction",
      sorter: true,
      render: (_, record: any) => {
        return (
          <Space size="middle" align="center" wrap>
            {record.isInProduction ? (
              <Tag color="#108ee9">In Production</Tag>
            ) : (
              <Tag color="#FF5630"> Not In Production</Tag>
            )}
          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    },

    {
      title: "createdAt",
      dataIndex: "createdAt",
      sorter: true,
      render: (_, record: any) => {
        const dateObject = parseISO(record.createdAt);
        const formattedDate = format(dateObject, "yyyy-MM-dd HH:mm:ss");

        return (
          <Space size="middle" align="center" wrap>
            {formattedDate}
          </Space>
        );
      },
      // width: "20%",
      align: "center" as AlignType
    }
  ];

  const fetchData = async () => {
    const { data } = await axios.get(`/api/car`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["car-list"],
    queryFn: async () => {
      const { data } = await fetchData();

      if (data) {
        setItems(data.items);
        setTableData(data.items);
        setTableParams({
          pagination: {
            total: data.items.length,
            pageSizeOptions: ["10", "20", "30", "40", "50"]
          }
        });
      }
      return data;
    }
  });

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (tableData) {
      setTableData(tableData);
    }
  }, [tableData]);

  // console.log(error, isLoading, isError)

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CarModel> | SorterResult<CarModel>[]
  ) => {
    SetPage(pagination.current as number);
    SetLimit(pagination.pageSize as number);

    if (
      sorter &&
      (sorter as SorterResult<CarModel>).field &&
      sorter &&
      (sorter as SorterResult<CarModel>).order
    ) {
      tableData.sort((a, b) => {
        const field = (sorter as SorterResult<CarModel>)
          .field as keyof CarModel;
        if ((sorter as SorterResult<CarModel>).order === "ascend") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });

      setTableData([...tableData]);
    }
  };

  const handleStatusChange = (value: boolean | undefined) => {
    setSelectedStatus(value);
    const newData = items.filter(item => {
      if (value === undefined) {
        return item;
      } else {
        return item.isInProduction === value;
      }
    });

    setTableParams({
      pagination: {
        total: newData.length,
        pageSizeOptions: ["10", "20", "30", "40", "50"]
      }
    });

    setTableData(newData);
  };

  const handleClear = () => {
    setSelectedStatus(undefined);
    SetPage(1);
    SetLimit(10);
    setTableData(items);

    setTableParams({
      pagination: {
        total: items.length,
        pageSizeOptions: ["10", "20", "30", "40", "50"]
      }
    });
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
            title="Cars List"
            hasLink={false}
            addLink=""
            permission=""
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px",
              overflow: "auto"
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space style={{ marginBottom: 16 }}>
                <Row
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                  justify="space-between"
                >
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="gutter-row"
                  >
                    <Space style={{ width: "100%" }} direction="vertical">
                      <span>
                        <b>isInProduction</b>
                      </span>
                      <Select
                        allowClear
                        style={{
                          width: "100%",
                          textAlign: "start"
                        }}
                        placeholder="Please select"
                        onChange={handleStatusChange}
                        options={statusList}
                        value={selectedStatus}
                        showSearch
                      />
                    </Space>
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    xxl={12}
                    className="gutter-row"
                  >
                    <Button
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "25px",
                        backgroundColor: "#F15F22",
                        color: "#ffffff"
                      }}
                      onClick={() => {
                        handleClear();
                      }}
                      className="ant-btn  ant-btn-lg"
                    >
                      Clear filters
                    </Button>
                  </Col>
                </Row>
              </Space>

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

export default CarList;
