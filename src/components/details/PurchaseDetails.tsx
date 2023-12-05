import React, { useEffect, useState } from "react";
import { Descriptions, Table } from "antd";
import type { PurchaseModel } from "@/interfaces/PurchaseModel";

interface PropData {
  item: PurchaseModel;
}

const PurchaseDetails = ({ item }: PropData) => {
  // console.log(item); // For debugging purposes only

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (item) {
      setData(item.products);
    }
  }, [item]);

  const columns = [
    {
      title: "Serial",
      dataIndex: "item_serial",
      key: "item_serial"
    },
    {
      title: "Purchase Qty",
      dataIndex: "purchase_qty",
      key: "purchase_qty"
    },
    {
      title: "Received Qty",
      dataIndex: "received_qty",
      key: "received_qty"
    },

    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price"
    },

    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount"
    }
  ];

  return (
    <div
      style={{
        margin: "10px 30px",
        textAlign: "center"
      }}
    >
      <div>
        <h1>
          Purchase Details |{" "}
          <span
            style={{
              color: "#FF5630",
              fontWeight: "bold",
              textTransform: "capitalize"
            }}
          >
            {item.type}
          </span>
        </h1>
      </div>
      <Descriptions
        title=""
        style={{
          color: "#000000",
          fontWeight: "bold"
        }}
      >
        <Descriptions.Item label="Supplier Name">
          {item.supplier ? item.supplier.shop_name : ""}
        </Descriptions.Item>

        <Descriptions.Item label="Supplier Bill No">
          {item.supplier_bill_no}
        </Descriptions.Item>
        <Descriptions.Item label="Supplier Bill Date">
          {item.supplier_bill_date}
        </Descriptions.Item>
        <Descriptions.Item label="Purchase Date">
          {item.purchase_date}
        </Descriptions.Item>
        <Descriptions.Item label="Product Origin">
          {item.productOrigin ? item.productOrigin.name : ""}
        </Descriptions.Item>

        {item.type === "foreign" && (
          <>
            <Descriptions.Item label="Currency">
              {item.currency
                ? `${item.currency.name} (${item.currency.rate})`
                : ""}
            </Descriptions.Item>

            <Descriptions.Item label="CF">
              {item.cf ? item.cf.company_name : ""}
            </Descriptions.Item>
            {item.lc && (
              <Descriptions.Item label="LC">{item.lc.name}</Descriptions.Item>
            )}
          </>
        )}
      </Descriptions>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        // footer={() => (
        //   <div style={{ textAlign: "right" }}>
        //     <h3>Total: $190.00</h3>
        //   </div>
        // )}
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          margin: "0 auto",
          textAlign: "center",
          overflow: "auto"
        }}
      />
    </div>
  );
};

export default PurchaseDetails;
