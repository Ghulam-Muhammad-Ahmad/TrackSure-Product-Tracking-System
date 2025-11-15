import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();
import cloudinary from "../config/cloudinary.js";
import { generateQRCode } from "../config/qrGenerator.js";
import fs from "fs/promises";
import { v4 as uuidv4 } from 'uuid'; // Import guid

function generateSecureToken() {
  const timestamp = Date.now().toString();
  const guid = uuidv4();
  return `${timestamp}${guid}`;
}

// ✅ CREATE QR CODE
const createQRCodeService = async ({ product_id, qr_name, view_permission, qr_details, tenantId }) => {
  if (!product_id || !qr_name || !view_permission || !qr_details) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    // 1. Validate product exists
    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(product_id) }
    });
    if (!product) return { success: false, message: "Product not found" };

    const secureToken = generateSecureToken();
    // 2. Generate QR code image locally
    const filePath = await generateQRCode(secureToken, tenantId);

    // 3. Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(filePath, { folder: "tracksure_upload" });

    // Delete temp file
    await fs.unlink(filePath);

    // 4. Save to DB
    const qrCode = await prisma.qr_codes.create({
      data: {
        product_id: parseInt(product_id),
        qr_name,
        view_permission,
        qr_details,
        qr_image_url: uploadRes.secure_url,
        qr_token: secureToken
      }
    });

    return { success: true, message: "QR Code created successfully", id: qrCode.id, qr_image_url: qrCode.qr_image_url }; // Corrected qrCode.qr_code_id to qrCode.id
  } catch (error) {
    console.error("Create QR Code Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ SCAN QR CODE
// Assumes: PrismaClient imported as `prisma`
// Schema used: the final one you posted (with `view_permission` on qr_codes)

const scanQRCodeService = async ({ qr_token, tenantId }) => {
  if (!qr_token?.trim() || !tenantId?.trim()) {
    return { success: false, message: "qr_token and tenantId are required" };
  }

  try {
    // 1) Validate tenant exists
    const tenant = await prisma.tenants.findUnique({
      where: { tenant_id: tenantId },
      select: {
        tenant_id: true,
        brandName: true,
        logoUrl: true,
        themeColor: true,
        description: true,
      },
    });
    if (!tenant) {
      return { success: false, message: "Tenant not found" };
    }

    // 2) Load QR + product (scoped to tenant via the products relation) + category
    const qrCode = await prisma.qr_codes.findFirst({
      where: {
        qr_token,
        products: { tenant_id: tenantId },
      },
      select: {
        qr_id: true,
        qr_name: true,
        qr_details: true,
        qr_image_url: true,
        qr_token: true,
        view_permission: true, // present in your final schema
        created_at: true,
        products: {
          select: {
            product_id: true,
            product_name: true,
            image_url: true,
            created_at: true,
            product_status: {
              select: {
                status: true,
              },
            },
            users_products_manufacturer_idTousers: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                phone_number: true, // Added to include phone number
                location: true, // Added to include location
              },
            },
            users_products_current_owner_idTousers: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                phone_number: true, // Added to include phone number
                location: true, // Added to include location
              },
            },
            categories: {
              select: {
                category_name: true,
              },
            },
          },
        },
      },
    });

    if (!qrCode) {
      return { success: false, message: "QR code not found or invalid token" };
    }

    // 3) View permissions
    // -1 => public. Otherwise, value is a user_id that must match the requesting user.
    // if (typeof qrCode.view_permission === "number" && qrCode.view_permission !== -1) {
    //   if (!userId || userId !== qrCode.view_permission) {
    //     return { success: false, message: "You do not have permission to view this QR code" };
    //   }
    // }

    const p = qrCode.products;

    // 4) Build response + normalized qr_details object (based on your contract)
    const qrDetails = {
      productName: qrCode.qr_details.includes("productName") ? p?.product_name ?? "NA" : "NA",
      CurrentOwner: qrCode.qr_details.includes("currentOwner") && p?.users_products_current_owner_idTousers
        ? {
          name: `${p.users_products_current_owner_idTousers.first_name} ${p.users_products_current_owner_idTousers.last_name}`,
          email: p.users_products_current_owner_idTousers.email,
          phone: p.users_products_current_owner_idTousers.phone_number ? p.users_products_current_owner_idTousers.phone_number : "NA",
          location: p.users_products_current_owner_idTousers.location ? p.users_products_current_owner_idTousers.location : "NA",
          }
        : "NA",
      Manufacturer: qrCode.qr_details.includes("manufacturer") && p?.users_products_manufacturer_idTousers
        ? {
            name: `${p.users_products_manufacturer_idTousers.first_name} ${p.users_products_manufacturer_idTousers.last_name}`,
            email: p.users_products_manufacturer_idTousers.email,
            phone: p.users_products_manufacturer_idTousers.phone_number ? p.users_products_manufacturer_idTousers.phone_number : "NA",
            location: p.users_products_manufacturer_idTousers.location ? p.users_products_manufacturer_idTousers.location : "NA",
          }
        : "NA",
      ProductImage: qrCode.qr_details.includes("productImage") ? p?.image_url ?? "NA" : "NA",
      ProductStatus: qrCode.qr_details.includes("productStatus") ? p?.product_status?.status ?? "NA" : "NA",
      Category: qrCode.qr_details.includes("productCategory") ? p?.categories?.category_name ?? "NA" : "NA",
    };

    return {
      success: true,
      message: "QR code scanned successfully",
      data: {
        qr_id: qrCode.qr_id,
        qr_name: qrCode.qr_name,
        qr_image_url: qrCode.qr_image_url,
        created_at: qrCode.created_at,
        // raw DB-stored details if you persist them
        qr_details: qrCode.qr_details,
        // normalized details derived from relations (matches your declared contract)
        qr_details_normalized: qrDetails,
        product: p
          ? {
              product_id: p.product_id,
              product_name: p.product_name,
              // These two are not in your posted schema; keep only if you actually have them:
              description: p.description ?? null,
              image_url: p.image_url,
              status: p.product_status?.status ?? "NA",
              manufacturer: qrDetails.Manufacturer,
              current_owner: qrDetails.CurrentOwner,
              created_at: p.created_at,
              category: qrDetails.Category,
            }
          : null,
        tenant: {
          brandName: tenant.brandName,
          logoUrl: tenant.logoUrl,
          themeColor: tenant.themeColor,
          description: tenant.description,
        },
      },
    };
  } catch (error) {
    console.error("Scan QR Code Service Error:", error);
    return { success: false, message: "Database error" };
  }
};


export { createQRCodeService, scanQRCodeService };
