// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";
import type { CarModel } from "@/interfaces/CarModel";

interface ApiResponse {
  data: {
    items: CarModel[];
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
    const carsData = JSON.parse(jsonContent);
    // Return the JSON data
    res.status(200).json({
      data: {
        items: carsData
      }
    });
  } else {
    // For other request methods, return a 405 Method Not Allowed status
    res.status(405).end();
  }
}
