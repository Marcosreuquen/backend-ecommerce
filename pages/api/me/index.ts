import { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "middlewares/authMiddleware";
const { send } = require("micro");
const methods = require("micro-method-router");
import { UsersController } from "controllers/users";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  decodedToken: tokenData
) {
  try {
    const data = await UsersController.getUserBy(decodedToken.userId);
    await send(res, 200, data);
  } catch (error) {
    await send(res, 404, error);
  }
}
async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  decodedToken: tokenData
) {
  const changes = req.body;
  try {
    const data = await UsersController.updateUserData(
      decodedToken.userId,
      changes
    );
    await send(res, 200, data);
  } catch (error) {
    await send(res, 404, error);
  }
}

const handlers = methods({
  get: getHandler,
  patch: patchHandler,
});

export default authMiddleware(handlers);
