// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

interface CarModel {
  id: string;
  isInProduction: boolean;
  brand: string;
  model: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: {
    items: CarModel[];
    total: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "public/json", "cars.json");

    // Read the content of the JSON file
    const jsonContent = await fs.readFile(filePath, "utf-8");

    // Parse the JSON content
    let carsData = JSON.parse(jsonContent);

    // Get query parameters from the URL
    const { sort, order, brand, model, color, isInProduction } = req.query;

    // Checking if the 'sort' parameter is a valid property on CarModel

    if (sort && typeof sort === "string" && sort in carsData[0]) {
      // Assuming 'sort' is a valid property on CarModel, apply sorting logic
      carsData.sort((a: any, b: any) => {
        // Add type annotations for parameters 'a' and 'b'
        const aValue: string = a[sort];
        const bValue: string = b[sort];
        if (order === "ascend") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply filtering logic
    // console.log(carsData.length);
    if (
      brand &&
      typeof brand === "string" &&
      brand !== "null" &&
      brand !== "undefined" &&
      brand !== null &&
      brand !== undefined
    ) {
      // console.log("brand", carsData.length);
      carsData = carsData.filter((car: CarModel) => car.brand === brand);
    }

    if (
      model &&
      typeof model === "string" &&
      model !== "null" &&
      model !== "undefined" &&
      model !== null &&
      model !== undefined
    ) {
      carsData = carsData.filter((car: CarModel) => car.model === model);
    }

    if (
      color &&
      typeof color === "string" &&
      color !== "null" &&
      color !== "undefined" &&
      color !== null &&
      color !== undefined
    ) {
      carsData = carsData.filter((car: CarModel) => car.color === color);
    }

    if (
      isInProduction &&
      typeof isInProduction === "string" &&
      isInProduction !== "null" &&
      isInProduction !== "undefined" &&
      isInProduction !== null &&
      isInProduction !== undefined
    ) {
      carsData = carsData.filter(
        (car: CarModel) => car.isInProduction === Boolean(isInProduction)
      );
    }

    // Return the JSON data
    res.status(200).json({
      data: {
        total: carsData.length,
        items: carsData
      }
    });
  } else {
    // For other request methods, return a 405 Method Not Allowed status
    res.status(405).end();
  }
}
