import {
  type ProductSkuModel,
  type ProductModel
} from "@/interfaces/ProductModel";
import { type PurchaseModel } from "@/interfaces/PurchaseModel";
import React from "react";
import Barcode from "react-barcode";

function TruncatedString({ text, count = 9 }: { text: string; count: number }) {
  let truncatedText;

  if (text.length <= count) {
    truncatedText = text;
  } else {
    truncatedText = text.slice(0, count) + "";
  }

  return <span>{truncatedText}</span>;
}

interface PropData {
  purchase: PurchaseModel;
  item: ProductModel;
  sku: ProductSkuModel;
}

const BarCodeData = ({ item, purchase, sku }: PropData) => {
  const convertNumberToCode = (number: number) => {
    // replace all number with code B- 0 L-1 A-2 C- 3 K- 4 W- 5 H- 6 I -7 T-8 E- 9
    const numberString = number.toString();
    let codeString = "";

    // while loop
    let i = 0;
    while (i < numberString.length) {
      const char = numberString.charAt(i);
      switch (char) {
        case "0":
          codeString += "B";
          break;
        case "1":
          codeString += "L";
          break;
        case "2":
          codeString += "A";
          break;
        case "3":
          codeString += "C";
          break;
        case "4":
          codeString += "K";
          break;
        case "5":
          codeString += "W";
          break;
        case "6":
          codeString += "H";
          break;
        case "7":
          codeString += "I";
          break;
        case "8":
          codeString += "T";
          break;
        case "9":
          codeString += "E";
          break;
      }
      i++;
    }

    return codeString;
  };

  return (
    <>
      <div
        style={{
          display: "inline-block",
          maxWidth: "192px",
          maxHeight: "96px",
          textAlign: "center",
          margin: "5px 7px",
          padding: "2px 2px",
          // border: "1px solid #000000",
          // borderRadius: "10px",
          fontSize: "9px"
        }}
      >
        {sku && (
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                display: "inline-block",
                width: "20%",
                fontSize: "9px",
                paddingLeft: "5px"
              }}
            >
              {purchase.supplier && purchase.supplier.code && (
                <TruncatedString
                  text={purchase.supplier && purchase.supplier.code}
                  count={4}
                />
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                width: "30%",
                fontSize: "9px"
              }}
            >
              {convertNumberToCode(sku.wholesale_price)}
            </div>
            <div style={{ display: "inline-block", width: "30%" }}>
              {purchase.productOrigin && purchase.productOrigin.name && (
                <TruncatedString
                  text={purchase.productOrigin && purchase.productOrigin.name}
                  count={12}
                />
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                width: "20%",
                fontSize: "9px",
                paddingRight: "5px",
                textAlign: "right"
              }}
            >
              {item.item_serial}/{item.received_qty}
            </div>
          </div>
        )}
        <Barcode
          value={sku.sku_code}
          height={15}
          width={1.8}
          fontSize={6}
          margin={2}
          format="CODE128"
          lineColor="#000000"
          background="#ffffff"
          marginTop={10}
          // marginBottom={0}
          // marginLeft={0}
          // marginRight={0}
          displayValue={true}
          // textPosition="top"
          // textMargin={0}
          // background="#ffffff"
          // lineColor="#000000"
          // fontOptions=""
          font="monospace"
          textAlign="center"
        />
        <br />
        <div>
          <div
            style={{
              display: "inline-block",
              width: "100%"
            }}
          >
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "16px"
              }}
            >
              TK. {sku.retail_price}
            </h1>
          </div>
        </div>

        {sku && (
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                display: "inline-block",
                width: "20%",
                paddingLeft: "5px"
              }}
            >
              {sku.branch && sku.branch?.code && (
                <TruncatedString
                  text={sku.branch && sku.branch?.code}
                  count={5}
                />
              )}
            </div>
            <div style={{ display: "inline-block", width: "40%" }}>
              {sku.item && sku.item.name && (
                <TruncatedString text={sku.item && sku.item.name} count={12} />
              )}
            </div>
            <div style={{ display: "inline-block", width: "20%" }}>
              {sku.color && sku.color.name && (
                <TruncatedString
                  text={sku.color && sku.color.name}
                  count={10}
                />
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                width: "20%",
                paddingRight: "5px",
                textAlign: "right"
              }}
            >
              {sku.size && sku.size.name && (
                <TruncatedString text={sku.size && sku.size.name} count={8} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BarCodeData;
