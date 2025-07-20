import { AuthError, NotFoundError, ValidationError } from "@packages/errors";
import { imagekit } from "@packages/libs/imagekit";
import { prisma } from "@packages/libs/prisma";
import { Prisma } from "@prisma/client";
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

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !regular_price ||
      !stock ||
      images.length === 0
    ) {
      return next(new ValidationError("Missing required fields"));
    }

    const existing = await prisma.products.findUnique({ where: { slug } });
    if (existing) {
      return next(
        new ValidationError("Slug already exists! Please use a different slug.")
      );
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    } else {
      console.log("images==========>", images);
    }

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        shopId: req.seller?.shop?.id,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory,
        colors,
        discount_codes: discountCodes,
        sizes,
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties,
        custom_specifications: custom_specifications,
        images: {
          create: images
            .filter((img: any) => img && img.file_id && img.url)
            .map((img: any) => ({
              file_id: img.file_id,
              url: img.url,
            })),
        },
      },
      include: { images: true },
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
      include: {
        images: true, // ✅ include related images
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
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("Product not found"));
    }

    if (product.shopId !== sellerId) {
      return next(new ValidationError("Unauthorized action"));
    }

    if (product.isDeleted) {
      return next(new ValidationError("Product is already deleted"));
    }

    const deletedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
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

// delete product (no seller validation)
// export const deleteProduct = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { productId } = req.params;

//     const product = await prisma.products.findUnique({
//       where: { id: productId },
//       select: { id: true, isDeleted: true },
//     });

//     if (!product) {
//       return next(new ValidationError("Product not found"));
//     }

//     if (product.isDeleted) {
//       return next(new ValidationError("Product is already deleted"));
//     }

//     const deletedProduct = await prisma.products.update({
//       where: { id: productId },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
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

// export const getAllProducts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 20;
//     const skip = (page - 1) * limit;
//     const type = req.query.type;

//     const baseFilter = {
//       OR: [{ starting_date: null }, { ending_date: null }],
//     };

//     const orderBy: Prisma.productsOrderByWithRelationInput =
//       type === "latest"
//         ? { createdAt: "desc" as Prisma.SortOrder }
//         : { totalSales: "desc" as Prisma.SortOrder };

//     const [products, total, top10Products] = await Promise.all([
//       prisma.products.findMany({
//         skip,
//         take: limit,
//         include: {
//           images: true,
//           shops: true,
//         },
//         where: baseFilter,
//         orderBy,
//       }),
//       prisma.products.count({
//         where: baseFilter,
//       }),
//       prisma.products.findMany({
//         take: 10,
//         orderBy: { totalSales: "desc" },
//         include: { images: true },
//       }),
//       prisma.products.count({
//         where: baseFilter,
//       }),
//       prisma.products.findMany({
//         take: 10,
//         where: baseFilter,
//         orderBy,
//       }),
//     ]);

//     res.status(200).json({
//       products,
//       top10By: type === "latest" ? "latest" : "topSales",
//       top10Products,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllProducts = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 20;
//     const skip = (page - 1) * limit;
//     const type = req.query.type;

//     const baseFilter: Prisma.productsWhereInput = {
//       isDeleted: false,
//       status: "Active",
//     };

//     const orderBy: Prisma.productsOrderByWithRelationInput =
//       type === "latest" ? { createdAt: "desc" } : { totalSales: "desc" };

//     const [products, total, top10Products] = await Promise.all([
//       prisma.products.findMany({
//         skip,
//         take: limit,
//         where: baseFilter,
//         include: {
//           images: true,
//           shops: true,
//         },
//         orderBy,
//       }),
//       prisma.products.count({ where: baseFilter }),
//       prisma.products.findMany({
//         take: 10,
//         where: baseFilter,
//         orderBy: { totalSales: "desc" },
//         include: { images: true },
//       }),
//     ]);

//     res.status(200).json({
//       products,
//       top10By: type === "latest" ? "latest" : "topSales",
//       top10Products,
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Sorting type: 'latest' or default to top sales
    const type = req.query.type;
    const sortByLatest = type === "latest";

    // Common filter for active, non-deleted products
    const baseFilter: Prisma.productsWhereInput = {
      isDeleted: false,
      status: "Active",
    };

    // Sorting criteria
    const orderBy: Prisma.productsOrderByWithRelationInput = sortByLatest
      ? { createdAt: "desc" }
      : { totalSales: "desc" };

    // Fetch main product list, total count, and top 10 products concurrently
    const [products, total, top10Products] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: limit,
        where: baseFilter,
        orderBy,
        include: {
          images: true, // ✅ Include image relations
          shops: true, // ✅ Include shop details
        },
      }),
      prisma.products.count({
        where: baseFilter,
      }),
      prisma.products.findMany({
        take: 10,
        where: baseFilter,
        orderBy: {
          totalSales: "desc",
        },
        include: {
          images: true, // ✅ Top 10 products with images
        },
      }),
    ]);

    // Send response
    res.status(200).json({
      products,
      top10By: sortByLatest ? "latest" : "topSales",
      top10Products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    next(error);
  }
};
