/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Upload
} from "antd";

import axios from "axios";
import Cookies from "js-cookie";

import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile, UploadFileStatus } from "antd/es/upload/interface";
import AppAxios from "@/services/AppAxios";
import type { PurchaseModel } from "@/interfaces/PurchaseModel";
import type { CategoryModel } from "@/interfaces/CategoryModel";
import type { ItemModel } from "@/interfaces/ItemModel";
import ability from "@/services/guard/ability";
import Link from "next/link";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
interface FormData {
  cf_rate: number;
  gst: number;
  lc_cost: number;
  other_cost: number;

  purchase_qty: number;
  received_qty: number;
  price: number;
}

export interface BranchItem {
  name: string;
  branch_id: number;
  branch_name: string;
  brand_id?: any;
  brand_name?: any;
  color_id: number;
  color_name: string;
  size_id: number;
  size_name: string;
  item_id: number;
  category_id?: any;
  sub_category_id?: any;
  occasion_id: number;
  material_id: number;
  weight: number;
  quantity: number;
  cost_price: number;
  wholesale_margin: number;
  wholesale_price: number;
  wholesale_profit: number;
  retail_margin: number;
  retail_price: number;
  retail_profit: number;
}

interface PropData {
  purchase: PurchaseModel;
}

const CreateProductForm = ({ purchase }: PropData) => {
  const [form] = Form.useForm();
  // ** States
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [changeOrigin, setChangeOrigin] = useState(false);
  const [changeGst, setChangeGst] = useState(false);
  const [changeLcCost, setChangeLcCost] = useState(false);
  const [changeCfRate, setChangeCfRate] = useState(false);
  const [changeOtherCost, setChangeOtherCost] = useState(false);
  const [weight, setWeight] = useState(0);

  const [receivedQty, setReceivedQty] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const [gstRate, setGstRate] = useState(purchase.gst);

  const [gstPrice, setGstPrice] = useState(0);

  const [otherCostRate, setOtherCostRate] = useState(purchase.other_cost);

  const [lcCostRate, setLcCostRate] = useState(purchase.lc_cost);

  const [cfRate, setCfRate] = useState(purchase.cf_rate);

  const [occasions, setOccasions] = useState<any[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<any>(null);

  const [productOrigins, setProductOrigins] = useState<any[]>([]);
  const [selectedProductOrigin, setSelectedProductOrigin] = useState<any>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const [colors, setColors] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState<any[]>([]);

  const [sizes, setSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<any[]>([]);

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState<any[]>([]);

  const [itemSerial, setItemSerial] = useState<any>(null);

  // const [units, setUnits] = useState([]);
  // const [selectedUnit, setSelectedUnit] = useState(null);

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState<any[]>([]);

  const [filterBranch, setFilterBranch] = useState<any[]>([]);

  // const [itemInputs, setItemInputs] = useState<any[]>([]);

  const [wholesaleMargin, setWholesaleMargin] = useState(0);
  const [retailMargin, setRetailMargin] = useState(0);

  const [receivedPrice, setReceivedPrice] = useState<number | null>(null);

  const [itemPrice, setItemPrice] = useState<number>(0);

  const [singleItemPriceForeign, setSingleItemPriceForeign] =
    useState<number>(0);
  const [singleItemPrice, setSingleItemPrice] = useState<number>(0);
  const [singleGst, setSingleGst] = useState<number>(0);
  const [singleOtherCost, setSingleOtherCost] = useState<number>(0);
  const [singleCFCost, setSingleCFCost] = useState<number>(0);
  const [singleLCCost, setSingleLCCost] = useState<number>(0);

  const [sumForeignAmount, setSumForeignAmount] = useState<number>(0);
  const [sumAmount, setSumAmount] = useState<number>(0);
  const [sumNetAmount, setSumNetAmount] = useState<number>(0);
  const [sumNetAmountBDT, setSumNetAmountBDT] = useState<number>(0);
  const [sumCFCost, setSumCFCost] = useState<number>(0);
  const [sumGst, setSumGst] = useState<number>(0);
  const [sumLcCost, setSumLcCost] = useState<number>(0);
  const [sumOtherCost, setSumOtherCost] = useState<number>(0);
  const [sumInvest, setSumInvest] = useState<number>(0);
  const [sumWholeSale, setSumWholeSale] = useState<number>(0);
  const [sumWholeSaleProfit, setSumWholeSaleProfit] = useState<number>(0);
  const [sumRetail, setSumRetail] = useState<number>(0);
  const [sumRetailProfit, setSumRetailProfit] = useState<number>(0);

  const [sumWholesaleMargin, setSumWholesaleMargin] = useState<number>(0);
  const [sumRetailMargin, setSumRetailMargin] = useState<number>(0);

  const handleChangeOrigin = () => {
    form.setFieldsValue({ productOrigin: purchase.productOrigin.id });
    setSelectedProductOrigin(purchase.productOrigin.id);
    setChangeOrigin(true);
  };

  const handleChangeGst = () => {
    form.setFieldsValue({ gst: purchase.gst });

    setChangeGst(true);
  };

  const handleChangeLcCost = () => {
    form.setFieldsValue({ lc_cost: purchase.lc_cost });
    setChangeLcCost(true);
  };

  const handleChangeCfRate = () => {
    form.setFieldsValue({ cf_rate: purchase.cf_rate });
    setChangeCfRate(true);
  };

  const handleChangeOtherCost = () => {
    form.setFieldsValue({ other_cost: purchase.other_cost });
    setChangeOtherCost(true);
  };

  const handlePurchaseAmount = (qty: number, amount: number) => {
    if (qty && amount) {
      const total = qty * amount;
      setPurchaseAmount(total);
    }
  };

  const calculatePrice = (
    itemPrice: number,
    gstPercent: number,
    cfCost: number,
    lcCost: number,
    otherCost: number,
    weight: number
  ) => {
    if (String(purchase.type) === "foreign" && purchase.currency) {
      const rate = purchase.currency.rate;

      const gstCost = (itemPrice * gstPercent) / 100;

      const cost = itemPrice + gstCost;

      const convertedCost = cost * rate;

      const cf = weight * cfCost;

      const totalCost = convertedCost + cf + lcCost + otherCost;

      const price = Math.round(totalCost);

      setItemPrice(price);

      return price;
    } else {
      const gstCost = (itemPrice * gstPercent) / 100;

      setGstPrice(gstCost);

      const cost = itemPrice + gstCost;

      const totalCost = cost + otherCost;

      const price = Math.round(totalCost);

      setItemPrice(price);

      return price;
    }
  };

  const CalculateMarginRate = (price: number, margin: number) => {
    const rate = (price * margin) / 100;
    const afterMargin = Math.round(price + rate);
    return afterMargin;
  };

  const generateInputs = (
    selectedItem: number,
    selectedCategory: number | null,
    selectedOccasion: number | null,
    selectedMaterial: number | null,
    selectedBrand: any[],
    selectedColor: any[],
    selectedSize: any[],
    selectedBranch: any[],
    itemPrice: number,
    wholesaleMargin: number,
    wholesalePrice: number,
    retailMargin: number,
    retailPrice: number
  ) => {
    const items: any[] = [];

    // sort selectedBrand
    selectedBrand.sort((a: any, b: any) => a - b);
    // sort selectedColor
    selectedColor.sort((a: any, b: any) => a - b);
    // sort selectedBranch
    selectedBranch.sort((a: any, b: any) => a - b);
    // sort selectedSize
    selectedSize.sort((a: any, b: any) => a - b);

    const newBranches: any = branches.filter((branch: any) => {
      return selectedBranch.includes(branch.value);
    });

    const newBrands: any = brands.filter((brand: any) => {
      return selectedBrand.includes(brand.value);
    });

    const newColors: any = colors.filter((color: any) => {
      return selectedColor.includes(color.value);
    });

    const newSizes: any = sizes.filter((size: any) => {
      return selectedSize.includes(size.value);
    });

    if (newBranches.length > 0 && newColors.length > 0) {
      newBranches.forEach((branch: any) => {
        items.push({
          branch_id: branch.value,
          branch_name: branch.label,
          cost_price: itemPrice,
          wholesale_margin: wholesaleMargin,
          wholesale_price: wholesalePrice,
          wholesale_profit: wholesalePrice - itemPrice,
          retail_margin: retailMargin,
          retail_price: retailPrice,
          retail_profit: retailPrice - itemPrice,

          items: []
        });
      });

      if (newBrands.length > 0 && newSizes.length > 0) {
        newColors.forEach((color: any) => {
          newBrands.forEach((brand: any) => {
            newSizes.forEach((size: any) => {
              items.forEach((item: any) => {
                item.items.push({
                  name:
                    item.branch_name +
                    " - " +
                    brand.label +
                    " - " +
                    color.label +
                    " - " +
                    size.label,
                  branch_id: item.branch_id,
                  branch_name: item.branch_name,
                  brand_id: brand.value,
                  brand_name: brand.label,
                  color_id: color.value,
                  color_name: color.label,
                  size_id: size.value,
                  size_name: size.label,
                  item_id: selectedItem,
                  category_id: selectedCategory,
                  sub_category_id: null,
                  occasion_id: selectedOccasion,
                  material_id: selectedMaterial,

                  weight: weight,
                  quantity: 0,
                  cost_price: itemPrice,
                  wholesale_margin: wholesaleMargin,
                  wholesale_price: wholesalePrice,
                  wholesale_profit: wholesalePrice - itemPrice,
                  retail_margin: retailMargin,
                  retail_price: retailPrice,
                  retail_profit: retailPrice - itemPrice
                });
              });
            });
          });
        });
      }

      if (newBrands.length > 0 && newSizes.length === 0) {
        newColors.forEach((color: any) => {
          newBrands.forEach((brand: any) => {
            items.forEach((item: any) => {
              item.items.push({
                name:
                  item.branch_name + " - " + brand.label + " - " + color.label,
                branch_id: item.branch_id,
                branch_name: item.branch_name,
                brand_id: brand.value,
                brand_name: brand.label,
                color_id: color.value,
                color_name: color.label,
                size_id: null,
                size_name: null,
                item_id: selectedItem,
                category_id: selectedCategory,
                sub_category_id: null,
                occasion_id: selectedOccasion,
                material_id: selectedMaterial,
                weight: weight,
                quantity: 0,
                cost_price: itemPrice,
                wholesale_margin: wholesaleMargin,
                wholesale_price: wholesalePrice,
                wholesale_profit: wholesalePrice - itemPrice,
                retail_margin: retailMargin,
                retail_price: retailPrice,
                retail_profit: retailPrice - itemPrice
              });
            });
          });
        });
      }

      if (newBrands.length === 0 && newSizes.length > 0) {
        newColors.forEach((color: any) => {
          newSizes.forEach((size: any) => {
            items.forEach((item: any) => {
              item.items.push({
                name:
                  item.branch_name + " - " + color.label + " - " + size.label,
                branch_id: item.branch_id,
                branch_name: item.branch_name,
                brand_id: null,
                brand_name: null,
                color_id: color.value,
                color_name: color.label,
                size_id: size.value,
                size_name: size.label,
                item_id: selectedItem,
                category_id: selectedCategory,
                sub_category_id: null,
                occasion_id: selectedOccasion,
                material_id: selectedMaterial,
                weight: weight,
                quantity: 0,
                cost_price: itemPrice,
                wholesale_margin: wholesaleMargin,
                wholesale_price: wholesalePrice,
                wholesale_profit: wholesalePrice - itemPrice,
                retail_margin: retailMargin,
                retail_price: retailPrice,
                retail_profit: retailPrice - itemPrice
              });
            });
          });
        });
      }

      if (newBrands.length === 0 && newSizes.length === 0) {
        newColors.forEach((color: any) => {
          items.forEach((item: any) => {
            item.items.push({
              name: item.branch_name + " - " + color.label,
              branch_id: item.branch_id,
              branch_name: item.branch_name,
              brand_id: null,
              brand_name: null,
              color_id: color.value,
              color_name: color.label,
              size_id: null,
              size_name: null,
              item_id: selectedItem,
              category_id: selectedCategory,
              sub_category_id: null,
              occasion_id: selectedOccasion,
              material_id: selectedMaterial,
              weight: weight,
              quantity: 0,
              cost_price: itemPrice,
              wholesale_margin: wholesaleMargin,
              wholesale_price: wholesalePrice,
              wholesale_profit: wholesalePrice - itemPrice,
              retail_margin: retailMargin,
              retail_price: retailPrice,
              retail_profit: retailPrice - itemPrice
            });
          });
        });
      }

      setFilterBranch(items);
    }
  };

  useEffect(() => {
    // setItemInputs([]);
    setFilterBranch([]);
    if (!receivedPrice) {
      return;
    }

    const price = calculatePrice(
      receivedPrice,
      gstRate,
      cfRate,
      lcCostRate,
      otherCostRate,
      weight
    );

    const wholesalePrice = CalculateMarginRate(price, wholesaleMargin);

    const retailPrice = CalculateMarginRate(wholesalePrice, retailMargin);

    generateInputs(
      selectedItem,
      selectedCategory,
      selectedOccasion,
      selectedMaterial,
      selectedBrand,
      selectedColor,
      selectedSize,
      selectedBranch,
      itemPrice,
      wholesaleMargin,
      wholesalePrice,
      retailMargin,
      retailPrice
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedBranch,
    selectedBrand,
    selectedCategory,
    selectedColor,
    selectedItem,
    selectedMaterial,
    selectedSize,
    itemPrice,
    wholesaleMargin,
    retailMargin,
    selectedOccasion,
    cfRate,
    gstRate,
    lcCostRate,
    otherCostRate,
    weight,
    receivedPrice
  ]);

  // image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState(0);
  const handleCancel = () => setPreviewOpen(false);

  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const token = Cookies.get("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url ?? (file.preview as string));
    setPreviewOpen(true);
    if (file.name) {
      setPreviewTitle(file.name);
    } else if (file.url) {
      const fileName = file.url.substring(file.url.lastIndexOf("/") + 1);
      setPreviewTitle(fileName);
    } else {
      // Handle the case where both file.name and file.url are falsy or null/undefined
      setPreviewTitle("Image");
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // only remove the files that are not uploaded
    const filteredList = newFileList.filter(
      file =>
        file.status !== "removed" &&
        file.status !== "error" &&
        file.status !== "uploading"
    ) as UploadFile[];

    setFileList(filteredList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // handle dynamic input

  const handleSingleUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    // check file type
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
        ? true
        : false;
    if (!isJpgOrPng) {
      MySwal.fire({
        title: "Error",
        text: "You can only upload JPG/PNG/JPEG file!",
        icon: "error"
      });
      return;
    }

    // check file size
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      MySwal.fire({
        title: "Error",
        text: "Image must smaller than 2MB!",
        icon: "error"
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await AppAxios.post(
        "/api/v1/images/single/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: event => {
            if (event?.loaded && event?.total) {
              const percent = Math.floor((event.loaded / event.total) * 100);
              setProgress(percent);
              if (percent === 100) {
                setTimeout(() => setProgress(0), 1000);
              }
              onProgress({ percent: (event.loaded / event.total) * 100 });
            }
          }
        }
      );
      if (data.success) {
        onSuccess("Ok");
        //  add new file to the list of files
        fileList.push({
          uid: data.data.item.id,
          name: file.name,
          status: "done" as UploadFileStatus,
          url: data.data.item.path
        });
      }
    } catch (err) {
      console.log("Error: ", err);
      onError({ err });
    }
  };

  const getCategories = async (selectedItem: any) => {
    const res = await AppAxios.get(
      `/api/v1/common/all-categories-by-item-id/${selectedItem}`
    );
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: CategoryModel) => {
          return {
            label: item.display_name,
            value: item.id
          };
        });
        setCategories(items);
      }
    }
  };

  const handleCategoryChange = (value: any) => {
    setSelectedCategory(value as any);
    form.setFieldsValue({ category_id: value });
  };

  const getMaterials = async () => {
    const res = await AppAxios.get("/api/v1/common/all-materials");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setMaterials(items);
      }
    }
  };

  const handleMaterialChange = (value: any) => {
    setSelectedMaterial(value as any);
    form.setFieldsValue({ material_id: value });
  };

  const getOccasions = async () => {
    const res = await AppAxios.get("/api/v1/common/all-occasions");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setOccasions(items);
      }
    }
  };

  const handleShowImage = () => {
    // purchase.images.image.path
    // open image in new tab
    if (purchase.images.length > 0) {
      purchase.images.map((purchaseImage: any) => {
        window.open(purchaseImage.image.path, "_blank");
      });
    }
  };

  const handleOccasionChange = (value: any) => {
    setSelectedOccasion(value as any);
    form.setFieldsValue({ occasion_id: value });
  };

  const getColors = async () => {
    const res = await AppAxios.get("/api/v1/common/all-colors");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setColors(items);
      }
    }
  };

  const handleColorChange = (value: any[]) => {
    setSelectedColor(value as any[]);
    form.setFieldsValue({ color_id: value });
  };

  const getSizes = async () => {
    const res = await AppAxios.get("/api/v1/common/all-sizes");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setSizes(items);
      }
    }
  };

  const handleSizeChange = (value: any[]) => {
    setSelectedSize(value as any[]);
    form.setFieldsValue({ size_id: value });
  };

  const getBrands = async () => {
    const res = await AppAxios.get("/api/v1/common/all-brands");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setBrands(items);
      }
    }
  };

  const handleBrandChange = (value: any[]) => {
    setSelectedBrand(value as any[]);
    form.setFieldsValue({ brand_id: value });
  };

  const getProductOrigins = async () => {
    const res = await AppAxios.get("/api/v1/common/all-product-origins");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setProductOrigins(items);
      }
    }
  };

  const handleProductOriginChange = (value: any) => {
    setSelectedProductOrigin(value as any);
    form.setFieldsValue({ productOrigin: value });
  };

  // const getUnits = async () => {
  //   const res = await AppAxios.get("/api/v1/common/all-units");
  //   if (res.data.success) {
  //     if (res.data.data.items.length > 0) {
  //       const items = res.data.data.items.map((item: any) => {

  //         return {
  //           label: item.name,
  //           value: item.id
  //         };
  //       }
  //       );
  //       setUnits(items);
  //     }
  //   }
  // };

  // const handleUnitChange = (value: any) => {
  //   setSelectedUnit(value as any);
  //   form.setFieldsValue({ unit_id: value });
  // };

  const getBranches = async () => {
    const res = await AppAxios.get("/api/v1/common/all-branches");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          };
        });
        setBranches(items);
      }
    }
  };

  const handleBranchChange = (value: any[]) => {
    // sort selectedBranch
    value.sort((a: any, b: any) => a - b);
    setSelectedBranch(value as any[]);
    form.setFieldsValue({ branch_id: value });

    /*   const filterBranch: any = branches.filter((branch: any) =>
        value.includes(branch.value)
      );
  
      setFilterBranch(filterBranch); */
  };

  const getItems = async () => {
    const res = await AppAxios.get("/api/v1/common/all-items");
    if (res.data.success) {
      if (res.data.data.items.length > 0) {
        const items = res.data.data.items.map((item: ItemModel) => {
          return {
            label: item.display_name,
            value: item.id
          };
        });
        setItems(items);
      }
    }
  };

  const handleItemChange = (value: any) => {
    if (value != null) {
      setSelectedItem(value as any);
      form.setFieldsValue({ item_id: value });
    } else {
      setSelectedItem(null);
      form.setFieldsValue({ item_id: null });
      form.setFieldsValue({ category_id: null });
      setSelectedCategory(null);
      setCategories([]);
    }
  };

  const getMarginRate = async () => {
    const { data } = await AppAxios.get("/api/v1/common/default-margin");

    if (data.success) {
      if (data.data.item) {
        setWholesaleMargin(data.data.item.wholesale_rate);
        setRetailMargin(data.data.item.retail_rate);
      }
    }
  };

  const getItemSerial = async () => {
    const { data } = await AppAxios.get(
      `/api/v1/common/product-serial-number/${purchase.id}`
    );

    if (data.success) {
      if (data.data.item_serial) {
        setItemSerial(data.data.item_serial);
      } else {
        setItemSerial(1);
      }
    }
  };

  useEffect(() => {
    if (itemSerial) {
      form.setFieldsValue({ item_serial: itemSerial });
      setItemSerial(itemSerial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSerial]);

  useEffect(() => {
    if (purchase) {
      setSelectedProductOrigin(purchase.productOrigin.id);
      form.setFieldsValue({ productOrigin: purchase.productOrigin.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase]);

  useEffect(() => {
    getItemSerial();
    getMaterials();
    getColors();
    getSizes();
    getBrands();
    getBranches();
    getItems();
    getMarginRate();
    getProductOrigins();
    getOccasions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setCategories([]);
      getCategories(selectedItem);
      setSelectedCategory(null);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (receivedQty && receivedPrice) {
      if (purchase.type === "foreign") {
        const itemPrice = receivedPrice * purchase.currency.rate;
        const gstForeign = (gstRate * receivedPrice) / 100;
        const gst = ((gstRate * receivedPrice) / 100) * purchase.currency.rate;
        const otherCost = otherCostRate;
        const cf = weight * cfRate;

        setSingleGst(gst);
        setSingleCFCost(cf);
        setSingleLCCost(lcCostRate);
        setSingleOtherCost(otherCost);
        setSingleItemPrice(itemPrice);
        setSingleItemPriceForeign(receivedPrice);
        // const itemPrice = price + gst + otherCost + cf;

        const foreignPrice = receivedPrice;

        setSingleItemPrice(itemPrice);

        setSingleItemPriceForeign(foreignPrice);

        const totalItemPrice = itemPrice * receivedQty;
        const totalForeignPrice = foreignPrice * receivedQty;
        const totalForeignGst = gstForeign * receivedQty;
        const totalGst = gst * receivedQty;
        const totalOtherCost = otherCost * receivedQty;
        const totalCf = cf * receivedQty;
        const totalLCCost = lcCostRate * receivedQty;

        const totalNetAmount = totalForeignPrice + totalForeignGst;
        const totalNetAmountBDT = totalItemPrice + totalGst;

        const totalInvest =
          totalItemPrice + totalCf + totalLCCost + totalOtherCost + totalGst;

        setSumForeignAmount(totalForeignPrice);
        setSumAmount(totalItemPrice);
        setSumGst(totalGst);
        setSumOtherCost(totalOtherCost);
        setSumCFCost(totalCf);
        setSumLcCost(totalLCCost);

        setSumInvest(totalInvest);

        setSumNetAmount(totalNetAmount);
        setSumNetAmountBDT(totalNetAmountBDT);
      } else {
        const itemPrice = receivedPrice;
        const gst = (gstRate * itemPrice) / 100;
        const otherCost = otherCostRate;

        setSingleGst(gst);
        setSingleOtherCost(otherCost);
        setSingleItemPrice(itemPrice);
        setSingleItemPriceForeign(receivedPrice);

        const foreignPrice = receivedPrice;

        setSingleItemPrice(itemPrice);

        setSingleItemPriceForeign(foreignPrice);

        const totalItemPrice = itemPrice * receivedQty;
        const totalForeignPrice = foreignPrice * receivedQty;
        const totalGst = gst * receivedQty;
        const totalOtherCost = otherCost * receivedQty;

        const totalNetAmount = totalForeignPrice + totalGst;
        const totalNetAmountBDT = totalItemPrice + totalGst;

        const totalInvest = totalItemPrice + totalOtherCost + totalGst;

        setSumForeignAmount(totalForeignPrice);
        setSumAmount(totalItemPrice);
        setSumGst(totalGst);
        setSumOtherCost(totalOtherCost);

        setSumInvest(totalInvest);

        setSumNetAmount(totalNetAmount);
        setSumNetAmountBDT(totalNetAmountBDT);
      }
    }
  }, [
    receivedQty,
    receivedPrice,
    gstPrice,
    purchase,
    otherCostRate,
    weight,
    gstRate,
    cfRate,
    lcCostRate
  ]);

  useEffect(() => {
    const itemsOnly: BranchItem[] = filterBranch.reduce((acc, branch) => {
      return acc.concat(branch.items);
    }, []);

    let wholeSaleAmount = 0;
    let WholeSaleProfit = 0;
    let retailAmount = 0;
    let retailProfit = 0;

    itemsOnly.map((bItem: BranchItem) => {
      wholeSaleAmount =
        Number(wholeSaleAmount) +
        Number(bItem.quantity) * Number(bItem.wholesale_price);
      WholeSaleProfit =
        Number(WholeSaleProfit) +
        Number(bItem.quantity) * Number(bItem.wholesale_profit);
      retailAmount =
        Number(retailAmount) +
        Number(bItem.quantity) * Number(bItem.retail_price);
      retailProfit =
        Number(retailProfit) +
        Number(bItem.quantity) * Number(bItem.retail_profit);
    });

    const avgWholesaleMargin = (WholeSaleProfit / Number(sumInvest)) * 100;

    const avgRetailMargin = (retailProfit / Number(sumInvest)) * 100;

    setSumWholesaleMargin(parseFloat(avgWholesaleMargin.toFixed(2)));
    setSumRetailMargin(parseFloat(avgRetailMargin.toFixed(2)));

    setSumWholeSale(wholeSaleAmount);
    setSumWholeSaleProfit(WholeSaleProfit);
    setSumRetail(retailAmount);
    setSumRetailProfit(retailProfit);
  }, [filterBranch, sumInvest]);

  const onSubmit = async (data: FormData) => {
    const { purchase_qty, received_qty, price } = data;

    // console.log(data)

    const itemsOnly: BranchItem[] = filterBranch.reduce((acc, branch) => {
      return acc.concat(branch.items);
    }, []);

    const qty = itemsOnly.reduce((a: any, b: BranchItem) => a + b.quantity, 0);

    if (
      Number(qty) < Number(received_qty) ||
      Number(qty) > Number(received_qty)
    ) {
      MySwal.fire({
        title: "Error",
        text: "Qty must equal to total qty!",
        icon: "error"
      });
      return;
    }

    if (Number(qty) !== Number(received_qty)) {
      MySwal.fire({
        title: "Error",
        text: "Received Qty must be equal to total qty!",
        icon: "error"
      });

      return;
    }

    const formData = {
      item_serial: itemSerial,
      name: null,
      cf_rate: cfRate,
      gst: gstRate,
      lc_cost: lcCostRate,
      other_cost: otherCostRate,
      purchase_id: purchase.id,
      purchase_qty: purchase_qty,
      received_qty: received_qty,
      cost_price: price,
      // total_amount: purchaseAmount,

      product_origin_id: selectedProductOrigin,
      currency_id: purchase.currency.id,
      images: fileList.map(item => item.uid),
      skus: itemsOnly,

      total_qty: qty,
      total_amount: sumAmount,
      total_amount_foreign: sumForeignAmount,
      total_gst: sumGst,
      total_other_cost: sumOtherCost,
      total_cf_cost: sumCFCost,
      total_lc_cost: sumLcCost,
      net_amount: sumNetAmountBDT,
      net_amount_foreign: sumNetAmount,
      total_investment: sumInvest,

      total_wholesale_profit: sumWholeSaleProfit,
      total_wholesale_amount: sumWholeSale,
      avg_wholesale_profit_percent: sumWholesaleMargin,

      total_retail_profit: sumRetailProfit,
      total_retail_amount: sumRetail,
      avg_retail_profit_percent: sumRetailMargin,

      total_cost_price: sumInvest
    };

    try {
      await AppAxios.post(`/api/v1/products`, formData)
        .then(res => {
          const { data } = res;

          // console.log(data)

          MySwal.fire({
            title: "Success",
            text: data.data.message || "Item Added successfully",
            icon: "success"
          }).then(() => {
            router.replace(
              `/admin/purchase/purchase/${purchase.id}/product/${data.data.item.id}`
            );
          });
        })
        .catch(err => {
          MySwal.fire({
            title: "Error",
            text: err.response.data.message || "Something went wrong",
            icon: "error"
          });
          console.log(err);
          setShowError(true);
          setErrorMessages(err.response.data.message);
        });
    } catch (err: any) {
      // console.log(err)
      setShowError(true);
      setErrorMessages(err.message);
    }
  };

  return (
    <>
      {showError && <Alert message={errorMessages} type="error" showIcon />}

      <Row>
        <Col lg={16} md={24} sm={24} xs={24}>
          {/* Currency : IC ( 1.35 ) */}
          {purchase.type === "foreign" && (
            <Space>
              <h1 className="font-bold text-sm">
                Currency :{" "}
                <span className="text-danger mr-6">
                  {purchase.currency ? purchase.currency.name : ""}({" "}
                  {purchase.currency ? purchase.currency.rate : ""})
                </span>
              </h1>
            </Space>
          )}
        </Col>

        <Col lg={8} md={24} sm={24} xs={24}>
          <Space>
            {ability.can("purchase.update", "") ? (
              <Space size="middle" align="center" wrap>
                <Link href={`/admin/purchase/purchase/${purchase.id}/edit`}>
                  <Button type="primary" icon={<EditOutlined />} />
                </Link>
              </Space>
            ) : null}
            {purchase && purchase.images.length > 0 ? (
              <Space size="middle" align="center" wrap className="ml-5">
                <Button
                  style={{
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                    color: "#fff"
                  }}
                  icon={<EyeOutlined />}
                  onClick={handleShowImage}
                />
              </Space>
            ) : null}
          </Space>
        </Col>
      </Row>
      <Row
        style={{
          width: "100%"
        }}
        justify={"center"}
      >
        <Col span={8}>
          <Card>
            <h4>Item Price : {singleItemPriceForeign}</h4>

            <h4>Item Price BDT : {singleItemPrice}</h4>

            <h4>Gst Per Item BDT : {singleGst}</h4>
            <h4>Other Cost Per Item: {singleOtherCost}</h4>
            {purchase.type === "foreign" && (
              <>
                <h4>Item Cf Cost : {singleCFCost}</h4>
                <h4>Item Lc Cost : {singleLCCost}</h4>
              </>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              textAlign: "left"
            }}
          >
            <h4>Total Amount BDT : {sumAmount}</h4>
            {purchase.type === "foreign" && (
              <>
                <h4>Total Amount: {sumForeignAmount}</h4>
                <h4>Total Amount Foreign: {sumNetAmount}</h4>
              </>
            )}

            <h4>Total Net Amount BDT : {sumNetAmountBDT}</h4>

            <h4>Total Gst BDT : {sumGst}</h4>
            <h4>Total Other Cost: {sumOtherCost}</h4>
            {purchase.type === "foreign" && (
              <>
                <h4>Total CF Cost: {sumCFCost}</h4>

                <h4>Total LC Cost : {sumLcCost}</h4>
              </>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              textAlign: "left"
            }}
          >
            <h4>Total Invest: {sumInvest}</h4>

            <h4>Wholesale Revenue : {sumWholeSale}</h4>

            <h4>Total Wholesale Profit : {sumWholeSaleProfit}</h4>

            <h4>AVG Wholesale margin : {sumWholesaleMargin}</h4>

            <h4>Retail Revenue : {sumRetail}</h4>

            <h4>Retail Profit : {sumRetailProfit}</h4>

            <h4>AVG Retail margin : {sumRetailMargin}</h4>
          </Card>
        </Col>
      </Row>

      <div className="mt-3">
        <Form
          // {...layout}
          autoComplete="off"
          onFinish={onSubmit}
          form={form}
          initialValues={{
            purchase_id: purchase.id,
            item_id: "",
            category_id: "",
            material_id: "",
            brand_id: "",
            color_id: "",
            size_id: "",
            unit_id: "",

            cf_rate: "",
            gst: "",
            lc_cost: "",
            other_cost: "",

            purchase_qty: "",
            received_qty: "",
            price: "",

            branch_id: ""
          }}
          style={{ maxWidth: "100%" }}
          name="wrap"
          layout="vertical"
          colon={false}
          scrollToFirstError
        >
          <Row
            gutter={[16, 16]}
            style={{
              justifyContent: "center"
            }}
          >
            <Col lg={8} md={24}>
              {/* Product Origin */}
              {!changeOrigin && (
                <Space>
                  <h1 className="font-bold text-sm">
                    Product Origin :{" "}
                    <span className="text-danger mr-6 ">
                      {purchase.productOrigin
                        ? purchase.productOrigin.name
                        : ""}
                    </span>
                    <Button
                      size="small"
                      onClick={handleChangeOrigin}
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                        color: "#fff"
                      }}
                    >
                      Change
                    </Button>
                  </h1>
                </Space>
              )}

              {changeOrigin && (
                <>
                  <Form.Item
                    label="Product Origin"
                    name="productOrigin"
                    style={{
                      marginBottom: 0
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Product Origin!"
                      }
                    ]}
                  >
                    <Space style={{ width: "100%" }} direction="vertical">
                      <Select
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        onChange={handleProductOriginChange}
                        options={productOrigins}
                        value={selectedProductOrigin}
                      />
                    </Space>
                  </Form.Item>
                </>
              )}
            </Col>
            <Col lg={8} md={24}>
              {!changeGst && (
                <Space>
                  <h1 className="font-bold text-sm">
                    GST (%) :{" "}
                    <span className="text-danger mr-6">{purchase.gst} %</span>
                    <Button
                      size="small"
                      onClick={handleChangeGst}
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                        color: "#fff"
                      }}
                    >
                      Change
                    </Button>
                  </h1>
                </Space>
              )}

              {changeGst && (
                <>
                  <Form.Item
                    label="GST"
                    style={{
                      marginBottom: 0
                    }}
                    name="gst"
                    rules={[
                      {
                        required: true,
                        message: "Please input your GST!"
                      }
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="GST"
                      className={`form-control`}
                      name="gst"
                      onChange={e => {
                        const gst = parseFloat(e.target.value);
                        setGstRate(gst);
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </Col>
            <Col lg={8} md={24}>
              {!changeOtherCost && (
                <Space>
                  <h1 className="font-bold text-sm">
                    Other Cost :{" "}
                    <span className="text-danger mr-6">
                      {purchase.other_cost} BDT
                    </span>
                  </h1>
                  <Button
                    size="small"
                    onClick={handleChangeOtherCost}
                    style={{
                      backgroundColor: "#dc3545",
                      borderColor: "#dc3545",
                      color: "#fff"
                    }}
                  >
                    Change
                  </Button>
                </Space>
              )}

              {changeOtherCost && (
                <>
                  <Form.Item
                    label="Other Cost"
                    style={{
                      marginBottom: 0
                    }}
                    name="other_cost"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Other Cost!"
                      }
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Other Cost"
                      className={`form-control`}
                      name="other_cost"
                      onChange={e => {
                        const other_cost = parseFloat(e.target.value);
                        setOtherCostRate(other_cost);
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>

          {purchase.type === "foreign" && (
            <Row
              gutter={[16, 16]}
              style={{
                justifyContent: "center"
              }}
            >
              <Col lg={12} md={24}>
                {!changeLcCost && (
                  <Space>
                    <h1 className="font-bold text-sm">
                      Lc Cost :{" "}
                      <span className="text-danger mr-6">
                        {purchase.lc_cost} BDT
                      </span>
                    </h1>
                    <Button
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                        color: "#fff"
                      }}
                      size="small"
                      onClick={handleChangeLcCost}
                    >
                      Change
                    </Button>
                  </Space>
                )}

                {changeLcCost && (
                  <>
                    <Form.Item
                      label="LC Cost"
                      style={{
                        marginBottom: 0
                      }}
                      name="lc_cost"
                      rules={[
                        {
                          required: true,
                          message: "Please input your LC Cost!"
                        }
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="LC Cost"
                        className={`form-control`}
                        name="lc_cost"
                        onChange={e => {
                          const lc_cost = parseFloat(e.target.value);
                          setLcCostRate(lc_cost);
                        }}
                      />
                    </Form.Item>
                  </>
                )}
              </Col>

              <Col lg={12} md={24}>
                {!changeCfRate && (
                  <Space>
                    <h1 className="font-bold text-sm">
                      C & F Rate :{" "}
                      <span className="text-danger mr-6">
                        {purchase.cf_rate} / KG
                      </span>
                    </h1>
                    <Button
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                        color: "#fff"
                      }}
                      size="small"
                      onClick={handleChangeCfRate}
                    >
                      Change
                    </Button>
                  </Space>
                )}
                {changeCfRate && (
                  <>
                    <Form.Item
                      label="C & F Rate ( 1 Kg rate )"
                      style={{
                        marginBottom: 0
                      }}
                      name="cf_rate"
                      rules={[
                        {
                          required: true,
                          message: "Please input your C & F Rate ( 1 Kg rate )!"
                        }
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="C & F Rate ( 1 Kg rate )"
                        className={`form-control`}
                        name="cf_rate"
                        onChange={e => {
                          const cf_rate = parseFloat(e.target.value);
                          setCfRate(cf_rate);
                        }}
                      />
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
          )}

          <Row
            gutter={[16, 16]}
            style={{
              justifyContent: "center"
            }}
          >
            <Col lg={4} md={24}>
              {/* item_serial */}
              <Form.Item
                label="Serial No"
                style={{
                  marginBottom: 0
                }}
                name="item_serial"
                rules={[
                  {
                    required: true,
                    message: "Please input your Serial No!"
                  }
                ]}
              >
                <Input
                  type="number"
                  placeholder="Serial No"
                  className={`form-control`}
                  name="item_serial"
                  value={itemSerial}
                  onChange={e => {
                    setItemSerial(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={4} md={24}>
              {/* purchase_qty */}
              <Form.Item
                label="Purchase Qty"
                style={{
                  marginBottom: 0
                }}
                name="purchase_qty"
                rules={[
                  {
                    required: true,
                    message: "Please input your purchase qty!"
                  }
                ]}
              >
                <Input
                  type="number"
                  placeholder="Purchase Qty"
                  className={`form-control`}
                  name="purchase_qty"
                />
              </Form.Item>
            </Col>

            <Col lg={4} md={24}>
              {/* received_qty */}
              <Form.Item
                label="Received Qty"
                style={{
                  marginBottom: 0
                }}
                name="received_qty"
                rules={[
                  {
                    required: true,
                    message: "Please input your received qty!"
                  }
                ]}
              >
                <Input
                  type="number"
                  placeholder="Received Qty"
                  className={`form-control`}
                  name="received_qty"
                  onChange={e => {
                    const received_qty = parseFloat(e.target.value);
                    setReceivedQty(received_qty);
                    if (receivedPrice) {
                      handlePurchaseAmount(received_qty, receivedPrice);
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col lg={4} md={24}>
              {/* price */}
              <Form.Item
                label="Purchase Price"
                style={{
                  marginBottom: 0
                }}
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price!"
                  }
                ]}
              >
                <Input
                  type="number"
                  placeholder="Price"
                  className={`form-control`}
                  name="price"
                  onChange={e => {
                    const price = parseFloat(e.target.value);
                    setReceivedPrice(price);
                    handlePurchaseAmount(receivedQty, price);
                  }}
                />
              </Form.Item>
            </Col>

            <Col lg={4} md={24}>
              {/* amount */}
              <Form.Item
                label="Amount"
                style={{
                  marginBottom: 0
                }}
                // name="amount"
              >
                <Input
                  readOnly
                  type="number"
                  placeholder="amount"
                  className={`form-control`}
                  name="amount"
                  value={purchaseAmount}
                />
              </Form.Item>
            </Col>

            <Col lg={4} md={24}>
              {/* weight */}
              <Form.Item
                label="weight"
                style={{
                  marginBottom: 0
                }}
                name="weight"
                rules={[
                  {
                    required: purchase.type === "foreign" ? true : false,
                    message: "Please input your weight!"
                  }
                ]}
              >
                <Input
                  type="number"
                  placeholder="weight"
                  className={`form-control`}
                  name="weight"
                  onChange={e => {
                    // console.log(e.target.value);
                    const weight = parseFloat(e.target.value);
                    setWeight(weight);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            style={{
              justifyContent: "center"
            }}
          >
            <Col lg={6} md={24}>
              {/* Item */}
              <Form.Item
                label="Item"
                name="item_id"
                style={{
                  marginBottom: 0
                }}
                rules={[
                  {
                    required: true,
                    message: "Please input your Item!"
                  }
                ]}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleItemChange}
                    options={items}
                    value={selectedItem}
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* category */}
              <Form.Item
                label="Category"
                name="category_id"
                style={{
                  marginBottom: 0
                }}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleCategoryChange}
                    options={categories}
                    value={selectedCategory}
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* occasion */}
              <Form.Item
                label="Occasion"
                name="occasion_id"
                style={{
                  marginBottom: 0
                }}
                rules={[
                  {
                    required: true,
                    message: "Please input your Occasion!"
                  }
                ]}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleOccasionChange}
                    options={occasions}
                    value={selectedOccasion}
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* Brand */}
              <Form.Item
                label="Brand"
                name="brand_id"
                style={{
                  marginBottom: 0
                }}
                /*   rules={[
{
required: true,
message: "Please input your Brand!"
}
]} */
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleBrandChange}
                    options={brands}
                    value={selectedBrand}
                    mode="multiple"
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* Material */}
              <Form.Item
                label="Material"
                name="material_id"
                style={{
                  marginBottom: 0
                }}
                rules={[
                  {
                    required: true,
                    message: "Please input your Material!"
                  }
                ]}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleMaterialChange}
                    options={materials}
                    value={selectedMaterial}
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* Color */}
              <Form.Item
                label="Color"
                name="color_id"
                style={{
                  marginBottom: 0
                }}
                rules={[
                  {
                    required: true,
                    message: "Please input your Color!"
                  }
                ]}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleColorChange}
                    options={colors}
                    value={selectedColor}
                    mode="multiple"
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* Size */}
              <Form.Item
                label="Size"
                name="size_id"
                style={{
                  marginBottom: 0
                }}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleSizeChange}
                    options={sizes}
                    value={selectedSize}
                  />
                </Space>
              </Form.Item>
            </Col>

            <Col lg={6} md={24}>
              {/* branch */}
              <Form.Item
                label="Branch"
                name="branch_id"
                style={{
                  marginBottom: 0
                }}
                rules={[
                  {
                    required: true,
                    message: "Please Select your branch!"
                  }
                ]}
              >
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    onChange={handleBranchChange}
                    options={branches}
                    value={selectedBranch}
                    mode="multiple"
                  />
                </Space>
              </Form.Item>
            </Col>
          </Row>

          {filterBranch.length > 0 &&
            filterBranch.map((branch, index) => (
              <>
                <Row
                  gutter={[16, 16]}
                  // key={index}
                  style={{
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                  key={index}
                >
                  <Col lg={3} md={12}>
                    <h1
                      className="font-bold align-middle text-sm"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                        // fontSize: "12px"
                      }}
                    >
                      {branch.branch_name}
                    </h1>
                  </Col>

                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Cost Price : </h1>
                    <Input
                      type="number"
                      placeholder="Cost Price"
                      value={branch.cost_price}
                      readOnly
                      onChange={e => {
                        const costPrice = parseFloat(e.target.value);

                        const itemAfterCostPrice = branch.items.map(
                          (item: any) => {
                            return {
                              ...item,
                              cost_price: costPrice
                            };
                          }
                        );

                        const newBranch = filterBranch.map(
                          (branchItem: any, i: number) => {
                            if (index === i) {
                              return {
                                ...branchItem,
                                cost_price: costPrice,
                                items: itemAfterCostPrice
                              };
                            }
                            return branchItem;
                          }
                        );

                        setFilterBranch(newBranch);
                      }}
                    />
                  </Col>

                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Wh Margin : </h1>
                    <Input
                      type="number"
                      placeholder="Wholesale Margin"
                      value={branch.wholesale_margin}
                      onChange={e => {
                        const margin = parseFloat(e.target.value);

                        const itemAfterMargin = branch.items.map(
                          (item: any) => {
                            const wholesale_price = Math.round(
                              item.cost_price + (item.cost_price * margin) / 100
                            );

                            return {
                              ...item,
                              wholesale_margin: margin,
                              wholesale_price: wholesale_price,
                              wholesale_profit: Math.round(
                                wholesale_price - item.cost_price
                              ),
                              retail_price: Math.round(
                                wholesale_price +
                                  (wholesale_price * item.retail_margin) / 100
                              ),
                              retail_profit: Math.round(
                                wholesale_price +
                                  (wholesale_price * item.retail_margin) / 100 -
                                  item.cost_price
                              )
                            };
                          }
                        );

                        const newBranch = filterBranch.map(
                          (branchItem: any, i: number) => {
                            if (index === i) {
                              const wholesale_price = Math.round(
                                branchItem.cost_price +
                                  (branchItem.cost_price * margin) / 100
                              );

                              return {
                                ...branchItem,
                                wholesale_margin: margin,
                                wholesale_price: wholesale_price,
                                wholesale_profit: Math.round(
                                  wholesale_price - branchItem.cost_price
                                ),
                                retail_price: Math.round(
                                  wholesale_price +
                                    (wholesale_price *
                                      branchItem.retail_margin) /
                                      100
                                ),
                                retail_profit: Math.round(
                                  wholesale_price +
                                    (wholesale_price *
                                      branchItem.retail_margin) /
                                      100 -
                                    branchItem.cost_price
                                ),
                                items: itemAfterMargin
                              };
                            }
                            return branchItem;
                          }
                        );

                        setFilterBranch(newBranch);
                      }}
                    />
                  </Col>

                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Wh Price : </h1>
                    <Input
                      type="number"
                      placeholder="Wholesale Price"
                      value={branch.wholesale_price}
                      onChange={e => {
                        const price = parseFloat(e.target.value);

                        const itemAfterPrice = branch.items.map((item: any) => {
                          return {
                            ...item,
                            wholesale_price: Math.round(price),
                            wholesale_margin: Math.round(
                              ((price - item.cost_price) / item.cost_price) *
                                100
                            ),
                            wholesale_profit: Math.round(
                              price - item.cost_price
                            ),
                            retail_price: Math.round(
                              (price * item.retail_margin) / 100
                            ),
                            retail_profit: Math.round(
                              (price * item.retail_margin) / 100 -
                                item.cost_price
                            )
                          };
                        });

                        const newBranch = filterBranch.map(
                          (branchItem: any, i: number) => {
                            if (index === i) {
                              return {
                                ...branchItem,
                                wholesale_price: Math.round(price),
                                wholesale_margin: Math.round(
                                  ((price - branchItem.cost_price) /
                                    branchItem.cost_price) *
                                    100
                                ),
                                wholesale_profit: Math.round(
                                  price - branchItem.cost_price
                                ),
                                retail_price: Math.round(
                                  price +
                                    (price * branchItem.retail_margin) / 100
                                ),
                                retail_profit: Math.round(
                                  price +
                                    (price * branchItem.retail_margin) / 100 -
                                    branchItem.cost_price
                                ),
                                items: itemAfterPrice
                              };
                            }
                            return branchItem;
                          }
                        );

                        setFilterBranch(newBranch);
                      }}
                    />
                  </Col>

                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Wh Profit : </h1>
                    <Input
                      type="number"
                      placeholder="Wholesale Profit"
                      value={branch.wholesale_profit}
                      readOnly
                    />
                  </Col>
                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Rt Margin : </h1>
                    <Input
                      type="number"
                      placeholder="Retail Margin"
                      value={branch.retail_margin}
                      onChange={e => {
                        const margin = parseFloat(e.target.value);

                        const itemAfterMargin = branch.items.map(
                          (item: any) => {
                            return {
                              ...item,
                              retail_margin: margin,
                              retail_price: Math.round(
                                item.wholesale_price +
                                  (item.wholesale_price * margin) / 100
                              ),
                              retail_profit: Math.round(
                                item.wholesale_price +
                                  (item.wholesale_price * margin) / 100 -
                                  item.cost_price
                              )
                            };
                          }
                        );

                        const newBranch = filterBranch.map(
                          (branchItem: any, i: number) => {
                            if (index === i) {
                              return {
                                ...branchItem,
                                retail_margin: margin,
                                retail_price: Math.round(
                                  branchItem.wholesale_price +
                                    (branchItem.wholesale_price * margin) / 100
                                ),
                                retail_profit: Math.round(
                                  branchItem.wholesale_price +
                                    (branchItem.wholesale_price * margin) /
                                      100 -
                                    branchItem.cost_price
                                ),
                                items: itemAfterMargin
                              };
                            }
                            return branchItem;
                          }
                        );

                        setFilterBranch(newBranch);
                      }}
                    />
                  </Col>
                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Rt Price : </h1>
                    <Input
                      type="number"
                      placeholder="Retail Price"
                      value={branch.retail_price}
                      onChange={e => {
                        const price = parseFloat(e.target.value);

                        const itemAfterPrice = branch.items.map((item: any) => {
                          return {
                            ...item,
                            retail_price: Math.round(price),
                            // show only 2 decimal point
                            retail_margin: Math.floor(
                              ((price - item.wholesale_price) /
                                item.wholesale_price) *
                                100
                            ),
                            retail_profit: Math.round(price - item.cost_price)
                          };
                        });

                        const newBranch = filterBranch.map(
                          (branchItem: any, i: number) => {
                            if (index === i) {
                              return {
                                ...branchItem,
                                retail_price: Math.round(price),
                                retail_margin: Math.floor(
                                  ((price - branchItem.wholesale_price) /
                                    branchItem.wholesale_price) *
                                    100
                                ),
                                retail_profit: Math.round(
                                  price - branchItem.cost_price
                                ),
                                items: itemAfterPrice
                              };
                            }
                            return branchItem;
                          }
                        );

                        setFilterBranch(newBranch);
                      }}
                    />
                  </Col>
                  <Col lg={3} md={12}>
                    <h1 className="font-bold text-sm">Rt Profit : </h1>
                    <Input
                      type="number"
                      placeholder="Retail Profit"
                      value={branch.retail_profit}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row
                  gutter={[16, 16]}
                  style={{
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    marginBottom: "10px",
                    overflowX: "auto"
                  }}
                >
                  {branch.items.length > 0 &&
                    branch.items.map((qtyItem: any, itemIndex: number) => (
                      <Col lg={4} md={12} key={itemIndex}>
                        <h1 className="font-bold text-sm">
                          {qtyItem.color_name} {qtyItem.size_name}
                        </h1>
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={qtyItem.quantity}
                          onChange={e => {
                            const quantity = parseFloat(e.target.value);

                            const itemAfterQty = branch.items.map(
                              (item: any, i: number) => {
                                if (itemIndex === i) {
                                  return {
                                    ...item,
                                    quantity: quantity
                                  };
                                }
                                return item;
                              }
                            );

                            const newBranch = filterBranch.map(
                              (branchItem: any, i: number) => {
                                if (index === i) {
                                  return {
                                    ...branchItem,
                                    items: itemAfterQty
                                  };
                                }
                                return branchItem;
                              }
                            );

                            setFilterBranch(newBranch);
                          }}
                        />
                      </Col>
                    ))}
                </Row>
              </>
            ))}

          {/* image */}
          <Form.Item
            label=""
            style={{
              marginBottom: 0
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Upload
                customRequest={handleSingleUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                defaultFileList={fileList}
                accept="image/jpeg,image/png,image/jpg"
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {progress > 0 ? <Progress percent={progress} /> : null}

              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="image" style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </Space>
          </Form.Item>

          {/* submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateProductForm;
