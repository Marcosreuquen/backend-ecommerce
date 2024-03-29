import { NextApiRequest, NextApiResponse } from "next";
import { productsController } from "controllers/products";
const { send } = require("micro");
const methods = require("micro-method-router");
import * as yup from "yup";
import { validateQuerySchema } from "middlewares/validateSchema";
import corsMiddleware from "middlewares/corsMiddleware";

const querySchema = yup.object().shape({
  productId: yup.string().required(),
});

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productId } = req.query;
    const data = await productsController.getProduct(productId);
    await send(res, 200, data);
  } catch (error) {
    await send(res, 404, {
      status: error.status,
      message: error.message,
    });
  }
}

const handlers = methods({
  get: getHandler,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, validateQuerySchema(querySchema, handlers));
};
