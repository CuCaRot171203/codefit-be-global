import multer from 'multer';
/**
 * Multer middleware configuration
 * Cấu hình storage, filter và limits
 */
export declare const uploadMiddleware: multer.Multer;
/**
 * Middleware upload single image
 * Field name: 'image'
 */
export declare const uploadSingleImage: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Middleware upload multiple images
 * Field name: 'images', max 10 files
 */
export declare const uploadMultipleImages: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=upload.middleware.d.ts.map