import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.response;
}

export async function createMPPreference(obj) {
  const preference = {
    items: obj.data.products.map((item) => {
      return {
        id: item.objectID,
        title: item.Name,
        description: item.Description,
        picture_url: item.Images[0].url,
        category_id: "cat123",
        quantity: 1,
        currency_id: "ARS",
        unit_price: item["Unit cost"],
      };
    }),
    back_urls: {
      success: process.env.SUCCESS_URL,
      failure: process.env.FAILURE_URL,
      pending: process.env.PENDING_URL,
    },
    external_reference: obj.id,
    notification_url: process.env.IPN_WH_ADDRESS,
  };

  const order = await (
    await fetch("https://api.mercadopago.com/checkout/preferences", {
      headers: {
        authorization: "Bearer " + process.env.MP_TOKEN,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(preference),
    })
  ).json();
  return order.init_point;
}
