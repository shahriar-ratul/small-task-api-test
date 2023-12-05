import React, { useEffect, useRef, useState } from "react";
import { Button, Descriptions, Space, Table } from "antd";
import type { PurchaseModel } from "@/interfaces/PurchaseModel";
import type { ProductModel, ProductSkuModel } from "@/interfaces/ProductModel";

// import BarCodePrint from "./print/BarCodePrint";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import type { ColumnsType } from "antd/es/table";
import { PrinterOutlined } from "@ant-design/icons";
import SingleBarCodePrint from "./print/SingleBarCodePrint";
import AppLoader from "@/lib/AppLoader";
interface PropData {
  purchase: PurchaseModel;
  item: ProductModel;
}

// 2 in = 50.8mm
// 1 in = 25.4mm

const pageStyle = `
@page{
  size: 50.8mm 25.4mm;
  margin: 0;
  padding: 0;
};



`;

const ProductDetails = ({ purchase, item }: PropData) => {
  // console.log(purchase); // For debugging purposes only
  // console.log(item); // For debugging purposes only

  const [selectedSku, setSelectedSku] = useState<ProductSkuModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // const componentRef = useRef();
  const componentRefSingle = useRef();

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current ?? null,
  //   pageStyle: pageStyle
  // });

  const handlePrintSingle = useReactToPrint({
    content: () => componentRefSingle.current ?? null,
    pageStyle: pageStyle,
    onBeforeGetContent() {
      setLoading(false);
    },
    onAfterPrint() {
      setLoading(false);
    }
  });

  const handleSkuPrint = (sku: ProductSkuModel) => {
    setLoading(true);
    setSelectedSku(sku);
  };

  useEffect(() => {
    if (selectedSku) {
      handlePrintSingle();
    }

    return () => {
      setSelectedSku(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSku]);

  const columns: ColumnsType<ProductSkuModel> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {},
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity"
    },

    {
      title: "Wholesale Margin",
      dataIndex: "wholesale_percentage",
      key: "wholesale_percentage"
    },
    {
      title: "Wholesale Price",
      dataIndex: "wholesale_price",
      key: "wholesale_price"
    },

    {
      title: "Retail Margin",
      dataIndex: "retail_percentage",
      key: "retail_percentage"
    },

    {
      title: "Retail Price",
      dataIndex: "retail_price",
      key: "retail_price"
    },
    {
      title: "Unit Price",
      dataIndex: "cost",
      key: "cost"
    },
    {
      title: "Action",
      dataIndex: "",
      render: (_, record: any) => {
        return (
          <>
            <Space size="middle" align="center" wrap>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#2db38b",
                  borderColor: "#2db38b"
                }}
                icon={<PrinterOutlined />}
                onClick={() => handleSkuPrint(record)}
              />
            </Space>
          </>
        );
      }
    }
  ];

  return (
    <>
      {loading && (
        <>
          <AppLoader />
        </>
      )}
      <div>
        <div
          style={{ display: "none" }} // This make ComponentToPrint show   only while printing
        >
          {selectedSku && (
            <SingleBarCodePrint
              componentRef={componentRefSingle}
              item={item}
              purchase={purchase}
              sku={selectedSku}
            />
          )}
        </div>

        {/* <div
          style={{ display: "none" }} // This make ComponentToPrint show   only while printing
        >
          <BarCodePrint
            componentRef={componentRef}
            item={item}
            purchase={purchase}
          />
        </div> */}
        {/* <Button
          type="primary"
          style={{
            margin: "10px 30px",
            backgroundColor: "#FF5630",
            borderColor: "#FF5630"
          }}
          onClick={handlePrint}
        >
          Print BarCode
        </Button> */}
      </div>

      <div className="flex justify-end">
        <Link href={`/admin/purchase/purchase/${purchase.id}/product/create`}>
          <Button
            type="primary"
            style={{
              margin: "10px 30px",
              backgroundColor: "#FF5630",
              borderColor: "#FF5630"
            }}
          >
            Add Product
          </Button>
        </Link>
      </div>

      <div
        style={{
          margin: "10px 30px"
        }}
      >
        <h1>
          Purchase Details |{" "}
          <span
            style={{
              color: "#FF5630",
              fontWeight: "bold",
              textTransform: "capitalize"
            }}
          >
            {purchase.type}
          </span>
        </h1>
        <Descriptions
          title=""
          style={{
            color: "#000000",
            fontWeight: "bold"
          }}
        >
          <Descriptions.Item label="Supplier Name">
            {purchase.supplier ? purchase.supplier.shop_name : ""}
          </Descriptions.Item>

          <Descriptions.Item label="Supplier Bill No">
            {purchase.supplier_bill_no}
          </Descriptions.Item>
          <Descriptions.Item label="Supplier Bill Date">
            {purchase.supplier_bill_date}
          </Descriptions.Item>
          <Descriptions.Item label="Purchase Date">
            {purchase.purchase_date}
          </Descriptions.Item>
          <Descriptions.Item label="Product Origin">
            {purchase.productOrigin ? purchase.productOrigin.name : ""}
          </Descriptions.Item>

          {purchase.type === "foreign" && (
            <>
              <Descriptions.Item label="Currency">
                {purchase.currency
                  ? `${purchase.currency.name} (${purchase.currency.rate})`
                  : ""}
              </Descriptions.Item>

              <Descriptions.Item label="CF">
                {purchase.cf ? purchase.cf.company_name : ""}
              </Descriptions.Item>
              {purchase.lc && (
                <Descriptions.Item label="LC">
                  {purchase.lc.name}
                </Descriptions.Item>
              )}
            </>
          )}
        </Descriptions>

        <>
          <div
            style={{
              margin: "10px 30px",
              color: "#FF5630",
              fontWeight: "bold"
            }}
          >
            <h1>Product Details</h1>
            <Descriptions
              // title="Product Details"
              style={{
                color: "#000000",
                fontWeight: "bold",
                marginTop: "20px"
              }}
            >
              <Descriptions.Item label="Purchase Qty">
                {item.purchase_qty}
              </Descriptions.Item>

              <Descriptions.Item label="Receive Qty">
                {item.received_qty}
              </Descriptions.Item>

              <Descriptions.Item label="Price">
                {item.unit_price}
              </Descriptions.Item>

              <Descriptions.Item label="Total Amount">
                {item.total_amount}
              </Descriptions.Item>
              <Descriptions.Item label="Product Origin">
                {item.productOrigin ? item.productOrigin.name : ""}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      </div>

      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={item.product_skus}
        pagination={false}
        // footer={() => (
        //   <div style={{ textAlign: "right" }}>
        //     <h3>Total: {item.total_cost_price}</h3>
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
    </>
  );
};

export default ProductDetails;
