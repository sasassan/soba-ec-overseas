import { NextResponse } from "next/server";
import { getProductByCode } from "@/data/products";
import { createOrder } from "@/lib/db";
import {
  computeBoxWeight,
  computeContentWeight,
  computeSubtotal,
  getShippingCost,
} from "@/lib/pricing";

export const runtime = "nodejs";

interface RequestItem {
  code?: string;
  quantity?: number;
}

interface RequestBody {
  items?: RequestItem[];
  customer?: {
    name?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "No items in the order." }, { status: 400 });
  }
  if (items.length > 20) {
    return NextResponse.json({ error: "Too many items." }, { status: 400 });
  }

  // Validate each item against the product master on the server (do not trust
  // any client-supplied prices or amounts).
  const validated: {
    productCode: string;
    productNameEn: string;
    productNameJa: string;
    unitPriceUsd: number;
    quantity: number;
    weightGrams: number;
  }[] = [];

  for (const item of items) {
    const code = item.code;
    const quantity = item.quantity;
    const product = code ? getProductByCode(code) : undefined;

    if (!product) {
      return NextResponse.json(
        { error: `Unknown product code: ${code ?? "(missing)"}` },
        { status: 400 }
      );
    }
    if (!Number.isInteger(quantity) || (quantity as number) <= 0 || (quantity as number) > 50) {
      return NextResponse.json(
        { error: `Invalid quantity for ${code}.` },
        { status: 400 }
      );
    }

    validated.push({
      productCode: product.code,
      productNameEn: product.nameEn,
      productNameJa: product.nameJa,
      unitPriceUsd: product.priceUsd,
      quantity: quantity as number,
      weightGrams: product.weightGrams,
    });
  }

  const customer = body.customer ?? {};
  const requiredCustomerFields: (keyof NonNullable<RequestBody["customer"]>)[] = [
    "name",
    "email",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "country",
  ];
  for (const field of requiredCustomerFields) {
    if (!customer[field] || typeof customer[field] !== "string") {
      return NextResponse.json(
        { error: `Missing customer field: ${field}` },
        { status: 400 }
      );
    }
  }

  const subtotalUsd = computeSubtotal(validated);
  const contentWeight = computeContentWeight(validated);
  const boxWeight = computeBoxWeight(contentWeight);
  const shippingUsd = getShippingCost(boxWeight);
  const totalUsd = subtotalUsd + shippingUsd;

  const { id, orderNumber } = await createOrder({
    customer: {
      name: customer.name as string,
      email: customer.email as string,
      addressLine1: customer.addressLine1 as string,
      addressLine2: (customer.addressLine2 as string) ?? "",
      city: customer.city as string,
      state: customer.state as string,
      postalCode: customer.postalCode as string,
      country: customer.country as string,
    },
    items: validated,
    subtotalUsd,
    shippingUsd,
    totalUsd,
    totalWeightGrams: boxWeight,
  });

  return NextResponse.json(
    {
      orderId: id,
      orderNumber,
      subtotalUsd,
      shippingUsd,
      totalUsd,
    },
    { status: 201 }
  );
}
