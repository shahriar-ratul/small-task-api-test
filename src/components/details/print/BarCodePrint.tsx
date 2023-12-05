/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductModel } from "@/interfaces/ProductModel";
import type { PurchaseModel } from "@/interfaces/PurchaseModel";
import React from "react";
import BarCodeData from "./BarCodeData";

interface PropData {
  componentRef: any;
  purchase: PurchaseModel;
  item: ProductModel;
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

const BarCodePrint = ({ componentRef, item, purchase }: PropData) => {
  return (
    <>
      <div ref={componentRef}>
        {item.product_skus.map((sku, index) => {
          return (
            <>
              <BarCodeData
                item={item}
                purchase={purchase}
                sku={sku}
                key={index}
              />
            </>
          );
        })}
      </div>
    </>
  );
};

export default BarCodePrint;
