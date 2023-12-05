/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductModel, ProductSkuModel } from "@/interfaces/ProductModel";
import type { PurchaseModel } from "@/interfaces/PurchaseModel";
import React from "react";
import BarCodeData from "./BarCodeData";

interface PropData {
  componentRef: any;
  purchase: PurchaseModel;
  item: ProductModel;
  sku: ProductSkuModel;
}

// B- 0
// L-1
// A-2
// C- 3
// K- 4
// W- 5
// H- 6
// I -7
// T-8
// E- 9
//  1 inch = 96px
// 2 inch = 192px

const SingleBarCodePrint = ({
  componentRef,
  item,
  purchase,
  sku
}: PropData) => {
  return (
    <>
      <div
        ref={componentRef}
        style={{
          height: "25.4mm",
          width: "50.8mm"
        }}
      >
        <BarCodeData item={item} purchase={purchase} sku={sku} />
      </div>
    </>
  );
};

export default SingleBarCodePrint;
