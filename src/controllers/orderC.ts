import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllOrders = async (request: Request, response: Response) => {
  try {
    /** get requested data (data has been sent from request) */
    const { search } = request.query;

    /** process to get order, contains means search name or table number of customer's order based on sent keyword */
    const allOrders = await prisma.order.findMany({
      where: {
        OR: [{ customer: { contains: search?.toString() || "" } }],
      },
      orderBy: { createdAt: "desc" } /** sort by descending order date */,
      include: {
        order_list: true,
      } /** include detail of order (item that sold) */,
    });
    return response
      .json({
        status: true,
        data: allOrders,
        message: `Order list has retrieved`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
export const createOrder = async (request: Request, response: Response) => {
  try {
    /** get requested data (data has been sent from request) */
    const { customer, table_number, payment_method, status, orderlists } =
      request.body;
    const user = request.body.user;
    const uuid = uuidv4();
    /**
     * assume that "orderlists" is an array of object that has keys:
     * productId, quantity, note
     * */

    /** loop details of order to check product and count the total price */
    let total_price = 0;
    for (let index = 0; index < orderlists.length; index++) {
      const { productId } = orderlists[index];
      const detailProduct = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });
      if (!detailProduct)
        return response.status(200).json({
          status: false,
          message: `Product with id ${productId} is not found`,
        });
      total_price += detailProduct.price * orderlists[index].quantity;
    }

    /** process to save new order */
    const newOrder = await prisma.order.create({
      data: {
        uuid,
        customer,
        total_price,
        payment_method,
        status,
        idUser: user.idUser,
      },
    });

    /** loop details of Order to save in database */
    for (let index = 0; index < orderlists.length; index++) {
      const uuid = uuidv4();
      const { productId, quantity, note } = orderlists[index];
      await prisma.order_list.create({
        data: {
          uuid,
          idOrder: newOrder.id,
          idProduct: Number(productId),
          quantity: Number(quantity),
          note,
        },
      });
    }
    return response
      .json({
        status: true,
        data: newOrder,
        message: `New Order has created`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
export const updateStatusOrder = async (
  request: Request,
  response: Response
) => {
  try {
    /** get id of order's id that sent in parameter of URL */
    const { id } = request.params;
    /** get requested data (data has been sent from request) */
    const { status } = request.body;
    const user = request.body.user;

    /** make sure that data is exists in database */
    const findOrder = await prisma.order.findFirst({
      where: { id: Number(id) },
    });
    if (!findOrder)
      return response
        .status(200)
        .json({ status: false, message: `Order is not found` });

    /** process to update product's data */
    const updatedStatus = await prisma.order.update({
      data: {
        status: status || findOrder.status,
        idUser: user.id ? user.idOrder : findOrder.idUser,
      },
      where: { id: Number(id) },
    });

    return response
      .json({
        status: true,
        data: updatedStatus,
        message: `Order has updated`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
export const deleteOrder = async (request: Request, response: Response) => {
  try {
    /** get id of order's id that sent in parameter of URL */
    const { id } = request.params;

    /** make sure that data is exists in database */
    const findOrder = await prisma.order.findFirst({
      where: { id: Number(id) },
    });
    if (!findOrder)
      return response
        .status(200)
        .json({ status: false, message: `Order is not found` });
    /** process to delete details of order */
    let deleteOrderList = await prisma.order_list.deleteMany({
      where: { idOrder: Number(id) },
    });
    /** process to delete of Order */
    let deleteOrder = await prisma.order.delete({ where: { id: Number(id) } });

    return response
      .json({
        status: true,
        data: deleteOrder,
        message: `Order has deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
