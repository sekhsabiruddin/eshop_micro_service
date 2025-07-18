import { AuthError, NotFoundError, ValidationError } from "@packages/errors";
import { imagekit } from "@packages/libs/imagekit";
import { prisma } from "@packages/libs/prisma";
import { NextFunction, Request, Response } from "express";

// get product categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.siteConfig.findFirst();

    if (!config) {
      return res.status(404).json({ message: "Categories not found" });
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.seller?.id || 12;
    const { public_name, discountType, discountValue, discountCode } = req.body;
    console.log("Reuested body data", req.body);
    // Check if discount code already exists
    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode,
      },
    });

    if (isDiscountCodeExist) {
      return next(
        new ValidationError(
          "Discount code already available, please use a different code!"
        )
      );
    }

    // Create the discount code
    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: sellerId,
      },
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id; // assuming seller middleware populates this

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: {
        id: true,
        sellerId: true,
      },
    });

    if (!discountCode) {
      return next(new NotFoundError("Discount code not found!"));
    }

    if (discountCode.sellerId !== sellerId) {
      return next(new ValidationError("Unauthorized access!"));
    }

    await prisma.discount_codes.delete({ where: { id } });

    return res.status(200).json({
      message: "Discount code successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

// export const uploadProductImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { fileName } = req.body;

//     // ✅ Log to terminal
//     console.log("[uploadProductImage] fileName:", fileName);

//     const response = await imagekit.upload({
//       file: fileName, // base64 string
//       fileName: `product-${Date.now()}.jpg`,
//       folder: "/products",
//     });

//     res.status(201).json({
//       file_url: response.url,
//       fileId: response.fileId,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[uploadProductImage] 🛬 Controller entered"); // <-- ADD THIS

  try {
    const { fileName } = req.body;
    console.log("[uploadProductImage] fileName:", fileName); // <-- You already had this

    const response = await imagekit.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: "/products",
    });

    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error("[uploadProductImage] ❌ Error:", error); // <-- ADD THIS TOO
    next(error);
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;

    const response = await imagekit.deleteFile(fileId);

    res.status(201).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      cash_on_delivery,
      slug,
      tags,
      brand,
      video_url,
      category,
      subCategory,
      colors = [],
      discountCodes = [],
      sizes = [],
      stock,
      sale_price,
      regular_price,
      customProperties = {},
      custom_specifications = {},
      images = [],
    } = req.body;

    // 🔒 Check seller
    // if (!req.seller?.id || !req.seller?.shop?.id) {
    //   return next(new AuthError("Only seller can create products!"));
    // }

    // 🚫 Required fields check

    if (!title) console.warn("Missing title");
    if (!slug) console.warn("Missing slug");
    if (!short_description) console.warn("Missing short_description");
    if (!category) console.warn("Missing category");
    if (!subCategory) console.warn("Missing subCategory");
    if (!sale_price) console.warn("Missing sale_price");
    if (!regular_price) console.warn("Missing regular_price");
    if (!stock) console.warn("Missing stock");
    if (!images || images.length === 0) console.warn("Missing images");
    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !regular_price ||
      !stock ||
      !images.length
    ) {
      return next(new ValidationError("Missing required fields"));
    }

    // 🧠 Check for existing slug
    const existing = await prisma.products.findUnique({ where: { slug } });
    if (existing) {
      return next(
        new ValidationError("Slug already exists! Please use a different slug.")
      );
    }

    // ✅ Create new product
    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        // shopId: req.seller.shop.id,
        shopId: "60d21b4667d0d8992e610c85",
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory,
        colors: colors || [],
        discount_codes: discountCodes.map((codeId: string) => codeId),
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specifications: custom_specifications || {},
        // images: {
        //   create: images
        //     .filter((img: any) => img && img.fileId && img.file_url)
        //     .map((img: any) => ({
        //       file_id: img.fileId,
        //       url: img.file_url,
        //     })),
        // },

        images: images.map((image: any) => image.file_url),
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    next(error);
  }
};
export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// export const getShopProducts = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const products = await prisma.products.findMany(); // 🔥 Removed include

//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// delete product
// export const deleteProduct = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { productId } = req.params;
//     const sellerId = req.seller?.shop?.id;

//     const product = await prisma.products.findUnique({
//       where: { id: productId },
//       select: { id: true, shopId: true, isDeleted: true },
//     });

//     if (!product) {
//       return next(new ValidationError("Product not found"));
//     }

//     if (product.shopId !== sellerId) {
//       return next(new ValidationError("Unauthorized action"));
//     }

//     if (product.isDeleted) {
//       return next(new ValidationError("Product is already deleted"));
//     }

//     const deletedProduct = await prisma.products.update({
//       where: { id: productId },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
//       },
//     });

//     return res.status(200).json({
//       message:
//         "Product is scheduled for deletion in 24 hours. You can restore it within this time.",
//       deletedAt: deletedProduct.deletedAt,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// delete product (no seller validation)
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("Product not found"));
    }

    if (product.isDeleted) {
      return next(new ValidationError("Product is already deleted"));
    }

    const deletedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return res.status(200).json({
      message:
        "Product is scheduled for deletion in 24 hours. You can restore it within this time.",
      deletedAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("Product not found"));
    }

    if (!product.isDeleted) {
      return res
        .status(400)
        .json({ message: "Product is not in deleted state" });
    }

    await prisma.products.update({
      where: { id: productId },
      data: { isDeleted: false, deletedAt: null },
    });

    return res.status(200).json({ message: "Product successfully restored!" });
  } catch (error) {
    return res.status(500).json({ message: "Error restoring product", error });
  }
};
