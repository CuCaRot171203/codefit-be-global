"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_config = require("dotenv/config");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_express30 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));

// src/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/auth/routes/auth.routes.ts
var import_express = require("express");

// src/base/base.controller.ts
var BaseController = class {
  service;
  /**
   * Hàm khởi tạo BaseController
   * @param service - Service instance được inject vào controller
   */
  constructor(service) {
    this.service = service;
  }
  /**
   * Trả về response thành công
   * @param res - Express Response object
   * @param data - Dữ liệu trả về
   * @param message - Thông báo thành công
   * @param statusCode - HTTP status code (default: 200)
   */
  success(res, data, message, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
  /**
   * Trả về response lỗi
   * @param res - Express Response object
   * @param message - Thông báo lỗi
   * @param statusCode - HTTP status code (default: 400)
   */
  error(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

// src/modules/auth/services/auth.service.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_client3 = require("@prisma/client");

// src/base/base.service.ts
var BaseService = class {
  repository;
  /**
   * Khởi tạo BaseService
   * @param repository - Repository instance được inject (optional)
   */
  constructor(repository) {
    this.repository = repository;
  }
};

// src/modules/auth/repositories/auth.repository.ts
var import_client2 = require("@prisma/client");

// src/base/base.repository.ts
var BaseRepository = class {
  model;
  /**
   * Tìm một bản ghi theo ID
   * @param id - ID của bản ghi cần tìm
   * @returns Promise<T | null> - Bản ghi hoặc null nếu không tìm thấy
   */
  async findById(id) {
    return this.model.findUnique({ where: { id } });
  }
  /**
   * Tìm nhiều bản ghi với điều kiện lọc
   * @param where - Điều kiện where của Prisma (optional)
   * @returns Promise<T[]> - Mảng các bản ghi
   */
  async findMany(where) {
    return this.model.findMany(where);
  }
  /**
   * Tạo mới một bản ghi
   * @param data - Dữ liệu của bản ghi mới
   * @returns Promise<T> - Bản ghi đã được tạo
   */
  async create(data) {
    return this.model.create({ data });
  }
  /**
   * Cập nhật một bản ghi theo ID
   * @param id - ID của bản ghi cần cập nhật
   * @param data - Dữ liệu cần cập nhật
   * @returns Promise<T> - Bản ghi đã được cập nhật
   */
  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }
  /**
   * Xóa một bản ghi theo ID
   * @param id - ID của bản ghi cần xóa
   * @returns Promise<T> - Bản ghi đã được xóa
   */
  async delete(id) {
    return this.model.delete({ where: { id } });
  }
};

// src/modules/auth/repositories/auth.repository.ts
var prisma2 = new import_client2.PrismaClient();
var AuthRepository = class extends BaseRepository {
  model = prisma2.user;
  /**
   * Tìm user theo email
   * @param email - Email cần tìm
   * @returns User hoặc null nếu không tìm thấy
   */
  async findByEmail(email) {
    return this.model.findUnique({ where: { email } });
  }
  /**
   * Tạo user mới
   * @param data - Dữ liệu user (email, username, password hash, role)
   * @returns User đã được tạo
   */
  async create(data) {
    return this.model.create({ data });
  }
};
var auth_repository_default = new AuthRepository();

// src/modules/auth/services/auth.service.ts
var prisma3 = new import_client3.PrismaClient();
var JWT_SECRET = process.env.JWT_SECRET || "codefit-secret-key";
var AuthService = class extends BaseService {
  constructor() {
    super(auth_repository_default);
  }
  /**
   * Đăng ký tài khoản mới
   * @param RegisterDto - email, username, password
   * @returns Promise<AuthResponse> - Thông tin user và JWT token
   */
  async register({ email, username, password }) {
    if (!email || !username || !password) {
      throw new Error("Email, username, and password are required");
    }
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }
    const defaultRole = await prisma3.role.findUnique({
      where: { name: "user" }
    });
    if (!defaultRole) {
      throw new Error("Default role not found. Please run seed first.");
    }
    const hashedPassword = await import_bcrypt.default.hash(password, 10);
    const user = await this.repository.create({
      email,
      username,
      password: hashedPassword,
      roleId: defaultRole.id
    });
    return this.formatUserResponse(user);
  }
  /**
   * Đăng nhập
   * @param LoginDto - email, password
   * @returns Promise<AuthResponse> - Thông tin user và JWT token
   */
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await prisma3.user.findUnique({
      where: { email },
      include: { role: true }
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await import_bcrypt.default.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);
    await prisma3.userSession.create({
      data: {
        userId: user.id,
        token: "login-" + user.id + "-" + Date.now(),
        expiredAt: expiresAt
      }
    });
    return this.formatUserResponse(user);
  }
  /**
   * Lấy thông tin user theo ID
   * @param id - User ID
   * @returns User object hoặc null
   */
  async getUserById(id) {
    return prisma3.user.findUnique({
      where: { id },
      include: { role: true }
    });
  }
  /**
   * Format user response - Thêm JWT token vào response
   * @param user - User object từ database
   * @returns AuthResponse với user info và token
   */
  formatUserResponse(user) {
    const token = this.generateToken(user.id, user.roleId, user.role?.name || "user");
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        roleName: user.role?.name || "user",
        isOnboarded: user.isOnboarded || false,
        createdAt: user.createdAt
      },
      token
    };
  }
  /**
   * Generate JWT token
   * @param userId - User ID để encode vào token
   * @param roleId - Role ID để encode vào token
   * @param roleName - Role name để encode vào token
   * @returns JWT token string
   */
  generateToken(userId, roleId, roleName) {
    return import_jsonwebtoken.default.sign({ userId, roleId, roleName }, JWT_SECRET, { expiresIn: "6h" });
  }
  /**
   * Verify JWT token
   * @param token - JWT token cần verify
   * @returns Decoded payload hoặc null nếu invalid
   */
  verifyToken(token) {
    try {
      return import_jsonwebtoken.default.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
};
var auth_service_default = new AuthService();

// src/modules/auth/controllers/auth.controller.ts
var AuthController = class extends BaseController {
  constructor() {
    super(auth_service_default);
  }
  /**
   * Đăng ký tài khoản mới
   * POST /api/auth/register
   */
  register = async (req, res, next) => {
    try {
      const data = await this.service.register(req.body);
      this.success(res, data, "User registered successfully", 201);
    } catch (error) {
      this.error(res, error.message, 400);
    }
  };
  /**
   * Đăng nhập
   * POST /api/auth/login
   */
  login = async (req, res, next) => {
    try {
      const data = await this.service.login(req.body);
      console.log("Login service response:", JSON.stringify(data));
      this.success(res, data, "Login successful", 200);
    } catch (error) {
      const status = error.message === "Invalid credentials" ? 401 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy thông tin user hiện tại
   * GET /api/auth/me
   * Cần token hợp lệ trong Authorization header
   */
  getMe = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const user = await this.service.getUserById(userId);
      if (!user) {
        this.error(res, "User not found", 404);
        return;
      }
      this.success(res, {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        school: user.school,
        roleId: user.roleId,
        roleName: user.role?.name,
        roleDescription: user.role?.description,
        isOnboarded: user.isOnboarded,
        createdAt: user.createdAt
      }, "User profile", 200);
    } catch (error) {
      next(error);
    }
  };
};
var auth_controller_default = new AuthController();

// src/middleware/auth.middleware.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var JWT_SECRET2 = process.env.JWT_SECRET || "codefit-secret-key";
var verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth middleware - Authorization header:", authHeader ? `${authHeader.substring(0, 50)}...` : "null");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Auth middleware - No valid Bearer token");
      res.status(401).json({
        success: false,
        message: "No token provided"
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    console.log("Auth middleware - Token extracted, length:", token?.length);
    const decoded = import_jsonwebtoken2.default.verify(token, JWT_SECRET2);
    console.log("Auth middleware - Token verified, userId:", decoded?.userId, "roleName:", decoded?.roleName);
    req.user = decoded;
    next();
  } catch (error) {
    const err = error;
    if (err?.name === "JsonWebTokenError" && err?.message === "jwt malformed") {
      console.log("Auth middleware - Token format is invalid (malformed)");
    } else {
      console.log("Auth middleware - Token verification failed:", err?.message || error);
    }
    let errorMessage = "Invalid or expired token";
    if (error instanceof import_jsonwebtoken2.default.JsonWebTokenError) {
      if (error.message === "jwt malformed") {
        errorMessage = "Token format is invalid";
      } else if (error.message === "invalid signature") {
        errorMessage = "Token signature is invalid";
      } else if (error.message === "jwt expired") {
        errorMessage = "Token has expired";
      } else {
        errorMessage = "Token verification failed";
      }
    } else if (error instanceof import_jsonwebtoken2.default.TokenExpiredError) {
      errorMessage = "Token has expired";
    } else if (error instanceof import_jsonwebtoken2.default.NotBeforeError) {
      errorMessage = "Token is not yet valid";
    }
    res.status(401).json({
      success: false,
      message: errorMessage,
      code: "AUTH_ERROR"
    });
  }
};
var requireAdmin = (req, res, next) => {
  if (!req.user || req.user.roleName !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required"
    });
    return;
  }
  next();
};
var requireLectureOrAdmin = (req, res, next) => {
  if (!req.user || req.user.roleName !== "admin" && req.user.roleName !== "lecture") {
    res.status(403).json({
      success: false,
      message: "Lecture or Admin access required"
    });
    return;
  }
  next();
};

// src/modules/auth/routes/auth.routes.ts
var router = (0, import_express.Router)();
router.post("/register", (req, res, next) => auth_controller_default.register(req, res, next));
router.post("/login", (req, res, next) => auth_controller_default.login(req, res, next));
router.get("/me", verifyToken, (req, res, next) => auth_controller_default.getMe(req, res, next));
var auth_routes_default = router;

// src/modules/submission/routes/submission.routes.ts
var import_express2 = require("express");

// src/modules/submission/repositories/submission.repository.ts
var import_client4 = require("@prisma/client");
var prisma4 = new import_client4.PrismaClient();
var SubmissionRepository = class extends BaseRepository {
  /** The Prisma model used for submission queries */
  model = prisma4.submission;
  /**
   * Retrieves all submissions for a specific user, ordered by creation date (newest first)
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to an array of user's submissions
   */
  async findByUserId(userId) {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Retrieves all submissions for a specific problem, ordered by creation date (newest first)
   * @param problemId - The unique identifier of the problem
   * @returns Promise resolving to an array of problem's submissions
   */
  async findByProblemId(problemId) {
    return this.model.findMany({
      where: { problemId },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Retrieves a submission by its ID along with all associated test case results
   * @param id - The unique identifier of the submission
   * @returns Promise resolving to the submission with included results, or undefined if not found
   */
  async findByIdWithResults(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        results: true
      }
    });
  }
  /**
   * Creates a new submission result record in the database
   * @param data - The submission result data to create
   * @returns Promise resolving to the created submission result
   */
  async createResult(data) {
    return prisma4.submissionResult.create({ data });
  }
  /**
   * Retrieves all test cases associated with a specific problem
   * @param problemId - The unique identifier of the problem
   * @returns Promise resolving to an array of test cases for the problem
   */
  async getTestcasesByProblemId(problemId) {
    return prisma4.testcase.findMany({
      where: { problemId }
    });
  }
};
var submission_repository_default = new SubmissionRepository();

// src/modules/problem/repositories/problem.repository.ts
var import_client5 = require("@prisma/client");
var prisma5 = new import_client5.PrismaClient();
var ProblemRepository = class extends BaseRepository {
  /** The Prisma model used for problem operations */
  model = prisma5.problem;
  /**
   * Find a problem by ID including all associated testcases
   * @description Retrieves a single problem with its full test case list for detailed views.
   * @param id - The unique identifier of the problem
   * @returns Promise resolving to the problem with testcases or null if not found
   */
  async findByIdWithTestcases(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        testcases: true
      }
    });
  }
  /**
   * Find all public test cases for a specific problem
   * @description Retrieves only the test cases marked as public for user visibility.
   * @param problemId - The unique identifier of the parent problem
   * @returns Promise resolving to an array of public test cases
   */
  async findPublicTestcases(problemId) {
    const testcases = await prisma5.testcase.findMany({
      where: {
        problemId,
        isPublic: true
      }
    });
    return testcases;
  }
};
var problem_repository_default = new ProblemRepository();

// src/modules/progress/repositories/progress.repository.ts
var import_client6 = require("@prisma/client");
var prisma6 = new import_client6.PrismaClient();
var ProgressRepository = class extends BaseRepository {
  model = prisma6.progress;
  /**
   * Tìm tiến độ học tập của user trong một khóa học cụ thể
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @returns Progress nếu tìm thấy, null nếu không tồn tại
   */
  async findByUserAndCourse(userId, courseId) {
    return this.model.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
  }
  /**
   * Cập nhật hoặc tạo mới tiến độ học tập của user
   * Nếu đã có record, cập nhật; nếu chưa có, tạo mới
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @param completedLessons - Số bài đã hoàn thành
   * @param totalLessons - Tổng số bài học
   * @returns Progress đã được cập nhật/tạo mới
   */
  async updateProgress(userId, courseId, completedLessons, totalLessons) {
    const percentage = totalLessons > 0 ? Math.round(completedLessons / totalLessons * 100) : 0;
    const existing = await this.findByUserAndCourse(userId, courseId);
    if (existing) {
      return this.model.update({
        where: { id: existing.id },
        data: {
          completedLessons,
          totalLessons,
          percentage
        }
      });
    }
    return this.model.create({
      data: {
        userId,
        courseId,
        completedLessons,
        totalLessons,
        percentage
      }
    });
  }
};
var progress_repository_default = new ProgressRepository();

// src/utils/redis.ts
var import_ioredis = __toESM(require("ioredis"));
function createRedisClient() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  const mock = {
    publish: async (_channel, _message) => {
    },
    get: async (_key) => null,
    set: async (_key, _value) => {
    },
    setex: async (_key, _seconds, _value) => {
    },
    del: async (..._keys) => 0,
    keys: async (_pattern) => [],
    disconnect: () => {
    },
    status: "disconnected",
    zrevrank: async (_key, _member) => null,
    zscore: async (_key, _member) => null,
    zincrby: async (_key, _increment, _member) => "0",
    zrange: async (_key, _start, _stop) => [],
    zrevrange: async (_key, _start, _stop) => [],
    zadd: async (_key, _score, _member) => 0
  };
  try {
    const client = new import_ioredis.default(url, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 1) return null;
        return Math.min(times * 200, 2e3);
      },
      lazyConnect: true,
      connectTimeout: 3e3
    });
    client.on("error", () => {
    });
    client.on("connect", () => console.log("[Redis] Connected successfully"));
    return client;
  } catch {
    return mock;
  }
}
var redis = createRedisClient();

// src/modules/progress/services/progress.service.ts
var ProgressService = class extends BaseService {
  constructor() {
    super(progress_repository_default);
  }
  /**
   * Lấy tiến độ học tập của user trong một khóa học
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @returns Progress data hoặc null nếu không tìm thấy
   */
  async getProgress(userId, courseId) {
    return this.repository.findByUserAndCourse(userId, courseId);
  }
  /**
   * Cập nhật tiến độ học tập của user trong khóa học
   * Validate dữ liệu đầu vào trước khi cập nhật, sau đó publish event lên Redis
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @param completedLessons - Số bài đã hoàn thành
   * @param totalLessons - Tổng số bài học
   * @returns Progress đã được cập nhật
   * @throws Error nếu giá trị đầu vào không hợp lệ
   */
  async updateProgress(userId, courseId, completedLessons, totalLessons) {
    if (completedLessons < 0 || totalLessons <= 0) {
      throw new Error("Invalid progress values");
    }
    const progress = await this.repository.updateProgress(
      userId,
      courseId,
      completedLessons,
      totalLessons
    );
    await this.publishProgressUpdate(userId, courseId, progress);
    return progress;
  }
  /**
   * Tăng số bài học đã hoàn thành lên 1
   * Lấy progress hiện tại, tăng completedLessons lên 1 và gọi updateProgress
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @returns Progress đã được cập nhật với completedLessons tăng thêm 1
   */
  async incrementProgress(userId, courseId) {
    const current = await this.repository.findByUserAndCourse(userId, courseId);
    const completedLessons = (current?.completedLessons || 0) + 1;
    const totalLessons = current?.totalLessons || 1;
    return this.updateProgress(userId, courseId, completedLessons, totalLessons);
  }
  /**
   * Publish progress update event lên Redis channel
   * @param userId - ID của user
   * @param courseId - ID của khóa học
   * @param progress - Object chứa thông tin progress
   */
  async publishProgressUpdate(userId, courseId, progress) {
    try {
      await redis.publish(`progress:${userId}`, JSON.stringify({
        type: "progress_update",
        userId,
        courseId,
        progress
      }));
    } catch (error) {
      console.error("Redis publish error:", error);
    }
  }
};
var progress_service_default = new ProgressService();

// src/modules/notification/repositories/notification.repository.ts
var import_client7 = require("@prisma/client");
var prisma7 = new import_client7.PrismaClient();
var NotificationRepository = class extends BaseRepository {
  /** Model Prisma được sử dụng cho các thao tác database. */
  model = prisma7.notification;
  /**
   * Lấy tất cả notifications của một user, sắp xếp theo thời gian tạo giảm dần.
   * @param userId - ID của user cần lấy notifications
   * @returns Promise<Notification[]> - Danh sách notifications của user
   */
  async findByUserId(userId) {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        content: true,
        isRead: true,
        createdAt: true,
        metadata: true
      }
    });
  }
  /**
   * Lấy tất cả notifications chưa đọc của một user.
   * @param userId - ID của user cần lấy notifications chưa đọc
   * @returns Promise<Notification[]> - Danh sách notifications chưa đọc
   */
  async findUnreadByUserId(userId) {
    return this.model.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Đánh dấu một notification là đã đọc.
   * @param id - ID của notification cần đánh dấu đã đọc
   * @returns Promise<Notification> - Notification sau khi được cập nhật
   */
  async markAsRead(id) {
    return this.model.update({
      where: { id },
      data: { isRead: true }
    });
  }
  /**
   * Đánh dấu tất cả notifications của user là đã đọc.
   * @param userId - ID của user cần đánh dấu tất cả notifications đã đọc
   * @returns Promise<number> - Số lượng notifications đã được cập nhật
   */
  async markAllAsRead(userId) {
    const result = await this.model.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return result.count;
  }
  /**
   * Đếm số lượng notifications chưa đọc của user.
   * @param userId - ID của user cần đếm notifications chưa đọc
   * @returns Promise<number> - Số lượng notifications chưa đọc
   */
  async countUnread(userId) {
    return this.model.count({
      where: { userId, isRead: false }
    });
  }
  /**
   * Lấy tất cả notifications đã gửi bởi một user (admin).
   * @param senderId - ID của user đã gửi notifications
   * @returns Promise<Notification[]> - Danh sách notifications đã gửi
   */
  async findBySenderId(senderId) {
    return this.model.findMany({
      where: { userId: senderId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }
  /**
   * Lấy tất cả notifications (admin).
   * @returns Promise<any[]> - Danh sách tất cả notifications
   */
  async findAll() {
    return this.model.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }
};
var notification_repository_default = new NotificationRepository();

// src/modules/notification/services/notification.service.ts
var NotificationService = class extends BaseService {
  constructor() {
    super(notification_repository_default);
  }
  /**
   * Tạo mới một notification cho user.
   * @param params - Object chứa các tham số
   * @param params.userId - ID của user nhận notification
   * @param params.type - Loại notification
   * @param params.title - Tiêu đề của notification
   * @param params.message - Nội dung thông báo
   * @param params.metadata - Metadata bổ sung (link, etc.)
   * @returns Promise chứa notification đã được tạo
   */
  async createNotification(params) {
    const { userId, type, title, message, metadata } = params;
    console.log("[NOTIFICATION SERVICE] Creating notification:", { userId, type, title, message, metadata });
    const notification = await this.repository.create({
      userId,
      type,
      title,
      content: message,
      isRead: false,
      metadata: metadata ? JSON.stringify(metadata) : null
    });
    console.log("[NOTIFICATION SERVICE] Notification created in DB:", notification);
    await this.publishNotification(userId, notification);
    return notification;
  }
  /**
   * Tạo notification cho kết quả bài nộp (submission).
   * Tự động format message dựa trên trạng thái nộp bài.
   * @param userId - ID của user nhận notification
   * @param submissionId - ID của submission
   * @param problemTitle - Tên bài toán
   * @param status - Trạng thái submission (AC = Accepted, hoặc mã lỗi khác)
   * @returns Promise chứa notification đã được tạo
   */
  async createSubmissionNotification(userId, submissionId, problemTitle, status) {
    const statusMessage = status === "AC" ? "Accepted" : `Failed: ${status}`;
    const title = `Submission Result - ${problemTitle}`;
    const message = `Your submission has been ${statusMessage}`;
    const notification = await this.createNotification({
      userId,
      type: "submission_result",
      title,
      message
    });
    return notification;
  }
  /**
   * Lấy tất cả notifications của một user.
   * @param userId - ID của user cần lấy notifications
   * @returns Promise<any[]> - Danh sách tất cả notifications của user
   */
  async getUserNotifications(userId) {
    return this.repository.findByUserId(userId);
  }
  /**
   * Lấy tất cả notifications chưa đọc của một user.
   * @param userId - ID của user cần lấy notifications chưa đọc
   * @returns Promise<any[]> - Danh sách notifications chưa đọc
   */
  async getUnreadNotifications(userId) {
    return this.repository.findUnreadByUserId(userId);
  }
  /**
   * Đánh dấu một notification là đã đọc.
   * @param notificationId - ID của notification cần đánh dấu đã đọc
   * @returns Promise<any> - Notification sau khi được cập nhật
   * @throws Error - Ném lỗi nếu notification không tồn tại
   */
  async markAsRead(notificationId) {
    const notification = await this.repository.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    return this.repository.markAsRead(notificationId);
  }
  /**
   * Đánh dấu tất cả notifications của user là đã đọc.
   * @param userId - ID của user cần đánh dấu tất cả notifications đã đọc
   * @returns Promise<{ count: number }> - Số lượng notifications đã được cập nhật
   */
  async markAllAsRead(userId) {
    const count = await this.repository.markAllAsRead(userId);
    return { count };
  }
  /**
   * Đếm số lượng notifications chưa đọc của user.
   * @param userId - ID của user cần đếm notifications chưa đọc
   * @returns Promise<{ count: number }> - Số lượng notifications chưa đọc
   */
  async getUnreadCount(userId) {
    const count = await this.repository.countUnread(userId);
    return { count };
  }
  /**
   * Xóa một notification.
   * @param id - ID của notification cần xóa
   * @returns Promise<{ message: string }> - Thông báo xóa thành công
   * @throws Error - Ném lỗi nếu notification không tồn tại
   */
  async deleteNotification(id) {
    const notification = await this.repository.findById(id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    await this.repository.delete(id);
    return { message: "Notification deleted successfully" };
  }
  /**
   * Publish notification event qua Redis để xử lý real-time.
   * Phương thức private chỉ được gọi từ bên trong service.
   * @param userId - ID của user nhận notification
   * @param notification - Object notification cần publish
   * @returns Promise<void>
   */
  async publishNotification(userId, notification) {
    try {
      await redis.publish(`notification:${userId}`, JSON.stringify({
        type: "new_notification",
        notification
      }));
    } catch (error) {
      console.error("Redis publish error:", error);
    }
  }
  /**
   * Lấy tất cả notifications đã gửi (notifications do admin tạo).
   * @param userId - ID của admin đang yêu cầu
   * @returns Promise<any[]> - Danh sách notifications đã gửi
   */
  async getSentNotifications(userId) {
    return this.repository.findBySenderId(userId);
  }
  /**
   * Lấy tất cả notifications (admin - tất cả users).
   * @returns Promise<any[]> - Danh sách tất cả notifications
   */
  async getAllNotifications() {
    return this.repository.findAll();
  }
  /**
   * Gửi notification nhắc nhở hackathon sắp bắt đầu
   */
  async createHackathonReminderNotification(userId, hackathonTitle, startTime, hackathonId) {
    const timeUntilStart = Math.ceil((startTime.getTime() - Date.now()) / (1e3 * 60));
    let timeText = "";
    if (timeUntilStart >= 60) {
      timeText = `${Math.ceil(timeUntilStart / 60)} gi\u1EDD`;
    } else {
      timeText = `${timeUntilStart} ph\xFAt`;
    }
    return this.createNotification({
      userId,
      type: "hackathon_reminder",
      title: `S\u1EF1 ki\u1EC7n "${hackathonTitle}" s\u1EAFp b\u1EAFt \u0111\u1EA7u!`,
      message: `Hackathon "${hackathonTitle}" s\u1EBD b\u1EAFt \u0111\u1EA7u trong ${timeText}. H\xE3y chu\u1EA9n b\u1ECB s\u1EB5n s\xE0ng!`,
      metadata: { hackathonId }
    });
  }
  /**
   * Gửi notification xác nhận đã đăng ký hackathon
   */
  async createHackathonJoinedNotification(userId, hackathonTitle, hackathonId) {
    return this.createNotification({
      userId,
      type: "hackathon_joined",
      title: `\u0110\xE3 \u0111\u0103ng k\xFD "${hackathonTitle}" th\xE0nh c\xF4ng!`,
      message: `B\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD tham gia hackathon "${hackathonTitle}". Ch\xFAc b\u1EA1n may m\u1EAFn!`,
      metadata: { hackathonId }
    });
  }
  /**
   * Gửi notification khi hackathon bắt đầu
   */
  async createHackathonStartedNotification(userId, hackathonTitle, hackathonId) {
    return this.createNotification({
      userId,
      type: "hackathon_started",
      title: `Hackathon "${hackathonTitle}" \u0111\xE3 b\u1EAFt \u0111\u1EA7u!`,
      message: `Hackathon "${hackathonTitle}" \u0111\xE3 ch\xEDnh th\u1EE9c b\u1EAFt \u0111\u1EA7u. V\xE0o thi ngay!`,
      metadata: { hackathonId }
    });
  }
};
var notification_service_default = new NotificationService();

// src/modules/submission/services/submission.service.ts
var SubmissionService = class extends BaseService {
  constructor() {
    super(submission_repository_default);
  }
  /**
   * Creates a new submission for a user
   * Validates the problem, creates the submission record, processes mock results,
   * updates submission status, handles progress updates, and sends notifications.
   * 
   * @param userId - The unique identifier of the submitting user
   * @param dto - The submission data containing problemId, code, and language
   * @returns Promise resolving to the created submission response
   * @throws Error if problemId, code, or language is missing
   * @throws Error if the specified problem does not exist
   */
  async createSubmission(userId, dto) {
    const { problemId, code, language } = dto;
    if (!problemId || !code || !language) {
      throw new Error("problemId, code, and language are required");
    }
    const problem = await problem_repository_default.findById(problemId);
    if (!problem) {
      throw new Error("Problem not found");
    }
    const submission = await this.repository.create({
      userId,
      problemId,
      code,
      language,
      status: "PENDING",
      runtime: null,
      memory: null
    });
    const results = await this.processMockResults(submission.id, problemId);
    const overallStatus = this.determineOverallStatus(results);
    const avgRuntime = this.calculateAverageRuntime(results);
    const updatedSubmission = await this.repository.update(submission.id, {
      status: overallStatus,
      runtime: avgRuntime
    });
    if (overallStatus === "AC") {
      await this.handleSuccessfulSubmission(userId, problemId);
    }
    await this.createSubmissionNotification(userId, submission.id, problem.title, overallStatus);
    return this.formatResponse(updatedSubmission, results);
  }
  /**
   * Retrieves a submission by its ID, including all test case results
   * 
   * @param id - The unique identifier of the submission
   * @returns Promise resolving to the submission response with results, or null if not found
   */
  async getSubmissionById(id) {
    const submission = await this.repository.findByIdWithResults(id);
    if (!submission) return null;
    return this.formatResponse(submission, submission.results);
  }
  /**
   * Retrieves all submissions for a specific user
   * 
   * @param userId - The unique identifier of the user
   * @returns Promise resolving to an array of user's submission responses
   */
  async getSubmissionsByUserId(userId) {
    const submissions = await this.repository.findByUserId(userId);
    return submissions.map((s) => this.formatResponse(s, []));
  }
  /**
   * Retrieves all submissions for a specific problem
   * 
   * @param problemId - The unique identifier of the problem
   * @returns Promise resolving to an array of problem's submission responses
   */
  async getSubmissionsByProblemId(problemId) {
    const submissions = await this.repository.findByProblemId(problemId);
    return submissions.map((s) => this.formatResponse(s, []));
  }
  /**
   * Handles post-submission actions for successful (AC) submissions
   * Updates the user's progress in the associated course if applicable.
   * 
   * @param userId - The unique identifier of the user
   * @param problemId - The unique identifier of the solved problem
   * @private
   */
  async handleSuccessfulSubmission(userId, problemId) {
    try {
      const enrolledCourse = await this.findCourseByProblemId(problemId);
      if (enrolledCourse) {
        await progress_service_default.incrementProgress(userId, enrolledCourse.courseId);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }
  /**
   * Finds the course that contains a specific problem by searching through lessons
   * Searches both 'code' type lessons and lessons with embedded problemId in content.
   * 
   * @param problemId - The unique identifier of the problem to find
   * @returns Promise resolving to the course ID if found, or null
   * @private
   */
  async findCourseByProblemId(problemId) {
    const { PrismaClient: PrismaClient32 } = await import("@prisma/client");
    const prisma32 = new PrismaClient32();
    const lesson = await prisma32.lesson.findFirst({
      where: {
        type: "code",
        content: {
          contains: problemId
        }
      },
      include: {
        phase: {
          include: {
            course: true
          }
        }
      }
    });
    if (lesson?.phase?.course) {
      return { courseId: lesson.phase.course.id };
    }
    const problemLesson = await prisma32.lesson.findFirst({
      where: {
        content: {
          contains: `"problemId": "${problemId}"`
        }
      },
      include: {
        phase: {
          include: {
            course: true
          }
        }
      }
    });
    if (problemLesson?.phase?.course) {
      return { courseId: problemLesson.phase.course.id };
    }
    return null;
  }
  /**
   * Creates a notification for the user about their submission result
   * 
   * @param userId - The unique identifier of the user to notify
   * @param submissionId - The unique identifier of the submission
   * @param problemTitle - The title of the problem submitted
   * @param status - The final status of the submission
   * @private
   */
  async createSubmissionNotification(userId, submissionId, problemTitle, status) {
    try {
      await notification_service_default.createSubmissionNotification(
        userId,
        submissionId,
        problemTitle,
        status
      );
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  }
  /**
   * Processes mock test results for a submission
   * If no test cases exist, creates a single mock result.
   * Otherwise, generates results for each test case.
   * 
   * @param submissionId - The unique identifier of the submission
   * @param problemId - The unique identifier of the problem
   * @returns Promise resolving to an array of submission results
   * @private
   */
  async processMockResults(submissionId, problemId) {
    const testcases = await this.repository.getTestcasesByProblemId(problemId);
    if (testcases.length === 0) {
      const mockResult = await this.repository.createResult({
        submissionId,
        testcaseId: "mock-tc-1",
        status: "AC",
        runtime: Math.floor(Math.random() * 200) + 50
      });
      return [mockResult];
    }
    const results = [];
    for (const tc of testcases) {
      const mockResult = await this.generateMockResult(submissionId, tc.id);
      results.push(mockResult);
    }
    return results;
  }
  /**
   * Generates a mock result for a single test case with randomized status
   * Uses weighted probability: 60% AC, 15% WA, 15% TLE, 10% RE
   * 
   * @param submissionId - The unique identifier of the submission
   * @param testcaseId - The unique identifier of the test case
   * @returns Promise resolving to the generated submission result
   * @private
   */
  async generateMockResult(submissionId, testcaseId) {
    const statuses = ["AC", "AC", "AC", "WA", "TLE", "RE"];
    const randomIndex = Math.floor(Math.random() * 100);
    let status;
    let runtime;
    if (randomIndex < 60) {
      status = "AC";
      runtime = Math.floor(Math.random() * 150) + 30;
    } else if (randomIndex < 75) {
      status = "WA";
      runtime = Math.floor(Math.random() * 100) + 20;
    } else if (randomIndex < 90) {
      status = "TLE";
      runtime = 2e3;
    } else {
      status = "RE";
      runtime = Math.floor(Math.random() * 50) + 10;
    }
    const result = await this.repository.createResult({
      submissionId,
      testcaseId,
      status,
      runtime
    });
    return result;
  }
  /**
   * Determines the overall submission status from all test case results
   * Priority: RE/CE/TLE/MLE > WA > AC
   * 
   * @param results - Array of submission results from all test cases
   * @returns The overall submission status
   * @private
   */
  determineOverallStatus(results) {
    if (results.length === 0) return "PENDING";
    const hasError = results.some((r) => ["RE", "CE", "TLE", "MLE"].includes(r.status));
    const hasWA = results.some((r) => r.status === "WA");
    if (hasError) return "RE";
    if (hasWA) return "WA";
    return "AC";
  }
  /**
   * Calculates the average runtime from all test case results
   * 
   * @param results - Array of submission results from all test cases
   * @returns The average runtime in milliseconds, or null if no results
   * @private
   */
  calculateAverageRuntime(results) {
    if (results.length === 0) return null;
    const total = results.reduce((sum, r) => sum + (r.runtime || 0), 0);
    return Math.round(total / results.length);
  }
  /**
   * Formats a submission entity into a standardized response object
   * 
   * @param submission - The raw submission entity from the database
   * @param results - Array of submission results to include
   * @returns Formatted SubmissionResponse object
   * @private
   */
  formatResponse(submission, results) {
    return {
      id: submission.id,
      problemId: submission.problemId,
      language: submission.language,
      status: submission.status,
      runtime: submission.runtime,
      memory: submission.memory,
      createdAt: submission.createdAt,
      results: results.map((r) => ({
        id: r.id,
        testcaseId: r.testcaseId,
        status: r.status,
        runtime: r.runtime,
        submissionId: submission.id
      }))
    };
  }
};
var submission_service_default = new SubmissionService();

// src/modules/submission/controllers/submission.controller.ts
var SubmissionController = class extends BaseController {
  /**
   * Constructor - initializes the controller with the submission service
   */
  constructor() {
    super(submission_service_default);
  }
  /**
   * Handles POST /submissions - Creates a new code submission
   * 
   * @param req - Express request object containing user info and submission data
   * @param res - Express response object for sending responses
   * @param next - Express next function for error handling
   */
  createSubmission = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { problemId, code, language } = req.body;
      if (!problemId || !code || !language) {
        this.error(res, "problemId, code, and language are required", 400);
        return;
      }
      const submission = await this.service.createSubmission(userId, { problemId, code, language });
      this.success(res, submission, "Submission created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Handles GET /submissions/:id - Retrieves a specific submission by ID
   * 
   * @param req - Express request object containing submission ID in params
   * @param res - Express response object for sending responses
   * @param next - Express next function for error handling
   */
  getSubmissionById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const submission = await this.service.getSubmissionById(id);
      if (!submission) {
        this.error(res, "Submission not found", 404);
        return;
      }
      this.success(res, submission, "Submission retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Handles GET /submissions - Retrieves all submissions for the authenticated user
   * 
   * @param req - Express request object containing user info
   * @param res - Express response object for sending responses
   * @param next - Express next function for error handling
   */
  getSubmissionsByUserId = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const submissions = await this.service.getSubmissionsByUserId(userId);
      this.success(res, submissions, "Submissions retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
};
var submission_controller_default = new SubmissionController();

// src/modules/submission/routes/submission.routes.ts
var router2 = (0, import_express2.Router)();
router2.post("/", verifyToken, (req, res, next) => submission_controller_default.createSubmission(req, res, next));
router2.get("/my", verifyToken, (req, res, next) => submission_controller_default.getSubmissionsByUserId(req, res, next));
router2.get("/", verifyToken, (req, res, next) => submission_controller_default.getSubmissionsByUserId(req, res, next));
router2.get("/:id", verifyToken, (req, res, next) => submission_controller_default.getSubmissionById(req, res, next));
var submission_routes_default = router2;

// src/modules/user/routes/user.routes.ts
var import_express3 = require("express");

// src/modules/user/services/user.service.ts
var import_bcrypt2 = __toESM(require("bcrypt"));

// src/modules/user/repositories/user.repository.ts
var import_client8 = require("@prisma/client");
var prisma8 = new import_client8.PrismaClient();
var UserRepository = class extends BaseRepository {
  model = prisma8.user;
  /**
   * @method findByEmail
   * @description Tìm kiếm người dùng theo email
   * @param {string} email - Email của người dùng cần tìm
   * @returns {Promise<UserProfile | null>} Thông tin người dùng hoặc null nếu không tìm thấy
   */
  async findByEmail(email) {
    return this.model.findUnique({
      where: { email },
      include: { role: true }
    });
  }
  async findById(id) {
    return this.model.findUnique({
      where: { id },
      include: { role: true }
    });
  }
  async findByIdWithPassword(id) {
    return this.model.findUnique({
      where: { id },
      include: { role: true }
    });
  }
  async updateProfile(id, data) {
    return this.model.update({
      where: { id },
      data,
      include: { role: true }
    });
  }
  async updatePassword(id, hashedPassword) {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
      include: { role: true }
    });
  }
  async markAsOnboarded(id) {
    return this.model.update({
      where: { id },
      data: { isOnboarded: true },
      include: { role: true }
    });
  }
};
var user_repository_default = new UserRepository();

// src/modules/user/services/user.service.ts
var UserService = class extends BaseService {
  constructor() {
    super(user_repository_default);
  }
  async getProfile(userId) {
    return this.repository.findById(userId);
  }
  async updateProfile(userId, dto) {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await this.repository.updateProfile(userId, {
      username: dto.username,
      avatar: dto.avatar,
      bio: dto.bio,
      fullName: dto.fullName,
      school: dto.school,
      learningLevel: dto.learningLevel,
      referralCode: dto.referralCode
    });
    if (dto.fullName && dto.school && dto.learningLevel) {
      await this.repository.markAsOnboarded(userId);
    }
    return updatedUser;
  }
  async changePassword(userId, dto) {
    const user = await this.repository.findByIdWithPassword(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isValid = await import_bcrypt2.default.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }
    if (dto.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }
    const hashedPassword = await import_bcrypt2.default.hash(dto.newPassword, 10);
    await this.repository.updatePassword(userId, hashedPassword);
    return { message: "Password changed successfully" };
  }
};
var user_service_default = new UserService();

// src/modules/user/controllers/user.controller.ts
var UserController = class extends BaseController {
  constructor() {
    super(user_service_default);
  }
  /**
   * @method getProfile
   * @description Xử lý request lấy thông tin hồ sơ người dùng hiện tại
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>}
   */
  getProfile = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const user = await this.service.getProfile(userId);
      if (!user) {
        this.error(res, "User not found", 404);
        return;
      }
      const { password, ...profile } = user;
      this.success(res, profile, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * @method updateProfile
   * @description Xử lý request cập nhật thông tin hồ sơ người dùng
   * @param {Request} req - Express request object (chứa body với username, avatar, bio)
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>}
   */
  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const user = await this.service.updateProfile(userId, req.body);
      const { password, ...profile } = user;
      this.success(res, profile, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * @method changePassword
   * @description Xử lý request thay đổi mật khẩu người dùng
   * @param {Request} req - Express request object (chứa body với currentPassword, newPassword)
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>}
   */
  changePassword = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        this.error(res, "Current password and new password are required", 400);
        return;
      }
      const result = await this.service.changePassword(userId, { currentPassword, newPassword });
      this.success(res, result, "Password changed successfully");
    } catch (error) {
      const status = error.message.includes("incorrect") ? 400 : 500;
      next(error);
    }
  };
};
var user_controller_default = new UserController();

// src/modules/user/routes/user.routes.ts
var router3 = (0, import_express3.Router)();
router3.use(verifyToken);
router3.get("/profile", (req, res, next) => user_controller_default.getProfile(req, res, next));
router3.put("/profile", (req, res, next) => user_controller_default.updateProfile(req, res, next));
router3.post("/change-password", (req, res, next) => user_controller_default.changePassword(req, res, next));
var user_routes_default = router3;

// src/modules/course/routes/course.routes.ts
var import_express4 = require("express");

// src/modules/course/repositories/course.repository.ts
var import_client9 = require("@prisma/client");
var prisma9 = new import_client9.PrismaClient();
var CourseRepository = class extends BaseRepository {
  /** Model Prisma cho bảng course */
  model = prisma9.course;
  /**
   * Lấy tất cả các khóa học, sắp xếp theo thời gian tạo giảm dần.
   * @returns Promise<Course[]> - Mảng tất cả các khóa học
   */
  async findAll() {
    return this.model.findMany({});
  }
  /**
   * Lấy tất cả khóa học của một creator cụ thể.
   * @param creatorId - ID của người tạo khóa học
   * @returns Promise<Course[]> - Mảng các khóa học thuộc về creator
   */
  async findByCreatorId(creatorId) {
    return this.model.findMany({
      where: { creatorId }
    });
  }
  /**
   * Lấy thông tin khóa học theo ID kèm theo các phases và lessons liên quan.
   * Sử dụng eager loading để include toàn bộ cấu trúc phân cấp của khóa học.
   * @param id - ID của khóa học cần lấy
   * @returns Promise<any> - Khóa học kèm phases và lessons đã sắp xếp
   */
  async findByIdWithPhases(id) {
    return this.model.findUnique({
      // Bước 2: Điều kiện tìm kiếm theo id
      where: { id },
      // Bước 3: Include các phases liên quan (eager loading)
      include: {
        // Bước 4: Lấy tất cả phases của course, sắp xếp theo orderIndex
        phases: {
          orderBy: { orderIndex: "asc" },
          // Bước 5: Với mỗi phase, include các lessons và minitests bên trong
          include: {
            // Bước 6: Lấy lessons của phase, sắp xếp theo orderIndex
            lessons: {
              orderBy: { orderIndex: "asc" }
            },
            // Lấy minitests của phase
            minitests: true
          }
        },
        // Include hackathons (Final Test) của khóa học
        hackathons: {
          orderBy: { startTime: "asc" },
          include: {
            problems: {
              include: {
                testcases: true
              }
            }
          }
        },
        // Include projects của khóa học
        projects: {
          orderBy: { id: "asc" }
        }
      }
    });
  }
};
var course_repository_default = new CourseRepository();

// src/modules/course/services/course.service.ts
var CourseService = class extends BaseService {
  /**
   * Constructor khởi tạo service với repository đã được inject.
   */
  constructor() {
    super(course_repository_default);
  }
  /**
   * Tạo mới một khóa học.
   * @param creatorId - ID của người tạo khóa học (từ token đã xác thực)
   * @param dto - Dữ liệu khóa học cần tạo (title, description, price, level)
   * @returns Promise<CourseWithPhases> - Khóa học đã được tạo
   * @throws Error - Nếu thiếu title hoặc description bắt buộc
   */
  async create(creatorId, dto) {
    if (!dto.title || !dto.description) {
      throw new Error("Title and description are required");
    }
    const courseData = {
      title: dto.title,
      description: dto.description,
      // Bước 3: Set giá trị mặc định cho price nếu không được cung cấp
      price: dto.price || 0,
      // Bước 4: Set giá trị mặc định cho level nếu không được cung cấp
      level: dto.level || "beginner",
      // Bước 5: Gán creatorId từ user đã xác thực
      creatorId
    };
    if (dto.features !== void 0) {
      courseData.features = dto.features;
    }
    if (dto.includes !== void 0) {
      courseData.includes = dto.includes;
    }
    const course = await this.repository.create(courseData);
    return { ...course, phases: [] };
  }
  /**
   * Lấy danh sách tất cả các khóa học.
   * @returns Promise<CourseWithPhases[]> - Mảng các khóa học với phases rỗng
   */
  async getAll() {
    const courses = await this.repository.findAll();
    return courses.map((c) => ({ ...c, phases: [] }));
  }
  /**
   * Lấy thông tin một khóa học theo ID, kèm theo các phases và lessons.
   * @param id - ID của khóa học cần lấy
   * @returns Promise<CourseWithPhases | null> - Khóa học với phases hoặc null nếu không tìm thấy
   */
  async getById(id) {
    const course = await this.repository.findByIdWithPhases(id);
    if (!course) return null;
    return course;
  }
  /**
   * Lấy danh sách khóa học của một creator cụ thể.
   * @param creatorId - ID của người tạo khóa học
   * @returns Promise<CourseWithPhases[]> - Mảng các khóa học của creator
   */
  async getByCreatorId(creatorId) {
    const courses = await this.repository.findByCreatorId(creatorId);
    return courses.map((c) => ({ ...c, phases: [] }));
  }
  /**
   * Cập nhật thông tin một khóa học.
   * @param id - ID của khóa học cần cập nhật
   * @param dto - Dữ liệu cần cập nhật (các trường optional)
   * @returns Promise<CourseWithPhases> - Khóa học đã được cập nhật
   * @throws Error - Nếu khóa học không tồn tại
   */
  async update(id, dto) {
    const course = await this.repository.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    const updateData = {
      title: dto.title,
      description: dto.description,
      price: dto.price,
      level: dto.level
    };
    if (dto.subscriptionType !== void 0) {
      updateData.subscriptionType = dto.subscriptionType;
    }
    if (dto.subscriptionPrice !== void 0) {
      updateData.subscriptionPrice = dto.subscriptionPrice;
    }
    if (dto.autoEnrollOnApproval !== void 0) {
      updateData.autoEnrollOnApproval = dto.autoEnrollOnApproval;
    }
    if (dto.unlockLessonsCount !== void 0) {
      updateData.unlockLessonsCount = dto.unlockLessonsCount;
    }
    if (dto.unlockByPhase !== void 0) {
      updateData.unlockByPhase = dto.unlockByPhase;
    }
    if (dto.features !== void 0) {
      updateData.features = dto.features;
    }
    if (dto.includes !== void 0) {
      updateData.includes = dto.includes;
    }
    const updated = await this.repository.update(id, updateData);
    return { ...updated, phases: [] };
  }
  /**
   * Xóa một khóa học.
   * @param id - ID của khóa học cần xóa
   * @returns Promise<{ message: string }> - Thông báo xóa thành công
   * @throws Error - Nếu khóa học không tồn tại
   */
  async delete(id) {
    const course = await this.repository.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    await this.repository.delete(id);
    return { message: "Course deleted successfully" };
  }
};
var course_service_default = new CourseService();

// src/modules/course/controllers/course.controller.ts
var CourseController = class extends BaseController {
  /**
   * Constructor khởi tạo controller với service tương ứng.
   * Inject courseService vào base controller để sử dụng trong các methods.
   */
  constructor() {
    super(course_service_default);
  }
  /**
   * Tạo mới một khóa học.
   * Endpoint: POST /courses
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa body với title, description, price, level
   * @param res - Response object để trả về kết quả
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  create = async (req, res, next) => {
    try {
      const creatorId = req.user?.userId;
      if (!creatorId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const course = await this.service.create(creatorId, req.body);
      this.success(res, course, "Course created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách tất cả khóa học.
   * Endpoint: GET /courses
   * Không yêu cầu xác thực - public endpoint.
   * 
   * @param req - Request object (không sử dụng params/body)
   * @param res - Response object để trả về danh sách khóa học
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  getAll = async (req, res, next) => {
    try {
      const courses = await this.service.getAll();
      this.success(res, courses, "Courses retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy thông tin một khóa học theo ID.
   * Endpoint: GET /courses/:id
   * Không yêu cầu xác thực - public endpoint.
   * 
   * @param req - Request object chứa params.id là ID của khóa học
   * @param res - Response object để trả về thông tin khóa học
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const course = await this.service.getById(id);
      if (!course) {
        this.error(res, "Course not found", 404);
        return;
      }
      this.success(res, course, "Course retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách khóa học của creator đang đăng nhập.
   * Endpoint: GET /courses/my/creator
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa thông tin user từ token
   * @param res - Response object để trả về danh sách khóa học của creator
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  getByCreator = async (req, res, next) => {
    try {
      const creatorId = req.user?.userId;
      if (!creatorId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const courses = await this.service.getByCreatorId(creatorId);
      this.success(res, courses, "Courses retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật thông tin một khóa học.
   * Endpoint: PUT /courses/:id
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa params.id và body với các trường cần update
   * @param res - Response object để trả về khóa học đã được cập nhật
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const course = await this.service.update(id, req.body);
      this.success(res, course, "Course updated successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
  /**
   * Xóa một khóa học.
   * Endpoint: DELETE /courses/:id
   * Yêu cầu: User đã xác thực (token hợp lệ)
   * 
   * @param req - Request object chứa params.id của khóa học cần xóa
   * @param res - Response object để trả về kết quả xóa
   * @param next - NextFunction để chuyển error sang middleware xử lý lỗi
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      this.success(res, result, "Course deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
};
var course_controller_default = new CourseController();

// src/modules/course/routes/course.routes.ts
var router4 = (0, import_express4.Router)();
router4.get("/", (req, res, next) => course_controller_default.getAll(req, res, next));
router4.get("/:id", (req, res, next) => course_controller_default.getById(req, res, next));
router4.post("/", verifyToken, (req, res, next) => course_controller_default.create(req, res, next));
router4.put("/:id", verifyToken, (req, res, next) => course_controller_default.update(req, res, next));
router4.delete("/:id", verifyToken, (req, res, next) => course_controller_default.delete(req, res, next));
router4.get("/my/creator", verifyToken, (req, res, next) => course_controller_default.getByCreator(req, res, next));
var course_routes_default = router4;

// src/modules/phase/routes/phase.routes.ts
var import_express5 = require("express");

// src/modules/phase/repositories/phase.repository.ts
var import_client10 = require("@prisma/client");
var prisma10 = new import_client10.PrismaClient();
var PhaseRepository = class extends BaseRepository {
  /** Prisma model được sử dụng cho các thao tác database */
  model = prisma10.phase;
  /**
   * Tìm tất cả các phase theo courseId
   * @param courseId - ID của khóa học cần lấy các phase
   * @returns Promise<Phase[]> - Danh sách các phase của khóa học
   */
  async findByCourseId(courseId) {
    return this.model.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" }
    });
  }
  /**
   * Xóa tất cả các phase theo courseId
   * @param courseId - ID của khóa học cần xóa các phase
   */
  async deleteByCourseId(courseId) {
    await this.model.deleteMany({ where: { courseId } });
  }
};
var phase_repository_default = new PhaseRepository();

// src/modules/phase/services/phase.service.ts
var PhaseService = class extends BaseService {
  constructor() {
    super(phase_repository_default);
  }
  /**
   * Tạo mới một phase
   * @param dto - Dữ liệu tạo phase bao gồm courseId và title
   * @returns Promise<Phase> - Phase vừa được tạo
   * @throws Error - Nếu thiếu courseId hoặc title
   */
  async create(dto) {
    if (!dto.courseId || !dto.title) {
      throw new Error("courseId and title are required");
    }
    const phase = await this.repository.create({
      courseId: dto.courseId,
      title: dto.title,
      orderIndex: dto.orderIndex || 0
    });
    return phase;
  }
  /**
   * Tạo phase với auto orderIndex
   * @param params - courseId và title
   * @returns Promise<Phase>
   */
  async createPhase(params) {
    const phases = await this.repository.findByCourseId(params.courseId);
    const maxOrder = phases.reduce((max, p) => Math.max(max, p.orderIndex || 0), -1);
    return this.create({
      courseId: params.courseId,
      title: params.title,
      orderIndex: maxOrder + 1
    });
  }
  /**
   * Lấy tất cả các phase của một khóa học
   * @param courseId - ID của khóa học
   * @returns Promise<Phase[]> - Danh sách các phase
   */
  async getByCourseId(courseId) {
    return this.repository.findByCourseId(courseId);
  }
  /**
   * Lấy một phase theo ID
   * @param id - ID của phase cần lấy
   * @returns Promise<Phase | null> - Phase tìm được hoặc null
   */
  async getById(id) {
    return this.repository.findById(id);
  }
  /**
   * Cập nhật một phase
   * @param id - ID của phase cần cập nhật
   * @param dto - Dữ liệu cập nhật (title và/hoặc orderIndex)
   * @returns Promise<Phase> - Phase sau khi cập nhật
   * @throws Error - Nếu phase không tồn tại
   */
  async update(id, dto) {
    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new Error("Phase not found");
    }
    const updated = await this.repository.update(id, {
      title: dto.title,
      orderIndex: dto.orderIndex
    });
    return updated;
  }
  /**
   * Xóa một phase
   * @param id - ID của phase cần xóa
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu phase không tồn tại
   */
  async delete(id) {
    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new Error("Phase not found");
    }
    await this.repository.delete(id);
    return { message: "Phase deleted successfully" };
  }
};
var phase_service_default = new PhaseService();

// src/modules/phase/controllers/phase.controller.ts
var PhaseController = class extends BaseController {
  constructor() {
    super(phase_service_default);
  }
  /**
   * Tạo mới một phase
   * POST /api/phases
   * @param req - Request chứa body với courseId và title
   * @param res - Response trả về phase đã tạo
   * @param next - Next function để xử lý lỗi
   */
  create = async (req, res, next) => {
    try {
      const phase = await this.service.create(req.body);
      this.success(res, phase, "Phase created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả các phase của một khóa học
   * GET /api/phases/course/:courseId
   * @param req - Request chứa params.courseId
   * @param res - Response trả về danh sách các phase
   * @param next - Next function để xử lý lỗi
   */
  getByCourseId = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const phases = await this.service.getByCourseId(courseId);
      this.success(res, phases, "Phases retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy một phase theo ID
   * GET /api/phases/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về phase tìm được
   * @param next - Next function để xử lý lỗi
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const phase = await this.service.getById(id);
      if (!phase) {
        this.error(res, "Phase not found", 404);
        return;
      }
      this.success(res, phase, "Phase retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật một phase
   * PUT /api/phases/:id
   * @param req - Request chứa params.id và body với title/orderIndex
   * @param res - Response trả về phase đã cập nhật
   * @param next - Next function để xử lý lỗi
   */
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const phase = await this.service.update(id, req.body);
      this.success(res, phase, "Phase updated successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
  /**
   * Xóa một phase
   * DELETE /api/phases/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về thông báo thành công
   * @param next - Next function để xử lý lỗi
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      this.success(res, result, "Phase deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
};
var phase_controller_default = new PhaseController();

// src/modules/phase/routes/phase.routes.ts
var router5 = (0, import_express5.Router)();
router5.post("/", (req, res, next) => phase_controller_default.create(req, res, next));
router5.get("/course/:courseId", (req, res, next) => phase_controller_default.getByCourseId(req, res, next));
router5.get("/:id", (req, res, next) => phase_controller_default.getById(req, res, next));
router5.put("/:id", (req, res, next) => phase_controller_default.update(req, res, next));
router5.delete("/:id", (req, res, next) => phase_controller_default.delete(req, res, next));
var phase_routes_default = router5;

// src/modules/lesson/routes/lesson.routes.ts
var import_express6 = require("express");

// src/modules/lesson/repositories/lesson.repository.ts
var import_client11 = require("@prisma/client");
var prisma11 = new import_client11.PrismaClient();
var LessonRepository = class extends BaseRepository {
  /** Prisma model instance for Lesson entity */
  model = prisma11.lesson;
  /**
   * Find lesson by ID with full relations (phase, course, hackathons, projects)
   */
  async findById(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: {
              include: {
                hackathons: true,
                projects: true
              }
            },
            minitests: true
          }
        }
      }
    });
  }
  /**
   * Retrieves all lessons belonging to a specific phase.
   * Results are sorted by orderIndex in ascending order.
   * @param phaseId - The ID of the phase to get lessons for
   * @returns Promise resolving to array of lessons sorted by order
   */
  async findByPhaseId(phaseId) {
    return this.model.findMany({
      where: { phaseId },
      orderBy: { orderIndex: "asc" }
    });
  }
};
var lesson_repository_default = new LessonRepository();

// src/modules/lesson/services/lesson.service.ts
var LessonService = class extends BaseService {
  constructor() {
    super(lesson_repository_default);
  }
  /**
   * Creates a new lesson after validating required fields.
   * @param dto - CreateLessonDto containing lesson data
   * @returns Promise resolving to the created lesson
   * @throws Error if required fields (phaseId, title, content) are missing
   */
  async create(dto) {
    if (!dto.phaseId || !dto.title || !dto.content) {
      throw new Error("phaseId, title, and content are required");
    }
    const lesson = await this.repository.create({
      phaseId: dto.phaseId,
      title: dto.title,
      content: dto.content,
      type: dto.type || "video",
      orderIndex: dto.orderIndex || 0,
      isPublished: true
    });
    return lesson;
  }
  /**
   * Create lesson for lecture (without content initially)
   * @param params - phaseId, title, type, status
   * @returns Promise resolving to the created lesson
   */
  async createLesson(params) {
    if (!params.phaseId || !params.title) {
      throw new Error("phaseId and title are required");
    }
    const lessons = await this.repository.findByPhaseId(params.phaseId);
    const maxOrder = lessons.reduce((max, l) => Math.max(max, l.orderIndex || 0), -1);
    const lesson = await this.repository.create({
      phaseId: params.phaseId,
      title: params.title,
      content: "",
      type: params.type || "theory",
      status: params.status || "DRAFT",
      orderIndex: maxOrder + 1,
      isPublished: true
    });
    return lesson;
  }
  /**
   * Retrieves all lessons for a specific phase.
   * @param phaseId - ID of the phase to get lessons for
   * @returns Promise resolving to array of lessons
   */
  async getByPhaseId(phaseId) {
    return this.repository.findByPhaseId(phaseId);
  }
  /**
   * Retrieves a single lesson by its ID.
   * @param id - Unique identifier of the lesson
   * @returns Promise resolving to the lesson or null if not found
   */
  async getById(id) {
    return this.repository.findById(id);
  }
  /**
   * Updates an existing lesson with new data.
   * @param id - ID of the lesson to update
   * @param dto - UpdateLessonDto containing fields to update
   * @returns Promise resolving to the updated lesson
   * @throws Error if lesson is not found
   */
  async update(id, dto) {
    const lesson = await this.repository.findById(id);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const updated = await this.repository.update(id, {
      title: dto.title,
      content: dto.content,
      type: dto.type,
      orderIndex: dto.orderIndex
    });
    return updated;
  }
  /**
   * Deletes a lesson by its ID.
   * @param id - ID of the lesson to delete
   * @returns Promise resolving to success message
   * @throws Error if lesson is not found
   */
  async delete(id) {
    const lesson = await this.repository.findById(id);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    await this.repository.delete(id);
    return { message: "Lesson deleted successfully" };
  }
};
var lesson_service_default = new LessonService();

// src/modules/lesson/controllers/lesson.controller.ts
var LessonController = class extends BaseController {
  /**
   * Initializes the controller with the lesson service.
   * @constructor
   */
  constructor() {
    super(lesson_service_default);
  }
  /**
   * Creates a new lesson.
   * Handles POST /lessons
   * @param req - Express request object containing lesson data in body
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  create = async (req, res, next) => {
    try {
      const lesson = await this.service.create(req.body);
      this.success(res, lesson, "Lesson created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Retrieves all lessons for a specific phase.
   * Handles GET /lessons/phase/:phaseId
   * @param req - Express request object containing phaseId in params
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  getByPhaseId = async (req, res, next) => {
    try {
      const { phaseId } = req.params;
      const lessons = await this.service.getByPhaseId(phaseId);
      this.success(res, lessons, "Lessons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Retrieves a single lesson by its ID.
   * Handles GET /lessons/:id
   * @param req - Express request object containing lesson id in params
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const lesson = await this.service.getById(id);
      if (!lesson) {
        this.error(res, "Lesson not found", 404);
        return;
      }
      this.success(res, lesson, "Lesson retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Updates an existing lesson.
   * Handles PUT /lessons/:id
   * @param req - Express request object containing id in params and update data in body
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const lesson = await this.service.update(id, req.body);
      this.success(res, lesson, "Lesson updated successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
  /**
   * Deletes a lesson by its ID.
   * Handles DELETE /lessons/:id
   * @param req - Express request object containing lesson id in params
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      this.success(res, result, "Lesson deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
};
var lesson_controller_default = new LessonController();

// src/modules/lesson/routes/lesson.routes.ts
var router6 = (0, import_express6.Router)();
router6.post("/", (req, res, next) => lesson_controller_default.create(req, res, next));
router6.get("/phase/:phaseId", (req, res, next) => lesson_controller_default.getByPhaseId(req, res, next));
router6.get("/:id", (req, res, next) => lesson_controller_default.getById(req, res, next));
router6.put("/:id", (req, res, next) => lesson_controller_default.update(req, res, next));
router6.delete("/:id", (req, res, next) => lesson_controller_default.delete(req, res, next));
var lesson_routes_default = router6;

// src/modules/enrollment/routes/enrollment.routes.ts
var import_express7 = require("express");

// src/modules/enrollment/repositories/enrollment.repository.ts
var import_client12 = require("@prisma/client");
var prisma12 = new import_client12.PrismaClient();
var EnrollmentRepository = class extends BaseRepository {
  model = prisma12.enrollment;
  /**
   * Lấy danh sách tất cả enrollment của một user
   * Bao gồm thông tin chi tiết của course và các lessons
   * @param userId - ID của người dùng
   * @returns Promise<Enrollment[]> - Danh sách enrollment kèm course details
   */
  async findByUserId(userId) {
    const enrollments = await this.model.findMany({
      where: { userId },
      include: {
        coach: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            email: true,
            bio: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        course: {
          include: {
            phases: {
              orderBy: { orderIndex: "asc" },
              include: {
                lessons: {
                  orderBy: { orderIndex: "asc" }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course.phases.reduce(
          (sum, phase) => sum + phase.lessons.length,
          0
        );
        const completedCount = await prisma12.lessonProgress.count({
          where: {
            userId,
            courseId: enrollment.courseId,
            isCompleted: true
          }
        });
        const progress = totalLessons > 0 ? Math.round(completedCount / totalLessons * 100) : Math.round(enrollment.progress || 0);
        return {
          ...enrollment,
          progress,
          coachId: enrollment.coachId,
          coach: enrollment.coach
        };
      })
    );
    return enrollmentsWithProgress;
  }
  /**
   * Tìm một enrollment cụ thể theo userId và courseId
   * Sử dụng unique constraint composite key
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Enrollment | null> - Enrollment nếu tìm thấy, null nếu không
   */
  async findByUserIdAndCourseId(userId, courseId) {
    return this.model.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      select: {
        id: true,
        userId: true,
        courseId: true,
        progress: true,
        coachId: true,
        completedLessons: true,
        currentUnlocks: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            unlockLessonsCount: true,
            unlockByPhase: true
          }
        }
      }
    });
  }
  /**
   * Cập nhật tiến độ học tập của một enrollment
   * @param id - ID của enrollment cần cập nhật
   * @param progress - Tiến độ mới (0-100)
   * @returns Promise<Enrollment> - Enrollment sau khi cập nhật
   */
  async updateProgress(id, progress) {
    return this.model.update({
      where: { id },
      data: { progress }
    });
  }
};
var enrollment_repository_default = new EnrollmentRepository();

// src/modules/enrollment/services/enrollment.service.ts
var EnrollmentService = class extends BaseService {
  constructor() {
    super(enrollment_repository_default);
  }
  /**
   * Đăng ký một khóa học cho người dùng
   * Kiểm tra điều kiện trước khi tạo enrollment mới
   * @param userId - ID của người dùng đăng ký
   * @param dto - Dữ liệu đăng ký (courseId, coachId)
   * @returns Promise<Enrollment> - Enrollment vừa được tạo
   * @throws Error nếu thiếu courseId hoặc đã đăng ký rồi
   */
  async enroll(userId, dto) {
    if (!dto.courseId) {
      throw new Error("courseId is required");
    }
    const existing = await this.repository.findByUserIdAndCourseId(userId, dto.courseId);
    if (existing) {
      throw new Error("Already enrolled in this course");
    }
    const course = await prisma_default.course.findUnique({
      where: { id: dto.courseId },
      select: { unlockLessonsCount: true, subscriptionType: true, price: true }
    });
    const unlockLessonsCount = course?.unlockLessonsCount ?? 3;
    const isFreeCourse = course?.subscriptionType === "FREE" || course?.price === 0;
    const currentUnlocks = isFreeCourse ? 999999 : unlockLessonsCount;
    const enrollment = await this.repository.create({
      userId,
      courseId: dto.courseId,
      progress: 0,
      coachId: dto.coachId || null,
      // Progressive unlock: mở khóa tất cả bài cho khóa miễn phí, hoặc unlockLessonsCount bài cho khóa trả phí
      currentUnlocks,
      completedLessons: 0
    });
    return enrollment;
  }
  /**
   * Lấy danh sách tất cả enrollment của một user
   * @param userId - ID của người dùng
   * @returns Promise<Enrollment[]> - Danh sách enrollment
   */
  async getUserEnrollments(userId) {
    return this.repository.findByUserId(userId);
  }
  /**
   * Lấy thông tin một enrollment cụ thể
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Enrollment | null> - Enrollment nếu tìm thấy
   */
  async getEnrollment(userId, courseId) {
    return this.repository.findByUserIdAndCourseId(userId, courseId);
  }
  /**
   * Cập nhật tiến độ học tập của một enrollment
   * Kiểm tra giá trị progress hợp lệ và enrollment tồn tại
   * @param enrollmentId - ID của enrollment cần cập nhật
   * @param progress - Tiến độ mới (0-100)
   * @returns Promise<Enrollment> - Enrollment sau khi cập nhật
   * @throws Error nếu progress không hợp lệ hoặc enrollment không tồn tại
   */
  async updateProgress(enrollmentId, progress) {
    if (progress < 0 || progress > 100) {
      throw new Error("Progress must be between 0 and 100");
    }
    const enrollment = await this.repository.findById(enrollmentId);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return this.repository.updateProgress(enrollmentId, progress);
  }
  /**
   * Hủy đăng ký khóa học của người dùng
   * Tìm enrollment và xóa khỏi database
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học cần hủy đăng ký
   * @returns Promise<{message: string}> - Thông báo thành công
   * @throws Error nếu enrollment không tồn tại
   */
  async unenroll(userId, courseId) {
    const enrollment = await this.repository.findByUserIdAndCourseId(userId, courseId);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    await this.repository.delete(enrollment.id);
    return { message: "Unenrolled successfully" };
  }
};
var enrollment_service_default = new EnrollmentService();

// src/modules/enrollment/controllers/enrollment.controller.ts
var EnrollmentController = class extends BaseController {
  /**
   * Constructor - Khởi tạo controller với enrollmentService
   */
  constructor() {
    super(enrollment_service_default);
  }
  /**
   * POST /enrollment - Đăng ký khóa học mới
   * Yêu cầu user đã đăng nhập (có userId trong token)
   * @param req - Express Request object (chứa user.userId và body với courseId)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  enroll = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const enrollment = await this.service.enroll(userId, req.body);
      this.success(res, enrollment, "Enrolled successfully", 201);
    } catch (error) {
      const status = error.message.includes("Already") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * GET /enrollment - Lấy danh sách enrollment của user hiện tại
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getMyEnrollments = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const enrollments = await this.service.getUserEnrollments(userId);
      this.success(res, enrollments, "Enrollments retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * GET /enrollment/:courseId - Lấy thông tin một enrollment cụ thể
   * @param req - Express Request object (chứa params.courseId)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getEnrollment = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const enrollment = await this.service.getEnrollment(userId, courseId);
      if (!enrollment) {
        this.error(res, "Enrollment not found", 404);
        return;
      }
      this.success(res, enrollment, "Enrollment retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * PUT /enrollment/:enrollmentId/progress - Cập nhật tiến độ học tập
   * @param req - Express Request object (chứa params.enrollmentId, body.progress)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  updateProgress = async (req, res, next) => {
    try {
      const { enrollmentId } = req.params;
      const { progress } = req.body;
      if (typeof progress !== "number") {
        this.error(res, "Progress must be a number", 400);
        return;
      }
      const enrollment = await this.service.updateProgress(enrollmentId, progress);
      this.success(res, enrollment, "Progress updated successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * DELETE /enrollment/:courseId - Hủy đăng ký khóa học
   * @param req - Express Request object (chứa params.courseId)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  unenroll = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const result = await this.service.unenroll(userId, courseId);
      this.success(res, result, "Unenrolled successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
};
var enrollment_controller_default = new EnrollmentController();

// src/modules/enrollment/routes/enrollment.routes.ts
var router7 = (0, import_express7.Router)();
router7.post("/", verifyToken, (req, res, next) => enrollment_controller_default.enroll(req, res, next));
router7.get("/my", verifyToken, (req, res, next) => enrollment_controller_default.getMyEnrollments(req, res, next));
router7.get("/", verifyToken, (req, res, next) => enrollment_controller_default.getMyEnrollments(req, res, next));
router7.get("/:courseId", verifyToken, (req, res, next) => enrollment_controller_default.getEnrollment(req, res, next));
router7.put("/:enrollmentId/progress", verifyToken, (req, res, next) => enrollment_controller_default.updateProgress(req, res, next));
router7.delete("/:courseId", verifyToken, (req, res, next) => enrollment_controller_default.unenroll(req, res, next));
var enrollment_routes_default = router7;

// src/modules/problem/routes/problem.routes.ts
var import_express8 = require("express");

// src/modules/problem/services/problem.service.ts
var ProblemService = class extends BaseService {
  constructor() {
    super(problem_repository_default);
  }
  /**
   * Get all problems
   * @description Retrieves all problems from the database.
   * @returns Promise resolving to an array of all problems
   */
  async getAll() {
    return this.repository.findMany();
  }
  /**
   * Create a new problem
   * @description Validates input data and creates a new problem in the database.
   * @param dto - Data Transfer Object containing problem details
   * @returns Promise resolving to the created problem
   * @throws Error if title or description is missing
   */
  async create(dto) {
    if (!dto.title || !dto.description) {
      throw new Error("Title and description are required");
    }
    const problem = await this.repository.create({
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty || "easy",
      timeLimit: dto.timeLimit || 1e3,
      memoryLimit: dto.memoryLimit || 256
    });
    return problem;
  }
  /**
   * Get a problem by ID with all testcases
   * @description Retrieves a problem along with its associated test cases.
   * @param id - The unique identifier of the problem
   * @returns Promise resolving to the problem with testcases or null
   */
  async getById(id) {
    return this.repository.findByIdWithTestcases(id);
  }
  /**
   * Get all public test cases for a problem
   * @description Retrieves only the test cases that are marked as public for user access.
   * @param problemId - The unique identifier of the problem
   * @returns Promise resolving to an array of public test cases
   * @throws Error if the problem is not found
   */
  async getPublicTestcases(problemId) {
    const problem = await this.repository.findById(problemId);
    if (!problem) {
      throw new Error("Problem not found");
    }
    return this.repository.findPublicTestcases(problemId);
  }
  /**
   * Update an existing problem
   * @description Validates existence and updates problem data with provided fields.
   * @param id - The unique identifier of the problem to update
   * @param dto - Data Transfer Object containing fields to update
   * @returns Promise resolving to the updated problem
   * @throws Error if the problem is not found
   */
  async update(id, dto) {
    const problem = await this.repository.findById(id);
    if (!problem) {
      throw new Error("Problem not found");
    }
    return this.repository.update(id, {
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      timeLimit: dto.timeLimit,
      memoryLimit: dto.memoryLimit
    });
  }
  /**
   * Delete a problem
   * @description Removes a problem from the database after verifying its existence.
   * @param id - The unique identifier of the problem to delete
   * @returns Promise resolving to a success message
   * @throws Error if the problem is not found
   */
  async delete(id) {
    const problem = await this.repository.findById(id);
    if (!problem) {
      throw new Error("Problem not found");
    }
    await this.repository.delete(id);
    return { message: "Problem deleted successfully" };
  }
};
var problem_service_default = new ProblemService();

// src/modules/problem/controllers/problem.controller.ts
var ProblemController = class extends BaseController {
  /**
   * Constructor
   * @description Initializes the controller with the problem service.
   */
  constructor() {
    super(problem_service_default);
  }
  /**
   * Get all problems
   * @description Handles GET request to retrieve all problems.
   * @param req - Express request object
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  getAll = async (req, res, next) => {
    try {
      const problems = await this.service.getAll();
      this.success(res, problems, "Problems retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Create a new problem
   * @description Handles POST request to create a new programming problem.
   * @param req - Express request object containing problem data in body
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  create = async (req, res, next) => {
    try {
      const problem = await this.service.create(req.body);
      this.success(res, problem, "Problem created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Get a problem by ID
   * @description Handles GET request to retrieve a specific problem by its ID.
   * @param req - Express request object containing problem ID in params
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const problem = await this.service.getById(id);
      if (!problem) {
        this.error(res, "Problem not found", 404);
        return;
      }
      this.success(res, problem, "Problem retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Get all public test cases for a problem
   * @description Handles GET request to retrieve only public test cases of a problem.
   * @param req - Express request object containing problemId in params
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  getPublicTestcases = async (req, res, next) => {
    try {
      const { problemId } = req.params;
      const testcases = await this.service.getPublicTestcases(problemId);
      this.success(res, testcases, "Public testcases retrieved successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Update an existing problem
   * @description Handles PUT request to update problem details.
   * @param req - Express request object containing ID in params and update data in body
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const problem = await this.service.update(id, req.body);
      this.success(res, problem, "Problem updated successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Delete a problem
   * @description Handles DELETE request to remove a problem from the system.
   * @param req - Express request object containing ID in params
   * @param res - Express response object for sending response
   * @param next - Express next function for error handling
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      this.success(res, result, "Problem deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
};
var problem_controller_default = new ProblemController();

// src/modules/problem/routes/problem.routes.ts
var router8 = (0, import_express8.Router)();
router8.post("/", (req, res, next) => problem_controller_default.create(req, res, next));
router8.get("/", (req, res, next) => problem_controller_default.getAll(req, res, next));
router8.get("/:id", (req, res, next) => problem_controller_default.getById(req, res, next));
router8.get("/:problemId/testcases/public", (req, res, next) => problem_controller_default.getPublicTestcases(req, res, next));
router8.put("/:id", (req, res, next) => problem_controller_default.update(req, res, next));
router8.delete("/:id", (req, res, next) => problem_controller_default.delete(req, res, next));
var problem_routes_default = router8;

// src/modules/testcase/routes/testcase.routes.ts
var import_express9 = require("express");

// src/modules/testcase/repositories/testcase.repository.ts
var import_client13 = require("@prisma/client");
var prisma13 = new import_client13.PrismaClient();
var TestcaseRepository = class extends BaseRepository {
  /** Prisma model được sử dụng cho các thao tác database */
  model = prisma13.testcase;
  /**
   * Tìm tất cả các testcase theo problemId
   * @param problemId - ID của bài toán cần lấy các testcase
   * @returns Promise<Testcase[]> - Danh sách các testcase của bài toán
   */
  async findByProblemId(problemId) {
    return this.model.findMany({
      where: { problemId },
      orderBy: { id: "asc" }
    });
  }
  /**
   * Tìm các testcase công khai theo problemId
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách testcase công khai
   */
  async findPublicByProblemId(problemId) {
    return this.model.findMany({
      where: {
        problemId,
        isPublic: true
      }
    });
  }
  /**
   * Tìm các testcase riêng tư theo problemId
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách testcase riêng tư
   */
  async findPrivateByProblemId(problemId) {
    return this.model.findMany({
      where: {
        problemId,
        isPublic: false
      }
    });
  }
};
var testcase_repository_default = new TestcaseRepository();

// src/modules/testcase/services/testcase.service.ts
var TestcaseService = class extends BaseService {
  constructor() {
    super(testcase_repository_default);
  }
  /**
   * Tạo mới một testcase
   * @param dto - Dữ liệu tạo testcase bao gồm problemId, input, expectedOutput
   * @returns Promise<Testcase> - Testcase vừa được tạo
   * @throws Error - Nếu thiếu các trường bắt buộc
   */
  async create(dto) {
    if (!dto.problemId || !dto.input || !dto.expectedOutput) {
      throw new Error("problemId, input, and expectedOutput are required");
    }
    const testcase = await this.repository.create({
      problemId: dto.problemId,
      input: dto.input,
      expectedOutput: dto.expectedOutput,
      isPublic: dto.isPublic ?? false
    });
    return testcase;
  }
  /**
   * Lấy tất cả các testcase của một bài toán
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách các testcase
   */
  async getByProblemId(problemId) {
    return this.repository.findByProblemId(problemId);
  }
  /**
   * Lấy các testcase công khai của một bài toán
   * @param problemId - ID của bài toán
   * @returns Promise<Testcase[]> - Danh sách testcase công khai
   */
  async getPublicByProblemId(problemId) {
    return this.repository.findPublicByProblemId(problemId);
  }
  /**
   * Lấy một testcase theo ID
   * @param id - ID của testcase cần lấy
   * @returns Promise<Testcase | null> - Testcase tìm được hoặc null
   */
  async getById(id) {
    return this.repository.findById(id);
  }
  /**
   * Cập nhật một testcase
   * @param id - ID của testcase cần cập nhật
   * @param dto - Dữ liệu cập nhật (input, expectedOutput, isPublic)
   * @returns Promise<Testcase> - Testcase sau khi cập nhật
   * @throws Error - Nếu testcase không tồn tại
   */
  async update(id, dto) {
    const testcase = await this.repository.findById(id);
    if (!testcase) {
      throw new Error("Testcase not found");
    }
    return this.repository.update(id, {
      input: dto.input,
      expectedOutput: dto.expectedOutput,
      isPublic: dto.isPublic
    });
  }
  /**
   * Xóa một testcase
   * @param id - ID của testcase cần xóa
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu testcase không tồn tại
   */
  async delete(id) {
    const testcase = await this.repository.findById(id);
    if (!testcase) {
      throw new Error("Testcase not found");
    }
    await this.repository.delete(id);
    return { message: "Testcase deleted successfully" };
  }
};
var testcase_service_default = new TestcaseService();

// src/modules/testcase/controllers/testcase.controller.ts
var TestcaseController = class extends BaseController {
  constructor() {
    super(testcase_service_default);
  }
  /**
   * Tạo mới một testcase
   * POST /api/testcases
   * @param req - Request chứa body với problemId, input, expectedOutput, isPublic
   * @param res - Response trả về testcase đã tạo
   * @param next - Next function để xử lý lỗi
   */
  create = async (req, res, next) => {
    try {
      const testcase = await this.service.create(req.body);
      this.success(res, testcase, "Testcase created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả các testcase của một bài toán
   * GET /api/testcases/problem/:problemId
   * @param req - Request chứa params.problemId
   * @param res - Response trả về danh sách các testcase
   * @param next - Next function để xử lý lỗi
   */
  getByProblemId = async (req, res, next) => {
    try {
      const { problemId } = req.params;
      const testcases = await this.service.getByProblemId(problemId);
      this.success(res, testcases, "Testcases retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy các testcase công khai của một bài toán
   * GET /api/testcases/problem/:problemId/public
   * @param req - Request chứa params.problemId
   * @param res - Response trả về danh sách testcase công khai
   * @param next - Next function để xử lý lỗi
   */
  getPublicByProblemId = async (req, res, next) => {
    try {
      const { problemId } = req.params;
      const testcases = await this.service.getPublicByProblemId(problemId);
      this.success(res, testcases, "Public testcases retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy một testcase theo ID
   * GET /api/testcases/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về testcase tìm được
   * @param next - Next function để xử lý lỗi
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const testcase = await this.service.getById(id);
      if (!testcase) {
        this.error(res, "Testcase not found", 404);
        return;
      }
      this.success(res, testcase, "Testcase retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật một testcase
   * PUT /api/testcases/:id
   * @param req - Request chứa params.id và body với input/expectedOutput/isPublic
   * @param res - Response trả về testcase đã cập nhật
   * @param next - Next function để xử lý lỗi
   */
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const testcase = await this.service.update(id, req.body);
      this.success(res, testcase, "Testcase updated successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
  /**
   * Xóa một testcase
   * DELETE /api/testcases/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về thông báo thành công
   * @param next - Next function để xử lý lỗi
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      this.success(res, result, "Testcase deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      next(error);
    }
  };
};
var testcase_controller_default = new TestcaseController();

// src/modules/testcase/routes/testcase.routes.ts
var router9 = (0, import_express9.Router)();
router9.post("/", (req, res, next) => testcase_controller_default.create(req, res, next));
router9.get("/problem/:problemId", (req, res, next) => testcase_controller_default.getByProblemId(req, res, next));
router9.get("/problem/:problemId/public", (req, res, next) => testcase_controller_default.getPublicByProblemId(req, res, next));
router9.get("/:id", (req, res, next) => testcase_controller_default.getById(req, res, next));
router9.put("/:id", (req, res, next) => testcase_controller_default.update(req, res, next));
router9.delete("/:id", (req, res, next) => testcase_controller_default.delete(req, res, next));
var testcase_routes_default = router9;

// src/modules/progress/routes/progress.routes.ts
var import_express10 = require("express");

// src/modules/progress/controllers/progress.controller.ts
var ProgressController = class extends BaseController {
  /**
   * Constructor khởi tạo controller với progressService
   */
  constructor() {
    super(progress_service_default);
  }
  /**
   * Handler lấy tiến độ học tập của user trong một khóa học
   * GET /:courseId
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getProgress = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const progress = await this.service.getProgress(userId, courseId);
      this.success(res, progress, "Progress retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Handler cập nhật tiến độ học tập của user trong khóa học
   * PUT /:courseId
   * @param req - Express Request object với body chứa completedLessons và totalLessons
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  updateProgress = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const { completedLessons, totalLessons } = req.body;
      const progress = await this.service.updateProgress(
        userId,
        courseId,
        completedLessons,
        totalLessons
      );
      this.success(res, progress, "Progress updated successfully");
    } catch (error) {
      const status = error.message.includes("Invalid") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
};
var progress_controller_default = new ProgressController();

// src/modules/progress/routes/progress.routes.ts
var router10 = (0, import_express10.Router)();
router10.use(verifyToken);
router10.get("/:courseId", (req, res, next) => progress_controller_default.getProgress(req, res, next));
router10.put("/:courseId", (req, res, next) => progress_controller_default.updateProgress(req, res, next));
var progress_routes_default = router10;

// src/modules/lessonProgress/routes/lessonProgress.routes.ts
var import_express11 = require("express");

// src/modules/lessonProgress/repositories/lessonProgress.repository.ts
var import_client14 = require("@prisma/client");
var prisma14 = new import_client14.PrismaClient();
var LessonProgressRepository = class extends BaseRepository {
  /** Prisma model được sử dụng cho các thao tác database */
  model = prisma14.lessonProgress;
  /**
   * Tìm tiến độ bài học của người dùng theo lessonId
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress | null> - Tiến độ tìm được hoặc null
   */
  async findByUserAndLesson(userId, lessonId) {
    return this.model.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });
  }
  /**
   * Tìm tất cả tiến độ bài học của người dùng trong một khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
   */
  async findByUserAndCourse(userId, courseId) {
    return this.model.findMany({
      where: { userId, courseId }
    });
  }
  /**
   * Đánh dấu bài học là hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật/tạo mới
   */
  async markComplete(userId, lessonId, courseId) {
    const existing = await this.findByUserAndLesson(userId, lessonId);
    if (existing) {
      await this.model.update({
        where: { id: existing.id },
        data: {
          isCompleted: true,
          completedAt: /* @__PURE__ */ new Date()
        }
      });
    } else {
      await this.model.create({
        data: {
          userId,
          lessonId,
          courseId,
          isCompleted: true,
          completedAt: /* @__PURE__ */ new Date()
        }
      });
    }
    const completedCount = await this.model.count({
      where: {
        userId,
        isCompleted: true,
        courseId
      }
    });
    const enrollment = await prisma14.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true }
    });
    if (enrollment) {
      const unlockLessonsCount = enrollment.course.unlockLessonsCount;
      const totalLessons = await prisma14.lesson.count({
        where: { phase: { courseId } }
      });
      let newUnlocks = enrollment.currentUnlocks;
      if (unlockLessonsCount === 0) {
        newUnlocks = totalLessons;
      } else {
        const completedBatches = Math.floor(completedCount / unlockLessonsCount);
        newUnlocks = Math.min((completedBatches + 1) * unlockLessonsCount, totalLessons);
      }
      if (newUnlocks > enrollment.currentUnlocks) {
        await prisma14.enrollment.update({
          where: { userId_courseId: { userId, courseId } },
          data: {
            completedLessons: completedCount,
            currentUnlocks: newUnlocks
          }
        });
      } else if (completedCount !== enrollment.completedLessons) {
        await prisma14.enrollment.update({
          where: { userId_courseId: { userId, courseId } },
          data: { completedLessons: completedCount }
        });
      }
    }
    try {
      await redis.del(`stats:courses:${userId}`);
    } catch (err) {
      console.error("Redis cache invalidation error:", err);
    }
    return this.model.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });
  }
  /**
   * Đánh dấu bài học là chưa hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
   * @throws Error - Nếu không tìm thấy tiến độ bài học
   */
  async markIncomplete(userId, lessonId) {
    const existing = await this.findByUserAndLesson(userId, lessonId);
    if (!existing) {
      throw new Error("Lesson progress not found");
    }
    return this.model.update({
      where: { id: existing.id },
      data: {
        isCompleted: false,
        completedAt: null
      }
    });
  }
};
var lessonProgress_repository_default = new LessonProgressRepository();

// src/modules/lessonProgress/services/lessonProgress.service.ts
var LessonProgressService = class extends BaseService {
  constructor() {
    super(lessonProgress_repository_default);
  }
  /**
   * Lấy tiến độ của một bài học cụ thể
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress | null> - Tiến độ bài học hoặc null
   */
  async getLessonProgress(userId, lessonId) {
    return this.repository.findByUserAndLesson(userId, lessonId);
  }
  /**
   * Lấy tất cả tiến độ bài học của người dùng trong một khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress[]> - Danh sách tiến độ bài học
   */
  async getCourseProgress(userId, courseId) {
    return this.repository.findByUserAndCourse(userId, courseId);
  }
  /**
   * Đánh dấu bài học là hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @param courseId - ID của khóa học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
   */
  async markLessonComplete(userId, lessonId, courseId) {
    const progress = await this.repository.markComplete(userId, lessonId, courseId);
    await this.publishLessonUpdate(userId, lessonId, courseId, true);
    return progress;
  }
  /**
   * Đánh dấu bài học là chưa hoàn thành
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @returns Promise<LessonProgress> - Bản ghi tiến độ đã cập nhật
   */
  async markLessonIncomplete(userId, lessonId) {
    const progress = await this.repository.markIncomplete(userId, lessonId);
    await this.publishLessonUpdate(userId, lessonId, progress.courseId || "", false);
    return progress;
  }
  /**
   * Đếm số bài học đã hoàn thành trong một khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<number> - Số lượng bài học đã hoàn thành
   */
  async getCompletedCount(userId, courseId) {
    const progressList = await this.repository.findByUserAndCourse(userId, courseId);
    return progressList.filter((p) => p.isCompleted).length;
  }
  /**
   * Publish sự kiện thay đổi tiến độ bài học lên Redis
   * @param userId - ID của người dùng
   * @param lessonId - ID của bài học
   * @param courseId - ID của khóa học
   * @param completed - Trạng thái hoàn thành mới
   * @private
   */
  async publishLessonUpdate(userId, lessonId, courseId, completed) {
    try {
      await redis.publish(`lesson:${userId}`, JSON.stringify({
        type: "lesson_update",
        userId,
        lessonId,
        courseId,
        completed
      }));
    } catch (error) {
      console.error("Redis publish error:", error);
    }
  }
};
var lessonProgress_service_default = new LessonProgressService();

// src/modules/lessonProgress/controllers/lessonProgress.controller.ts
var LessonProgressController = class extends BaseController {
  constructor() {
    super(lessonProgress_service_default);
  }
  /**
   * Lấy tiến độ của một bài học cụ thể
   * GET /api/lesson-progress/lesson/:lessonId
   * @param req - Request chứa params.lessonId và user từ token
   * @param res - Response trả về tiến độ bài học
   * @param next - Next function để xử lý lỗi
   */
  getLessonProgress = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId } = req.params;
      const progress = await this.service.getLessonProgress(userId, lessonId);
      this.success(res, progress, "Lesson progress retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả tiến độ bài học trong một khóa học
   * GET /api/lesson-progress/course/:courseId
   * @param req - Request chứa params.courseId và user từ token
   * @param res - Response trả về danh sách tiến độ bài học
   * @param next - Next function để xử lý lỗi
   */
  getCourseProgress = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const progress = await this.service.getCourseProgress(userId, courseId);
      this.success(res, progress, "Course progress retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Đánh dấu bài học là hoàn thành
   * POST /api/lesson-progress/complete
   * @param req - Request chứa body với lessonId, courseId và user từ token
   * @param res - Response trả về tiến độ đã cập nhật
   * @param next - Next function để xử lý lỗi
   */
  markComplete = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId, courseId } = req.body;
      const progress = await this.service.markLessonComplete(userId, lessonId, courseId);
      this.success(res, progress, "Lesson marked as complete");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Đánh dấu bài học là chưa hoàn thành
   * PUT /api/lesson-progress/lesson/:lessonId/incomplete
   * @param req - Request chứa params.lessonId và user từ token
   * @param res - Response trả về tiến độ đã cập nhật
   * @param next - Next function để xử lý lỗi
   */
  markIncomplete = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId } = req.params;
      const progress = await this.service.markLessonIncomplete(userId, lessonId);
      this.success(res, progress, "Lesson marked as incomplete");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
};
var lessonProgress_controller_default = new LessonProgressController();

// src/modules/lessonProgress/routes/lessonProgress.routes.ts
var router11 = (0, import_express11.Router)();
router11.use(verifyToken);
router11.get("/lesson/:lessonId", (req, res, next) => lessonProgress_controller_default.getLessonProgress(req, res, next));
router11.get("/course/:courseId", (req, res, next) => lessonProgress_controller_default.getCourseProgress(req, res, next));
router11.post("/complete", (req, res, next) => lessonProgress_controller_default.markComplete(req, res, next));
router11.put("/lesson/:lessonId/incomplete", (req, res, next) => lessonProgress_controller_default.markIncomplete(req, res, next));
var lessonProgress_routes_default = router11;

// src/modules/notification/routes/notification.routes.ts
var import_express12 = require("express");

// src/modules/notification/controllers/notification.controller.ts
var NotificationController = class extends BaseController {
  /**
   * Constructor khởi tạo controller với notificationService.
   */
  constructor() {
    super(notification_service_default);
  }
  /**
   * Tạo mới một notification.
   * Endpoint: POST /notifications
   * @param req - Request object chứa userId, type, title, message trong body
   * @param res - Response object để trả về kết quả
   * @param next - NextFunction để xử lý lỗi
   */
  createNotification = async (req, res, next) => {
    try {
      const { userId, type, title, message, metadata } = req.body;
      const notification = await this.service.createNotification({
        userId,
        type,
        title,
        message,
        metadata
      });
      this.success(res, notification, "Notification created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả notifications của user hiện tại.
   * Endpoint: GET /notifications (yêu cầu authentication)
   * @param req - Request object chứa thông tin user đã xác thực
   * @param res - Response object để trả về danh sách notifications
   * @param next - NextFunction để xử lý lỗi
   */
  getMyNotifications = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      console.log("[NOTIFICATION CONTROLLER] getMyNotifications - userId:", userId);
      if (!userId) {
        console.log("[NOTIFICATION CONTROLLER] No userId found!");
        this.error(res, "Unauthorized", 401);
        return;
      }
      const notifications = await this.service.getUserNotifications(userId);
      console.log("[NOTIFICATION CONTROLLER] Found notifications:", notifications.length);
      this.success(res, notifications, "Notifications retrieved successfully");
    } catch (error) {
      console.error("[NOTIFICATION CONTROLLER] Error:", error);
      next(error);
    }
  };
  /**
   * Lấy tất cả notifications chưa đọc của user hiện tại.
   * Endpoint: GET /notifications/unread (yêu cầu authentication)
   * @param req - Request object chứa thông tin user đã xác thực
   * @param res - Response object để trả về danh sách notifications chưa đọc
   * @param next - NextFunction để xử lý lỗi
   */
  getUnread = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const notifications = await this.service.getUnreadNotifications(userId);
      this.success(res, notifications, "Unread notifications retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Đánh dấu một notification là đã đọc.
   * Endpoint: PUT /notifications/:id/read
   * @param req - Request object chứa id notification trong params
   * @param res - Response object để trả về notification đã cập nhật
   * @param next - NextFunction để xử lý lỗi
   */
  markAsRead = async (req, res, next) => {
    try {
      const { id } = req.params;
      const notification = await this.service.markAsRead(id);
      this.success(res, notification, "Notification marked as read");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Đánh dấu tất cả notifications của user là đã đọc.
   * Endpoint: PUT /notifications/read-all (yêu cầu authentication)
   * @param req - Request object chứa thông tin user đã xác thực
   * @param res - Response object để trả về số lượng đã cập nhật
   * @param next - NextFunction để xử lý lỗi
   */
  markAllAsRead = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const result = await this.service.markAllAsRead(userId);
      this.success(res, result, "All notifications marked as read");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy số lượng notifications chưa đọc của user hiện tại.
   * Endpoint: GET /notifications/unread/count (yêu cầu authentication)
   * @param req - Request object chứa thông tin user đã xác thực
   * @param res - Response object để trả về số lượng
   * @param next - NextFunction để xử lý lỗi
   */
  getUnreadCount = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const result = await this.service.getUnreadCount(userId);
      this.success(res, result, "Unread count retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Xóa một notification.
   * Endpoint: DELETE /notifications/:id
   * @param req - Request object chứa id notification trong params
   * @param res - Response object để trả về kết quả xóa
   * @param next - NextFunction để xử lý lỗi
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.deleteNotification(id);
      this.success(res, result, "Notification deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy tất cả notifications đã gửi (notifications do admin tạo).
   * Endpoint: GET /notifications/sent
   * @param req - Request object
   * @param res - Response object
   * @param next - NextFunction
   */
  getSentNotifications = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const notifications = await this.service.getSentNotifications(userId);
      this.success(res, notifications, "Sent notifications retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả notifications (admin - tất cả users).
   * Endpoint: GET /notifications/all
   * @param req - Request object
   * @param res - Response object
   * @param next - NextFunction
   */
  getAllNotifications = async (req, res, next) => {
    try {
      const notifications = await this.service.getAllNotifications();
      this.success(res, notifications, "All notifications retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
};
var notification_controller_default = new NotificationController();

// src/modules/notification/routes/notification.routes.ts
var router12 = (0, import_express12.Router)();
router12.post("/", (req, res, next) => notification_controller_default.createNotification(req, res, next));
router12.use(verifyToken);
router12.get("/", (req, res, next) => notification_controller_default.getMyNotifications(req, res, next));
router12.get("/unread", (req, res, next) => notification_controller_default.getUnread(req, res, next));
router12.get("/unread/count", (req, res, next) => notification_controller_default.getUnreadCount(req, res, next));
router12.put("/:id/read", (req, res, next) => notification_controller_default.markAsRead(req, res, next));
router12.put("/read-all", (req, res, next) => notification_controller_default.markAllAsRead(req, res, next));
router12.get("/sent", (req, res, next) => notification_controller_default.getSentNotifications(req, res, next));
router12.get("/all", (req, res, next) => notification_controller_default.getAllNotifications(req, res, next));
router12.delete("/:id", (req, res, next) => notification_controller_default.delete(req, res, next));
var notification_routes_default = router12;

// src/modules/minitest/routes/minitest.routes.ts
var import_express13 = require("express");

// src/modules/minitest/services/minitest.service.ts
var MinitestService = class {
  // ============ Minitest CRUD ============
  async getAllMinitests() {
    return prisma_default.minitest.findMany({
      include: {
        phase: {
          include: {
            course: {
              select: { id: true, title: true }
            }
          }
        },
        questions: {
          include: {
            problem: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { orderIndex: "asc" }
    });
  }
  // Alias for controller compatibility
  getById = (id) => this.getMinitestById(id);
  async getMinitestById(id) {
    return prisma_default.minitest.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: {
              select: { id: true, title: true }
            },
            lessons: {
              orderBy: { orderIndex: "asc" }
            }
          }
        },
        questions: {
          include: {
            problem: {
              include: {
                testcases: true
              }
            }
          }
        },
        submissions: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }
  /**
   * Lấy thông tin course với tất cả các phases để tìm phase tiếp theo
   */
  async getCourseWithPhases(courseId) {
    return prisma_default.course.findUnique({
      where: { id: courseId },
      include: {
        phases: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" }
            }
          }
        }
      }
    });
  }
  async getMinitestsByPhase(phaseId) {
    return prisma_default.minitest.findMany({
      where: { phaseId },
      include: {
        questions: {
          include: {
            problem: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { orderIndex: "asc" }
    });
  }
  async getByCourseId(courseId) {
    return prisma_default.minitest.findMany({
      where: {
        phase: { courseId }
      },
      include: {
        phase: {
          include: {
            course: {
              select: { id: true, title: true }
            }
          }
        },
        questions: {
          include: {
            problem: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { orderIndex: "asc" }
    });
  }
  async createMinitest(data) {
    let orderIndex = data.orderIndex;
    if (orderIndex === void 0) {
      const maxOrder = await prisma_default.minitest.aggregate({
        where: { phaseId: data.phaseId },
        _max: { orderIndex: true }
      });
      orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    }
    const minitest = await prisma_default.minitest.create({
      data: {
        phaseId: data.phaseId,
        title: data.title,
        orderIndex
      },
      include: {
        phase: true
      }
    });
    if (data.questionIds && data.questionIds.length > 0) {
      await prisma_default.minitestQuestion.createMany({
        data: data.questionIds.map((problemId, index) => ({
          minitestId: minitest.id,
          problemId,
          orderIndex: index
        }))
      });
    }
    return this.getMinitestById(minitest.id);
  }
  async updateMinitest(id, data) {
    const updateData = {};
    if (data.title !== void 0) updateData.title = data.title;
    if (data.orderIndex !== void 0) updateData.orderIndex = data.orderIndex;
    if (Object.keys(updateData).length > 0) {
      await prisma_default.minitest.update({
        where: { id },
        data: updateData
      });
    }
    if (data.questionIds !== void 0) {
      await prisma_default.minitestQuestion.deleteMany({
        where: { minitestId: id }
      });
      if (data.questionIds.length > 0) {
        await prisma_default.minitestQuestion.createMany({
          data: data.questionIds.map((problemId, index) => ({
            minitestId: id,
            problemId,
            orderIndex: index
          }))
        });
      }
    }
    return this.getMinitestById(id);
  }
  async deleteMinitest(id) {
    return prisma_default.minitest.delete({
      where: { id }
    });
  }
  // ============ Questions ============
  async addQuestion(minitestId, problemId) {
    return prisma_default.minitestQuestion.create({
      data: {
        minitestId,
        problemId
      },
      include: {
        problem: true
      }
    });
  }
  async removeQuestion(minitestId, problemId) {
    return prisma_default.minitestQuestion.deleteMany({
      where: {
        minitestId,
        problemId
      }
    });
  }
  // ============ Submissions ============
  async getSubmissions(minitestId) {
    return prisma_default.minitestSubmission.findMany({
      where: { minitestId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  async getUserSubmissions(userId, minitestId) {
    return prisma_default.minitestSubmission.findMany({
      where: {
        userId,
        ...minitestId && { minitestId }
      },
      include: {
        minitest: {
          include: {
            phase: {
              include: {
                course: {
                  select: { id: true, title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Lấy kết quả submission mới nhất của user cho một minitest cụ thể
   */
  async getResult(userId, minitestId) {
    const submission = await prisma_default.minitestSubmission.findFirst({
      where: {
        userId,
        minitestId
      },
      include: {
        minitest: {
          include: {
            phase: {
              include: {
                course: {
                  select: { id: true, title: true }
                }
              }
            },
            questions: {
              include: {
                problem: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    if (!submission) {
      return null;
    }
    let parsedResult = null;
    if (submission.result) {
      try {
        parsedResult = JSON.parse(submission.result);
      } catch {
        parsedResult = null;
      }
    }
    const minitest = submission.minitest;
    const totalQuestions = minitest.questions.length;
    const allSubmissions = await prisma_default.minitestSubmission.findMany({
      where: {
        userId,
        minitestId
      },
      orderBy: { createdAt: "desc" }
    });
    const ranking = await prisma_default.minitestSubmission.count({
      where: {
        minitestId,
        score: { gt: submission.score }
      }
    }) + 1;
    const totalParticipants = await prisma_default.minitestSubmission.count({
      where: { minitestId }
    });
    const correctAnswers = parsedResult?.passedTests || 0;
    const incorrectAnswers = (parsedResult?.totalTests || 0) - correctAnswers;
    const firstSubmission = allSubmissions[allSubmissions.length - 1];
    const lastSubmission = submission;
    const timeSpentMs = lastSubmission.createdAt.getTime() - firstSubmission.createdAt.getTime();
    const timeSpentMinutes = Math.round(timeSpentMs / 6e4);
    const timeSpent = timeSpentMinutes > 0 ? `${timeSpentMinutes} ph\xFAt` : "\xCDt h\u01A1n 1 ph\xFAt";
    let nextLessonId = null;
    let nextPhaseId = null;
    let nextPhaseTitle = null;
    if (minitest.phase && minitest.phase.course) {
      const coursePhases = await prisma_default.phase.findMany({
        where: { courseId: minitest.phase.course.id },
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" }
          }
        }
      });
      const currentPhaseIndex = coursePhases.findIndex((p) => p.id === minitest.phase.id);
      if (currentPhaseIndex !== -1) {
        if (currentPhaseIndex + 1 < coursePhases.length) {
          const nextPhase = coursePhases[currentPhaseIndex + 1];
          nextPhaseId = nextPhase.id;
          nextPhaseTitle = nextPhase.title;
          if (nextPhase.lessons.length > 0) {
            nextLessonId = nextPhase.lessons[0].id;
          }
        }
      }
    }
    return {
      score: submission.score,
      totalScore: totalQuestions * 100,
      timeSpent,
      ranking,
      totalParticipants,
      correctAnswers,
      incorrectAnswers,
      accuracy: parsedResult?.totalTests > 0 ? Math.round(parsedResult.passedTests / parsedResult.totalTests * 100) : 0,
      strengths: parsedResult?.allPassed ? ["Ho\xE0n th\xE0nh t\u1ED1t b\xE0i ki\u1EC3m tra"] : [],
      improvements: !parsedResult?.allPassed ? ["C\u1EA7n \xF4n t\u1EADp th\xEAm c\xE1c b\xE0i t\u01B0\u01A1ng t\u1EF1"] : [],
      topics: minitest.questions.map((q) => ({
        name: q.problem.title,
        score: parsedResult?.problemId === q.problemId ? Math.round(parsedResult.passedTests / (parsedResult.totalTests || 1) * 100) : 0
      })),
      suggestedCourse: "Ti\u1EBFp t\u1EE5c h\u1ECDc \u0111\u1EC3 c\u1EA3i thi\u1EC7n!",
      submissionId: submission.id,
      submittedAt: submission.createdAt,
      allPassed: parsedResult?.allPassed || false,
      nextLessonId,
      nextPhaseId,
      nextPhaseTitle
    };
  }
  /**
   * Lấy tất cả kết quả của user
   */
  async getUserResults(userId) {
    const submissions = await prisma_default.minitestSubmission.findMany({
      where: { userId },
      include: {
        minitest: {
          include: {
            phase: {
              include: {
                course: {
                  select: { id: true, title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return submissions.map((sub) => {
      let parsedResult = null;
      if (sub.result) {
        try {
          parsedResult = JSON.parse(sub.result);
        } catch {
          parsedResult = null;
        }
      }
      return {
        id: sub.id,
        minitestId: sub.minitestId,
        minitestTitle: sub.minitest.title,
        courseTitle: sub.minitest.phase?.course?.title,
        score: sub.score,
        totalScore: sub.minitest.questions?.length * 100 || 0,
        passedTests: parsedResult?.passedTests || 0,
        totalTests: parsedResult?.totalTests || 0,
        allPassed: parsedResult?.allPassed || false,
        submittedAt: sub.createdAt
      };
    });
  }
  async submit(userId, minitestId, data) {
    const problem = await prisma_default.problem.findUnique({
      where: { id: data.problemId },
      include: { testcases: true }
    });
    if (!problem) {
      throw new Error("Problem not found");
    }
    const minitest = await prisma_default.minitest.findUnique({
      where: { id: minitestId },
      include: {
        questions: {
          where: { problemId: data.problemId }
        }
      }
    });
    if (!minitest || minitest.questions.length === 0) {
      throw new Error("Problem not found in this minitest");
    }
    const results = this.runCodeAgainstTestCases(data.code, data.language, problem.testcases);
    const passedTests = results.filter((r) => r.passed).length;
    const totalTests = results.length;
    const allPassed = passedTests === totalTests && totalTests > 0;
    const baseScore = 100;
    const scorePerTest = totalTests > 0 ? baseScore / totalTests : 0;
    const score = Math.round(passedTests * scorePerTest);
    const submission = await prisma_default.minitestSubmission.create({
      data: {
        userId,
        minitestId,
        score,
        result: JSON.stringify({
          problemId: data.problemId,
          passedTests,
          totalTests,
          allPassed,
          testResults: results
        })
      },
      include: {
        minitest: true
      }
    });
    return {
      submissionId: submission.id,
      score,
      passedTests,
      totalTests,
      allPassed,
      results: results.map((r) => ({
        testId: r.testId,
        passed: r.passed,
        actualOutput: r.actualOutput,
        input: r.isPublic !== false ? r.input : "[Hidden]",
        expectedOutput: r.isPublic !== false ? r.expectedOutput : "[Hidden]",
        isPublic: r.isPublic !== false,
        error: r.error
      }))
    };
  }
  /**
   * Run code against test cases (simulation)
   */
  runCodeAgainstTestCases(code, language, testCases) {
    const results = [];
    for (const testCase of testCases) {
      const simulatedOutput = this.simulateExecution(code, language, testCase.input);
      const passed = simulatedOutput.trim() === testCase.expectedOutput.trim();
      results.push({
        testId: testCase.id || `test-${results.length}`,
        passed,
        actualOutput: simulatedOutput,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isPublic: testCase.isPublic !== false,
        error: simulatedOutput.startsWith("ERROR:") ? simulatedOutput : void 0
      });
    }
    return results;
  }
  /**
   * Simulate code execution (JavaScript only)
   */
  simulateExecution(code, language, input) {
    if (language !== "javascript") {
      return input;
    }
    try {
      const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const functionPatterns = [
        /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
        /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
        /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g
      ];
      const functionNames = [];
      for (const pattern of functionPatterns) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(cleanCode)) !== null) {
          functionNames.push(match[1]);
        }
      }
      const functionCallMatch = input.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([\s\S]*)\)$/);
      let calledFuncName;
      let argsStr;
      if (functionCallMatch) {
        [, calledFuncName, argsStr] = functionCallMatch;
      } else {
        calledFuncName = functionNames[0];
        if (!calledFuncName) {
          const anyFuncMatch = cleanCode.match(/(?:function|const\s+|let\s+|var\s+)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=(]/);
          if (anyFuncMatch) {
            calledFuncName = anyFuncMatch[1];
          } else {
            return `ERROR: No function detected in code. Available functions: ${functionNames.join(", ") || "none"}`;
          }
        }
        argsStr = input;
      }
      const hasFunction = functionNames.includes(calledFuncName);
      if (!hasFunction) {
        return `ERROR: Function '${calledFuncName}' not found. Available functions: ${functionNames.join(", ") || "none"}`;
      }
      const args = this.parseArguments(argsStr);
      const serializedArgs = args.map((a) => {
        if (typeof a === "string") return JSON.stringify(a);
        else if (typeof a === "number" || typeof a === "boolean" || a === null) return String(a);
        else if (typeof a === "undefined") return "undefined";
        else return JSON.stringify(a);
      }).join(", ");
      const wrappedCode = `${code}
return ${calledFuncName}(${serializedArgs});`;
      const fn = new Function(wrappedCode);
      return this.formatResult(fn());
    } catch (error) {
      return `ERROR: ${error.message}`;
    }
  }
  parseArguments(argsStr) {
    const args = [];
    let current = "";
    let depth = 0;
    let inString = false;
    let stringChar = "";
    let inArray = false;
    let arrayDepth = 0;
    let inObject = false;
    let objectDepth = 0;
    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if ((char === '"' || char === "'" || char === "`") && (i === 0 || argsStr[i - 1] !== "\\")) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = "";
        }
      }
      if (!inString) {
        if (char === "[") {
          if (inArray) arrayDepth++;
          inArray = true;
        }
        if (char === "]") {
          if (arrayDepth > 0) arrayDepth--;
          else inArray = false;
        }
        if (char === "{") {
          if (inObject) objectDepth++;
          inObject = true;
        }
        if (char === "}") {
          if (objectDepth > 0) objectDepth--;
          else inObject = false;
        }
        if (char === "(") depth++;
        if (char === ")") depth--;
      }
      if (char === "," && depth === 0 && !inString && !inArray && !inObject) {
        args.push(this.parseValue(current.trim()));
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      args.push(this.parseValue(current.trim()));
    }
    return args;
  }
  parseValue(value) {
    if (!value) return void 0;
    try {
      return JSON.parse(value);
    } catch {
    }
    if (value === "undefined") return void 0;
    if (value === "null") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    const num = Number(value);
    if (!isNaN(num)) return num;
    return value;
  }
  formatResult(result) {
    if (result === void 0) return "undefined";
    if (result === null) return "null";
    if (typeof result === "object") return JSON.stringify(result);
    return String(result);
  }
  // ============ Problems (for admin to create questions) ============
  async getAllProblems() {
    return prisma_default.problem.findMany({
      include: {
        _count: {
          select: {
            testcases: true
          }
        }
      },
      orderBy: { title: "asc" }
    });
  }
  async createProblem(data) {
    const { testcases, ...problemData } = data;
    const problem = await prisma_default.problem.create({
      data: {
        ...problemData,
        difficulty: problemData.difficulty || "EASY",
        timeLimit: problemData.timeLimit || 1e3,
        memoryLimit: problemData.memoryLimit || 256
      }
    });
    if (testcases && testcases.length > 0) {
      await prisma_default.testcase.createMany({
        data: testcases.map((tc, index) => ({
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic ?? index < 2
          // First 2 are public by default
        }))
      });
    }
    return prisma_default.problem.findUnique({
      where: { id: problem.id },
      include: {
        testcases: true
      }
    });
  }
  async updateProblem(id, data) {
    return prisma_default.problem.update({
      where: { id },
      data,
      include: {
        testcases: true
      }
    });
  }
  async addTestcase(problemId, data) {
    return prisma_default.testcase.create({
      data: {
        problemId,
        ...data
      }
    });
  }
  async deleteTestcase(id) {
    return prisma_default.testcase.delete({
      where: { id }
    });
  }
};
var minitest_service_default = new MinitestService();

// src/modules/minitest/controllers/minitest.controller.ts
var MinitestController = class extends BaseController {
  constructor() {
    super(minitest_service_default);
  }
  /**
   * Tạo mới một bài minitest
   * POST /api/minitests
   * @param req - Request chứa body với title, description, questions
   * @param res - Response trả về bài test đã tạo
   * @param next - Next function để xử lý lỗi
   */
  create = async (req, res, next) => {
    try {
      const minitest = await this.service.create(req.body);
      this.success(res, minitest, "Minitest created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy bài minitest theo ID
   * GET /api/minitests/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về bài test với câu hỏi
   * @param next - Next function để xử lý lỗi
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const minitest = await this.service.getById(id);
      if (!minitest) {
        this.error(res, "Minitest not found", 404);
        return;
      }
      this.success(res, minitest, "Minitest retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy các bài minitest theo courseId
   * GET /api/minitests/course/:courseId
   * @param req - Request chứa params.courseId
   * @param res - Response trả về danh sách bài test
   * @param next - Next function để xử lý lỗi
   */
  getByCourseId = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const minitests = await this.service.getByCourseId(courseId);
      this.success(res, minitests, "Minitests retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Nộp bài minitest
   * POST /api/minitests/:id/submit
   * @param req - Request chứa params.id và body với answers, user từ token
   * @param res - Response trả về kết quả chấm điểm
   * @param next - Next function để xử lý lỗi
   */
  submit = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const result = await this.service.submit(userId, id, req.body);
      this.success(res, result, "Minitest submitted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy kết quả bài test của người dùng hiện tại
   * GET /api/minitests/my/results
   * @param req - Request chứa user từ token
   * @param res - Response trả về danh sách kết quả
   * @param next - Next function để xử lý lỗi
   */
  getMyResults = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const results = await this.service.getUserResults(userId);
      this.success(res, results, "Results retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy kết quả bài test của user cho một minitest cụ thể
   * GET /api/minitests/:id/result
   * @param req - Request chứa params.id và user từ token
   * @param res - Response trả về kết quả
   * @param next - Next function để xử lý lỗi
   */
  getResult = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const result = await this.service.getResult(userId, id);
      if (!result) {
        this.error(res, "Result not found", 404);
        return;
      }
      this.success(res, result, "Result retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
};
var minitest_controller_default = new MinitestController();

// src/modules/minitest/routes/minitest.routes.ts
var router13 = (0, import_express13.Router)();
router13.post("/", (req, res, next) => minitest_controller_default.create(req, res, next));
router13.get("/:id", (req, res, next) => minitest_controller_default.getById(req, res, next));
router13.get("/course/:courseId", (req, res, next) => minitest_controller_default.getByCourseId(req, res, next));
router13.post("/:id/submit", verifyToken, (req, res, next) => minitest_controller_default.submit(req, res, next));
router13.get("/:id/result", verifyToken, (req, res, next) => minitest_controller_default.getResult(req, res, next));
router13.get("/my/results", verifyToken, (req, res, next) => minitest_controller_default.getMyResults(req, res, next));
var minitest_routes_default = router13;

// src/modules/hackathon/routes/hackathon.routes.ts
var import_express14 = require("express");

// src/modules/hackathon/repositories/hackathon.repository.ts
var import_client15 = require("@prisma/client");
var prisma15 = new import_client15.PrismaClient();
var HackathonRepository = class extends BaseRepository {
  /** Model Prisma để thao tác với bảng hackathon */
  model = prisma15.hackathon;
  /**
   * Tìm hackathon theo ID (override để include course)
   */
  async findById(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        course: true,
        problems: {
          include: {
            testcases: true
          }
        }
      }
    });
  }
  /**
   * Tìm tất cả các hackathon đang diễn ra (active)
   * Active = ngày bắt đầu <= ngày hiện tại <= ngày kết thúc
   * @returns Promise<Hackathon[]> Danh sách hackathon đang active
   */
  async findActive() {
    const now = /* @__PURE__ */ new Date();
    return this.model.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gte: now }
      },
      orderBy: { startTime: "desc" },
      include: {
        _count: {
          select: { participants: true, submissions: true }
        }
      }
    });
  }
  /**
   * Tìm tất cả các hackathon sắp diễn ra (upcoming)
   * Upcoming = ngày bắt đầu > ngày hiện tại
   * @returns Promise<Hackathon[]> Danh sách hackathon sắp diễn ra
   */
  async findUpcoming() {
    const now = /* @__PURE__ */ new Date();
    return this.model.findMany({
      where: {
        startTime: { gt: now }
      },
      orderBy: { startTime: "asc" },
      include: {
        _count: {
          select: { participants: true, submissions: true }
        }
      }
    });
  }
  /**
   * Tìm tất cả các hackathon đã kết thúc (ended)
   * Ended = ngày kết thúc < ngày hiện tại
   * @returns Promise<Hackathon[]> Danh sách hackathon đã kết thúc
   */
  async findEnded() {
    const now = /* @__PURE__ */ new Date();
    return this.model.findMany({
      where: {
        endTime: { lt: now }
      },
      orderBy: { endTime: "desc" },
      include: {
        _count: {
          select: { participants: true, submissions: true }
        }
      }
    });
  }
  /**
   * Tìm tất cả hackathon mà user đã đăng ký
   * @param userId - ID của người dùng
   * @returns Promise<any[]> Danh sách hackathon đã đăng ký
   */
  async findRegisteredByUser(userId) {
    const participants = await prisma15.hackathonParticipant.findMany({
      where: { userId },
      include: {
        hackathon: {
          include: {
            _count: {
              select: { participants: true, submissions: true }
            }
          }
        }
      },
      orderBy: { joinedAt: "desc" }
    });
    return participants.map((p) => ({
      ...p.hackathon,
      registeredAt: p.joinedAt,
      isRegistered: true
    }));
  }
  /**
   * Lấy bảng xếp hạng của một hackathon
   * @param hackathonId - ID của hackathon
   * @param currentUserId - ID của user hiện tại (để highlight)
   * @returns Promise<any> Bảng xếp hạng với thông tin participants và submissions
   */
  async getLeaderboardData(hackathonId, currentUserId) {
    const hackathon = await this.model.findUnique({
      where: { id: hackathonId }
    });
    if (!hackathon) {
      throw new Error("Hackathon not found");
    }
    const submissions = await prisma15.hackathonSubmission.findMany({
      where: { hackathonId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { score: "desc" }
    });
    const userMap = /* @__PURE__ */ new Map();
    for (const sub of submissions) {
      if (!userMap.has(sub.userId)) {
        userMap.set(sub.userId, {
          userId: sub.userId,
          fullName: sub.user.fullName,
          username: sub.user.username,
          avatar: sub.user.avatar,
          totalScore: 0,
          submissions: 0,
          isCurrentUser: sub.userId === currentUserId
        });
      }
      const entry = userMap.get(sub.userId);
      entry.totalScore += sub.score || 0;
      entry.submissions += 1;
    }
    const leaderboard = Array.from(userMap.values()).sort((a, b) => b.totalScore - a.totalScore).slice(0, 50).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    const participants = await prisma15.hackathonParticipant.findMany({
      where: { hackathonId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { joinedAt: "desc" }
    });
    const participantCount = participants.length;
    return {
      hackathon: {
        id: hackathon.id,
        title: hackathon.title,
        description: hackathon.description,
        startTime: hackathon.startTime,
        endTime: hackathon.endTime,
        status: hackathon.endTime < /* @__PURE__ */ new Date() ? "ended" : hackathon.startTime > /* @__PURE__ */ new Date() ? "upcoming" : "active"
      },
      participantCount,
      totalSubmissions: submissions.length,
      leaderboard
    };
  }
};
var hackathon_repository_default = new HackathonRepository();

// src/modules/hackathon/repositories/hackathonParticipant.repository.ts
var import_client16 = require("@prisma/client");
var prisma16 = new import_client16.PrismaClient();
var HackathonParticipantRepository = class {
  /** Model Prisma để thao tác với bảng hackathonParticipant */
  model = prisma16.hackathonParticipant;
  /**
   * Tạo mới một bản ghi tham gia hackathon
   * @param data - Dữ liệu tham gia hackathon
   * @returns Promise<HackathonParticipant> Bản ghi tham gia đã được tạo
   */
  async create(data) {
    return this.model.create({ data });
  }
  /**
   * Tìm bản ghi tham gia theo hackathonId và userId
   * Sử dụng unique constraint trên cặp (hackathonId, userId)
   * @param hackathonId - ID của hackathon
   * @param userId - ID của người dùng
   * @returns Promise<HackathonParticipant | null> Bản ghi tham gia hoặc null nếu không tìm thấy
   */
  async findByHackathonAndUser(hackathonId, userId) {
    return this.model.findFirst({
      where: { hackathonId, userId }
    });
  }
  /**
   * Tìm tất cả người tham gia của một hackathon cụ thể
   * @param hackathonId - ID của hackathon cần lấy danh sách tham gia
   * @returns Promise<HackathonParticipant[]> Danh sách người tham gia
   */
  async findByHackathonId(hackathonId) {
    return this.model.findMany({
      where: { hackathonId },
      orderBy: { joinedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true
          }
        }
      }
    });
  }
  /**
   * Xóa bản ghi tham gia hackathon
   * @param id - ID của bản ghi tham gia cần xóa
   * @returns Promise<void>
   */
  async delete(id) {
    await this.model.delete({ where: { id } });
  }
};
var hackathonParticipant_repository_default = new HackathonParticipantRepository();

// src/modules/hackathon/repositories/hackathonSubmission.repository.ts
var import_client17 = require("@prisma/client");
var prisma17 = new import_client17.PrismaClient();
var HackathonSubmissionRepository = class {
  /** Model Prisma để thao tác với bảng hackathonSubmission */
  model = prisma17.hackathonSubmission;
  /**
   * Tạo mới một bài nộp dự án
   * @param data - Dữ liệu bài nộp dự án
   * @returns Promise<HackathonSubmission> Bài nộp đã được tạo
   */
  async create(data) {
    const createData = {
      hackathonId: data.hackathonId,
      userId: data.userId,
      score: data.score ?? null,
      submittedAt: data.submittedAt || /* @__PURE__ */ new Date()
    };
    if (data.problemId) {
      createData.problemId = data.problemId;
    }
    if (data.projectTitle) {
      createData.projectTitle = data.projectTitle;
    }
    if (data.description !== void 0) {
      createData.description = data.description;
    }
    if (data.repositoryUrl !== void 0) {
      createData.repositoryUrl = data.repositoryUrl;
    }
    if (data.demoUrl !== void 0) {
      createData.demoUrl = data.demoUrl;
    }
    return this.model.create({ data: createData });
  }
  /**
   * Tìm tất cả bài nộp của một hackathon cụ thể
   * @param hackathonId - ID của hackathon cần lấy danh sách bài nộp
   * @returns Promise<HackathonSubmission[]> Danh sách bài nộp
   */
  async findByHackathonId(hackathonId) {
    return this.model.findMany({
      where: { hackathonId },
      orderBy: { score: "desc" }
    });
  }
  /**
   * Tìm tất cả bài nộp của một người dùng cụ thể
   * @param userId - ID của người dùng cần lấy danh sách bài nộp
   * @returns Promise<HackathonSubmission[]> Danh sách bài nộp của user
   */
  async findByUserId(userId) {
    return this.model.findMany({
      where: { userId },
      orderBy: { submittedAt: "desc" }
    });
  }
  /**
   * Cập nhật điểm số cho một bài nộp
   * @param id - ID của bài nộp cần cập nhật điểm
   * @param score - Điểm số mới (0-100)
   * @returns Promise<HackathonSubmission> Bài nộp đã được cập nhật
   */
  async updateScore(id, score) {
    return this.model.update({
      where: { id },
      data: { score }
    });
  }
};
var hackathonSubmission_repository_default = new HackathonSubmissionRepository();

// src/modules/email/email.service.ts
var import_nodemailer = __toESM(require("nodemailer"));
var EmailService = class {
  transporter = null;
  getTransporter() {
    if (!this.transporter) {
      console.log("[EmailService] Initializing transporter...");
      console.log("[EmailService] SMTP Config:", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPass: !!process.env.SMTP_PASS
      });
      this.transporter = import_nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || ""
        }
      });
    }
    return this.transporter;
  }
  /**
   * Gửi email thông báo bài học mới cho user
   */
  async sendNewLessonNotification(to, userName, courseTitle, lessonTitle, lessonUrl) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${userName},</h2>
        <p>Kh\xF3a h\u1ECDc <strong>"${courseTitle}"</strong> v\u1EEBa c\xF3 b\xE0i h\u1ECDc m\u1EDBi!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0B3C5D; margin: 0 0 10px 0;">${lessonTitle}</h3>
          <p style="color: #666; margin: 0;">C\xF3 b\xE0i h\u1ECDc m\u1EDBi \u0111ang ch\u1EDD b\u1EA1n kh\xE1m ph\xE1!</p>
        </div>
        <a href="${lessonUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem b\xE0i h\u1ECDc
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `B\xE0i h\u1ECDc m\u1EDBi: ${lessonTitle} - ${courseTitle}`,
        html
      });
      console.log(`Email sent to ${to} for new lesson: ${lessonTitle}`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }
  /**
   * Gửi email thông báo bài học được duyệt cho lecture
   */
  async sendLessonApprovedNotification(to, lectureName, lessonTitle) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${lectureName},</h2>
        <p>Ch\xFAc m\u1EEBng! B\xE0i h\u1ECDc c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin: 0;">${lessonTitle}</h3>
          <p style="color: #10b981; margin: 10px 0 0 0;">\u2713 \u0110\xE3 \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t</p>
        </div>
        <p>C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 \u0111\xF3ng g\xF3p n\u1ED9i dung cho CodeFit!</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `B\xE0i h\u1ECDc \u0111\u01B0\u1EE3c duy\u1EC7t: ${lessonTitle}`,
        html
      });
    } catch (error) {
      console.error("Failed to send approval email:", error);
    }
  }
  /**
   * Gửi email thông báo bài học bị từ chối cho lecture
   */
  async sendLessonRejectedNotification(to, lectureName, lessonTitle, feedback) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${lectureName},</h2>
        <p>B\xE0i h\u1ECDc c\u1EE7a b\u1EA1n c\u1EA7n \u0111\u01B0\u1EE3c ch\u1EC9nh s\u1EEDa th\xEAm.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #dc2626; margin: 0 0 10px 0;">${lessonTitle}</h3>
          <p style="color: #666; margin: 0 0 10px 0;"><strong>Ph\u1EA3n h\u1ED3i t\u1EEB Admin:</strong></p>
          <p style="color: #333; margin: 0;">${feedback}</p>
        </div>
        <p>Vui l\xF2ng ch\u1EC9nh s\u1EEDa b\xE0i h\u1ECDc theo ph\u1EA3n h\u1ED3i v\xE0 n\u1ED9p l\u1EA1i.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `B\xE0i h\u1ECDc c\u1EA7n ch\u1EC9nh s\u1EEDa: ${lessonTitle}`,
        html
      });
    } catch (error) {
      console.error("Failed to send rejection email:", error);
    }
  }
  /**
   * Gửi email thông báo điểm bài tập cho user
   */
  async sendScoreNotification(to, userName, lessonTitle, courseTitle, score, passedTests, totalTests, lessonUrl) {
    const percentage = Math.round(passedTests / totalTests * 100);
    const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${userName},</h2>
        <p>K\u1EBFt qu\u1EA3 b\xE0i t\u1EADp c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin: 0 0 5px 0;">Kh\xF3a h\u1ECDc: <strong>${courseTitle}</strong></p>
          <h3 style="color: #0B3C5D; margin: 0 0 15px 0;">${lessonTitle}</h3>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: ${scoreColor};">${score}</div>
              <div style="color: #666; font-size: 12px;">\u0110i\u1EC3m</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: #0B3C5D;">${passedTests}/${totalTests}</div>
              <div style="color: #666; font-size: 12px;">Test passed (${percentage}%)</div>
            </div>
          </div>
        </div>
        <a href="${lessonUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem chi ti\u1EBFt
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `K\u1EBFt qu\u1EA3 b\xE0i t\u1EADp: ${lessonTitle} - ${score} \u0111i\u1EC3m`,
        html
      });
      console.log(`Score email sent to ${to} for lesson: ${lessonTitle}`);
    } catch (error) {
      console.error("Failed to send score email:", error);
    }
  }
  /**
   * Gửi email thông báo được cấp quyền truy cập khóa học
   */
  async sendCourseAccessGrantedNotification(to, userName, courseTitle, courseUrl) {
    const cUrl = courseUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${userName},</h2>
        <p>Ch\xFAc m\u1EEBng! B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp kh\xF3a h\u1ECDc!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin: 0;">${courseTitle}</h3>
          <p style="color: #666; margin: 10px 0 0 0;">\u2713 B\u1EA1n c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u h\u1ECDc ngay</p>
        </div>
        <a href="${cUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
          B\u1EAFt \u0111\u1EA7u h\u1ECDc ngay
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `B\u1EA1n \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp: ${courseTitle}`,
        html
      });
      console.log(`Course access granted email sent to ${to}`);
    } catch (error) {
      console.error("Failed to send course access email:", error);
    }
  }
  /**
   * Gửi email kèm mã kích hoạt khóa học
   */
  async sendCourseAccessWithCode(to, userName, courseTitle, activationCode, courseUrl) {
    const cUrl = courseUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${userName},</h2>
        <p>Ch\xFAc m\u1EEBng! B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp kh\xF3a h\u1ECDc!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin: 0;">${courseTitle}</h3>
          <p style="color: #666; margin: 10px 0 0 0;">\u2713 B\u1EA1n c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u h\u1ECDc ngay</p>
        </div>
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #f59e0b;">
          <p style="color: #666; margin: 0 0 5px 0; font-size: 12px;">M\xE3 k\xEDch ho\u1EA1t c\u1EE7a b\u1EA1n:</p>
          <p style="color: #0B3C5D; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 2px; font-family: monospace;">${activationCode}</p>
        </div>
        <p style="color: #666; margin: 0 0 20px 0;">S\u1EED d\u1EE5ng m\xE3 tr\xEAn \u0111\u1EC3 k\xEDch ho\u1EA1t kh\xF3a h\u1ECDc ho\u1EB7c b\u1EA5m n\xFAt b\xEAn d\u01B0\u1EDBi:</p>
        <a href="${cUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
          K\xEDch ho\u1EA1t ngay
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `M\xE3 k\xEDch ho\u1EA1t kh\xF3a h\u1ECDc: ${courseTitle}`,
        html
      });
      console.log(`Course access with code email sent to ${to}`);
    } catch (error) {
      console.error("Failed to send course access with code email:", error);
    }
  }
  /**
   * Gửi email nhắc nhở hackathon sắp bắt đầu
   */
  async sendHackathonReminder(to, userName, hackathonTitle, startTime, hackathonUrl) {
    const hUrl = hackathonUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/hackathon`;
    const startDate = new Date(startTime);
    const formattedDate = startDate.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${userName},</h2>
        <p>Cu\u1ED9c thi hackathon b\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD s\u1EAFp b\u1EAFt \u0111\u1EA7u!</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #0B3C5D; margin: 0 0 10px 0;">${hackathonTitle}</h3>
          <p style="color: #666; margin: 0;"><strong>Th\u1EDDi gian b\u1EAFt \u0111\u1EA7u:</strong> ${formattedDate}</p>
        </div>
        <p style="color: #666; margin: 0 0 20px 0;">H\xE3y chu\u1EA9n b\u1ECB s\u1EB5n s\xE0ng v\xE0 tham gia ngay khi cu\u1ED9c thi b\u1EAFt \u0111\u1EA7u!</p>
        <a href="${hUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem chi ti\u1EBFt cu\u1ED9c thi
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `[Nh\u1EAFc nh\u1EDF] "${hackathonTitle}" s\u1EAFp b\u1EAFt \u0111\u1EA7u!`,
        html
      });
      console.log(`Hackathon reminder email sent to ${to}`);
    } catch (error) {
      console.error("Failed to send hackathon reminder email:", error);
    }
  }
  /**
   * Gửi email xác nhận đã đăng ký hackathon
   */
  async sendHackathonJoined(to, userName, hackathonTitle, hackathonUrl) {
    const hUrl = hackathonUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/hackathon`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin ch\xE0o ${userName},</h2>
        <p>B\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD tham gia hackathon th\xE0nh c\xF4ng!</p>
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="color: #10b981; margin: 0 0 10px 0;">\u2713 ${hackathonTitle}</h3>
          <p style="color: #666; margin: 0;">B\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD th\xE0nh c\xF4ng. Ch\xFAc b\u1EA1n c\xF3 m\u1ED9t cu\u1ED9c thi th\xFA v\u1ECB!</p>
        </div>
        <a href="${hUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem cu\u1ED9c thi
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB CodeFit. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi email n\xE0y.
        </p>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `\u0110\u0103ng k\xFD th\xE0nh c\xF4ng: ${hackathonTitle}`,
        html
      });
      console.log(`Hackathon joined email sent to ${to}`);
    } catch (error) {
      console.error("Failed to send hackathon joined email:", error);
    }
  }
  async sendProjectSubmittedEmail(to, userName, projectTitle, courseTitle, projectUrl) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0B3C5D 0%, #1e40af 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">\u{1F4E6} D\u1EF1 \xE1n \u0111\xE3 \u0111\u01B0\u1EE3c n\u1ED9p!</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0 0;">Ch\xFAng t\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c b\xE0i n\u1ED9p c\u1EE7a b\u1EA1n</p>
        </div>

        <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0B3C5D; margin: 0 0 20px 0;">Xin ch\xE0o ${userName},</h2>

          <p style="color: #374151; line-height: 1.6;">Ch\xFAc m\u1EEBng b\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh kh\xF3a h\u1ECDc! D\u1EF1 \xE1n c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c ghi nh\u1EADn.</p>

          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">\u{1F4C1} ${projectTitle}</h3>
            <p style="color: #78350f; margin: 0; font-size: 14px;">Kh\xF3a h\u1ECDc: <strong>${courseTitle}</strong></p>
          </div>

          <p style="color: #374151; line-height: 1.6;">Gi\u1EA3ng vi\xEAn s\u1EBD ch\u1EA5m \u0111i\u1EC3m v\xE0 ph\u1EA3n h\u1ED3i trong th\u1EDDi gian s\u1EDBm nh\u1EA5t. B\u1EA1n s\u1EBD nh\u1EADn \u0111\u01B0\u1EE3c th\xF4ng b\xE1o khi c\xF3 k\u1EBFt qu\u1EA3.</p>

          <a href="${projectUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 24px 0;">
            Xem chi ti\u1EBFt b\xE0i n\u1ED9p
          </a>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB <strong>CodeFit</strong>.<br/>
            C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tham gia h\u1ECDc t\u1EADp c\xF9ng ch\xFAng t\xF4i!
          </p>
        </div>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `\u{1F4E6} \u0110\xE3 nh\u1EADn b\xE0i n\u1ED9p: ${projectTitle}`,
        html
      });
      console.log(`Project submitted email sent to ${to} for project: ${projectTitle}`);
    } catch (error) {
      console.error("Failed to send project submitted email:", error);
    }
  }
  /**
   * Gửi email chứng chỉ hoàn thành khóa học
   */
  async sendCertificateEmail(to, userName, courseTitle, certificateUrl, certificateId) {
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify/${certificateId}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0B3C5D 0%, #1e40af 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">\u{1F393} Ch\xFAc m\u1EEBng b\u1EA1n!</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0 0;">B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh kh\xF3a h\u1ECDc</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0B3C5D; margin: 0 0 20px 0;">Xin ch\xE0o ${userName},</h2>
          
          <p style="color: #374151; line-height: 1.6;">Ch\xFAc m\u1EEBng b\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh xu\u1EA5t s\u1EAFc kh\xF3a h\u1ECDc!</p>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 18px;">\u{1F4DC} Ch\u1EE9ng ch\u1EC9 ho\xE0n th\xE0nh</h3>
            <p style="color: #78350f; margin: 0; font-size: 16px; font-weight: bold;">${courseTitle}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">Ch\u1EE9ng ch\u1EC9 c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c ph\xE1t h\xE0nh v\xE0 c\xF3 gi\xE1 tr\u1ECB v\u0129nh vi\u1EC5n. B\u1EA1n c\xF3 th\u1EC3:</p>
          
          <div style="margin: 24px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
              \u{1F517} Xem & Chia s\u1EBB ch\u1EE9ng ch\u1EC9
            </a>
          </div>
          
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              <strong>M\xE3 x\xE1c th\u1EF1c:</strong> ${certificateId.substring(0, 8).toUpperCase()}<br/>
              <strong>Link x\xE1c th\u1EF1c:</strong> <a href="${verifyUrl}" style="color: #3b82f6;">${verifyUrl}</a>
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">Ch\u1EE9ng ch\u1EC9 n\xE0y c\xF3 th\u1EC3 \u0111\u01B0\u1EE3c x\xE1c minh b\u1EDFi b\u1EA5t k\u1EF3 ai th\xF4ng qua link tr\xEAn. H\xE3y chia s\u1EBB th\xE0nh t\xEDch c\u1EE7a b\u1EA1n tr\xEAn LinkedIn ho\u1EB7c CV!</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EF1 \u0111\u1ED9ng t\u1EEB <strong>CodeFit</strong>.<br/>
            C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tham gia h\u1ECDc t\u1EADp c\xF9ng ch\xFAng t\xF4i!
          </p>
        </div>
      </div>
    `;
    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || "CodeFit <noreply@codefit.edu.vn>",
        to,
        subject: `\u{1F393} Ch\u1EE9ng ch\u1EC9 ho\xE0n th\xE0nh: ${courseTitle}`,
        html
      });
      console.log(`Certificate email sent to ${to} for course: ${courseTitle}`);
    } catch (error) {
      console.error("Failed to send certificate email:", error);
    }
  }
};
var email_service_default = new EmailService();

// src/modules/scoring/services/scoring.service.ts
var ScoringService = class {
  /**
   * Chạy code để preview (không lưu)
   */
  async runCode(lessonId, code, language) {
    const lessonContent = await prisma_default.lessonContent.findUnique({
      where: { lessonId }
    });
    if (!lessonContent) {
      throw new Error("Lesson content not found");
    }
    let testCases = [];
    try {
      testCases = JSON.parse(lessonContent.testCases || "[]");
    } catch {
      testCases = [];
    }
    const testResults = await this.runCodeAgainstTestCases(code, language, testCases);
    const passedTests = testResults.filter((r) => r.passed).length;
    const publicResults = testResults.filter((r) => r.isPublic !== false);
    const hiddenResults = testResults.filter((r) => r.isPublic === false);
    const publicPassed = publicResults.filter((r) => r.passed).length;
    const hiddenPassed = hiddenResults.filter((r) => r.passed).length;
    return {
      passedTests,
      totalTests: testResults.length,
      publicPassedTests: publicPassed,
      publicTotalTests: publicResults.length,
      hiddenPassedTests: hiddenPassed,
      hiddenTotalTests: hiddenResults.length,
      allPassed: passedTests === testResults.length && testResults.length > 0,
      results: testResults.map((r) => ({
        testId: r.testId,
        passed: r.passed,
        actualOutput: r.actualOutput,
        input: r.input,
        expectedOutput: r.expectedOutput,
        isPublic: r.isPublic !== false
      }))
    };
  }
  /**
   * Tính điểm cho một bài nộp
   */
  async calculateScore(lessonId, code, language, hintsUsed = 0, timeUsed = null) {
    const lessonContent = await prisma_default.lessonContent.findUnique({
      where: { lessonId }
    });
    if (!lessonContent) {
      throw new Error("Lesson content not found");
    }
    const scoringConfig = await prisma_default.scoringConfig.findUnique({
      where: { lessonId }
    });
    const config = {
      baseScore: scoringConfig?.baseScore ?? 100,
      penaltyPerHint: scoringConfig?.penaltyPerHint ?? 10,
      timeBonusEnabled: scoringConfig?.timeBonusEnabled ?? false,
      timeBonusThreshold: scoringConfig?.timeBonusThreshold ?? null,
      timeBonusValue: scoringConfig?.timeBonusValue ?? null
    };
    let testCases = [];
    try {
      testCases = JSON.parse(lessonContent.testCases || "[]");
    } catch {
      testCases = [];
    }
    if (testCases.length === 0) {
      const noTestResult = {
        baseScore: config.baseScore,
        hintPenalty: config.penaltyPerHint * hintsUsed,
        testCasePenalty: 0,
        timeBonus: 0,
        finalScore: Math.max(0, config.baseScore - config.penaltyPerHint * hintsUsed),
        passedTests: 0,
        totalTests: 0,
        hintsUsed,
        timeUsed,
        details: {
          testResults: [],
          hintDetails: []
        },
        isNoTestCase: true
      };
      return {
        score: noTestResult.finalScore,
        passedTests: 0,
        totalTests: 0,
        publicPassedTests: 0,
        publicTotalTests: 0,
        hiddenPassedTests: 0,
        hiddenTotalTests: 0,
        allPassed: false,
        result: noTestResult
      };
    }
    let hints = [];
    try {
      hints = JSON.parse(lessonContent.hints || "[]");
    } catch {
      hints = [];
    }
    const testResults = await this.runCodeAgainstTestCases(code, language, testCases);
    const result = this.computeScore(testResults, hints, config, hintsUsed, timeUsed);
    const publicResults = testResults.filter((r) => r.isPublic);
    const hiddenResults = testResults.filter((r) => !r.isPublic);
    const publicPassed = publicResults.filter((r) => r.passed).length;
    const hiddenPassed = hiddenResults.filter((r) => r.passed).length;
    return {
      score: result.finalScore,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      publicPassedTests: publicPassed,
      publicTotalTests: publicResults.length,
      hiddenPassedTests: hiddenPassed,
      hiddenTotalTests: hiddenResults.length,
      allPassed: result.passedTests === result.totalTests,
      result
    };
  }
  /**
   * Chạy code against test cases
   * Hiện tại là simulation - cần tích hợp với Judge0/Code executor thực tế
   */
  async runCodeAgainstTestCases(code, language, testCases) {
    const results = [];
    for (const testCase of testCases) {
      const simulatedOutput = this.simulateExecution(code, language, testCase.input);
      const passed = simulatedOutput.trim() === testCase.expectedOutput.trim();
      results.push({
        testId: testCase.id || `test-${results.length}`,
        passed,
        actualOutput: simulatedOutput,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        points: testCase.points || 10,
        earnedPoints: passed ? testCase.points || 10 : 0,
        isPublic: testCase.isPublic !== false
        // Default to public if not specified
      });
    }
    return results;
  }
  /**
   * Simulate code execution
   * Sử dụng Function constructor để execute JavaScript
   * Tự động detect function name và call với input
   */
  simulateExecution(code, language, input) {
    if (language !== "javascript") {
      return input;
    }
    try {
      const cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const functionPatterns = [
        /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        // function name(
        /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
        // const name = ( or const name = async (
        /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g,
        // let name = ( or let name = async (
        /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g
        // var name = ( or var name = async (
      ];
      const functionNames = [];
      for (const pattern of functionPatterns) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(cleanCode)) !== null) {
          functionNames.push(match[1]);
        }
      }
      const functionCallMatch = input.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([\s\S]*)\)$/);
      let calledFuncName;
      let argsStr;
      if (functionCallMatch) {
        [, calledFuncName, argsStr] = functionCallMatch;
      } else {
        calledFuncName = functionNames[0];
        if (!calledFuncName) {
          const anyFuncMatch = cleanCode.match(/(?:function|const\s+|let\s+|var\s+)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=(]/);
          if (anyFuncMatch) {
            calledFuncName = anyFuncMatch[1];
          } else {
            return `ERROR: No function detected in code. Available functions: ${functionNames.join(", ") || "none"}`;
          }
        }
        argsStr = input;
      }
      const hasFunction = functionNames.includes(calledFuncName);
      if (!hasFunction) {
        return `ERROR: Function '${calledFuncName}' not found. Available functions: ${functionNames.join(", ") || "none"}`;
      }
      const args = this.parseArguments(argsStr);
      const serializedArgs = args.map((a) => {
        if (typeof a === "string") {
          return JSON.stringify(a);
        } else if (typeof a === "number" || typeof a === "boolean" || a === null) {
          return String(a);
        } else if (typeof a === "undefined") {
          return "undefined";
        } else {
          return JSON.stringify(a);
        }
      }).join(", ");
      const wrappedCode = `
        ${code}
        return ${calledFuncName}(${serializedArgs});
      `;
      const fn = new Function(wrappedCode);
      return this.formatResult(fn());
    } catch (error) {
      return `ERROR: ${error.message}`;
    }
  }
  /**
   * Parse function arguments handling nested parentheses, strings, arrays, objects
   */
  parseArguments(argsStr) {
    const args = [];
    let current = "";
    let depth = 0;
    let inString = false;
    let stringChar = "";
    let inArray = false;
    let arrayDepth = 0;
    let inObject = false;
    let objectDepth = 0;
    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if ((char === '"' || char === "'" || char === "`") && (i === 0 || argsStr[i - 1] !== "\\")) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = "";
        }
      }
      if (!inString) {
        if (char === "[") {
          if (inArray) arrayDepth++;
          inArray = true;
        }
        if (char === "]") {
          if (arrayDepth > 0) arrayDepth--;
          else inArray = false;
        }
        if (char === "{") {
          if (inObject) objectDepth++;
          inObject = true;
        }
        if (char === "}") {
          if (objectDepth > 0) objectDepth--;
          else inObject = false;
        }
        if (char === "(") depth++;
        if (char === ")") depth--;
      }
      if (char === "," && depth === 0 && !inString && !inArray && !inObject) {
        args.push(this.parseValue(current.trim()));
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      args.push(this.parseValue(current.trim()));
    }
    return args;
  }
  /**
   * Parse a single argument value
   */
  parseValue(value) {
    if (!value) return void 0;
    try {
      return JSON.parse(value);
    } catch {
    }
    if (value === "undefined") return void 0;
    if (value === "null") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    const num = Number(value);
    if (!isNaN(num)) return num;
    return value;
  }
  /**
   * Format result for comparison
   */
  formatResult(result) {
    if (result === void 0) return "undefined";
    if (result === null) return "null";
    if (typeof result === "object") return JSON.stringify(result);
    return String(result);
  }
  /**
   * Tính điểm cuối cùng
   */
  computeScore(testResults, hints, config, hintsUsed, timeUsed) {
    const totalTests = testResults.length;
    const passedTests = testResults.filter((r) => r.passed).length;
    const totalPoints = testResults.reduce((sum, r) => sum + r.points, 0);
    const earnedPoints = testResults.reduce((sum, r) => sum + r.earnedPoints, 0);
    const testCaseRatio = totalPoints > 0 ? earnedPoints / totalPoints : 0;
    const testCasePenalty = (1 - testCaseRatio) * 0.5;
    const testCaseScore = config.baseScore * (1 - testCasePenalty);
    const hintPenalty = config.penaltyPerHint * hintsUsed;
    const afterHintScore = Math.max(0, testCaseScore - hintPenalty);
    let timeBonus = 0;
    if (config.timeBonusEnabled && timeUsed !== null && timeUsed < (config.timeBonusThreshold || Infinity)) {
      timeBonus = config.timeBonusValue || 0;
    }
    const finalScore = Math.max(0, Math.round(afterHintScore + timeBonus));
    return {
      baseScore: config.baseScore,
      hintPenalty,
      testCasePenalty: Math.round(testCasePenalty * 100),
      timeBonus,
      finalScore,
      passedTests,
      totalTests,
      hintsUsed,
      timeUsed,
      details: {
        testResults: testResults.map((r) => ({
          testId: r.testId,
          passed: r.passed,
          input: r.input,
          expectedOutput: r.expectedOutput,
          actualOutput: r.actualOutput,
          points: r.points,
          earnedPoints: r.earnedPoints
        })),
        hintDetails: hints.map((h, idx) => ({
          hintId: h.id || `hint-${idx}`,
          content: h.content,
          penalty: h.penalty,
          used: idx < hintsUsed
        }))
      }
    };
  }
  /**
   * Lưu kết quả submission
   */
  async saveSubmission(lessonId, userId, code, language, hintsUsed, timeUsed) {
    const { score, passedTests, totalTests, result } = await this.calculateScore(
      lessonId,
      code,
      language,
      hintsUsed,
      timeUsed
    );
    const submission = await prisma_default.lessonSubmission.create({
      data: {
        lessonId,
        userId,
        code,
        language,
        score,
        passedTests,
        totalTests,
        hintsUsed,
        timeUsed,
        status: "COMPILED",
        result: JSON.stringify(result)
      }
    });
    return submission;
  }
  /**
   * Lấy lịch sử submissions của user cho một lesson
   */
  async getUserSubmissions(lessonId, userId) {
    return prisma_default.lessonSubmission.findMany({
      where: { lessonId, userId },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Lấy chi tiết một submission
   */
  async getSubmissionById(submissionId) {
    const submission = await prisma_default.lessonSubmission.findUnique({
      where: { id: submissionId },
      include: {
        lesson: {
          include: {
            lessonContent: true
          }
        }
      }
    });
    if (submission && submission.result) {
      return {
        ...submission,
        parsedResult: JSON.parse(submission.result)
      };
    }
    return submission;
  }
};
var scoring_service_default = new ScoringService();

// src/modules/hackathon/services/hackathon.service.ts
var import_client18 = require("@prisma/client");
var prisma18 = new import_client18.PrismaClient();
var HackathonService = class extends BaseService {
  constructor() {
    super(hackathon_repository_default);
  }
  /**
   * Tạo mới một hackathon
   * @param createdBy - ID của người tạo hackathon
   * @param dto - Dữ liệu tạo hackathon (title, description, startDate, endDate)
   * @returns Promise<any> Hackathon đã được tạo
   * @throws Error nếu thiếu các trường bắt buộc
   */
  async create(createdBy, dto) {
    if (!dto.title || !dto.startDate || !dto.endDate) {
      throw new Error("Title, startDate, and endDate are required");
    }
    return this.repository.create({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: "upcoming",
      createdBy
    });
  }
  /**
   * Lấy thông tin hackathon theo ID
   * @param id - ID của hackathon cần lấy
   * @returns Promise<any | null> Hackathon hoặc null nếu không tìm thấy
   */
  async getById(id) {
    return this.repository.findById(id);
  }
  /**
   * Lấy danh sách hackathon đang diễn ra
   * @returns Promise<any[]> Danh sách hackathon active
   */
  async getActive() {
    return this.repository.findActive();
  }
  /**
   * Lấy danh sách hackathon sắp diễn ra
   * @returns Promise<any[]> Danh sách hackathon upcoming
   */
  async getUpcoming() {
    return this.repository.findUpcoming();
  }
  /**
   * Lấy danh sách hackathon đã kết thúc
   * @returns Promise<any[]> Danh sách hackathon đã kết thúc
   */
  async getEnded() {
    return this.repository.findEnded();
  }
  /**
   * Lấy danh sách hackathon đã đăng ký của một user
   * @param userId - ID của người dùng
   * @returns Promise<any[]> Danh sách hackathon đã đăng ký
   */
  async getRegistered(userId) {
    return this.repository.findRegisteredByUser(userId);
  }
  /**
   * Lấy bảng xếp hạng của một hackathon
   * @param hackathonId - ID của hackathon
   * @param currentUserId - ID của user hiện tại (để highlight)
   * @returns Promise<any> Bảng xếp hạng
   */
  async getLeaderboard(hackathonId, currentUserId) {
    return this.repository.getLeaderboardData(hackathonId, currentUserId);
  }
  /**
   * Lấy danh sách tất cả hackathon
   * @returns Promise<any[]> Danh sách tất cả hackathon
   */
  async getAll() {
    return this.repository.findMany();
  }
  /**
   * Xử lý tham gia hackathon của một người dùng
   * @param hackathonId - ID của hackathon muốn tham gia
   * @param userId - ID của người dùng
   * @param teamName - Tên nhóm (tùy chọn)
   * @returns Promise<any> Bản ghi tham gia
   * @throws Error nếu hackathon không tồn tại hoặc đã tham gia
   */
  async join(hackathonId, userId, teamName) {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) {
      throw new Error("Hackathon not found");
    }
    const now = /* @__PURE__ */ new Date();
    const start = new Date(hackathon.startDate || hackathon.startTime);
    const end = new Date(hackathon.endDate || hackathon.endTime);
    if (now < start) {
      throw new Error("Hackathon has not started yet");
    }
    if (now > end) {
      throw new Error("Hackathon has already ended");
    }
    const existing = await hackathonParticipant_repository_default.findByHackathonAndUser(hackathonId, userId);
    if (existing) {
      throw new Error("Already joined this hackathon");
    }
    const currentParticipants = await hackathonParticipant_repository_default.findByHackathonId(hackathonId);
    const maxParticipants = hackathon.maxParticipants || 100;
    if (currentParticipants.length >= maxParticipants) {
      throw new Error("Hackathon is full");
    }
    const participant = await hackathonParticipant_repository_default.create({
      hackathonId,
      userId,
      joinedAt: /* @__PURE__ */ new Date()
    });
    try {
      await notification_service_default.createHackathonJoinedNotification(
        userId,
        hackathon.title,
        hackathonId
      );
      const user = await prisma18.user.findUnique({
        where: { id: userId },
        select: { email: true, fullName: true }
      });
      if (user?.email) {
        await email_service_default.sendHackathonJoined(
          user.email,
          user.fullName || "User",
          hackathon.title
        );
      }
    } catch (notifError) {
      console.error("Failed to send hackathon joined notification:", notifError);
    }
    return participant;
  }
  /**
   * Lấy danh sách người tham gia của một hackathon
   * @param hackathonId - ID của hackathon
   * @returns Promise<any[]> Danh sách người tham gia
   */
  async getParticipants(hackathonId) {
    return hackathonParticipant_repository_default.findByHackathonId(hackathonId);
  }
  /**
   * Xử lý nộp dự án tham gia hackathon
   * @param hackathonId - ID của hackathon
   * @param userId - ID của người nộp
   * @param dto - Dữ liệu bài nộp (projectTitle, description, repositoryUrl, demoUrl)
   * @returns Promise<any> Bài nộp đã được tạo
   * @throws Error nếu hackathon không tồn tại hoặc user chưa tham gia
   */
  async submitProject(hackathonId, userId, dto) {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) {
      throw new Error("Hackathon not found");
    }
    const now = /* @__PURE__ */ new Date();
    const start = new Date(hackathon.startDate || hackathon.startTime);
    const end = new Date(hackathon.endDate || hackathon.endTime);
    if (now < start) {
      throw new Error("Hackathon has not started yet");
    }
    if (now > end) {
      throw new Error("Hackathon has already ended");
    }
    const participant = await hackathonParticipant_repository_default.findByHackathonAndUser(hackathonId, userId);
    if (!participant) {
      throw new Error("Must join hackathon before submitting");
    }
    return hackathonSubmission_repository_default.create({
      hackathonId,
      userId,
      projectTitle: dto.projectTitle,
      description: dto.description,
      repositoryUrl: dto.repositoryUrl,
      demoUrl: dto.demoUrl || null,
      score: null,
      submittedAt: /* @__PURE__ */ new Date()
    });
  }
  /**
   * Lấy danh sách bài nộp của một hackathon
   * @param hackathonId - ID của hackathon
   * @returns Promise<any[]> Danh sách bài nộp
   */
  async getSubmissions(hackathonId) {
    return hackathonSubmission_repository_default.findByHackathonId(hackathonId);
  }
  /**
   * Lấy danh sách bài nộp của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<any[]> Danh sách bài nộp
   */
  async getMySubmissions(userId) {
    return hackathonSubmission_repository_default.findByUserId(userId);
  }
  /**
   * Chấm điểm một bài nộp
   * @param submissionId - ID của bài nộp cần chấm
   * @param score - Điểm số (0-100)
   * @returns Promise<any> Bài nộp đã được cập nhật
   * @throws Error nếu điểm không nằm trong khoảng 0-100
   */
  async gradeSubmission(submissionId, score) {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }
    return hackathonSubmission_repository_default.updateScore(submissionId, score);
  }
  /**
   * Lấy danh sách bài problem của hackathon
   * @param hackathonId - ID của hackathon
   * @param userId - ID của user
   * @returns Danh sách problems + submissions của user
   */
  async getProblems(hackathonId, userId) {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) {
      throw new Error("Hackathon not found");
    }
    const participant = await hackathonParticipant_repository_default.findByHackathonAndUser(hackathonId, userId);
    if (!participant) {
      throw new Error("You must join the hackathon first");
    }
    let problemIds = [];
    if (hackathon.lessonIds) {
      try {
        problemIds = JSON.parse(hackathon.lessonIds);
      } catch {
        problemIds = [];
      }
    }
    if (problemIds.length === 0) {
      return { problems: [], submissions: [] };
    }
    const problems = await prisma18.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, title: true, description: true, difficulty: true, timeLimit: true }
    });
    const submissions = await prisma18.lessonSubmission.findMany({
      where: {
        userId,
        lessonId: { in: problemIds }
      },
      orderBy: { createdAt: "desc" }
    });
    return { problems, submissions };
  }
  /**
   * Chạy code bài trong hackathon (preview, không lưu)
   * @param hackathonId - ID của hackathon
   * @param userId - ID của user
   * @param problemId - ID của bài
   * @param code - Code của user
   * @param language - Ngôn ngữ lập trình
   */
  async runProblem(hackathonId, userId, problemId, code, language) {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) throw new Error("Hackathon not found");
    const now = /* @__PURE__ */ new Date();
    const start = new Date(hackathon.startTime);
    const end = new Date(hackathon.endTime);
    if (now < start) throw new Error("Hackathon has not started yet");
    if (now > end) throw new Error("Hackathon has already ended");
    const participant = await hackathonParticipant_repository_default.findByHackathonAndUser(hackathonId, userId);
    if (!participant) throw new Error("You must join the hackathon first");
    const results = await scoring_service_default.runCode(problemId, code, language || "javascript");
    return results;
  }
  /**
   * Nộp code bài trong hackathon (chấm điểm + lưu vào HackathonSubmission)
   * @param hackathonId - ID của hackathon
   * @param userId - ID của user
   * @param problemId - ID của bài
   * @param code - Code của user
   * @param language - Ngôn ngữ lập trình
   */
  async submitProblem(hackathonId, userId, problemId, code, language) {
    const hackathon = await this.repository.findById(hackathonId);
    if (!hackathon) throw new Error("Hackathon not found");
    const now = /* @__PURE__ */ new Date();
    const start = new Date(hackathon.startTime);
    const end = new Date(hackathon.endTime);
    if (now < start) throw new Error("Hackathon has not started yet");
    if (now > end) throw new Error("Hackathon has already ended");
    const participant = await hackathonParticipant_repository_default.findByHackathonAndUser(hackathonId, userId);
    if (!participant) throw new Error("You must join the hackathon first");
    const { score, passedTests, totalTests } = await scoring_service_default.calculateScore(problemId, code, language || "javascript");
    const submission = await hackathonSubmission_repository_default.create({
      hackathonId,
      userId,
      problemId,
      score,
      submittedAt: /* @__PURE__ */ new Date()
    });
    const existingLessonSubmission = await prisma18.lessonSubmission.findFirst({
      where: { lessonId: problemId, userId }
    });
    if (!existingLessonSubmission || (existingLessonSubmission.score ?? 0) < score) {
      await prisma18.lessonSubmission.upsert({
        where: { id: existingLessonSubmission?.id || "dummy" },
        create: {
          lessonId: problemId,
          userId,
          code,
          language: language || "javascript",
          score,
          passedTests,
          totalTests,
          hintsUsed: 0,
          status: "COMPILED"
        },
        update: { code, language: language || "javascript", score, passedTests, totalTests }
      });
    }
    return {
      ...submission,
      passedTests,
      totalTests,
      allPassed: passedTests === totalTests && totalTests > 0
    };
  }
};
var hackathon_service_default = new HackathonService();

// src/modules/hackathon/controllers/hackathon.controller.ts
var HackathonController = class extends BaseController {
  /**
   * Constructor khởi tạo controller với hackathon service
   */
  constructor() {
    super(hackathon_service_default);
  }
  /**
   * Tạo mới một hackathon
   * POST /hackathons
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  create = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const hackathon = await this.service.create(userId, req.body);
      this.success(res, hackathon, "Hackathon created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy thông tin hackathon theo ID
   * GET /hackathons/:id
   * @param req - Express Request object (chứa id trong params)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const hackathon = await this.service.getById(id);
      if (!hackathon) {
        this.error(res, "Hackathon not found", 404);
        return;
      }
      this.success(res, hackathon, "Hackathon retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách hackathon đang diễn ra
   * GET /hackathons/active
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getActive = async (req, res, next) => {
    try {
      const hackathons = await this.service.getActive();
      this.success(res, hackathons, "Active hackathons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách hackathon sắp diễn ra
   * GET /hackathons/upcoming
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getUpcoming = async (req, res, next) => {
    try {
      const hackathons = await this.service.getUpcoming();
      this.success(res, hackathons, "Upcoming hackathons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách hackathon đã kết thúc
   * GET /hackathons/ended
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getEnded = async (req, res, next) => {
    try {
      const hackathons = await this.service.getEnded();
      this.success(res, hackathons, "Ended hackathons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách hackathon đã đăng ký của user hiện tại
   * GET /hackathons/registered
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getRegistered = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const hackathons = await this.service.getRegistered(userId);
      this.success(res, hackathons, "Registered hackathons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy bảng xếp hạng của một hackathon
   * GET /hackathons/:id/leaderboard
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getLeaderboard = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const leaderboard = await this.service.getLeaderboard(id, userId);
      this.success(res, leaderboard, "Leaderboard retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Tham gia một hackathon
   * POST /hackathons/:id/join
   * @param req - Express Request object (chứa id trong params, teamName trong body)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  join = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const { teamName } = req.body;
      const participant = await this.service.join(id, userId, teamName);
      this.success(res, participant, "Joined hackathon successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy danh sách người tham gia của một hackathon
   * GET /hackathons/:id/participants
   * @param req - Express Request object (chứa id trong params)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getParticipants = async (req, res, next) => {
    try {
      const { id } = req.params;
      const participants = await this.service.getParticipants(id);
      this.success(res, participants, "Participants retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Nộp dự án tham gia hackathon
   * POST /hackathons/:id/submit
   * @param req - Express Request object (chứa id trong params, project info trong body)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  submitProject = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const submission = await this.service.submitProject(id, userId, req.body);
      this.success(res, submission, "Project submitted successfully", 201);
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy danh sách bài nộp của một hackathon
   * GET /hackathons/:id/submissions
   * @param req - Express Request object (chứa id trong params)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  getSubmissions = async (req, res, next) => {
    try {
      const { id } = req.params;
      const submissions = await this.service.getSubmissions(id);
      this.success(res, submissions, "Submissions retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Chấm điểm một bài nộp
   * PUT /hackathons/submissions/:submissionId/grade
   * @param req - Express Request object (chứa submissionId trong params, score trong body)
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  gradeSubmission = async (req, res, next) => {
    try {
      const { submissionId } = req.params;
      const { score } = req.body;
      const submission = await this.service.gradeSubmission(submissionId, score);
      this.success(res, submission, "Submission graded successfully");
    } catch (error) {
      const status = error.message.includes("must be") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy danh sách bài problem của hackathon
   * GET /hackathons/:id/problems
   */
  getProblems = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const data = await this.service.getProblems(id, userId);
      this.success(res, data, "Problems retrieved successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * Chạy code bài trong hackathon (preview, không lưu)
   * POST /hackathons/:id/run-problem
   */
  runProblem = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const { problemId, code, language } = req.body;
      const results = await this.service.runProblem(id, userId, problemId, code, language);
      this.success(res, results, "Code run completed");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * Nộp code bài trong hackathon (chấm điểm + lưu)
   * POST /hackathons/:id/submit-problem
   */
  submitProblem = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const { problemId, code, language } = req.body;
      const result = await this.service.submitProblem(id, userId, problemId, code, language);
      this.success(res, result, "Problem submitted successfully", 201);
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
};
var hackathon_controller_default = new HackathonController();

// src/modules/hackathon/routes/hackathon.routes.ts
var router14 = (0, import_express14.Router)();
router14.post("/", verifyToken, (req, res, next) => hackathon_controller_default.create(req, res, next));
router14.get("/active", (req, res, next) => hackathon_controller_default.getActive(req, res, next));
router14.get("/upcoming", (req, res, next) => hackathon_controller_default.getUpcoming(req, res, next));
router14.get("/ended", (req, res, next) => hackathon_controller_default.getEnded(req, res, next));
router14.get("/registered", verifyToken, (req, res, next) => hackathon_controller_default.getRegistered(req, res, next));
router14.get("/:id", (req, res, next) => hackathon_controller_default.getById(req, res, next));
router14.get("/:id/leaderboard", (req, res, next) => hackathon_controller_default.getLeaderboard(req, res, next));
router14.post("/:id/join", verifyToken, (req, res, next) => hackathon_controller_default.join(req, res, next));
router14.get("/:id/participants", (req, res, next) => hackathon_controller_default.getParticipants(req, res, next));
router14.post("/:id/submit", verifyToken, (req, res, next) => hackathon_controller_default.submitProject(req, res, next));
router14.get("/:id/submissions", (req, res, next) => hackathon_controller_default.getSubmissions(req, res, next));
router14.put("/submissions/:submissionId/grade", verifyToken, (req, res, next) => hackathon_controller_default.gradeSubmission(req, res, next));
router14.post("/:id/run-problem", verifyToken, (req, res, next) => hackathon_controller_default.runProblem(req, res, next));
router14.post("/:id/submit-problem", verifyToken, (req, res, next) => hackathon_controller_default.submitProblem(req, res, next));
router14.get("/:id/problems", verifyToken, (req, res, next) => hackathon_controller_default.getProblems(req, res, next));
var hackathon_routes_default = router14;

// src/modules/leaderboard/routes/leaderboard.routes.ts
var import_express15 = require("express");

// src/modules/leaderboard/repositories/leaderboard.repository.ts
var import_client19 = require("@prisma/client");
var prisma19 = new import_client19.PrismaClient();
var LeaderboardRepository = class extends BaseRepository {
  /** Prisma model được sử dụng (user model) */
  model = prisma19.user;
  /**
   * Lấy bảng xếp hạng toàn cục
   * @param limit - Số lượng entry tối đa (mặc định: 50)
   * @returns Promise<object[]> - Danh sách leaderboard với thứ hạng
   */
  async getGlobalLeaderboard(limit = 50) {
    const leaderboardKey = "leaderboard:global";
    try {
      const cached = await redis.zrevrange(leaderboardKey, 0, limit - 1, "WITHSCORES");
      if (cached.length > 0) {
        return this.formatRedisLeaderboard(cached);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }
    const users = await this.model.findMany({
      select: {
        id: true,
        username: true,
        avatar: true
      }
    });
    const submissions = await prisma19.submission.groupBy({
      by: ["userId"],
      where: { status: "AC" },
      _count: { id: true }
    });
    const scoreMap = /* @__PURE__ */ new Map();
    for (const sub of submissions) {
      scoreMap.set(sub.userId, sub._count.id * 10);
    }
    const entries = users.map((u) => ({
      userId: u.id,
      username: u.username,
      avatar: u.avatar,
      score: scoreMap.get(u.id) || 0
    }));
    entries.sort((a, b) => b.score - a.score);
    try {
      for (const entry of entries.slice(0, limit)) {
        await redis.zadd(leaderboardKey, entry.score, entry.userId);
      }
    } catch (error) {
      console.error("Redis zadd error:", error);
    }
    return entries.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
  }
  /**
   * Lấy bảng xếp hạng theo khóa học
   * @param courseId - ID của khóa học
   * @param limit - Số lượng entry tối đa (mặc định: 50)
   * @returns Promise<object[]> - Danh sách leaderboard của khóa học
   */
  async getCourseLeaderboard(courseId, limit = 50) {
    const enrollments = await prisma19.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, username: true, avatar: true }
        }
      }
    });
    const userIds = enrollments.map((e) => e.userId);
    const submissions = await prisma19.submission.groupBy({
      by: ["userId"],
      where: {
        userId: { in: userIds },
        status: "AC"
      },
      _count: { id: true }
    });
    const scoreMap = /* @__PURE__ */ new Map();
    for (const sub of submissions) {
      scoreMap.set(sub.userId, sub._count.id * 10);
    }
    const entries = enrollments.map((e) => ({
      userId: e.user.id,
      username: e.user.username,
      avatar: e.user.avatar,
      score: scoreMap.get(e.user.id) || 0,
      progress: e.progress
    }));
    entries.sort((a, b) => b.score - a.score);
    return entries.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
  }
  /**
   * Format dữ liệu leaderboard từ Redis
   * @param data - Mảng dữ liệu Redis [userId, score, userId, score, ...]
   * @returns object[] - Mảng entries đã format
   * @private
   */
  formatRedisLeaderboard(data) {
    const entries = [];
    for (let i = 0; i < data.length; i += 2) {
      entries.push({
        userId: data[i],
        score: parseInt(data[i + 1])
      });
    }
    return entries;
  }
};
var leaderboard_repository_default = new LeaderboardRepository();

// src/modules/leaderboard/services/leaderboard.service.ts
var LeaderboardService = class extends BaseService {
  constructor() {
    super(leaderboard_repository_default);
  }
  /**
   * Lấy bảng xếp hạng toàn cục
   * @param limit - Số lượng entry tối đa (mặc định: 50)
   * @returns Promise<object[]> - Danh sách leaderboard toàn cục
   */
  async getGlobal(limit = 50) {
    return this.repository.getGlobalLeaderboard(limit);
  }
  /**
   * Lấy bảng xếp hạng theo khóa học
   * @param courseId - ID của khóa học
   * @param limit - Số lượng entry tối đa (mặc định: 50)
   * @returns Promise<object[]> - Danh sách leaderboard của khóa học
   */
  async getCourseLeaderboard(courseId, limit = 50) {
    return this.repository.getCourseLeaderboard(courseId, limit);
  }
  /**
   * Lấy thứ hạng của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<object | null> - Thông tin rank hoặc null nếu không tìm thấy
   */
  async getUserRank(userId) {
    try {
      const rank = await redis.zrevrank("leaderboard:global", userId);
      const score = await redis.zscore("leaderboard:global", userId);
      if (rank === null) return null;
      return {
        rank: rank + 1,
        score: parseInt(score || "0")
      };
    } catch (error) {
      console.error("Redis error:", error);
      return null;
    }
  }
  /**
   * Cập nhật điểm số của người dùng khi có bài nộp thành công
   * @param userId - ID của người dùng
   * @param problemId - ID của bài toán (hiện không sử dụng, để dành cho future use)
   */
  async updateUserScore(userId, problemId) {
    try {
      await redis.zincrby("leaderboard:global", 10, userId);
    } catch (error) {
      console.error("Redis update error:", error);
    }
  }
};
var leaderboard_service_default = new LeaderboardService();

// src/modules/leaderboard/controllers/leaderboard.controller.ts
var LeaderboardController = class extends BaseController {
  constructor() {
    super(leaderboard_service_default);
  }
  /**
   * Lấy bảng xếp hạng toàn cục
   * GET /api/leaderboard
   * @param req - Request với query.limit (tùy chọn)
   * @param res - Response trả về danh sách leaderboard
   * @param next - Next function để xử lý lỗi
   */
  getGlobal = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const leaderboard = await this.service.getGlobal(limit);
      this.success(res, leaderboard, "Leaderboard retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy bảng xếp hạng theo khóa học
   * GET /api/leaderboard/course/:courseId
   * @param req - Request với params.courseId và query.limit
   * @param res - Response trả về danh sách leaderboard của khóa học
   * @param next - Next function để xử lý lỗi
   */
  getCourseLeaderboard = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const limit = parseInt(req.query.limit) || 50;
      const leaderboard = await this.service.getCourseLeaderboard(courseId, limit);
      this.success(res, leaderboard, "Course leaderboard retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy thứ hạng của người dùng hiện tại
   * GET /api/leaderboard/my-rank
   * @param req - Request với user từ token
   * @param res - Response trả về thông tin rank của user
   * @param next - Next function để xử lý lỗi
   */
  getMyRank = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const rank = await this.service.getUserRank(userId);
      this.success(res, rank, "Rank retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
};
var leaderboard_controller_default = new LeaderboardController();

// src/modules/leaderboard/routes/leaderboard.routes.ts
var router15 = (0, import_express15.Router)();
router15.get("/", (req, res, next) => leaderboard_controller_default.getGlobal(req, res, next));
router15.get("/course/:courseId", (req, res, next) => leaderboard_controller_default.getCourseLeaderboard(req, res, next));
router15.get("/my-rank", verifyToken, (req, res, next) => leaderboard_controller_default.getMyRank(req, res, next));
var leaderboard_routes_default = router15;

// src/modules/project/routes/project.routes.ts
var import_express16 = require("express");

// src/modules/project/repositories/project.repository.ts
var import_client20 = require("@prisma/client");
var prisma20 = new import_client20.PrismaClient();
var ProjectRepository = class extends BaseRepository {
  /** Prisma model được sử dụng cho các thao tác database */
  model = prisma20.project;
  /**
   * Tìm một dự án theo ID với course và submissions
   */
  async findById(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          },
          orderBy: { submittedAt: "desc" }
        }
      }
    });
  }
  /**
   * Tìm các dự án theo userId
   * @param userId - ID của người dùng
   * @returns Promise<Project[]> - Danh sách dự án của người dùng
   */
  async findByUserId(userId) {
    const projectSubmissions = await prisma20.projectSubmission.findMany({
      where: { userId },
      include: { project: true }
    });
    return projectSubmissions.map((ps) => ps.project);
  }
  /**
   * Tìm các dự án theo courseId
   * @param courseId - ID của khóa học
   * @returns Promise<Project[]> - Danh sách dự án của khóa học
   */
  async findByCourseId(courseId) {
    return this.model.findMany({
      where: { courseId }
    });
  }
  /**
   * Tìm các dự án theo userId và courseId
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Project[]> - Danh sách dự án của người dùng trong khóa học
   */
  async findByUserAndCourse(userId, courseId) {
    const projectSubmissions = await prisma20.projectSubmission.findMany({
      where: { userId },
      include: { project: true }
    });
    return projectSubmissions.filter((ps) => ps.project?.courseId === courseId).map((ps) => ps.project).filter(Boolean);
  }
  async createSubmission(data) {
    return prisma20.projectSubmission.create({
      data: {
        userId: data.userId,
        projectId: data.projectId,
        fileUrl: data.fileUrl,
        status: "pending"
      },
      include: {
        project: {
          include: {
            course: { select: { id: true, title: true } }
          }
        }
      }
    });
  }
};
var project_repository_default = new ProjectRepository();

// src/modules/certificate/services/certificate.service.ts
var import_client22 = require("@prisma/client");

// src/modules/certificate/repositories/certificate.repository.ts
var import_client21 = require("@prisma/client");
var prisma21 = new import_client21.PrismaClient();
var CertificateRepository = class extends BaseRepository {
  /** Prisma model được sử dụng cho các thao tác database */
  model = prisma21.certificate;
  /**
   * Tìm tất cả chứng chỉ của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<Certificate[]> - Danh sách chứng chỉ của người dùng
   */
  async findByUserId(userId) {
    return this.model.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" }
    });
  }
  /**
   * Tìm chứng chỉ theo userId và courseId
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
   */
  async findByUserAndCourse(userId, courseId) {
    return this.model.findFirst({
      where: { userId, courseId }
    });
  }
  /**
   * Tạo mới một chứng chỉ
   * @param data - Thông tin chứng chỉ cần tạo
   * @returns Promise<Certificate> - Chứng chỉ đã được tạo
   */
  async generateCertificate(data) {
    const existing = await this.findByUserAndCourse(data.userId, data.courseId);
    if (existing) {
      return existing;
    }
    const certificateUrl = `https://codefit.com/certificates/${crypto.randomUUID()}`;
    return this.model.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        userName: data.userName,
        issuedAt: /* @__PURE__ */ new Date(),
        certificateUrl
      }
    });
  }
};
var certificate_repository_default = new CertificateRepository();

// src/modules/certificate/services/certificate.service.ts
var prisma22 = new import_client22.PrismaClient();
var CertificateService = class extends BaseService {
  constructor() {
    super(certificate_repository_default);
  }
  /**
   * Lấy tất cả chứng chỉ của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<Certificate[]> - Danh sách chứng chỉ
   */
  async getUserCertificates(userId) {
    return this.repository.findByUserId(userId);
  }
  /**
   * Lấy chứng chỉ của người dùng cho một khóa học cụ thể
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
   */
  async getCertificate(userId, courseId) {
    return this.repository.findByUserAndCourse(userId, courseId);
  }
  /**
   * Sinh chứng chỉ khi hoàn thành khóa học
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Certificate> - Chứng chỉ đã được tạo
   * @throws Error - Nếu chưa đăng ký, chưa hoàn thành, hoặc không tìm thấy course/user
   */
  async generateForCourseCompletion(userId, courseId) {
    const enrollment = await prisma22.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });
    if (!enrollment) {
      throw new Error("Not enrolled in this course");
    }
    if (enrollment.progress < 100) {
      throw new Error("Course not completed yet");
    }
    const course = await prisma22.course.findUnique({
      where: { id: courseId }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const user = await prisma22.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const certificate = await this.repository.generateCertificate({
      userId,
      courseId,
      courseTitle: course.title,
      userName: user.username
    });
    if (user.email) {
      email_service_default.sendCertificateEmail(
        user.email,
        user.username,
        course.title,
        certificate.certificateUrl || "",
        certificate.id
      ).catch((err) => console.error("Failed to send certificate email:", err));
    }
    return certificate;
  }
  /**
   * Sinh chứng chỉ khi nộp project - không yêu cầu enrollment hay progress
   * @param userId - ID của người dùng
   * @param courseId - ID của khóa học
   * @returns Promise<Certificate> - Chứng chỉ đã được tạo
   * @throws Error - Nếu không tìm thấy course/user
   */
  async generateForProjectSubmission(userId, courseId) {
    const course = await prisma22.course.findUnique({
      where: { id: courseId }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const user = await prisma22.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const certificate = await this.repository.generateCertificate({
      userId,
      courseId,
      courseTitle: course.title,
      userName: user.username
    });
    return certificate;
  }
  /**
   * Xác minh chứng chỉ theo ID
   * @param certificateId - ID của chứng chỉ
   * @returns Promise<Certificate | null> - Chứng chỉ tìm được hoặc null
   */
  async verifyCertificate(certificateId) {
    return this.repository.findById(certificateId);
  }
};
var certificate_service_default = new CertificateService();

// src/modules/project/services/project.service.ts
var ProjectService = class extends BaseService {
  constructor() {
    super(project_repository_default);
  }
  /**
   * Tạo mới một dự án
   * @param userId - ID của người tạo
   * @param dto - Dữ liệu tạo dự án bao gồm title, description
   * @returns Promise<Project> - Dự án vừa được tạo
   * @throws Error - Nếu thiếu title
   */
  async create(userId, dto) {
    if (!dto.title) {
      throw new Error("Title is required");
    }
    return this.repository.create({
      userId,
      title: dto.title,
      description: dto.description,
      courseId: dto.courseId,
      status: "draft",
      repositoryUrl: dto.repositoryUrl || null,
      demoUrl: dto.demoUrl || null
    });
  }
  /**
   * Lấy dự án theo ID
   * @param id - ID của dự án
   * @returns Promise<Project | null> - Dự án tìm được hoặc null
   */
  async getById(id) {
    return this.repository.findById(id);
  }
  /**
   * Lấy tất cả dự án của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<Project[]> - Danh sách dự án
   */
  async getUserProjects(userId) {
    return this.repository.findByUserId(userId);
  }
  /**
   * Lấy tất cả dự án trong một khóa học
   * @param courseId - ID của khóa học
   * @returns Promise<Project[]> - Danh sách dự án
   */
  async getCourseProjects(courseId) {
    return this.repository.findByCourseId(courseId);
  }
  /**
   * Cập nhật một dự án
   * @param id - ID của dự án cần cập nhật
   * @param userId - ID của người cập nhật (để kiểm tra quyền)
   * @param dto - Dữ liệu cập nhật
   * @returns Promise<Project> - Dự án sau khi cập nhật
   * @throws Error - Nếu dự án không tồn tại
   */
  async update(id, userId, dto) {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return this.repository.update(id, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      repositoryUrl: dto.repositoryUrl,
      demoUrl: dto.demoUrl
    });
  }
  /**
   * Xóa một dự án
   * @param id - ID của dự án cần xóa
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu dự án không tồn tại
   */
  async delete(id) {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    await this.repository.delete(id);
    return { message: "Project deleted successfully" };
  }
  async submitProject(params) {
    const project = await this.repository.findById(params.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    const submission = await this.repository.createSubmission({
      userId: params.userId,
      projectId: params.projectId,
      fileUrl: params.fileUrl,
      fileName: params.fileName
    });
    notification_service_default.createNotification({
      userId: params.userId,
      type: "submission_result",
      title: `\u0110\xE3 n\u1ED9p: ${project.title}`,
      message: `B\u1EA1n \u0111\xE3 n\u1ED9p d\u1EF1 \xE1n "${project.title}" th\xE0nh c\xF4ng. \u0110ang ch\u1EDD gi\u1EA3ng vi\xEAn ch\u1EA5m \u0111i\u1EC3m.`,
      metadata: {
        projectId: params.projectId,
        submissionId: submission.id,
        courseId: project.courseId
      }
    }).catch((err) => console.error("[ProjectService] Failed to create notification:", err));
    const user = await prisma_default.user.findUnique({ where: { id: params.userId } });
    if (user?.email) {
      email_service_default.sendProjectSubmittedEmail(
        user.email,
        user.username,
        project.title,
        submission.project.course.title,
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/project/${params.projectId}/result`
      ).catch((err) => console.error("[ProjectService] Failed to send email:", err));
    }
    const courseId = project.courseId;
    const course = project.course;
    let certificateResult = null;
    try {
      const certificate = await certificate_service_default.generateForProjectSubmission(params.userId, courseId);
      console.log(`[ProjectService] Certificate generated successfully:`, certificate.id);
      certificateResult = { id: certificate.id, certificateUrl: certificate.certificateUrl };
      notification_service_default.createNotification({
        userId: params.userId,
        type: "certificate",
        title: "Ch\xFAc m\u1EEBng b\u1EA1n!",
        message: `B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh kh\xF3a h\u1ECDc "${course.title}"! Ch\u1EE9ng ch\u1EC9 \u0111\xE3 \u0111\u01B0\u1EE3c ph\xE1t h\xE0nh.`,
        metadata: { courseId, certificateId: certificate.id }
      }).catch((err) => console.error("[ProjectService] Failed to create cert notification:", err));
      if (user?.email) {
        email_service_default.sendCertificateEmail(
          user.email,
          user.username,
          course.title,
          certificate.certificateUrl || "",
          certificate.id
        ).catch((err) => console.error("[ProjectService] Failed to send certificate email:", err));
      }
    } catch (certErr) {
      console.error("[ProjectService] Certificate generation failed:", certErr.message);
    }
    return {
      id: submission.id,
      projectId: submission.projectId,
      courseId: project.courseId,
      status: submission.status,
      submittedAt: submission.submittedAt,
      projectTitle: project.title,
      courseTitle: submission.project.course.title,
      certificate: certificateResult
    };
  }
};
var project_service_default = new ProjectService();

// src/modules/project/controllers/project.controller.ts
var ProjectController = class extends BaseController {
  constructor() {
    super(project_service_default);
  }
  /**
   * Tạo mới một dự án
   * POST /api/projects
   * @param req - Request chứa body với title, description, user từ token
   * @param res - Response trả về dự án đã tạo
   * @param next - Next function để xử lý lỗi
   */
  create = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const project = await this.service.create(userId, req.body);
      this.success(res, project, "Project created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy dự án theo ID
   * GET /api/projects/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về dự án tìm được
   * @param next - Next function để xử lý lỗi
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = await this.service.getById(id);
      if (!project) {
        this.error(res, "Project not found", 404);
        return;
      }
      this.success(res, project, "Project retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả dự án của người dùng hiện tại
   * GET /api/projects/my
   * @param req - Request chứa user từ token
   * @param res - Response trả về danh sách dự án
   * @param next - Next function để xử lý lỗi
   */
  getMyProjects = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const projects = await this.service.getUserProjects(userId);
      this.success(res, projects, "Projects retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy tất cả dự án trong một khóa học
   * GET /api/projects/course/:courseId
   * @param req - Request chứa params.courseId
   * @param res - Response trả về danh sách dự án
   * @param next - Next function để xử lý lỗi
   */
  getCourseProjects = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const projects = await this.service.getCourseProjects(courseId);
      this.success(res, projects, "Course projects retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật một dự án
   * PUT /api/projects/:id
   * @param req - Request chứa params.id, body với dữ liệu cập nhật, user từ token
   * @param res - Response trả về dự án đã cập nhật
   * @param next - Next function để xử lý lỗi
   */
  update = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const project = await this.service.update(id, userId, req.body);
      this.success(res, project, "Project updated successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Xóa một dự án
   * DELETE /api/projects/:id
   * @param req - Request chứa params.id
   * @param res - Response trả về thông báo thành công
   * @param next - Next function để xử lý lỗi
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      this.success(res, result, "Project deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  submitProject = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { projectId, fileUrl, fileName } = req.body;
      if (!projectId || !fileUrl) {
        this.error(res, "projectId and fileUrl are required", 400);
        return;
      }
      const result = await this.service.submitProject({ userId, projectId, fileUrl, fileName });
      this.success(res, result, "Project submitted successfully", 201);
    } catch (error) {
      if (error.message.includes("not found")) {
        this.error(res, error.message, 404);
        return;
      }
      next(error);
    }
  };
};
var project_controller_default = new ProjectController();

// src/modules/project/routes/project.routes.ts
var router16 = (0, import_express16.Router)();
router16.post("/", verifyToken, (req, res, next) => project_controller_default.create(req, res, next));
router16.post("/submit", verifyToken, (req, res, next) => project_controller_default.submitProject(req, res, next));
router16.get("/my", verifyToken, (req, res, next) => project_controller_default.getMyProjects(req, res, next));
router16.get("/course/:courseId", (req, res, next) => project_controller_default.getCourseProjects(req, res, next));
router16.get("/:id", (req, res, next) => project_controller_default.getById(req, res, next));
router16.put("/:id", verifyToken, (req, res, next) => project_controller_default.update(req, res, next));
router16.delete("/:id", verifyToken, (req, res, next) => project_controller_default.delete(req, res, next));
var project_routes_default = router16;

// src/modules/certificate/routes/certificate.routes.ts
var import_express17 = require("express");

// src/modules/certificate/controllers/certificate.controller.ts
var CertificateController = class extends BaseController {
  constructor() {
    super(certificate_service_default);
  }
  /**
   * Lấy tất cả chứng chỉ của người dùng hiện tại
   * GET /api/certificates/my
   * @param req - Request chứa user từ token
   * @param res - Response trả về danh sách chứng chỉ
   * @param next - Next function để xử lý lỗi
   */
  getMyCertificates = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const certificates = await this.service.getUserCertificates(userId);
      this.success(res, certificates, "Certificates retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy chứng chỉ cho một khóa học cụ thể
   * GET /api/certificates/course/:courseId
   * @param req - Request chứa params.courseId và user từ token
   * @param res - Response trả về chứng chỉ
   * @param next - Next function để xử lý lỗi
   */
  getCertificate = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const certificate = await this.service.getCertificate(userId, courseId);
      if (!certificate) {
        this.error(res, "Certificate not found", 404);
        return;
      }
      this.success(res, certificate, "Certificate retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Sinh chứng chỉ khi hoàn thành khóa học
   * POST /api/certificates/generate
   * @param req - Request chứa body với courseId và user từ token
   * @param res - Response trả về chứng chỉ đã tạo
   * @param next - Next function để xử lý lỗi
   */
  generate = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.body;
      const certificate = await this.service.generateForCourseCompletion(userId, courseId);
      this.success(res, certificate, "Certificate generated successfully", 201);
    } catch (error) {
      const status = error.message.includes("Not") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
  /**
   * Xác minh chứng chỉ (công khai - không cần auth)
   * GET /api/certificates/verify/:certificateId
   * @param req - Request chứa params.certificateId
   * @param res - Response trả về thông tin chứng chỉ
   * @param next - Next function để xử lý lỗi
   */
  verify = async (req, res, next) => {
    try {
      const { certificateId } = req.params;
      const certificate = await this.service.verifyCertificate(certificateId);
      if (!certificate) {
        this.error(res, "Certificate not found", 404);
        return;
      }
      this.success(res, certificate, "Certificate verified successfully");
    } catch (error) {
      next(error);
    }
  };
};
var certificate_controller_default = new CertificateController();

// src/modules/certificate/routes/certificate.routes.ts
var router17 = (0, import_express17.Router)();
router17.get("/my", verifyToken, (req, res, next) => certificate_controller_default.getMyCertificates(req, res, next));
router17.get("/course/:courseId", verifyToken, (req, res, next) => certificate_controller_default.getCertificate(req, res, next));
router17.post("/generate", verifyToken, (req, res, next) => certificate_controller_default.generate(req, res, next));
router17.get("/verify/:certificateId", (req, res, next) => certificate_controller_default.verify(req, res, next));
var certificate_routes_default = router17;

// src/modules/feedback/routes/feedback.routes.ts
var import_express18 = require("express");

// src/modules/feedback/repositories/feedback.repository.ts
var import_client23 = require("@prisma/client");
var prisma23 = new import_client23.PrismaClient();
var FeedbackRepository = class extends BaseRepository {
  /** Prisma model được sử dụng cho các thao tác database */
  model = prisma23.feedback;
  /**
   * Tìm tất cả feedback theo userId
   * @param userId - ID của người dùng
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async findByUserId(userId) {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Tìm tất cả feedback (lấy tất cả)
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async findAllFeedback() {
    return this.model.findMany({
      orderBy: { createdAt: "desc" }
    });
  }
};
var feedback_repository_default = new FeedbackRepository();

// src/modules/feedback/services/feedback.service.ts
var FeedbackService = class extends BaseService {
  constructor() {
    super(feedback_repository_default);
  }
  /**
   * Tạo mới một feedback
   * @param userId - ID của người gửi feedback
   * @param dto - Dữ liệu tạo feedback
   * @returns Promise<Feedback> - Feedback vừa được tạo
   * @throws Error - Nếu thiếu dữ liệu
   */
  async create(userId, dto) {
    if (!dto.message) {
      throw new Error("message is required");
    }
    return this.repository.create({
      userId,
      message: dto.message
    });
  }
  /**
   * Lấy tất cả feedback
   * @returns Promise<Feedback[]> - Danh sách feedback
   */
  async getAll() {
    return this.repository.findAllFeedback();
  }
  /**
   * Lấy feedback của một user
   * @param userId - ID của người dùng
   * @returns Promise<Feedback[]> - Danh sách feedback của user
   */
  async getByUser(userId) {
    return this.repository.findByUserId(userId);
  }
  /**
   * Xóa một feedback
   * @param id - ID của feedback cần xóa
   * @param userId - ID của người xóa (để kiểm tra quyền)
   * @returns Promise<{ message: string }> - Thông báo thành công
   * @throws Error - Nếu feedback không tồn tại hoặc không có quyền
   */
  async delete(id, userId) {
    const feedback = await this.repository.findById(id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }
    if (feedback.userId !== userId) {
      throw new Error("You can only delete your own feedback");
    }
    await this.repository.delete(id);
    return { message: "Feedback deleted successfully" };
  }
};
var feedback_service_default = new FeedbackService();

// src/modules/feedback/controllers/feedback.controller.ts
var FeedbackController = class extends BaseController {
  constructor() {
    super(feedback_service_default);
  }
  /**
   * Tạo mới một feedback
   * POST /api/feedback
   * @param req - Request chứa body với message, user từ token
   * @param res - Response trả về feedback đã tạo
   * @param next - Next function để xử lý lỗi
   */
  create = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const feedback = await this.service.create(userId, req.body);
      this.success(res, feedback, "Feedback submitted successfully", 201);
    } catch (error) {
      const status = error.message.includes("already") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy tất cả feedback
   * GET /api/feedback
   * @param req - Request
   * @param res - Response trả về danh sách feedback
   * @param next - Next function để xử lý lỗi
   */
  getAll = async (req, res, next) => {
    try {
      const feedback = await this.service.getAll();
      this.success(res, feedback, "Feedback retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Xóa một feedback
   * DELETE /api/feedback/:id
   * @param req - Request chứa params.id và user từ token
   * @param res - Response trả về thông báo thành công
   * @param next - Next function để xử lý lỗi
   */
  delete = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const result = await this.service.delete(id, userId);
      this.success(res, result, "Feedback deleted successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      this.error(res, error.message, status);
    }
  };
};
var feedback_controller_default = new FeedbackController();

// src/modules/feedback/routes/feedback.routes.ts
var router18 = (0, import_express18.Router)();
router18.post("/", verifyToken, (req, res, next) => feedback_controller_default.create(req, res, next));
router18.get("/", (req, res, next) => feedback_controller_default.getAll(req, res, next));
router18.delete("/:id", verifyToken, (req, res, next) => feedback_controller_default.delete(req, res, next));
var feedback_routes_default = router18;

// src/modules/stats/routes/stats.routes.ts
var import_express19 = require("express");

// src/modules/stats/repositories/stats.repository.ts
var import_client24 = require("@prisma/client");
var prisma24 = new import_client24.PrismaClient();
var StatsRepository = class {
  /**
   * Lấy thống kê chi tiết của một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<object> - Thông tin thống kê người dùng
   */
  async getUserStats(userId) {
    const [submissions, enrollments, certificates] = await Promise.all([
      // Đếm submissions theo status
      prisma24.submission.groupBy({
        by: ["status"],
        where: { userId },
        _count: { id: true }
      }),
      // Lấy tiến độ của các khóa học đã đăng ký
      prisma24.enrollment.findMany({
        where: { userId },
        select: { progress: true }
      }),
      // Đếm số chứng chỉ
      prisma24.certificate.count({ where: { userId } })
    ]);
    const totalSubmissions = submissions.reduce((sum, s) => sum + s._count.id, 0);
    const acceptedSubmissions = submissions.find((s) => s.status === "AC")?._count.id || 0;
    const completedCourses = enrollments.filter((e) => e.progress === 100).length;
    return {
      userId,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate: totalSubmissions > 0 ? Math.round(acceptedSubmissions / totalSubmissions * 100) : 0,
      totalProblemsSolved: acceptedSubmissions,
      totalCoursesEnrolled: enrollments.length,
      totalCoursesCompleted: completedCourses,
      totalCertificates: certificates
    };
  }
  /**
   * Lấy thống kê của một khóa học
   * @param courseId - ID của khóa học
   * @returns Promise<object> - Thông tin thống kê khóa học
   */
  async getCourseStats(courseId) {
    const enrollments = await prisma24.enrollment.findMany({
      where: { courseId },
      select: { progress: true }
    });
    const avgProgress = enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0;
    const feedbackCount = await prisma24.feedback.count();
    return {
      courseId,
      totalEnrollments: enrollments.length,
      averageProgress: avgProgress,
      averageRating: 0,
      totalFeedback: feedbackCount
    };
  }
  /**
   * Lấy thống kê tổng quan của nền tảng
   * @returns Promise<object> - Thông tin thống kê nền tảng
   */
  async getPlatformStats() {
    const [users, courses, submissions, enrollments] = await Promise.all([
      prisma24.user.count(),
      prisma24.course.count(),
      prisma24.submission.count(),
      prisma24.enrollment.count()
    ]);
    return {
      totalUsers: users,
      totalCourses: courses,
      totalSubmissions: submissions,
      totalEnrollments: enrollments
    };
  }
  /**
   * Lấy so sánh progress theo tuần cho một người dùng
   * @param userId - ID của người dùng
   * @returns Promise<object> - Thông tin so sánh tuần
   */
  async getWeeklyComparison(userId) {
    const now = /* @__PURE__ */ new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);
    const [thisWeekSubs, lastWeekSubs, userStats] = await Promise.all([
      prisma24.submission.count({
        where: {
          userId,
          createdAt: { gte: thisWeekStart }
        }
      }),
      prisma24.submission.count({
        where: {
          userId,
          createdAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }),
      prisma24.userStats.findUnique({
        where: { userId }
      })
    ]);
    const [thisWeekEnrollments] = await Promise.all([
      prisma24.enrollment.findMany({
        where: { userId },
        select: {
          progress: true
        }
      })
    ]);
    let percentage = 0;
    if (lastWeekSubs > 0) {
      percentage = Math.round((thisWeekSubs - lastWeekSubs) / lastWeekSubs * 100);
    } else if (thisWeekSubs > 0) {
      percentage = 100;
    }
    if (userStats) {
      await prisma24.userStats.update({
        where: { userId },
        data: {
          weeklyScore: thisWeekSubs,
          lastWeekScore: lastWeekSubs,
          lastUpdated: now
        }
      });
    }
    return {
      thisWeekSubmissions: thisWeekSubs,
      lastWeekSubmissions: lastWeekSubs,
      percentage,
      comparison: thisWeekSubs > lastWeekSubs ? "better" : thisWeekSubs < lastWeekSubs ? "worse" : "same",
      message: thisWeekSubs > lastWeekSubs ? `B\u1EA1n \u0111\xE3 l\xE0m t\u1ED1t h\u01A1n ${Math.abs(percentage)}% so v\u1EDBi tu\u1EA7n tr\u01B0\u1EDBc` : thisWeekSubs < lastWeekSubs ? `B\u1EA1n \u0111ang \xEDt h\u01A1n ${Math.abs(percentage)}% so v\u1EDBi tu\u1EA7n tr\u01B0\u1EDBc` : "Ti\u1EBFn \u0111\u1ED9 t\u01B0\u01A1ng \u0111\u01B0\u01A1ng tu\u1EA7n tr\u01B0\u1EDBc"
    };
  }
  // ============ User Dashboard: Score Breakdown ============
  async getUserScoreBreakdown(userId) {
    const lessonSubmissions = await prisma24.lessonSubmission.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: { select: { id: true, title: true } }
              }
            }
          }
        }
      }
    });
    const courseMap = /* @__PURE__ */ new Map();
    let totalScore = 0;
    for (const sub of lessonSubmissions) {
      const course = sub.lesson?.phase?.course;
      if (!course) continue;
      const courseId = course.id;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId,
          courseTitle: course.title,
          score: 0,
          phases: []
        });
      }
      const courseData = courseMap.get(courseId);
      const phaseId = sub.lesson?.phase?.id;
      const phaseTitle = sub.lesson?.phase?.title;
      const lessonId = sub.lesson?.id;
      const lessonTitle = sub.lesson?.title;
      let phase = courseData.phases.find((p) => p.phaseId === phaseId);
      if (!phase) {
        phase = { phaseId, phaseTitle, lessons: [] };
        courseData.phases.push(phase);
      }
      let lesson = phase.lessons.find((l) => l.lessonId === lessonId);
      if (!lesson) {
        lesson = {
          lessonId,
          lessonTitle,
          score: sub.score || 0,
          passedTests: sub.passedTests || 0,
          totalTests: sub.totalTests || 0,
          status: sub.status
        };
        phase.lessons.push(lesson);
        courseData.score += lesson.score;
        totalScore += lesson.score;
      }
    }
    return {
      totalScore,
      courses: Array.from(courseMap.values())
    };
  }
  // ============ User Dashboard: Login Days & Streak ============
  async getUserLoginDays(userId) {
    const now = /* @__PURE__ */ new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const sessions = await prisma24.userSession.findMany({
      where: {
        userId,
        expiredAt: { gte: thirtyDaysAgo }
      },
      select: { expiredAt: true },
      orderBy: { expiredAt: "desc" }
    });
    const uniqueDays = /* @__PURE__ */ new Set();
    for (const s of sessions) {
      const day = s.expiredAt.toISOString().split("T")[0];
      uniqueDays.add(day);
    }
    const sortedDays = Array.from(uniqueDays).sort().reverse();
    let currentStreak = 0;
    const today = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const hasRecentLogin = sortedDays[0] === today || sortedDays[0] === yesterdayStr;
    if (hasRecentLogin) {
      let expectedDate = sortedDays[0] === today ? now : yesterday;
      for (const day of sortedDays) {
        const dayDate = new Date(day);
        const diff = Math.floor((expectedDate.getTime() - dayDate.getTime()) / (1e3 * 60 * 60 * 24));
        if (diff <= 1) {
          currentStreak++;
          expectedDate = dayDate;
        } else {
          break;
        }
      }
    }
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const activeDaysThisWeek = Array.from(uniqueDays).filter((day) => new Date(day) >= sevenDaysAgo).length;
    return {
      currentStreak,
      activeDaysThisWeek,
      totalActiveDays: uniqueDays.size
    };
  }
  // ============ User Dashboard: Weekly Activity ============
  async getUserWeeklyActivity(userId) {
    const now = /* @__PURE__ */ new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const result = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(monday);
      dayStart.setDate(monday.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      const isFuture = dayStart > now;
      const submissionCount = isFuture ? 0 : await prisma24.submission.count({
        where: {
          userId,
          createdAt: { gte: dayStart, lt: dayEnd }
        }
      });
      const lessonProgressCount = isFuture ? 0 : await prisma24.lessonProgress.count({
        where: {
          userId,
          completedAt: { gte: dayStart, lt: dayEnd }
        }
      });
      const lessonSubmissionCount = isFuture ? 0 : await prisma24.lessonSubmission.count({
        where: {
          userId,
          createdAt: { gte: dayStart, lt: dayEnd }
        }
      });
      result.push({
        day: days[i],
        label: days[i],
        submissions: submissionCount + lessonProgressCount + lessonSubmissionCount,
        isToday: i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      });
    }
    const totalThisWeek = result.reduce((sum, d) => sum + d.submissions, 0);
    return {
      days: result,
      totalThisWeek
    };
  }
  // ============ User Dashboard: Global Rank ============
  async getUserGlobalRank(userId) {
    const userSubmissions = await prisma24.lessonSubmission.findMany({
      where: { userId },
      select: { score: true }
    });
    const userScore = userSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    const allScores = await prisma24.lessonSubmission.groupBy({
      by: ["userId"],
      _sum: { score: true }
    });
    const ranked = allScores.map((s) => ({ userId: s.userId, score: s._sum.score || 0 })).sort((a, b) => b.score - a.score);
    const rank = ranked.findIndex((e) => e.userId === userId) + 1;
    const totalUsers = ranked.length;
    return {
      rank: rank > 0 ? rank : null,
      score: userScore,
      totalUsers
    };
  }
  // ============ Global Leaderboard ============
  async getGlobalLeaderboard() {
    const allScores = await prisma24.lessonSubmission.groupBy({
      by: ["userId"],
      _sum: { score: true }
    });
    const userIds = allScores.map((s) => s.userId);
    const users = await prisma24.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatar: true,
        email: true
      }
    });
    const userMap = new Map(users.map((u) => [u.id, u]));
    const leaderboard = allScores.map((s) => ({
      userId: s.userId,
      fullName: userMap.get(s.userId)?.fullName || "Unknown",
      username: userMap.get(s.userId)?.username || "unknown",
      avatar: userMap.get(s.userId)?.avatar || void 0,
      totalScore: s._sum.score || 0
    })).sort((a, b) => b.totalScore - a.totalScore).slice(0, 50).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    return leaderboard;
  }
  // ============ User Dashboard: Enrolled Courses ============
  async getUserEnrolledCoursesWithProgress(userId) {
    const enrollments = await prisma24.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            level: true,
            duration: true
          }
        },
        user: {
          select: { fullName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    if (enrollments.length === 0) return [];
    const courseIds = enrollments.map((e) => e.courseId);
    const progressData = await prisma24.progress.findMany({
      where: { userId, courseId: { in: courseIds } },
      select: { courseId: true, completedLessons: true, totalLessons: true, percentage: true }
    });
    const progressMap = new Map(progressData.map((p) => [p.courseId, p]));
    const lessonProgressCounts = await prisma24.lessonProgress.groupBy({
      by: ["courseId"],
      where: {
        userId,
        isCompleted: true,
        courseId: { in: courseIds }
      },
      _count: { lessonId: true }
    });
    const completedLessonMap = new Map(lessonProgressCounts.map((c) => [c.courseId, c._count.lessonId]));
    const phasesData = await prisma24.phase.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        _count: { select: { lessons: true } }
      }
    });
    const totalLessonMap = /* @__PURE__ */ new Map();
    for (const phase of phasesData) {
      const current = totalLessonMap.get(phase.courseId) || 0;
      totalLessonMap.set(phase.courseId, current + phase._count.lessons);
    }
    return enrollments.map((e) => {
      const prog = progressMap.get(e.courseId);
      const completedFromLesson = completedLessonMap.get(e.courseId) || 0;
      const totalFromCourse = totalLessonMap.get(e.courseId) || 0;
      let progress = 0;
      let completedLessons = 0;
      let totalLessons = 0;
      if (prog && prog.percentage > 0) {
        progress = prog.percentage;
        completedLessons = prog.completedLessons;
        totalLessons = prog.totalLessons;
      } else if (totalFromCourse > 0) {
        completedLessons = completedFromLesson;
        totalLessons = totalFromCourse;
        progress = Math.round(completedLessons / totalLessons * 100);
      } else {
        completedLessons = completedFromLesson;
        totalLessons = prog?.totalLessons || 0;
        progress = Math.round(e.progress || 0);
      }
      return {
        enrollmentId: e.id,
        courseId: e.course.id,
        courseTitle: e.course.title,
        courseDescription: e.course.description,
        courseImage: e.course.image,
        level: e.course.level,
        duration: e.course.duration,
        progress,
        completedLessons,
        totalLessons,
        enrolledAt: e.createdAt
      };
    });
  }
  // ============ User Dashboard: 5-Criteria Evaluation ============
  async getUserEvaluation(userId) {
    const now = /* @__PURE__ */ new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const lessonSubs = await prisma24.lessonSubmission.findMany({
      where: { userId },
      include: { lesson: true }
    });
    const problemSubs = await prisma24.submission.findMany({
      where: { userId },
      include: { problem: true }
    });
    const hasLessonSubs = lessonSubs.length > 0;
    const hasProblemSubs = problemSubs.length > 0;
    const hasAnySubmission = hasLessonSubs || hasProblemSubs;
    const activeDays = await prisma24.userSession.findMany({
      where: {
        userId,
        expiredAt: { gte: sevenDaysAgo }
      },
      select: { expiredAt: true }
    });
    const uniqueDays = new Set(
      activeDays.map((s) => s.expiredAt.toISOString().split("T")[0])
    );
    const hasActiveDays = uniqueDays.size > 0;
    const enrollments = await prisma24.enrollment.findMany({ where: { userId } });
    const progress = await prisma24.progress.findMany({ where: { userId } });
    const hasEnrollments = enrollments.length > 0;
    const hasActivity = hasAnySubmission || hasEnrollments;
    if (!hasActivity) {
      return {
        hasActivity: false,
        algorithmSpeed: { score: 0, label: "T\u1ED1c \u0111\u1ED9 hi\u1EC3u thu\u1EADt to\xE1n" },
        logicThinking: { score: 0, label: "Kh\u1EA3 n\u0103ng t\u01B0 duy logic" },
        bugFixing: { score: 0, label: "Kh\u1EA3 n\u0103ng fix bug" },
        learningFrequency: { score: 0, label: "T\u1EA7n su\u1EA5t h\u1ECDc", level: "low" },
        taskCompletion: { score: 0, label: "M\u1EE9c \u0111\u1ED9 ho\xE0n th\xE0nh" },
        finalScore: 0
      };
    }
    let speedScore = 0;
    let speedDataPoints = 0;
    for (const sub of lessonSubs) {
      if (sub.timeUsed && sub.timeUsed > 0) {
        const ratio = Math.min(sub.timeUsed / 3600, 1);
        const score = (1 - ratio) * 50;
        speedScore += score;
        speedDataPoints++;
      }
    }
    for (const sub of problemSubs) {
      if (sub.runtime && sub.problem?.timeLimit && sub.problem.timeLimit > 0) {
        const ratio = Math.min(sub.runtime / sub.problem.timeLimit, 1);
        const score = (1 - ratio) * 50;
        speedScore += score;
        speedDataPoints++;
      }
    }
    const algorithmSpeed = speedDataPoints > 0 ? Math.round(speedScore / speedDataPoints) : 0;
    const lessonPassRate = hasLessonSubs ? lessonSubs.reduce((sum, s) => sum + (s.passedTests || 0) / Math.max(s.totalTests || 1, 1), 0) / lessonSubs.length : 0;
    const problemFirstAC = await Promise.all(
      problemSubs.map(async (sub) => {
        const firstForProblem = await prisma24.submission.findFirst({
          where: { userId, problemId: sub.problemId },
          orderBy: { createdAt: "asc" }
        });
        return firstForProblem?.status === "AC" ? 1 : 0;
      })
    );
    const acFirstRate = problemFirstAC.length > 0 ? problemFirstAC.reduce((a, b) => a + b, 0) / problemFirstAC.length : 0;
    const waCount = await prisma24.submissionResult.count({
      where: {
        submission: { userId },
        status: "WA"
      }
    });
    const totalResults = await prisma24.submissionResult.count({
      where: { submission: { userId } }
    });
    const waRate = totalResults > 0 ? waCount / totalResults : 0;
    const logicThinking = Math.round(
      lessonPassRate * 40 + acFirstRate * 30 + Math.max(0, 1 - waRate) * 30
    );
    const problemIds = [...new Set(problemSubs.map((s) => s.problemId))];
    let fixedCount = 0;
    let totalMultiAttempt = 0;
    let totalErrorDecrease = 0;
    for (const pid of problemIds) {
      const attempts = await prisma24.submission.findMany({
        where: { userId, problemId: pid },
        orderBy: { createdAt: "asc" }
      });
      if (attempts.length > 1) {
        totalMultiAttempt++;
        const lastAC = attempts.findLast((a) => a.status === "AC");
        if (lastAC) {
          fixedCount++;
          const firstWA = attempts.find((a) => a.status === "WA" || a.status === "RE");
          if (firstWA) {
            const firstErrors = attempts.filter((a) => a.createdAt <= firstWA.createdAt).length;
            const errorsAfterFix = attempts.indexOf(lastAC) - attempts.indexOf(firstWA);
            if (firstErrors > 0) {
              totalErrorDecrease += Math.max(0, errorsAfterFix) / firstErrors;
            }
          }
        }
      }
    }
    const fixedRate = totalMultiAttempt > 0 ? fixedCount / totalMultiAttempt : 0;
    const errorDecrease = totalMultiAttempt > 0 ? totalErrorDecrease / totalMultiAttempt : 0;
    const bugFixing = Math.round(
      fixedRate * 40 + Math.min(errorDecrease, 1) * 30 + fixedRate * 30
    );
    const activeDaysPerWeek = uniqueDays.size;
    const frequencyScore = Math.round(activeDaysPerWeek / 7 * 100);
    let frequencyLevel = "low";
    if (activeDaysPerWeek >= 5) frequencyLevel = "high";
    else if (activeDaysPerWeek >= 3) frequencyLevel = "medium";
    const learningFrequency = frequencyScore;
    const totalLessons = progress.reduce((sum, p) => sum + (p.totalLessons || 0), 0);
    const completedLessons = progress.reduce((sum, p) => sum + (p.completedLessons || 0), 0);
    const lessonCompletion = totalLessons > 0 ? completedLessons / totalLessons : 0;
    const projectSubs = await prisma24.projectSubmission.findMany({
      where: { userId, status: "approved" }
    });
    const hasProject = projectSubs.length > 0;
    const taskCompletion = Math.round(lessonCompletion * 70 + (hasProject ? 30 : 0));
    const finalScore = Math.round(
      algorithmSpeed * 0.2 + logicThinking * 0.25 + bugFixing * 0.15 + learningFrequency * 0.2 + taskCompletion * 0.2
    );
    return {
      hasActivity: true,
      algorithmSpeed: { score: algorithmSpeed, label: "T\u1ED1c \u0111\u1ED9 hi\u1EC3u thu\u1EADt to\xE1n" },
      logicThinking: { score: logicThinking, label: "Kh\u1EA3 n\u0103ng t\u01B0 duy logic" },
      bugFixing: { score: bugFixing, label: "Kh\u1EA3 n\u0103ng fix bug" },
      learningFrequency: { score: learningFrequency, label: "T\u1EA7n su\u1EA5t h\u1ECDc", level: frequencyLevel },
      taskCompletion: { score: taskCompletion, label: "M\u1EE9c \u0111\u1ED9 ho\xE0n th\xE0nh" },
      finalScore
    };
  }
  // ============ Profile Page: 30-day Activity ============
  async getActivity30Days(userId) {
    const now = /* @__PURE__ */ new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const result = [];
    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(thirtyDaysAgo);
      dayStart.setDate(thirtyDaysAgo.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      const submissionCount = await prisma24.submission.count({
        where: { userId, createdAt: { gte: dayStart, lt: dayEnd } }
      });
      const lessonProgressCount = await prisma24.lessonProgress.count({
        where: { userId, completedAt: { gte: dayStart, lt: dayEnd } }
      });
      const lessonSubmissionCount = await prisma24.lessonSubmission.count({
        where: { userId, createdAt: { gte: dayStart, lt: dayEnd } }
      });
      const value = submissionCount + lessonProgressCount + lessonSubmissionCount;
      const dateObj = new Date(dayStart);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const dayName = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][dateObj.getDay()];
      result.push({
        date: dayStart.toISOString().split("T")[0],
        dateLabel: `${day}/${month}`,
        label: `${dayName} ${day}`,
        value
      });
    }
    return result;
  }
};
var stats_repository_default = new StatsRepository();

// src/modules/stats/services/stats.service.ts
var StatsService = class {
  /**
   * Lấy thống kê của người dùng (có cache)
   * @param userId - ID của người dùng
   * @returns Promise<object> - Thông tin thống kê người dùng
   */
  async getUserStats(userId) {
    const cacheKey = `stats:user:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const stats = await stats_repository_default.getUserStats(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(stats));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return stats;
  }
  /**
   * Lấy thống kê của khóa học (có cache)
   * @param courseId - ID của khóa học
   * @returns Promise<object> - Thông tin thống kê khóa học
   */
  async getCourseStats(courseId) {
    const cacheKey = `stats:course:${courseId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const stats = await stats_repository_default.getCourseStats(courseId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(stats));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return stats;
  }
  /**
   * Lấy thống kê tổng quan của nền tảng (có cache)
   * @returns Promise<object> - Thông tin thống kê nền tảng
   */
  async getPlatformStats() {
    const cacheKey = "stats:platform";
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const stats = await stats_repository_default.getPlatformStats();
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(stats));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return stats;
  }
  /**
   * Xóa cache theo pattern
   * @param pattern - Pattern để xóa cache (ví dụ: stats:user:*)
   */
  async invalidateCache(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error("Redis invalidate error:", error);
    }
  }
  /**
   * Lấy so sánh progress theo tuần
   * @param userId - ID của người dùng
   * @returns Promise<object> - Thông tin so sánh tuần này vs tuần trước
   */
  async getWeeklyComparison(userId) {
    const cacheKey = `stats:weekly:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const comparison = await stats_repository_default.getWeeklyComparison(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(comparison));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return comparison;
  }
  async getUserScoreBreakdown(userId) {
    const cacheKey = `stats:score:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getUserScoreBreakdown(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getUserLoginDays(userId) {
    const cacheKey = `stats:login:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getUserLoginDays(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getUserWeeklyActivity(userId) {
    const cacheKey = `stats:weekly-activity:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getUserWeeklyActivity(userId);
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getUserGlobalRank(userId) {
    const cacheKey = `stats:rank:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getUserGlobalRank(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getGlobalLeaderboard() {
    const cacheKey = "stats:leaderboard";
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getGlobalLeaderboard();
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getUserEnrolledCourses(userId) {
    const cacheKey = `stats:courses:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getUserEnrolledCoursesWithProgress(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getUserEvaluation(userId) {
    const cacheKey = `stats:eval:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getUserEvaluation(userId);
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
  async getActivity30Days(userId) {
    const cacheKey = `stats:activity30:${userId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error("Redis get error:", error);
    }
    const data = await stats_repository_default.getActivity30Days(userId);
    try {
      await redis.setex(cacheKey, 60, JSON.stringify(data));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return data;
  }
};
var stats_service_default = new StatsService();

// src/modules/stats/controllers/stats.controller.ts
var StatsController = class {
  /**
   * Lấy thống kê của người dùng hiện tại
   * GET /api/stats/me
   * @param req - Request chứa user từ token
   * @param res - Response trả về thông tin thống kê
   * @param next - Next function để xử lý lỗi
   */
  async getMyStats(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const stats = await stats_service_default.getUserStats(userId);
      res.json({ success: true, data: stats, message: "Stats retrieved successfully" });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Lấy thống kê của một khóa học
   * GET /api/stats/course/:courseId
   * @param req - Request chứa params.courseId
   * @param res - Response trả về thông tin thống kê khóa học
   * @param next - Next function để xử lý lỗi
   */
  async getCourseStats(req, res, next) {
    try {
      const courseId = req.params.courseId;
      const stats = await stats_service_default.getCourseStats(courseId);
      res.json({ success: true, data: stats, message: "Course stats retrieved successfully" });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Lấy thống kê tổng quan của nền tảng
   * GET /api/stats/platform
   * @param req - Request
   * @param res - Response trả về thông tin thống kê nền tảng
   * @param next - Next function để xử lý lỗi
   */
  async getPlatformStats(req, res, next) {
    try {
      const stats = await stats_service_default.getPlatformStats();
      res.json({ success: true, data: stats, message: "Platform stats retrieved successfully" });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Lấy so sánh progress theo tuần
   * GET /api/stats/weekly-comparison
   * @param req - Request chứa user từ token
   * @param res - Response trả về thông tin so sánh tuần
   * @param next - Next function để xử lý lỗi
   */
  async getWeeklyComparison(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const comparison = await stats_service_default.getWeeklyComparison(userId);
      res.json({ success: true, data: comparison });
    } catch (error) {
      next(error);
    }
  }
  async getScoreBreakdown(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getUserScoreBreakdown(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getLoginDays(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getUserLoginDays(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getWeeklyActivity(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getUserWeeklyActivity(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getGlobalRank(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getUserGlobalRank(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getGlobalLeaderboard(req, res, next) {
    try {
      const data = await stats_service_default.getGlobalLeaderboard();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getEnrolledCourses(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getUserEnrolledCourses(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getEvaluation(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getUserEvaluation(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getActivity30Days(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await stats_service_default.getActivity30Days(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
};
var stats_controller_default = new StatsController();

// src/modules/stats/routes/stats.routes.ts
var router19 = (0, import_express19.Router)();
router19.get("/me", verifyToken, (req, res, next) => stats_controller_default.getMyStats(req, res, next));
router19.get("/course/:courseId", (req, res, next) => stats_controller_default.getCourseStats(req, res, next));
router19.get("/platform", (req, res, next) => stats_controller_default.getPlatformStats(req, res, next));
router19.get("/weekly-comparison", verifyToken, (req, res, next) => stats_controller_default.getWeeklyComparison(req, res, next));
router19.get("/score-breakdown", verifyToken, (req, res, next) => stats_controller_default.getScoreBreakdown(req, res, next));
router19.get("/login-days", verifyToken, (req, res, next) => stats_controller_default.getLoginDays(req, res, next));
router19.get("/weekly-activity", verifyToken, (req, res, next) => stats_controller_default.getWeeklyActivity(req, res, next));
router19.get("/global-rank", verifyToken, (req, res, next) => stats_controller_default.getGlobalRank(req, res, next));
router19.get("/global-leaderboard", (req, res, next) => stats_controller_default.getGlobalLeaderboard(req, res, next));
router19.get("/enrolled-courses", verifyToken, (req, res, next) => stats_controller_default.getEnrolledCourses(req, res, next));
router19.get("/evaluation", verifyToken, (req, res, next) => stats_controller_default.getEvaluation(req, res, next));
router19.get("/activity-30-days", verifyToken, (req, res, next) => stats_controller_default.getActivity30Days(req, res, next));
var stats_routes_default = router19;

// src/modules/upload/routes/upload.routes.ts
var import_express20 = require("express");

// src/services/imagekit.service.ts
var import_imagekit = __toESM(require("imagekit"));
var imagekit = new import_imagekit.default({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
var uploadImage = async (file, fileName, folder = "/codefit") => {
  try {
    const result = await imagekit.upload({
      file,
      fileName,
      folder
    });
    return {
      fileId: result.fileId,
      fileType: result.fileType,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl || null,
      name: result.name
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// src/middleware/upload.middleware.ts
var import_multer = __toESM(require("multer"));
var ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/x-7z-compressed",
  "application/x-rar"
];
var MAX_FILE_SIZE = 50 * 1024 * 1024;
var storage = import_multer.default.memoryStorage();
var fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, WebP, SVG, ZIP, RAR, and 7Z are allowed."));
  }
};
var uploadMiddleware = (0, import_multer.default)({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});
var uploadSingleImage = uploadMiddleware.single("image");
var uploadMultipleImages = uploadMiddleware.array("images", 10);

// src/modules/upload/routes/upload.routes.ts
var router20 = (0, import_express20.Router)();
var asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
router20.post(
  "/",
  verifyToken,
  uploadMiddleware.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file provided"
      });
      return;
    }
    const folder = req.body.folder || "/codefit";
    const result = await uploadImage(req.file.buffer, req.file.originalname, folder);
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: result
    });
  })
);
router20.post(
  "/image",
  verifyToken,
  uploadMiddleware.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided"
      });
      return;
    }
    const folder = req.body.folder || "/codefit";
    const result = await uploadImage(req.file.buffer, req.file.originalname, folder);
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: result
    });
  })
);
router20.post(
  "/images",
  verifyToken,
  uploadMiddleware.array("images", 10),
  asyncHandler(async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No image files provided"
      });
      return;
    }
    const folder = req.body.folder || "/codefit";
    const uploadPromises = files.map(
      (file) => uploadImage(file.buffer, file.originalname, folder)
    );
    const results = await Promise.all(uploadPromises);
    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: results
    });
  })
);
var upload_routes_default = router20;

// src/modules/payment/routes/payment.routes.ts
var import_express21 = require("express");

// src/modules/payment/services/payment.service.ts
var import_sepay_pg_node = require("sepay-pg-node");

// src/utils/payos.ts
var import_node = require("@payos/node");
var _payOS = null;
function getPayOS() {
  if (!_payOS) {
    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
    if (!clientId || !apiKey || !checksumKey) {
      console.warn("[PayOS] WARNING: PayOS credentials not found in environment variables");
      console.warn("[PayOS] Payment will fall back to mock mode");
    }
    _payOS = new import_node.PayOS({
      clientId: clientId || "",
      apiKey: apiKey || "",
      checksumKey: checksumKey || ""
    });
  }
  return _payOS;
}
var payos_default = {
  paymentRequests: {
    create: (body) => getPayOS().paymentRequests.create(body),
    get: (orderCode) => getPayOS().paymentRequests.get(Number(orderCode)),
    cancel: (orderCode, reason) => getPayOS().paymentRequests.cancel(Number(orderCode), reason)
  },
  webhooks: {
    verify: (body) => getPayOS().webhooks.verify(body)
  }
};

// src/modules/payment/repositories/payment.repository.ts
var import_client25 = require("@prisma/client");
var prisma25 = new import_client25.PrismaClient();
var PaymentRepository = class {
  /**
   * Tạo một payment mới
   */
  async create(data) {
    return prisma25.payment.create({ data });
  }
  /**
   * Tìm payment theo ID
   */
  async findById(id) {
    return prisma25.payment.findUnique({
      where: { id },
      include: { course: true, user: true }
    });
  }
  /**
   * Tìm payment theo PayOS order ID
   */
  async findByPayosOrderId(orderId) {
    return prisma25.payment.findFirst({
      where: { payosOrderId: orderId },
      include: { course: true, user: true }
    });
  }
  /**
   * Tìm payments của một user
   */
  async findByUserId(userId) {
    return prisma25.payment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Tìm payment đang pending của user cho một course
   */
  async findPendingByUserAndCourse(userId, courseId) {
    return prisma25.payment.findFirst({
      where: {
        userId,
        courseId,
        paymentStatus: "pending"
      }
    });
  }
  /**
   * Cập nhật payment status
   */
  async updateStatus(id, status, data) {
    return prisma25.payment.update({
      where: { id },
      data: {
        paymentStatus: status,
        ...data
      }
    });
  }
  /**
   * Cập nhật PayOS order ID
   */
  async updatePayosOrderId(id, orderId) {
    return prisma25.payment.update({
      where: { id },
      data: { payosOrderId: orderId }
    });
  }
};
var payment_repository_default = new PaymentRepository();

// src/modules/payment/repositories/activateCode.repository.ts
var import_client26 = require("@prisma/client");
var prisma26 = new import_client26.PrismaClient();
var ActivateCodeRepository = class {
  /**
   * Tạo activate code mới
   */
  async create(data) {
    return prisma26.activateCode.create({ data });
  }
  /**
   * Tìm activate code theo code string
   */
  async findByCode(code) {
    return prisma26.activateCode.findUnique({
      where: { code },
      include: { course: true }
    });
  }
  /**
   * Tìm activate codes theo course ID
   */
  async findByCourseId(courseId) {
    return prisma26.activateCode.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Tìm activate codes của một user đã sử dụng
   */
  async findByUserId(userId) {
    return prisma26.activateCode.findMany({
      where: { usedBy: userId },
      include: { course: true },
      orderBy: { usedAt: "desc" }
    });
  }
  /**
   * Đánh dấu activate code đã sử dụng
   */
  async markAsUsed(code, userId) {
    return prisma26.activateCode.update({
      where: { code },
      data: {
        isUsed: true,
        usedBy: userId,
        usedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  /**
   * Xóa activate code
   */
  async delete(id) {
    return prisma26.activateCode.delete({
      where: { id }
    });
  }
};
var activateCode_repository_default = new ActivateCodeRepository();

// src/modules/payment/services/payment.service.ts
var import_client27 = require("@prisma/client");
var prisma27 = new import_client27.PrismaClient();
var sePayClient = null;
var sePayMerchantId = process.env.SEPAY_MERCHANT_ID;
var sePaySecretKey = process.env.SEPAY_SECRET_KEY;
var sePayEnv = process.env.SEPAY_ENV || "sandbox";
console.log("[SePay] Merchant ID:", sePayMerchantId ? `${sePayMerchantId.substring(0, 8)}...` : "NOT SET");
if (sePayMerchantId && sePaySecretKey) {
  try {
    sePayClient = new import_sepay_pg_node.SePayPgClient({
      env: sePayEnv,
      merchant_id: sePayMerchantId,
      secret_key: sePaySecretKey
    });
    console.log("[SePay] Initialized successfully");
  } catch (initError) {
    console.error("[SePay] Init error:", initError);
  }
} else {
  console.log("[SePay] Not configured - missing credentials");
}
var PaymentService = class {
  /**
   * Tạo payment mới cho thanh toán QR (SePay)
   */
  async createPayment(userId, courseId, paymentMethod) {
    const course = await course_repository_default.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const existingEnrollment = await enrollment_repository_default.findByUserIdAndCourseId(userId, courseId);
    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }
    return await prisma27.$transaction(async (tx) => {
      const pendingPayment = await tx.payment.findFirst({
        where: {
          userId,
          courseId,
          paymentStatus: "pending",
          paymentMethod: paymentMethod === "qr" ? "payos" : "direct"
        }
      });
      if (pendingPayment) {
        return pendingPayment;
      }
      const payment = await tx.payment.create({
        data: {
          userId,
          courseId,
          amount: course.price,
          paymentMethod: paymentMethod === "qr" ? "payos" : "direct",
          paymentStatus: paymentMethod === "direct" ? "completed" : "pending"
        }
      });
      return payment;
    });
  }
  /**
   * Tạo SePay payment checkout
   */
  async createSePayCheckout(userId, courseId) {
    const payment = await this.createPayment(userId, courseId, "qr");
    const course = await course_repository_default.findById(courseId);
    const orderCode = `CODEFIT-${Date.now()}`;
    await payment_repository_default.updatePayosOrderId(payment.id, orderCode);
    const isSePayConfigured = process.env.SEPAY_MERCHANT_ID && process.env.SEPAY_MERCHANT_ID !== "YOUR_MERCHANT_ID";
    if (isSePayConfigured && sePayClient) {
      try {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const checkoutFormFields = sePayClient.checkout.initOneTimePaymentFields({
          payment_method: "BANK_TRANSFER",
          order_invoice_number: orderCode,
          order_amount: Math.round(payment.amount),
          currency: "VND",
          order_description: `Thanh toan CodeFit #${orderCode}`,
          success_url: `${frontendUrl}/user/payment/success?orderCode=${orderCode}&paymentId=${payment.id}&courseId=${courseId}`,
          error_url: `${frontendUrl}/user/payment/error?orderCode=${orderCode}&paymentId=${payment.id}`,
          cancel_url: `${frontendUrl}/user/payment/cancel?orderCode=${orderCode}&paymentId=${payment.id}`
        });
        const checkoutUrl = sePayClient.checkout.initCheckoutUrl();
        console.log("[SePay] Checkout created for order:", orderCode);
        return {
          payment,
          checkoutUrl,
          checkoutFormFields,
          orderCode
        };
      } catch (sePayError) {
        console.error("SePay Error:", sePayError);
        return this.createMockCheckout(payment, course, orderCode);
      }
    } else {
      return this.createMockCheckout(payment, course, orderCode);
    }
  }
  /**
   * Tạo mock checkout cho development
   */
  createMockCheckout(payment, course, orderCode) {
    const qrData = JSON.stringify({
      courseId: payment.courseId,
      paymentId: payment.id,
      amount: payment.amount,
      orderCode,
      timestamp: Date.now()
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
    return {
      payment,
      checkoutUrl: `https://sepay.vn/mock-checkout/${payment.id}`,
      checkoutFormFields: {},
      qrCodeUrl,
      orderCode,
      isMock: true
    };
  }
  /**
   * Xử lý thanh toán trực tiếp với activate code
   */
  async activateWithCode(userId, code) {
    const activateCode = await activateCode_repository_default.findByCode(code);
    if (!activateCode) {
      throw new Error("Invalid activation code");
    }
    if (activateCode.isUsed) {
      throw new Error("This activation code has already been used");
    }
    if (activateCode.expiresAt && new Date(activateCode.expiresAt) < /* @__PURE__ */ new Date()) {
      throw new Error("This activation code has expired");
    }
    const existingEnrollment = await enrollment_repository_default.findByUserIdAndCourseId(userId, activateCode.courseId);
    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }
    const payment = await payment_repository_default.create({
      userId,
      courseId: activateCode.courseId,
      amount: 0,
      paymentMethod: "direct",
      paymentStatus: "completed",
      completedAt: /* @__PURE__ */ new Date()
    });
    await activateCode_repository_default.markAsUsed(code, userId);
    const unlockLessonsCount = activateCode.course.unlockLessonsCount ?? 3;
    const enrollment = await enrollment_repository_default.create({
      userId,
      courseId: activateCode.courseId,
      progress: 0,
      paymentId: payment.id,
      currentUnlocks: unlockLessonsCount,
      completedLessons: 0
    });
    return {
      enrollment,
      payment,
      course: activateCode.course
    };
  }
  /**
   * Xác nhận thanh toán SePay thành công
   */
  async confirmSePayPayment(orderCode) {
    const payment = await payment_repository_default.findByPayosOrderId(orderCode);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.paymentStatus === "completed") {
      return payment;
    }
    await payment_repository_default.updateStatus(payment.id, "completed", {
      completedAt: /* @__PURE__ */ new Date()
    });
    const courseInfo = await prisma27.course.findUnique({
      where: { id: payment.courseId },
      select: { unlockLessonsCount: true }
    });
    const unlockLessonsCount = courseInfo?.unlockLessonsCount ?? 3;
    const enrollment = await enrollment_repository_default.create({
      userId: payment.userId,
      courseId: payment.courseId,
      progress: 0,
      paymentId: payment.id,
      currentUnlocks: unlockLessonsCount,
      completedLessons: 0
    });
    try {
      const user = await prisma27.user.findUnique({ where: { id: payment.userId } });
      const course = await course_repository_default.findById(payment.courseId);
      if (user && user.email && course?.title) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const courseUrl = `${frontendUrl}/user/courses/${payment.courseId}/content`;
        await email_service_default.sendCourseAccessGrantedNotification(
          user.email,
          user.fullName || user.username,
          course.title,
          courseUrl
        );
        console.log(`[SePay] Confirmation email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error("[SePay] Failed to send confirmation email:", emailError);
    }
    return {
      ...payment,
      paymentStatus: "completed",
      enrollment
    };
  }
  /**
   * Lấy danh sách payments của user
   */
  async getUserPayments(userId) {
    const payments = await payment_repository_default.findByUserId(userId);
    return payments.map((p) => ({
      id: p.id,
      courseId: p.courseId,
      courseName: p.course?.title || "",
      amount: p.amount,
      paymentStatus: p.paymentStatus,
      paymentMethod: p.paymentMethod,
      payosOrderId: p.payosOrderId,
      orderCode: p.payosOrderId,
      createdAt: p.createdAt,
      completedAt: p.completedAt
    }));
  }
  /**
   * Lấy thông tin payment
   */
  async getPayment(paymentId) {
    return payment_repository_default.findById(paymentId);
  }
  /**
   * Check payment status
   * Kết hợp DB status + PayOS API để lấy trạng thái thật
   */
  async checkPaymentStatus(paymentId) {
    const payment = await payment_repository_default.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.paymentStatus !== "pending") {
      return {
        id: payment.id,
        paymentStatus: payment.paymentStatus,
        status: payment.paymentStatus,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        payosOrderId: payment.payosOrderId,
        orderCode: payment.payosOrderId,
        courseId: payment.courseId,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt
      };
    }
    if (payment.paymentMethod === "payos" && payment.payosOrderId) {
      try {
        const payosData = await payos_default.paymentRequests.get(String(payment.payosOrderId));
        console.log(`[checkPaymentStatus] PayOS status for ${payment.payosOrderId}: ${payosData.status}`);
        if (payosData.status === "PAID") {
          await payment_repository_default.updateStatus(payment.id, "completed", {
            completedAt: /* @__PURE__ */ new Date(),
            payosTransactionId: payosData.transactions?.[0]?.reference
          });
          const existingEnrollment = await enrollment_repository_default.findByUserIdAndCourseId(
            payment.userId,
            payment.courseId
          );
          if (!existingEnrollment) {
            const courseInfo = await prisma27.course.findUnique({
              where: { id: payment.courseId },
              select: { unlockLessonsCount: true }
            });
            const unlockLessonsCount = courseInfo?.unlockLessonsCount ?? 3;
            await enrollment_repository_default.create({
              userId: payment.userId,
              courseId: payment.courseId,
              progress: 0,
              paymentId: payment.id,
              currentUnlocks: unlockLessonsCount,
              completedLessons: 0
            });
          }
          return {
            id: payment.id,
            paymentStatus: "completed",
            status: "completed",
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            payosOrderId: payment.payosOrderId,
            orderCode: payment.payosOrderId,
            courseId: payment.courseId,
            createdAt: payment.createdAt,
            completedAt: /* @__PURE__ */ new Date()
          };
        }
        return {
          id: payment.id,
          paymentStatus: payment.paymentStatus,
          status: payment.paymentStatus,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          payosOrderId: payment.payosOrderId,
          orderCode: payment.payosOrderId,
          courseId: payment.courseId,
          createdAt: payment.createdAt,
          completedAt: payment.completedAt
        };
      } catch (payosError) {
        console.error(`[checkPaymentStatus] PayOS API error for ${payment.payosOrderId}:`, payosError.message);
      }
    }
    return {
      id: payment.id,
      paymentStatus: payment.paymentStatus,
      status: payment.paymentStatus,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      payosOrderId: payment.payosOrderId,
      orderCode: payment.payosOrderId,
      courseId: payment.courseId,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt
    };
  }
  /**
   * Hủy payment
   */
  async cancelPayment(paymentId, userId) {
    const payment = await payment_repository_default.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.userId !== userId) {
      throw new Error("Unauthorized");
    }
    if (payment.paymentStatus !== "pending") {
      throw new Error("Cannot cancel completed payment");
    }
    return payment_repository_default.updateStatus(paymentId, "cancelled");
  }
  /**
   * Tạo activate code mới (cho admin)
   */
  async createActivateCode(courseId, createdBy) {
    const code = this.generateActivateCode();
    return activateCode_repository_default.create({
      code,
      courseId,
      createdBy,
      isUsed: false
    });
  }
  /**
   * Generate random activate code
   */
  generateActivateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "CF-";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  /**
   * Tạo PayOS payment link cho khóa học
   */
  async createPayOSPaymentLink(userId, courseId) {
    const course = await course_repository_default.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const existingEnrollment = await enrollment_repository_default.findByUserIdAndCourseId(userId, courseId);
    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }
    const pendingPayment = await payment_repository_default.findPendingByUserAndCourse(userId, courseId);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    let payment = pendingPayment;
    if (!pendingPayment) {
      payment = await payment_repository_default.create({
        userId,
        courseId,
        amount: course.price,
        paymentMethod: "payos",
        paymentStatus: "pending"
      });
    }
    if (!payment) {
      throw new Error("Failed to create or retrieve payment");
    }
    const orderCode = Number(String(Date.now()).slice(-9));
    await payment_repository_default.updatePayosOrderId(payment.id, String(orderCode));
    try {
      const payosBody = {
        orderCode,
        amount: Math.round(course.price),
        description: `Thanh toan CodeFit`,
        returnUrl: `${frontendUrl}/user/payment/success?paymentId=${payment.id}&courseId=${courseId}`,
        cancelUrl: `${frontendUrl}/user/payment/cancel?paymentId=${payment.id}&courseId=${courseId}`,
        items: [
          {
            name: course.title,
            quantity: 1,
            price: Math.round(course.price)
          }
        ]
      };
      const payosResponse = await payos_default.paymentRequests.create(payosBody);
      return {
        payment: {
          id: payment.id,
          amount: payment.amount,
          paymentStatus: payment.paymentStatus
        },
        checkoutUrl: payosResponse.checkoutUrl,
        qrCode: payosResponse.qrCode,
        accountNumber: payosResponse.accountNumber,
        accountName: payosResponse.accountName,
        orderCode: String(orderCode),
        payosOrderId: String(orderCode)
      };
    } catch (payosError) {
      console.error("[PayOS] createPaymentLink error:", payosError);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(JSON.stringify({
        paymentId: payment.id,
        orderCode: String(orderCode),
        amount: course.price,
        courseId
      }))}`;
      return {
        payment: {
          id: payment.id,
          amount: payment.amount,
          paymentStatus: payment.paymentStatus
        },
        checkoutUrl: null,
        qrCode: qrCodeUrl,
        accountNumber: null,
        accountName: null,
        orderCode: String(orderCode),
        payosOrderId: String(orderCode),
        isMock: true
      };
    }
  }
  /**
   * Xác nhận thanh toán PayOS thành công (từ webhook)
   */
  async confirmPayOSPayment(orderCode, transactionId) {
    const payment = await payment_repository_default.findByPayosOrderId(orderCode);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.paymentStatus === "completed") {
      return payment;
    }
    await payment_repository_default.updateStatus(payment.id, "completed", {
      completedAt: /* @__PURE__ */ new Date(),
      payosTransactionId: transactionId
    });
    const existingEnrollment = await enrollment_repository_default.findByUserIdAndCourseId(
      payment.userId,
      payment.courseId
    );
    if (!existingEnrollment) {
      const courseInfo = await prisma27.course.findUnique({
        where: { id: payment.courseId },
        select: { unlockLessonsCount: true }
      });
      const unlockLessonsCount = courseInfo?.unlockLessonsCount ?? 3;
      await enrollment_repository_default.create({
        userId: payment.userId,
        courseId: payment.courseId,
        progress: 0,
        paymentId: payment.id,
        currentUnlocks: unlockLessonsCount,
        completedLessons: 0
      });
    }
    try {
      const user = await prisma27.user.findUnique({ where: { id: payment.userId } });
      const course = await course_repository_default.findById(payment.courseId);
      if (user && user.email && course?.title) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const courseUrl = `${frontendUrl}/user/courses/${payment.courseId}/content`;
        await email_service_default.sendCourseAccessGrantedNotification(
          user.email,
          user.fullName || user.username,
          course.title,
          courseUrl
        );
        console.log(`[PayOS] Confirmation email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error("[PayOS] Failed to send confirmation email:", emailError);
    }
    return {
      ...payment,
      paymentStatus: "completed",
      completedAt: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Xác nhận thanh toán PayOS bằng paymentId (gọi từ frontend khi PayOS redirect về)
   * CHỈ xác nhận nếu PayOS API xác nhận đã thanh toán thành công
   */
  async confirmPayOSPaymentById(paymentId, userId) {
    const payment = await payment_repository_default.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.userId !== userId) {
      throw new Error("Unauthorized");
    }
    if (payment.paymentStatus === "completed") {
      return { ...payment, paymentStatus: "completed" };
    }
    let transactionId;
    let payosStatus;
    if (payment.payosOrderId) {
      try {
        const payosData = await payos_default.paymentRequests.get(String(payment.payosOrderId));
        payosStatus = payosData.status;
        transactionId = payosData.transactions?.[0]?.reference || void 0;
        console.log(`[confirmPayOSPaymentById] PayOS status for ${payment.payosOrderId}: ${payosStatus}`);
      } catch (payosError) {
        console.error(`[confirmPayOSPaymentById] PayOS API error:`, payosError.message);
        throw new Error("Kh\xF4ng th\u1EC3 x\xE1c minh thanh to\xE1n v\u1EDBi PayOS. Vui l\xF2ng th\u1EED l\u1EA1i sau.");
      }
    } else {
      throw new Error("Payment ch\u01B0a c\xF3 PayOS order ID");
    }
    if (payosStatus !== "PAID" && payosStatus !== "COMPLETED") {
      throw new Error(`Thanh to\xE1n ch\u01B0a ho\xE0n t\u1EA5t tr\xEAn PayOS (tr\u1EA1ng th\xE1i: ${payosStatus})`);
    }
    await payment_repository_default.updateStatus(payment.id, "completed", {
      completedAt: /* @__PURE__ */ new Date(),
      payosTransactionId: transactionId
    });
    const existingEnrollment = await enrollment_repository_default.findByUserIdAndCourseId(
      payment.userId,
      payment.courseId
    );
    if (!existingEnrollment) {
      const courseInfo = await prisma27.course.findUnique({
        where: { id: payment.courseId },
        select: { unlockLessonsCount: true }
      });
      const unlockLessonsCount = courseInfo?.unlockLessonsCount ?? 3;
      await enrollment_repository_default.create({
        userId: payment.userId,
        courseId: payment.courseId,
        progress: 0,
        paymentId: payment.id,
        currentUnlocks: unlockLessonsCount,
        completedLessons: 0
      });
    }
    try {
      const user = await prisma27.user.findUnique({ where: { id: payment.userId } });
      const course = await course_repository_default.findById(payment.courseId);
      if (user && user.email && course?.title) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const courseUrl = `${frontendUrl}/user/courses/${payment.courseId}/content`;
        await email_service_default.sendCourseAccessGrantedNotification(
          user.email,
          user.fullName || user.username,
          course.title,
          courseUrl
        );
      }
    } catch (emailError) {
      console.error("[confirmPayOSPaymentById] Failed to send email:", emailError);
    }
    return {
      ...payment,
      paymentStatus: "completed",
      completedAt: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Lấy trạng thái payment từ PayOS
   */
  async getPayOSPaymentStatus(orderCode) {
    try {
      const payosData = await payos_default.paymentRequests.get(orderCode);
      return {
        orderCode,
        status: payosData.status,
        amount: payosData.amount
      };
    } catch (payosError) {
      throw new Error(`PayOS status check failed: ${payosError.message}`);
    }
  }
  /**
   * Hủy PayOS payment link
   */
  async cancelPayOSPayment(paymentId, userId, reason) {
    console.log(`[CancelPayOS] paymentId=${paymentId}, userId=${userId}`);
    const payment = await payment_repository_default.findById(paymentId);
    console.log(`[CancelPayOS] DB result:`, payment ? `found, status=${payment.paymentStatus}, dbUserId=${payment.userId}` : "NOT FOUND");
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.userId !== userId) {
      throw new Error("Unauthorized");
    }
    if (payment.paymentStatus !== "pending") {
      throw new Error("Cannot cancel non-pending payment");
    }
    if (payment.payosOrderId) {
      try {
        await payos_default.paymentRequests.cancel(payment.payosOrderId, reason);
      } catch (payosError) {
        console.warn("[PayOS] cancelPaymentLink warning:", payosError?.message);
      }
    }
    return payment_repository_default.updateStatus(paymentId, "cancelled");
  }
};
var payment_service_default = new PaymentService();

// src/modules/payment/controllers/payment.controller.ts
var PaymentController = class extends BaseController {
  constructor() {
    super(payment_service_default);
  }
  /**
   * POST /payment/create - Tạo payment mới
   */
  createPayment = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId, paymentMethod } = req.body;
      if (!courseId) {
        this.error(res, "courseId is required", 400);
        return;
      }
      if (paymentMethod === "qr") {
        const result = await this.service.createSePayCheckout(userId, courseId);
        this.success(res, result, "Payment created successfully", 201);
      } else {
        this.error(res, "Direct payment requires activation code", 400);
      }
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : error.message.includes("Already") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * POST /payment/activate - Kích hoạt với mã code
   */
  activateWithCode = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { code, courseId } = req.body;
      if (!code) {
        this.error(res, "Activation code is required", 400);
        return;
      }
      const result = await this.service.activateWithCode(userId, code);
      this.success(res, result, "Course activated successfully", 201);
    } catch (error) {
      const status = error.message.includes("not found") || error.message.includes("Invalid") ? 404 : error.message.includes("already") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * GET /payment/my - Lấy danh sách payments của user
   */
  getMyPayments = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const payments = await this.service.getUserPayments(userId);
      this.success(res, payments, "Payments retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * GET /payment/:id - Lấy thông tin payment
   */
  getPayment = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const payment = await this.service.getPayment(id);
      if (!payment) {
        this.error(res, "Payment not found", 404);
        return;
      }
      this.success(res, payment, "Payment retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * GET /payment/:id/status - Check payment status
   */
  checkPaymentStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const status = await this.service.checkPaymentStatus(id);
      this.success(res, status, "Payment status retrieved successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * POST /payment/:id/cancel - Hủy payment
   */
  cancelPayment = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { id } = req.params;
      const result = await this.service.cancelPayment(id, userId);
      this.success(res, result, "Payment cancelled successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : error.message.includes("Unauthorized") ? 403 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * POST /payment/sepay/ipn - IPN (Instant Payment Notification) từ SePay
   * SePay sẽ gọi endpoint này khi có thanh toán thành công
   */
  sepayIpn = async (req, res, next) => {
    try {
      console.log("[SePay IPN] Received:", JSON.stringify(req.body, null, 2));
      const { order_invoice_number, amount, status, transaction_id } = req.body;
      if (status === "SUCCESS" || status === "success" || status === "PAID") {
        console.log("[SePay IPN] Payment success for order:", order_invoice_number);
        await this.service.confirmSePayPayment(order_invoice_number);
        console.log("[SePay IPN] Enrollment created successfully");
      }
      res.status(200).json({ received: true, message: "IPN processed" });
    } catch (error) {
      console.error("SePay IPN error:", error);
      res.status(200).json({ received: true, message: "Error logged" });
    }
  };
  /**
   * POST /payment/sepay/callback - Callback từ SePay (redirect URL)
   */
  sepayCallback = async (req, res, next) => {
    try {
      const { orderCode, status } = req.body;
      if (status === "success" || status === "PAID") {
        await this.service.confirmSePayPayment(orderCode.toString());
      }
      this.success(res, { received: true }, "Callback processed");
    } catch (error) {
      console.error("SePay callback error:", error);
      this.error(res, error.message, 500);
    }
  };
  /**
   * POST /payment/admin/create-code - Tạo activate code (admin only)
   */
  createActivateCode = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.roleName;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      if (userRole !== "admin") {
        this.error(res, "Admin access required", 403);
        return;
      }
      const { courseId } = req.body;
      if (!courseId) {
        this.error(res, "courseId is required", 400);
        return;
      }
      const result = await this.service.createActivateCode(courseId, userId);
      this.success(res, result, "Activate code created successfully", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * POST /payment/payos/create - Tạo PayOS payment link
   */
  createPayOSPaymentLink = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.body;
      if (!courseId) {
        this.error(res, "courseId is required", 400);
        return;
      }
      const result = await this.service.createPayOSPaymentLink(userId, courseId);
      this.success(res, result, "PayOS payment link created", 201);
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : error.message.includes("Already") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * POST /payment/payos/cancel - Hủy PayOS payment link
   */
  cancelPayOSPayment = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { paymentId, reason } = req.body;
      if (!paymentId) {
        this.error(res, "paymentId is required", 400);
        return;
      }
      const result = await this.service.cancelPayOSPayment(paymentId, userId, reason);
      this.success(res, result, "PayOS payment cancelled");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : error.message.includes("Unauthorized") ? 403 : error.message.includes("Cannot cancel") ? 400 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * POST /payment/payos/confirm - Xác nhận PayOS thanh toán thành công (khi PayOS redirect về returnUrl)
   * Frontend gọi API này khi nhận redirect từ PayOS với code=00 hoặc status=PAID
   */
  confirmPayOSPayment = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { paymentId } = req.body;
      if (!paymentId) {
        this.error(res, "paymentId is required", 400);
        return;
      }
      const result = await this.service.confirmPayOSPaymentById(paymentId, userId);
      this.success(res, result, "Payment confirmed successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : error.message.includes("Unauthorized") ? 403 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * POST /payment/payos/webhook - Webhook từ PayOS
   */
  payosWebhook = async (req, res, next) => {
    try {
      console.log("[PayOS Webhook] Received:", JSON.stringify(req.body, null, 2));
      const webhookData = await payos_default.webhooks.verify(req.body);
      console.log("[PayOS Webhook] Verified data:", JSON.stringify(webhookData, null, 2));
      const orderCode = String(webhookData.orderCode);
      await this.service.confirmPayOSPayment(
        orderCode,
        webhookData.transactionId || void 0
      );
      console.log("[PayOS Webhook] Payment confirmed for order:", orderCode);
      res.status(200).json({ error: 0, message: "Ok" });
    } catch (error) {
      console.error("[PayOS Webhook] Error:", error.message);
      res.status(200).json({ error: 0, message: "Webhook processed" });
    }
  };
};
var payment_controller_default = new PaymentController();

// src/modules/payment/routes/payment.routes.ts
var router21 = (0, import_express21.Router)();
router21.post(
  "/create",
  verifyToken,
  (req, res, next) => payment_controller_default.createPayment(req, res, next)
);
router21.post(
  "/activate",
  verifyToken,
  (req, res, next) => payment_controller_default.activateWithCode(req, res, next)
);
router21.get(
  "/my",
  verifyToken,
  (req, res, next) => payment_controller_default.getMyPayments(req, res, next)
);
router21.get(
  "/:id/status",
  verifyToken,
  (req, res, next) => payment_controller_default.checkPaymentStatus(req, res, next)
);
router21.post(
  "/:id/cancel",
  verifyToken,
  (req, res, next) => payment_controller_default.cancelPayment(req, res, next)
);
router21.get(
  "/:id",
  verifyToken,
  (req, res, next) => payment_controller_default.getPayment(req, res, next)
);
router21.post(
  "/sepay/ipn",
  (req, res, next) => payment_controller_default.sepayIpn(req, res, next)
);
router21.post(
  "/sepay/callback",
  (req, res, next) => payment_controller_default.sepayCallback(req, res, next)
);
router21.post(
  "/admin/create-code",
  verifyToken,
  (req, res, next) => payment_controller_default.createActivateCode(req, res, next)
);
router21.post(
  "/payos/create",
  verifyToken,
  (req, res, next) => payment_controller_default.createPayOSPaymentLink(req, res, next)
);
router21.post(
  "/payos/cancel-payment",
  verifyToken,
  (req, res, next) => payment_controller_default.cancelPayOSPayment(req, res, next)
);
router21.post(
  "/payos/webhook",
  (req, res, next) => payment_controller_default.payosWebhook(req, res, next)
);
router21.post(
  "/payos/confirm",
  verifyToken,
  (req, res, next) => payment_controller_default.confirmPayOSPayment(req, res, next)
);
var payment_routes_default = router21;

// src/modules/admin/routes/admin.routes.ts
var import_express22 = require("express");

// src/modules/admin/repositories/admin.repository.ts
var AdminRepository = class {
  // ============ Users ============
  async getAllUsers(role) {
    const where = {};
    if (role) {
      const roleRecord = await prisma_default.role.findFirst({
        where: { name: role }
      });
      if (roleRecord) {
        where.roleId = roleRecord.id;
      }
    }
    const users = await prisma_default.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: {
          select: { id: true, name: true }
        },
        avatar: true,
        school: true,
        isOnboarded: true,
        isActive: true,
        createdAt: true,
        lectureCourses: {
          select: {
            id: true,
            courseId: true
          }
        }
      }
    });
    return users.map((user) => ({
      ...user,
      _count: {
        enrollments: 0,
        submissions: 0,
        courses: user.lectureCourses?.length || 0
      }
    }));
  }
  async getUserById(id) {
    return prisma_default.user.findUnique({
      where: { id },
      include: {
        role: true,
        enrollments: { include: { course: true } },
        certificates: true,
        userStats: true,
        lectureCourses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                _count: { select: { enrollments: true } }
              }
            }
          }
        }
      }
    });
  }
  async updateUser(id, data) {
    return prisma_default.user.update({
      where: { id },
      data
    });
  }
  async deleteUser(id) {
    return prisma_default.user.delete({ where: { id } });
  }
  async countUsersByRole() {
    return prisma_default.user.groupBy({
      by: ["roleId"],
      _count: true
    });
  }
  // ============ Courses ============
  async getAllCourses() {
    return prisma_default.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { id: true, fullName: true, email: true } },
        _count: {
          select: {
            enrollments: true,
            phases: true
          }
        },
        phases: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                title: true,
                orderIndex: true
              }
            }
          }
        }
      }
    });
  }
  async getCourseById(id) {
    return prisma_default.course.findUnique({
      where: { id },
      include: {
        creator: true,
        phases: {
          include: {
            lessons: {
              include: {
                lessonContent: true
              }
            },
            minitests: {
              include: {
                questions: {
                  include: {
                    problem: true
                  }
                }
              }
            }
          },
          orderBy: { orderIndex: "asc" }
        },
        hackathons: {
          include: {
            problems: {
              include: { testcases: true }
            },
            _count: {
              select: { participants: true, submissions: true }
            }
          }
        },
        projects: {
          include: {
            submissions: {
              include: {
                user: { select: { id: true, fullName: true, email: true } }
              }
            }
          }
        },
        enrollments: true
      }
    });
  }
  async createCourse(data) {
    return prisma_default.course.create({ data });
  }
  async updateCourse(id, data) {
    return prisma_default.course.update({
      where: { id },
      data
    });
  }
  async deleteCourse(id) {
    return prisma_default.course.delete({ where: { id } });
  }
  async countCourses() {
    return prisma_default.course.count();
  }
  // ============ Payments ============
  async getAllPayments() {
    return prisma_default.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        course: { select: { id: true, title: true } }
      }
    });
  }
  async updatePaymentStatus(paymentId, status) {
    return prisma_default.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: status,
        completedAt: status === "completed" ? /* @__PURE__ */ new Date() : void 0
      },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        course: { select: { id: true, title: true } }
      }
    });
  }
  async findPaymentById(paymentId) {
    return prisma_default.payment.findUnique({
      where: { id: paymentId }
    });
  }
  async getPaymentStats() {
    const totalAmount = await prisma_default.payment.aggregate({
      where: { paymentStatus: "completed" },
      _sum: { amount: true }
    });
    const pendingCount = await prisma_default.payment.count({
      where: { paymentStatus: "pending" }
    });
    const completedCount = await prisma_default.payment.count({
      where: { paymentStatus: "completed" }
    });
    const byMethod = await prisma_default.payment.groupBy({
      by: ["paymentMethod", "paymentStatus"],
      _count: true,
      _sum: { amount: true }
    });
    const recentPayments = await prisma_default.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { title: true } }
      }
    });
    return {
      totalAmount: totalAmount._sum.amount || 0,
      pendingCount,
      completedCount,
      byMethod,
      recentPayments
    };
  }
  async getRevenueByMonth() {
    const payments = await prisma_default.payment.findMany({
      where: { paymentStatus: "completed" },
      select: {
        amount: true,
        completedAt: true
      }
    });
    const monthlyRevenue = {};
    payments.forEach((p) => {
      if (p.completedAt) {
        const month = `${p.completedAt.getFullYear()}-${String(p.completedAt.getMonth() + 1).padStart(2, "0")}`;
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + p.amount;
      }
    });
    return monthlyRevenue;
  }
  // ============ Activate Codes ============
  async getAllActivateCodes() {
    return prisma_default.activateCode.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true } }
      }
    });
  }
  async createActivateCode(data) {
    return prisma_default.activateCode.create({ data });
  }
  async deleteActivateCode(id) {
    return prisma_default.activateCode.delete({ where: { id } });
  }
  // ============ Dashboard Stats ============
  async getDashboardStats() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalLessons,
      totalMinitests,
      totalHackathons,
      paymentStats,
      usersByRole,
      recentUsers,
      activeHackathons,
      topSubmissions
    ] = await Promise.all([
      prisma_default.user.count(),
      prisma_default.course.count(),
      prisma_default.enrollment.count(),
      prisma_default.lesson.count(),
      prisma_default.minitest.count(),
      prisma_default.hackathon.count(),
      this.getPaymentStats(),
      prisma_default.user.groupBy({
        by: ["roleId"],
        _count: true
      }),
      prisma_default.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          fullName: true,
          avatar: true,
          role: { select: { name: true } },
          createdAt: true
        }
      }),
      prisma_default.hackathon.findMany({
        take: 5,
        orderBy: { startTime: "desc" },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          _count: { select: { participants: true, submissions: true } }
        }
      }),
      prisma_default.hackathonSubmission.findMany({
        take: 10,
        orderBy: { score: "desc" },
        select: {
          id: true,
          score: true,
          submittedAt: true,
          user: { select: { id: true, fullName: true, avatar: true } },
          hackathon: { select: { id: true, title: true } }
        }
      })
    ]);
    const roles = await prisma_default.role.findMany();
    const roleMap = roles.reduce((acc, role) => {
      acc[role.id] = role.name;
      return acc;
    }, {});
    const userStats = usersByRole.map((ur) => ({
      role: roleMap[ur.roleId] || "Unknown",
      count: ur._count
    }));
    const lectureCount = usersByRole.filter((ur) => roleMap[ur.roleId]?.toLowerCase() === "lecture").reduce((sum, ur) => sum + ur._count, 0);
    return {
      // Basic counts
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalLessons,
      totalMinitests,
      totalHackathons,
      lectureCount,
      // Payment stats
      ...paymentStats,
      // User stats by role
      userStats,
      // Recent users
      recentUsers: recentUsers.map((u) => ({
        ...u,
        roleName: u.role?.name || "Unknown"
      })),
      // Active hackathons
      activeHackathons: activeHackathons.map((h) => ({
        ...h,
        participantCount: h._count.participants,
        submissionCount: h._count.submissions
      })),
      // Top submissions (leaderboard)
      topSubmissions: topSubmissions.map((s) => ({
        id: s.id,
        score: s.score,
        submittedAt: s.submittedAt,
        user: s.user,
        hackathon: s.hackathon
      }))
    };
  }
  // ============ Enrollments ============
  async getAllEnrollments() {
    return prisma_default.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        course: { select: { id: true, title: true } },
        coach: { select: { id: true, fullName: true } }
      }
    });
  }
  // ============ Phases (Chương học) ============
  async getAllPhases() {
    return prisma_default.phase.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        course: { select: { id: true, title: true } },
        lessons: {
          orderBy: { orderIndex: "asc" }
        },
        minitests: {
          include: {
            questions: {
              include: {
                problem: true
              }
            }
          }
        },
        _count: {
          select: {
            lessons: true,
            minitests: true
          }
        }
      }
    });
  }
  async getPhasesByCourse(courseId) {
    return prisma_default.phase.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
      include: {
        lessons: {
          orderBy: { orderIndex: "asc" }
        },
        minitests: {
          include: {
            questions: true
          }
        },
        _count: {
          select: {
            lessons: true,
            minitests: true
          }
        }
      }
    });
  }
  async createPhase(data) {
    const maxOrder = await prisma_default.phase.aggregate({
      where: { courseId: data.courseId },
      _max: { orderIndex: true }
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    return prisma_default.phase.create({
      data: {
        ...data,
        orderIndex: data.orderIndex ?? orderIndex
      },
      include: {
        course: { select: { id: true, title: true } },
        lessons: true
      }
    });
  }
  async updatePhase(id, data) {
    return prisma_default.phase.update({
      where: { id },
      data,
      include: {
        course: { select: { id: true, title: true } },
        lessons: { orderBy: { orderIndex: "asc" } }
      }
    });
  }
  async deletePhase(id) {
    return prisma_default.phase.delete({ where: { id } });
  }
  // ============ Lessons (Bài học) ============
  async getAllLessons() {
    return prisma_default.lesson.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        }
      }
    });
  }
  async getLessonById(id) {
    return prisma_default.lesson.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        },
        _count: {
          select: {
            lessonProgress: true
          }
        }
      }
    });
  }
  async getLessonsByPhase(phaseId) {
    return prisma_default.lesson.findMany({
      where: { phaseId },
      orderBy: { orderIndex: "asc" }
    });
  }
  async createLesson(data) {
    const maxOrder = await prisma_default.lesson.aggregate({
      where: { phaseId: data.phaseId },
      _max: { orderIndex: true }
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    return prisma_default.lesson.create({
      data: {
        ...data,
        orderIndex: data.orderIndex ?? orderIndex
      },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        }
      }
    });
  }
  async updateLesson(id, data) {
    return prisma_default.lesson.update({
      where: { id },
      data,
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        }
      }
    });
  }
  async deleteLesson(id) {
    const lesson = await prisma_default.lesson.findUnique({
      where: { id },
      include: {
        phase: {
          select: {
            id: true,
            courseId: true
          }
        }
      }
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const phaseId = lesson.phase.id;
    const courseId = lesson.phase.courseId;
    const course = await prisma_default.course.findUnique({
      where: { id: courseId },
      select: { subscriptionType: true, price: true }
    });
    const isFreeCourse = course?.subscriptionType === "FREE" || course?.price === 0;
    await prisma_default.lesson.delete({ where: { id } });
    const remainingLessons = await prisma_default.lesson.count({
      where: { phaseId }
    });
    const maxUnlocks = isFreeCourse ? 999999 : remainingLessons;
    await prisma_default.enrollment.updateMany({
      where: {
        courseId,
        currentUnlocks: { gt: maxUnlocks }
      },
      data: {
        currentUnlocks: maxUnlocks
      }
    });
  }
  // ============ Testcases (cho bài học code) ============
  async getTestcasesByLesson(lessonId) {
    return [];
  }
  async createTestcase(data) {
    throw new Error("Testcase for lessons requires schema update. Please update the Prisma schema.");
  }
  async updateTestcase(id, data) {
    return prisma_default.testcase.update({
      where: { id },
      data
    });
  }
  async deleteTestcase(id) {
    return prisma_default.testcase.delete({ where: { id } });
  }
  // ============ Minitests (Admin) ============
  async getAllMinitests() {
    return prisma_default.minitest.findMany({
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        },
        questions: {
          include: {
            problem: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { id: "desc" }
    });
  }
  async getMinitestById(id) {
    return prisma_default.minitest.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        },
        questions: {
          include: {
            problem: {
              include: {
                testcases: true
              }
            }
          }
        }
      }
    });
  }
  async createMinitest(data) {
    const maxOrder = await prisma_default.minitest.aggregate({
      where: { phaseId: data.phaseId },
      _max: { orderIndex: true }
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
    const minitest = await prisma_default.minitest.create({
      data: {
        phaseId: data.phaseId,
        title: data.title,
        orderIndex
      }
    });
    if (data.questionIds && data.questionIds.length > 0) {
      await prisma_default.minitestQuestion.createMany({
        data: data.questionIds.map((problemId, index) => ({
          minitestId: minitest.id,
          problemId
        }))
      });
    }
    return this.getMinitestById(minitest.id);
  }
  async updateMinitest(id, data) {
    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (Object.keys(updateData).length > 0) {
      await prisma_default.minitest.update({
        where: { id },
        data: updateData
      });
    }
    if (data.questionIds !== void 0) {
      await prisma_default.minitestQuestion.deleteMany({ where: { minitestId: id } });
      if (data.questionIds.length > 0) {
        await prisma_default.minitestQuestion.createMany({
          data: data.questionIds.map((problemId, index) => ({
            minitestId: id,
            problemId,
            orderIndex: index
          }))
        });
      }
    }
    return this.getMinitestById(id);
  }
  async deleteMinitest(id) {
    return prisma_default.minitest.delete({ where: { id } });
  }
  // ============ Problems (Admin) ============
  async getAllProblems() {
    return prisma_default.problem.findMany({
      include: {
        testcases: true,
        _count: {
          select: {
            testcases: true
          }
        }
      },
      orderBy: { title: "asc" }
    });
  }
  async getProblemsByCourseId(courseId) {
    return prisma_default.problem.findMany({
      where: {
        minitestQuestions: {
          some: {
            minitest: {
              phase: { courseId }
            }
          }
        }
      },
      include: {
        testcases: true,
        _count: { select: { testcases: true } },
        minitestQuestions: {
          include: {
            minitest: {
              include: {
                phase: { select: { id: true, title: true, courseId: true } }
              }
            }
          }
        }
      },
      orderBy: { title: "asc" }
    });
  }
  async createProblem(data) {
    const { testcases, hackathonId, ...problemData } = data;
    const problem = await prisma_default.problem.create({
      data: {
        ...problemData,
        difficulty: problemData.difficulty || "EASY",
        hackathonId: hackathonId || null
      }
    });
    if (testcases && testcases.length > 0) {
      await prisma_default.testcase.createMany({
        data: testcases.map((tc, index) => ({
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isPublic: tc.isPublic ?? index < 2
        }))
      });
    }
    return prisma_default.problem.findUnique({
      where: { id: problem.id },
      include: { testcases: true }
    });
  }
  async updateProblem(id, data) {
    return prisma_default.problem.update({
      where: { id },
      data,
      include: { testcases: true }
    });
  }
  async addProblemToHackathon(problemId, hackathonId) {
    return prisma_default.problem.update({
      where: { id: problemId },
      data: { hackathonId },
      include: { testcases: true }
    });
  }
  async removeProblemFromHackathon(problemId) {
    return prisma_default.problem.update({
      where: { id: problemId },
      data: { hackathonId: null },
      include: { testcases: true }
    });
  }
  async deleteProblem(id) {
    return prisma_default.problem.delete({ where: { id } });
  }
  // ============ Lecture Course Assignment ============
  async getLectureCourses(lectureId) {
    return prisma_default.lectureCourse.findMany({
      where: { lectureId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            level: true,
            _count: { select: { enrollments: true } }
          }
        }
      },
      orderBy: { assignedAt: "desc" }
    });
  }
  async assignCourseToLecture(lectureId, courseId, assignedBy) {
    return prisma_default.lectureCourse.create({
      data: {
        lectureId,
        courseId,
        assignedBy
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });
  }
  async unassignCourseFromLecture(lectureId, courseId) {
    return prisma_default.lectureCourse.delete({
      where: {
        lectureId_courseId: {
          lectureId,
          courseId
        }
      }
    });
  }
  async isLectureAssignedToCourse(lectureId, courseId) {
    const result = await prisma_default.lectureCourse.findUnique({
      where: {
        lectureId_courseId: {
          lectureId,
          courseId
        }
      }
    });
    return !!result;
  }
  async getLecturesByCourse(courseId) {
    const lectureCourses = await prisma_default.lectureCourse.findMany({
      where: { courseId },
      include: {
        lecture: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: { assignedAt: "desc" }
    });
    return lectureCourses.map((lc) => lc.lecture);
  }
  // ============ Instructor Detail (Assignment Overview) ============
  async getInstructorDetail(lectureId) {
    try {
      const user = await prisma_default.user.findUnique({
        where: { id: lectureId },
        include: {
          role: true
        }
      });
      if (!user) {
        throw new Error("Instructor not found");
      }
      const lectureCourses = await prisma_default.lectureCourse.findMany({
        where: { lectureId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              level: true,
              _count: {
                select: {
                  enrollments: true,
                  phases: true
                }
              }
            }
          }
        },
        orderBy: { assignedAt: "desc" }
      });
      const lessonRequests = await prisma_default.lessonRequest.findMany({
        where: { lectureId },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      const totalLessons = lessonRequests.length;
      const completedLessons = lessonRequests.filter((lr) => lr.status === "SUBMITTED" || lr.status === "APPROVED").length;
      const inProgressLessons = lessonRequests.filter((lr) => lr.status === "IN_PROGRESS").length;
      const pendingLessons = lessonRequests.filter((lr) => lr.status === "PENDING").length;
      const minitestSubmissions = await prisma_default.minitestSubmission.findMany({
        where: { userId: lectureId },
        include: {
          minitest: {
            include: {
              phase: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      const hackathonParticipations = await prisma_default.hackathonParticipant.findMany({
        where: { userId: lectureId },
        include: {
          hackathon: true
        },
        orderBy: { joinedAt: "desc" }
      });
      const hackathonSubmissions = await prisma_default.hackathonSubmission.findMany({
        where: { userId: lectureId },
        include: {
          hackathon: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true
            }
          },
          problem: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { submittedAt: "desc" }
      });
      const courseProgress = lectureCourses.map((lc) => {
        const courseLessonRequests = lessonRequests.filter(
          (lr) => lr.lesson?.phase?.course?.id === lc.course.id
        );
        const completed = courseLessonRequests.filter(
          (lr) => lr.status === "SUBMITTED" || lr.status === "APPROVED"
        ).length;
        const total = courseLessonRequests.length;
        return {
          courseId: lc.course.id,
          courseTitle: lc.course.title,
          assignedAt: lc.assignedAt,
          totalLessons: total,
          completedLessons: completed,
          progress: total > 0 ? Math.round(completed / total * 100) : 0
        };
      });
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt
        },
        courses: lectureCourses.map((lc) => ({
          id: lc.id,
          courseId: lc.course.id,
          courseTitle: lc.course.title,
          courseLevel: lc.course.level,
          enrolledStudents: lc.course._count.enrollments,
          phasesCount: lc.course._count.phases,
          assignedAt: lc.assignedAt
        })),
        lessonRequests: lessonRequests.map((lr) => ({
          id: lr.id,
          status: lr.status,
          dueDate: lr.dueDate,
          notes: lr.notes,
          createdAt: lr.createdAt,
          updatedAt: lr.updatedAt,
          lesson: {
            id: lr.lesson.id,
            title: lr.lesson.title,
            type: lr.lesson.type,
            status: lr.lesson.status,
            courseId: lr.lesson.phase?.course?.id,
            courseTitle: lr.lesson.phase?.course?.title
          }
        })),
        minitests: minitestSubmissions.map((ms) => ({
          id: ms.id,
          score: ms.score,
          submittedAt: ms.createdAt,
          minitest: {
            id: ms.minitest.id,
            title: ms.minitest.title,
            courseId: ms.minitest.phase?.course?.id,
            courseTitle: ms.minitest.phase?.course?.title
          }
        })),
        hackathons: hackathonParticipations.map((hp) => ({
          id: hp.id,
          joinedAt: hp.joinedAt,
          hackathon: {
            id: hp.hackathon.id,
            title: hp.hackathon.title,
            startTime: hp.hackathon.startTime,
            endTime: hp.hackathon.endTime
          }
        })),
        hackathonSubmissions: hackathonSubmissions.map((hs) => ({
          id: hs.id,
          score: hs.score,
          submittedAt: hs.submittedAt,
          hackathon: {
            id: hs.hackathon.id,
            title: hs.hackathon.title
          },
          problem: {
            id: hs.problem.id,
            title: hs.problem.title
          }
        })),
        stats: {
          totalCourses: lectureCourses.length,
          totalLessons,
          completedLessons,
          inProgressLessons,
          pendingLessons,
          lessonCompletionRate: totalLessons > 0 ? Math.round(completedLessons / totalLessons * 100) : 0,
          totalMinitests: minitestSubmissions.length,
          avgMinitestScore: minitestSubmissions.length > 0 ? Math.round(minitestSubmissions.reduce((acc, ms) => acc + ms.score, 0) / minitestSubmissions.length) : 0,
          totalHackathons: hackathonParticipations.length,
          totalHackathonSubmissions: hackathonSubmissions.length
        },
        courseProgress
      };
    } catch (error) {
      console.error("Error in getInstructorDetail:", error);
      throw error;
    }
  }
  // ============ Hackathons / Final Tests (Admin) ============
  async getAllHackathons() {
    return prisma_default.hackathon.findMany({
      include: {
        course: {
          select: { id: true, title: true }
        },
        problems: {
          include: {
            testcases: true
          }
        },
        _count: {
          select: { participants: true, submissions: true }
        }
      },
      orderBy: { startTime: "desc" }
    });
  }
  async getHackathonById(id) {
    const hackathon = await prisma_default.hackathon.findUnique({
      where: { id },
      include: {
        course: true,
        problems: {
          include: {
            testcases: true
          }
        },
        participants: {
          include: { user: { select: { id: true, fullName: true, email: true } } }
        },
        submissions: {
          include: { user: { select: { id: true, fullName: true, email: true } } }
        }
      }
    });
    if (!hackathon) return null;
    const totalSubmissions = hackathon.submissions.length;
    const uniqueSubmitters = new Set(hackathon.submissions.map((s) => s.userId)).size;
    const avgScore = totalSubmissions > 0 ? hackathon.submissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions : 0;
    const submissionsByStatus = {
      pending: hackathon.submissions.filter((s) => s.status === "PENDING").length,
      graded: hackathon.submissions.filter((s) => s.status === "GRADED").length,
      rejected: hackathon.submissions.filter((s) => s.status === "REJECTED").length
    };
    const sevenDaysAgo = /* @__PURE__ */ new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const submissionsByDay = {};
    hackathon.submissions.filter((s) => new Date(s.submittedAt) >= sevenDaysAgo).forEach((s) => {
      const day = new Date(s.submittedAt).toISOString().split("T")[0];
      submissionsByDay[day] = (submissionsByDay[day] || 0) + 1;
    });
    const problemStats = hackathon.problems.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      submissionCount: hackathon.submissions.filter((s) => s.problemId === p.id).length,
      avgScore: (() => {
        const problemSubmissions = hackathon.submissions.filter((s) => s.problemId === p.id);
        return problemSubmissions.length > 0 ? problemSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / problemSubmissions.length : 0;
      })()
    }));
    return {
      ...hackathon,
      statistics: {
        totalSubmissions,
        uniqueSubmitters,
        avgScore: Math.round(avgScore * 100) / 100,
        submissionsByStatus,
        submissionsByDay,
        problemStats,
        participantCount: hackathon.participants.length,
        submissionCount: totalSubmissions
      }
    };
  }
  async createHackathon(data) {
    const { lessonIds, problems, ...hackathonData } = data;
    return prisma_default.hackathon.create({
      data: {
        ...hackathonData,
        courseId: data.courseId,
        lessonId: data.lessonId,
        title: data.title,
        description: data.description || "",
        startTime: data.startTime || /* @__PURE__ */ new Date(),
        endTime: data.endTime || new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3),
        durationMinutes: data.durationMinutes || 120,
        maxParticipants: data.maxParticipants || 100,
        imageUrl: data.imageUrl || null,
        // lessonIds will be added after Prisma regenerate
        // Create problems if provided
        ...problems && problems.length > 0 ? {
          problems: {
            create: problems.map((problem) => ({
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty || "MEDIUM",
              codeTemplate: problem.codeTemplate || null,
              inputFormat: problem.inputFormat || null,
              outputFormat: problem.outputFormat || null,
              testcases: problem.testcases && problem.testcases.length > 0 ? {
                create: problem.testcases.map((tc, index) => ({
                  input: tc.input,
                  expectedOutput: tc.expectedOutput,
                  isPublic: tc.isPublic ?? index < 2
                }))
              } : void 0
            }))
          }
        } : {}
      },
      include: {
        course: { select: { id: true, title: true } },
        problems: {
          include: {
            testcases: true
          }
        }
      }
    });
  }
  async updateHackathon(id, data) {
    return prisma_default.hackathon.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime ? new Date(data.startTime) : void 0,
        endTime: data.endTime ? new Date(data.endTime) : void 0,
        durationMinutes: data.durationMinutes,
        maxParticipants: data.maxParticipants,
        imageUrl: data.imageUrl
      },
      include: {
        course: { select: { id: true, title: true } }
      }
    });
  }
  async deleteHackathon(id) {
    return prisma_default.hackathon.delete({ where: { id } });
  }
  // ============ Projects / Final Projects (Admin) ============
  async getAllProjects() {
    return prisma_default.project.findMany({
      include: {
        course: {
          select: { id: true, title: true }
        },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { id: "desc" }
    });
  }
  async getProjectById(id) {
    return prisma_default.project.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: {
          include: {
            user: { select: { id: true, fullName: true, email: true } }
          },
          orderBy: { submittedAt: "desc" }
        }
      }
    });
  }
  async createProject(data) {
    return prisma_default.project.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        description: data.description || ""
      },
      include: {
        course: { select: { id: true, title: true } }
      }
    });
  }
  async updateProject(id, data) {
    return prisma_default.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        fileUrl: data.fileUrl
      },
      include: {
        course: { select: { id: true, title: true } },
        submissions: {
          include: {
            user: { select: { id: true, fullName: true, email: true } }
          }
        }
      }
    });
  }
  async deleteProject(id) {
    return prisma_default.project.delete({ where: { id } });
  }
  async approveProjectSubmission(submissionId) {
    return prisma_default.projectSubmission.update({
      where: { id: submissionId },
      data: { status: "approved" },
      include: {
        user: { select: { id: true, fullName: true, email: true } }
      }
    });
  }
  async rejectProjectSubmission(submissionId, reason) {
    return prisma_default.projectSubmission.update({
      where: { id: submissionId },
      data: {
        status: "rejected",
        reviewNote: reason
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } }
      }
    });
  }
  // ============ Lesson Requests (Admin duyệt) ============
  async getLessonRequestById(id) {
    return prisma_default.lessonRequest.findUnique({
      where: { id },
      include: {
        lecture: { select: { id: true, fullName: true, email: true } },
        lesson: {
          include: {
            phase: {
              include: {
                course: { select: { id: true, title: true } }
              }
            }
          }
        }
      }
    });
  }
  async getAllLessonRequests() {
    return prisma_default.lessonRequest.findMany({
      include: {
        lecture: { select: { id: true, fullName: true, email: true } },
        lesson: {
          include: {
            phase: {
              include: {
                course: { select: { id: true, title: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  async deleteLessonRequest(id) {
    return prisma_default.lessonRequest.delete({ where: { id } });
  }
  async approveLessonRequest(id) {
    return prisma_default.lessonRequest.update({
      where: { id },
      data: {
        status: "APPROVED"
      },
      include: {
        lesson: true,
        lecture: { select: { id: true, fullName: true, email: true } }
      }
    });
  }
  async rejectLessonRequest(id, reason) {
    return prisma_default.lessonRequest.update({
      where: { id },
      data: {
        status: "REJECTED"
      },
      include: {
        lesson: true,
        lecture: { select: { id: true, fullName: true, email: true } }
      }
    });
  }
  // ============ Minitest Submissions Stats (Admin) ============
  async getMinitestStats() {
    const minitests = await prisma_default.minitest.findMany({
      include: {
        phase: {
          include: {
            course: { select: { id: true, title: true } }
          }
        },
        questions: {
          select: { id: true }
        },
        submissions: {
          select: {
            id: true,
            score: true,
            userId: true,
            createdAt: true
          }
        }
      }
    });
    const stats = minitests.map((minitest) => {
      const totalSubmissions = minitest.submissions.length;
      const uniqueUsers = new Set(minitest.submissions.map((s) => s.userId)).size;
      const passedSubmissions = minitest.submissions.filter((s) => s.score >= 50).length;
      const completionRate = totalSubmissions > 0 ? Math.round(passedSubmissions / totalSubmissions * 100) : 0;
      const submissionsWithScores = minitest.submissions.filter((s) => s.score !== null && s.score !== void 0);
      const avgScore = submissionsWithScores.length > 0 ? Math.round(submissionsWithScores.reduce((sum, s) => sum + (s.score || 0), 0) / submissionsWithScores.length) : 0;
      return {
        id: minitest.id,
        title: minitest.title,
        phase: minitest.phase,
        questionCount: minitest.questions.length,
        totalSubmissions,
        uniqueUsers,
        passedSubmissions,
        completionRate,
        avgScore,
        recentSubmissions: minitest.submissions.slice(0, 5).map((s) => ({
          id: s.id,
          score: s.score,
          status: s.score >= 50 ? "PASSED" : "FAILED",
          submittedAt: s.createdAt
        }))
      };
    });
    return stats;
  }
  async getMinitestSubmissions(minitestId) {
    const submissions = await prisma_default.minitestSubmission.findMany({
      where: { minitestId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return submissions.map((s) => ({
      ...s,
      status: s.score >= 50 ? "PASSED" : "FAILED",
      submittedAt: s.createdAt
    }));
  }
};
var admin_repository_default = new AdminRepository();

// src/modules/admin/services/admin.service.ts
var AdminService = class {
  // ============ Dashboard ============
  async getDashboardStats() {
    return admin_repository_default.getDashboardStats();
  }
  // ============ Users ============
  async getAllUsers(role) {
    return admin_repository_default.getAllUsers(role);
  }
  async getUserById(id) {
    const user = await admin_repository_default.getUserById(id);
    if (user) {
      if (user.roleId && !user.role) {
        const role = await prisma_default.role.findUnique({
          where: { id: user.roleId }
        });
        return { ...user, role };
      }
    }
    return user;
  }
  async updateUser(id, data) {
    if (data.role) {
      const roleRecord = await prisma_default.role.findUnique({
        where: { name: data.role }
      });
      if (roleRecord) {
        data.roleId = roleRecord.id;
      }
      delete data.role;
    }
    return admin_repository_default.updateUser(id, data);
  }
  async deleteUser(id) {
    return admin_repository_default.deleteUser(id);
  }
  async countUsersByRole() {
    return admin_repository_default.countUsersByRole();
  }
  // ============ Courses ============
  async getAllCourses() {
    return admin_repository_default.getAllCourses();
  }
  async getCourseById(id) {
    return admin_repository_default.getCourseById(id);
  }
  async createCourse(data) {
    if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
      throw new Error("T\xEAn kh\xF3a h\u1ECDc kh\xF4ng \u0111\u01B0\u1EE3c tr\u1ED1ng");
    }
    if (data.price !== void 0 && (typeof data.price !== "number" || data.price < 0)) {
      throw new Error("Gi\xE1 kh\xF4ng \u0111\u01B0\u1EE3c \xE2m");
    }
    if (data.originalPrice !== void 0 && (typeof data.originalPrice !== "number" || data.originalPrice < 0)) {
      throw new Error("Gi\xE1 g\u1ED1c kh\xF4ng \u0111\u01B0\u1EE3c \xE2m");
    }
    if (data.subscriptionPrice !== void 0 && (typeof data.subscriptionPrice !== "number" || data.subscriptionPrice < 0)) {
      throw new Error("Gi\xE1 subscription kh\xF4ng \u0111\u01B0\u1EE3c \xE2m");
    }
    const validSubscriptionTypes = ["FREE", "PREMIUM", "BOTH"];
    if (data.subscriptionType && !validSubscriptionTypes.includes(data.subscriptionType)) {
      throw new Error("Lo\u1EA1i subscription kh\xF4ng h\u1EE3p l\u1EC7");
    }
    const { isFreeCourse, ...validData } = data;
    void isFreeCourse;
    return admin_repository_default.createCourse(validData);
  }
  async updateCourse(id, data) {
    if (data.title !== void 0 && (typeof data.title !== "string" || data.title.trim().length === 0)) {
      throw new Error("T\xEAn kh\xF3a h\u1ECDc kh\xF4ng \u0111\u01B0\u1EE3c tr\u1ED1ng");
    }
    if (data.price !== void 0 && (typeof data.price !== "number" || data.price < 0)) {
      throw new Error("Gi\xE1 kh\xF4ng \u0111\u01B0\u1EE3c \xE2m");
    }
    if (data.originalPrice !== void 0 && (typeof data.originalPrice !== "number" || data.originalPrice < 0)) {
      throw new Error("Gi\xE1 g\u1ED1c kh\xF4ng \u0111\u01B0\u1EE3c \xE2m");
    }
    if (data.subscriptionPrice !== void 0 && (typeof data.subscriptionPrice !== "number" || data.subscriptionPrice < 0)) {
      throw new Error("Gi\xE1 subscription kh\xF4ng \u0111\u01B0\u1EE3c \xE2m");
    }
    const validSubscriptionTypes = ["FREE", "PREMIUM", "BOTH"];
    if (data.subscriptionType && !validSubscriptionTypes.includes(data.subscriptionType)) {
      throw new Error("Lo\u1EA1i subscription kh\xF4ng h\u1EE3p l\u1EC7");
    }
    return admin_repository_default.updateCourse(id, data);
  }
  async deleteCourse(id) {
    return admin_repository_default.deleteCourse(id);
  }
  async countCourses() {
    return admin_repository_default.countCourses();
  }
  // ============ Payments ============
  async getAllPayments() {
    return admin_repository_default.getAllPayments();
  }
  async getPaymentStats() {
    return admin_repository_default.getPaymentStats();
  }
  async getRevenueByMonth() {
    return admin_repository_default.getRevenueByMonth();
  }
  async cancelPayment(paymentId) {
    const payment = await admin_repository_default.getAllPayments().then(
      () => admin_repository_default.findPaymentById(paymentId)
    );
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.paymentStatus !== "pending") {
      throw new Error("Only pending payments can be cancelled");
    }
    return admin_repository_default.updatePaymentStatus(paymentId, "failed");
  }
  // ============ Activate Codes ============
  async getAllActivateCodes() {
    return admin_repository_default.getAllActivateCodes();
  }
  async createActivateCode(courseId, createdBy) {
    const code = this.generateActivateCode();
    return admin_repository_default.createActivateCode({
      code,
      courseId,
      createdBy,
      isUsed: false
    });
  }
  async deleteActivateCode(id) {
    return admin_repository_default.deleteActivateCode(id);
  }
  generateActivateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "CF-";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  // ============ Enrollments ============
  async getAllEnrollments() {
    return admin_repository_default.getAllEnrollments();
  }
  // ============ Phases (Chương học) ============
  async getAllPhases() {
    return admin_repository_default.getAllPhases();
  }
  async getPhasesByCourse(courseId) {
    return admin_repository_default.getPhasesByCourse(courseId);
  }
  async createPhase(data) {
    return admin_repository_default.createPhase(data);
  }
  async updatePhase(id, data) {
    return admin_repository_default.updatePhase(id, data);
  }
  async deletePhase(id) {
    return admin_repository_default.deletePhase(id);
  }
  // ============ Lessons (Bài học) ============
  async getAllLessons() {
    return admin_repository_default.getAllLessons();
  }
  async getLessonById(id) {
    return admin_repository_default.getLessonById(id);
  }
  async getLessonsByPhase(phaseId) {
    return admin_repository_default.getLessonsByPhase(phaseId);
  }
  async createLesson(data) {
    return admin_repository_default.createLesson(data);
  }
  async updateLesson(id, data) {
    return admin_repository_default.updateLesson(id, data);
  }
  async deleteLesson(id) {
    return admin_repository_default.deleteLesson(id);
  }
  // ============ Testcases (cho bài học code) ============
  async getTestcasesByLesson(lessonId) {
    return admin_repository_default.getTestcasesByLesson(lessonId);
  }
  async createTestcase(data) {
    return admin_repository_default.createTestcase(data);
  }
  async updateTestcase(id, data) {
    return admin_repository_default.updateTestcase(id, data);
  }
  async deleteTestcase(id) {
    return admin_repository_default.deleteTestcase(id);
  }
  // ============ Lecture Course Assignment ============
  async getLectureCourses(lectureId) {
    return admin_repository_default.getLectureCourses(lectureId);
  }
  async assignCourseToLecture(lectureId, courseId, assignedBy) {
    const isAssigned = await admin_repository_default.isLectureAssignedToCourse(lectureId, courseId);
    if (isAssigned) {
      throw new Error("Lecture is already assigned to this course");
    }
    const course = await prisma_default.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new Error("Course not found");
    }
    const lecture = await prisma_default.user.findUnique({ where: { id: lectureId } });
    if (!lecture) {
      throw new Error("Lecture not found");
    }
    const lectureRole = await prisma_default.role.findUnique({ where: { id: lecture.roleId } });
    if (!lectureRole || lectureRole.name !== "lecture") {
      throw new Error("User is not a lecture");
    }
    const result = await admin_repository_default.assignCourseToLecture(lectureId, courseId, assignedBy);
    try {
      console.log("[ADMIN] Creating notification for lecture:", lectureId, "course:", course.title);
      const notification = await notification_service_default.createNotification({
        userId: lectureId,
        type: "course_assignment",
        title: "B\u1EA1n \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh gi\u1EA3ng d\u1EA1y kh\xF3a h\u1ECDc m\u1EDBi",
        message: `B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh gi\u1EA3ng d\u1EA1y kh\xF3a h\u1ECDc "${course.title}". Vui l\xF2ng ki\u1EC3m tra v\xE0 chu\u1EA9n b\u1ECB n\u1ED9i dung.`,
        metadata: {
          link: `/lecture/my-courses/${courseId}`,
          courseId,
          courseTitle: course.title
        }
      });
      console.log("[ADMIN] Notification created:", notification);
    } catch (err) {
      console.error("[ADMIN] Failed to send notification:", err);
    }
    return result;
  }
  async unassignCourseFromLecture(lectureId, courseId) {
    const isAssigned = await admin_repository_default.isLectureAssignedToCourse(lectureId, courseId);
    if (!isAssigned) {
      throw new Error("Lecture is not assigned to this course");
    }
    const course = await prisma_default.course.findUnique({ where: { id: courseId } });
    const result = await admin_repository_default.unassignCourseFromLecture(lectureId, courseId);
    if (course) {
      try {
        await notification_service_default.createNotification({
          userId: lectureId,
          type: "course_unassignment",
          title: "B\u1EA1n b\u1ECB g\u1EE1 kh\u1ECFi kh\xF3a h\u1ECDc",
          message: `B\u1EA1n \u0111\xE3 b\u1ECB g\u1EE1 kh\u1ECFi kh\xF3a h\u1ECDc "${course.title}". N\u1ED9i dung gi\u1EA3ng d\u1EA1y \u0111\xE3 \u0111\u01B0\u1EE3c chuy\u1EC3n cho gi\u1EA3ng vi\xEAn kh\xE1c.`
        });
      } catch (err) {
        console.error("Failed to send notification:", err);
      }
    }
    return result;
  }
  // ============ Instructor Detail (Assignment Overview) ============
  async getInstructorDetail(lectureId) {
    return admin_repository_default.getInstructorDetail(lectureId);
  }
  // ============ Get Lectures by Course ============
  async getLecturesByCourse(courseId) {
    return admin_repository_default.getLecturesByCourse(courseId);
  }
  // ============ Minitests (Admin) ============
  async getAllMinitests() {
    return admin_repository_default.getAllMinitests();
  }
  async getMinitestById(id) {
    return admin_repository_default.getMinitestById(id);
  }
  async createMinitest(data) {
    return admin_repository_default.createMinitest(data);
  }
  async updateMinitest(id, data) {
    return admin_repository_default.updateMinitest(id, data);
  }
  async deleteMinitest(id) {
    return admin_repository_default.deleteMinitest(id);
  }
  async getMinitestStats() {
    return admin_repository_default.getMinitestStats();
  }
  async getMinitestSubmissions(minitestId) {
    return admin_repository_default.getMinitestSubmissions(minitestId);
  }
  // ============ Problems (Admin) ============
  async getAllProblems() {
    return admin_repository_default.getAllProblems();
  }
  async getProblemsByCourseId(courseId) {
    return admin_repository_default.getProblemsByCourseId(courseId);
  }
  async createProblem(data) {
    return admin_repository_default.createProblem(data);
  }
  async updateProblem(id, data) {
    return admin_repository_default.updateProblem(id, data);
  }
  async addProblemToHackathon(problemId, hackathonId) {
    return admin_repository_default.addProblemToHackathon(problemId, hackathonId);
  }
  async removeProblemFromHackathon(problemId) {
    return admin_repository_default.removeProblemFromHackathon(problemId);
  }
  async deleteProblem(id) {
    return admin_repository_default.deleteProblem(id);
  }
  // ============ Hackathons / Final Tests (Admin) ============
  async getAllHackathons() {
    return admin_repository_default.getAllHackathons();
  }
  async getHackathonById(id) {
    return admin_repository_default.getHackathonById(id);
  }
  async createHackathon(data) {
    return admin_repository_default.createHackathon(data);
  }
  async updateHackathon(id, data) {
    return admin_repository_default.updateHackathon(id, data);
  }
  async deleteHackathon(id) {
    return admin_repository_default.deleteHackathon(id);
  }
  // ============ Projects / Final Projects (Admin) ============
  async getAllProjects() {
    return admin_repository_default.getAllProjects();
  }
  async getProjectById(id) {
    return admin_repository_default.getProjectById(id);
  }
  async createProject(data) {
    return admin_repository_default.createProject(data);
  }
  async updateProject(id, data) {
    return admin_repository_default.updateProject(id, data);
  }
  async deleteProject(id) {
    return admin_repository_default.deleteProject(id);
  }
  async approveProjectSubmission(submissionId) {
    return admin_repository_default.approveProjectSubmission(submissionId);
  }
  async rejectProjectSubmission(submissionId, reason) {
    return admin_repository_default.rejectProjectSubmission(submissionId, reason);
  }
  // ============ Lesson Requests (Admin duyệt) ============
  async getLessonRequestById(id) {
    return admin_repository_default.getLessonRequestById(id);
  }
  async getAllLessonRequests() {
    return admin_repository_default.getAllLessonRequests();
  }
  async deleteLessonRequest(id) {
    return admin_repository_default.deleteLessonRequest(id);
  }
  async approveLessonRequest(id) {
    return admin_repository_default.approveLessonRequest(id);
  }
  async rejectLessonRequest(id, reason) {
    return admin_repository_default.rejectLessonRequest(id, reason);
  }
};
var admin_service_default = new AdminService();

// src/modules/admin/controllers/admin.controller.ts
var AdminController = class {
  strParam(val) {
    return Array.isArray(val) ? val[0] : val || "";
  }
  // ============ Dashboard ============
  getDashboardStats = async (req, res, next) => {
    try {
      const stats = await admin_service_default.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };
  // ============ Users ============
  getAllUsers = async (req, res, next) => {
    try {
      const { role } = req.query;
      const roleStr = Array.isArray(role) ? role[0] : role;
      const users = await admin_service_default.getAllUsers(roleStr);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };
  getUserById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await admin_service_default.getUserById(id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };
  updateUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log("Update user request:", { id, body: req.body });
      const user = await admin_service_default.updateUser(id, req.body);
      console.log("Updated user:", user);
      res.json({ success: true, data: user, message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteUser(id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Courses ============
  getAllCourses = async (req, res, next) => {
    try {
      const courses = await admin_service_default.getAllCourses();
      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  };
  getCourseById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const course = await admin_service_default.getCourseById(id);
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }
      res.json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  };
  createCourse = async (req, res, next) => {
    try {
      const course = await admin_service_default.createCourse(req.body);
      res.status(201).json({ success: true, data: course, message: "Course created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateCourse = async (req, res, next) => {
    try {
      const id = req.params.id;
      const course = await admin_service_default.updateCourse(id, req.body);
      res.json({ success: true, data: course, message: "Course updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteCourse = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteCourse(id);
      res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Payments ============
  getAllPayments = async (req, res, next) => {
    try {
      const payments = await admin_service_default.getAllPayments();
      res.json({ success: true, data: payments });
    } catch (error) {
      next(error);
    }
  };
  getPaymentStats = async (req, res, next) => {
    try {
      const stats = await admin_service_default.getPaymentStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };
  getRevenueByMonth = async (req, res, next) => {
    try {
      const revenue = await admin_service_default.getRevenueByMonth();
      res.json({ success: true, data: revenue });
    } catch (error) {
      next(error);
    }
  };
  cancelPayment = async (req, res, next) => {
    try {
      const id = req.params.id;
      const payment = await admin_service_default.cancelPayment(id);
      res.json({ success: true, data: payment, message: "Payment cancelled successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Activate Codes ============
  getAllActivateCodes = async (req, res, next) => {
    try {
      const codes = await admin_service_default.getAllActivateCodes();
      res.json({ success: true, data: codes });
    } catch (error) {
      next(error);
    }
  };
  createActivateCode = async (req, res, next) => {
    try {
      const { courseId } = req.body;
      const createdBy = req.user?.userId;
      if (!courseId) {
        res.status(400).json({ success: false, message: "courseId is required" });
        return;
      }
      const code = await admin_service_default.createActivateCode(courseId, createdBy || "");
      res.status(201).json({ success: true, data: code, message: "Activate code created successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteActivateCode = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteActivateCode(id);
      res.json({ success: true, message: "Activate code deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Enrollments ============
  getAllEnrollments = async (req, res, next) => {
    try {
      const enrollments = await admin_service_default.getAllEnrollments();
      res.json({ success: true, data: enrollments });
    } catch (error) {
      next(error);
    }
  };
  // ============ Phases (Chương học) ============
  getAllPhases = async (req, res, next) => {
    try {
      const { courseId } = req.query;
      const courseIdStr = Array.isArray(courseId) ? courseId[0] : courseId;
      if (courseIdStr) {
        const phases = await admin_service_default.getPhasesByCourse(courseIdStr);
        res.json({ success: true, data: phases });
      } else {
        const phases = await admin_service_default.getAllPhases();
        res.json({ success: true, data: phases });
      }
    } catch (error) {
      next(error);
    }
  };
  getPhaseById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const phases = await admin_service_default.getPhasesByCourse(id);
      res.json({ success: true, data: phases });
    } catch (error) {
      next(error);
    }
  };
  createPhase = async (req, res, next) => {
    try {
      const { courseId, title } = req.body;
      if (!courseId || !title) {
        res.status(400).json({ success: false, message: "courseId and title are required" });
        return;
      }
      const phase = await admin_service_default.createPhase({ courseId, title });
      res.status(201).json({ success: true, data: phase, message: "Phase created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updatePhase = async (req, res, next) => {
    try {
      const id = req.params.id;
      const phase = await admin_service_default.updatePhase(id, req.body);
      res.json({ success: true, data: phase, message: "Phase updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deletePhase = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deletePhase(id);
      res.json({ success: true, message: "Phase deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Lessons (Bài học) ============
  getAllLessons = async (req, res, next) => {
    try {
      const { phaseId } = req.query;
      const phaseIdStr = Array.isArray(phaseId) ? phaseId[0] : phaseId;
      if (phaseIdStr) {
        const lessons = await admin_service_default.getLessonsByPhase(phaseIdStr);
        res.json({ success: true, data: lessons });
      } else {
        const lessons = await admin_service_default.getAllLessons();
        res.json({ success: true, data: lessons });
      }
    } catch (error) {
      next(error);
    }
  };
  getLessonById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const lesson = await admin_service_default.getLessonById(id);
      if (!lesson) {
        res.status(404).json({ success: false, message: "Lesson not found" });
        return;
      }
      res.json({ success: true, data: lesson });
    } catch (error) {
      next(error);
    }
  };
  createLesson = async (req, res, next) => {
    try {
      const { phaseId, title, content, type, orderIndex } = req.body;
      if (!phaseId || !title || !content) {
        res.status(400).json({ success: false, message: "phaseId, title, and content are required" });
        return;
      }
      const lesson = await admin_service_default.createLesson({ phaseId, title, content, type, orderIndex, isPublished: true });
      res.status(201).json({ success: true, data: lesson, message: "Lesson created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateLesson = async (req, res, next) => {
    try {
      const id = req.params.id;
      const lesson = await admin_service_default.updateLesson(id, req.body);
      res.json({ success: true, data: lesson, message: "Lesson updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteLesson = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteLesson(id);
      res.json({ success: true, message: "Lesson deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Testcases (cho bài học code) ============
  getTestcasesByLesson = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const testcases = await admin_service_default.getTestcasesByLesson(Array.isArray(lessonId) ? lessonId[0] : lessonId);
      res.json({ success: true, data: testcases });
    } catch (error) {
      next(error);
    }
  };
  createTestcase = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const { input, expectedOutput, isHidden, points } = req.body;
      if (!input || !expectedOutput) {
        res.status(400).json({ success: false, message: "input and expectedOutput are required" });
        return;
      }
      const testcase = await admin_service_default.createTestcase({
        lessonId,
        input,
        expectedOutput,
        isHidden: isHidden ?? false,
        points: points ?? 10
      });
      res.status(201).json({ success: true, data: testcase, message: "Testcase created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateTestcase = async (req, res, next) => {
    try {
      const id = req.params.id;
      const testcase = await admin_service_default.updateTestcase(id, req.body);
      res.json({ success: true, data: testcase, message: "Testcase updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteTestcase = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteTestcase(id);
      res.json({ success: true, message: "Testcase deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Lecture Course Assignment ============
  getLectureCourses = async (req, res, next) => {
    try {
      const { lectureId } = req.params;
      const courses = await admin_service_default.getLectureCourses(Array.isArray(lectureId) ? lectureId[0] : lectureId);
      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  };
  assignCourseToLecture = async (req, res, next) => {
    try {
      const { lectureId, courseId } = req.params;
      const assignedBy = req.user?.userId;
      console.log("[ADMIN CONTROLLER] assignCourseToLecture called:", { lectureId, courseId, assignedBy });
      const result = await admin_service_default.assignCourseToLecture(
        Array.isArray(lectureId) ? lectureId[0] : lectureId,
        Array.isArray(courseId) ? courseId[0] : courseId,
        assignedBy
      );
      res.status(201).json({ success: true, data: result, message: "Course assigned to lecture successfully" });
    } catch (error) {
      next(error);
    }
  };
  unassignCourseFromLecture = async (req, res, next) => {
    try {
      const { lectureId, courseId } = req.params;
      await admin_service_default.unassignCourseFromLecture(
        Array.isArray(lectureId) ? lectureId[0] : lectureId,
        Array.isArray(courseId) ? courseId[0] : courseId
      );
      res.json({ success: true, message: "Course unassigned from lecture successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Instructor Detail (Assignment Overview) ============
  getInstructorDetail = async (req, res, next) => {
    try {
      const { lectureId } = req.params;
      const detail = await admin_service_default.getInstructorDetail(Array.isArray(lectureId) ? lectureId[0] : lectureId);
      res.json({ success: true, data: detail });
    } catch (error) {
      if (error.message === "Instructor not found") {
        res.status(404).json({ success: false, message: "Instructor not found" });
        return;
      }
      next(error);
    }
  };
  // ============ Get Lectures by Course ============
  getLecturesByCourse = async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const lectures = await admin_service_default.getLecturesByCourse(courseId);
      res.json({ success: true, data: lectures });
    } catch (error) {
      next(error);
    }
  };
  // ============ Minitests (Admin) ============
  getAllMinitests = async (req, res, next) => {
    try {
      const minitests = await admin_service_default.getAllMinitests();
      res.json({ success: true, data: minitests });
    } catch (error) {
      next(error);
    }
  };
  getMinitestById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const minitest = await admin_service_default.getMinitestById(id);
      if (!minitest) {
        res.status(404).json({ success: false, message: "Minitest not found" });
        return;
      }
      res.json({ success: true, data: minitest });
    } catch (error) {
      next(error);
    }
  };
  createMinitest = async (req, res, next) => {
    try {
      const { phaseId, title, questionIds } = req.body;
      if (!phaseId || !title) {
        res.status(400).json({ success: false, message: "phaseId and title are required" });
        return;
      }
      const minitest = await admin_service_default.createMinitest({ phaseId, title, questionIds });
      res.status(201).json({ success: true, data: minitest, message: "Minitest created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateMinitest = async (req, res, next) => {
    try {
      const id = req.params.id;
      const minitest = await admin_service_default.updateMinitest(id, req.body);
      res.json({ success: true, data: minitest, message: "Minitest updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteMinitest = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteMinitest(id);
      res.json({ success: true, message: "Minitest deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Minitest Stats (Admin) ============
  getMinitestStats = async (req, res, next) => {
    try {
      const stats = await admin_service_default.getMinitestStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };
  getMinitestSubmissions = async (req, res, next) => {
    try {
      const { minitestId } = req.params;
      const submissions = await admin_service_default.getMinitestSubmissions(Array.isArray(minitestId) ? minitestId[0] : minitestId);
      res.json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  };
  // ============ Problems (Admin) ============
  getAllProblems = async (req, res, next) => {
    try {
      const problems = await admin_service_default.getAllProblems();
      res.json({ success: true, data: problems });
    } catch (error) {
      next(error);
    }
  };
  getProblemsByCourseId = async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      if (!courseId) {
        res.status(400).json({ success: false, message: "courseId is required" });
        return;
      }
      const problems = await admin_service_default.getProblemsByCourseId(courseId);
      res.json({ success: true, data: problems });
    } catch (error) {
      next(error);
    }
  };
  createProblem = async (req, res, next) => {
    try {
      const { title, description, difficulty, testcases, hackathonId } = req.body;
      if (!title || !description) {
        res.status(400).json({ success: false, message: "title and description are required" });
        return;
      }
      const problem = await admin_service_default.createProblem({ title, description, difficulty, testcases, hackathonId });
      res.status(201).json({ success: true, data: problem, message: "Problem created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateProblem = async (req, res, next) => {
    try {
      const id = req.params.id;
      const problem = await admin_service_default.updateProblem(id, req.body);
      res.json({ success: true, data: problem, message: "Problem updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteProblem = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteProblem(id);
      res.json({ success: true, message: "Problem deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  addProblemToHackathon = async (req, res, next) => {
    try {
      const { problemId } = req.body;
      const { hackathonId } = req.params;
      if (!problemId || !hackathonId) {
        res.status(400).json({ success: false, message: "problemId and hackathonId are required" });
        return;
      }
      const problem = await admin_service_default.addProblemToHackathon(
        problemId,
        Array.isArray(hackathonId) ? hackathonId[0] : hackathonId
      );
      res.json({ success: true, data: problem, message: "Problem added to hackathon successfully" });
    } catch (error) {
      next(error);
    }
  };
  removeProblemFromHackathon = async (req, res, next) => {
    try {
      const { problemId } = req.params;
      const problem = await admin_service_default.removeProblemFromHackathon(Array.isArray(problemId) ? problemId[0] : problemId);
      res.json({ success: true, data: problem, message: "Problem removed from hackathon successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Hackathons / Final Tests (Admin) ============
  getAllHackathons = async (req, res, next) => {
    try {
      const hackathons = await admin_service_default.getAllHackathons();
      res.json({ success: true, data: hackathons });
    } catch (error) {
      next(error);
    }
  };
  getHackathonById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const hackathon = await admin_service_default.getHackathonById(id);
      if (!hackathon) {
        res.status(404).json({ success: false, message: "Hackathon not found" });
        return;
      }
      res.json({ success: true, data: hackathon });
    } catch (error) {
      next(error);
    }
  };
  createHackathon = async (req, res, next) => {
    try {
      const { courseId, lessonId, title, description, startTime, endTime, durationMinutes, maxParticipants, imageUrl, lessonIds, problems } = req.body;
      if (!title) {
        res.status(400).json({ success: false, message: "title is required" });
        return;
      }
      const hackathon = await admin_service_default.createHackathon({
        courseId,
        lessonId,
        title,
        description: description || "",
        startTime: startTime ? new Date(startTime) : /* @__PURE__ */ new Date(),
        endTime: endTime ? new Date(endTime) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3),
        durationMinutes: durationMinutes || 120,
        maxParticipants: maxParticipants || 100,
        imageUrl: imageUrl || null,
        lessonIds: lessonIds || [],
        problems: problems || []
      });
      res.status(201).json({ success: true, data: hackathon, message: "Hackathon created successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateHackathon = async (req, res, next) => {
    try {
      const id = req.params.id;
      const hackathon = await admin_service_default.updateHackathon(id, req.body);
      res.json({ success: true, data: hackathon, message: "Hackathon updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteHackathon = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteHackathon(id);
      res.json({ success: true, message: "Hackathon deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Projects / Final Projects (Admin) ============
  getAllProjects = async (req, res, next) => {
    try {
      const projects = await admin_service_default.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  };
  getProjectById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const project = await admin_service_default.getProjectById(id);
      if (!project) {
        res.status(404).json({ success: false, message: "Project not found" });
        return;
      }
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  };
  createProject = async (req, res, next) => {
    try {
      const { courseId, title, description } = req.body;
      if (!courseId || !title) {
        res.status(400).json({ success: false, message: "courseId and title are required" });
        return;
      }
      const project = await admin_service_default.createProject({
        courseId,
        title,
        description: description || ""
      });
      res.status(201).json({ success: true, data: project, message: "Project created successfully" });
    } catch (error) {
      if (error.message && error.message.includes("Foreign key constraint")) {
        res.status(400).json({ success: false, message: "Kh\xF3a h\u1ECDc kh\xF4ng t\u1ED3n t\u1EA1i. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i courseId." });
        return;
      }
      next(error);
    }
  };
  updateProject = async (req, res, next) => {
    try {
      const id = req.params.id;
      const project = await admin_service_default.updateProject(id, req.body);
      res.json({ success: true, data: project, message: "Project updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  deleteProject = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteProject(id);
      res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  approveProjectSubmission = async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await admin_service_default.approveProjectSubmission(id);
      res.json({ success: true, data: result, message: "Project submission approved" });
    } catch (error) {
      next(error);
    }
  };
  rejectProjectSubmission = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { reason } = req.body;
      const result = await admin_service_default.rejectProjectSubmission(id, reason);
      res.json({ success: true, data: result, message: "Project submission rejected" });
    } catch (error) {
      next(error);
    }
  };
  // ============ Lesson Requests (Admin duyệt) ============
  getLessonRequestById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await admin_service_default.getLessonRequestById(id);
      if (!data) {
        res.status(404).json({ success: false, message: "Kh\xF4ng t\xECm th\u1EA5y y\xEAu c\u1EA7u" });
        return;
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
  getAllLessonRequests = async (req, res, next) => {
    try {
      const requests = await admin_service_default.getAllLessonRequests();
      res.json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  };
  deleteLessonRequest = async (req, res, next) => {
    try {
      const id = req.params.id;
      await admin_service_default.deleteLessonRequest(id);
      res.json({ success: true, message: "\u0110\xE3 x\xF3a y\xEAu c\u1EA7u" });
    } catch (error) {
      next(error);
    }
  };
  approveLessonRequest = async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await admin_service_default.approveLessonRequest(id);
      res.json({ success: true, data: result, message: "Lesson request approved successfully" });
    } catch (error) {
      next(error);
    }
  };
  rejectLessonRequest = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { reason } = req.body;
      const result = await admin_service_default.rejectLessonRequest(id, reason);
      res.json({ success: true, data: result, message: "Lesson request rejected" });
    } catch (error) {
      next(error);
    }
  };
};
var admin_controller_default = new AdminController();

// src/modules/admin/routes/admin.routes.ts
var router22 = (0, import_express22.Router)();
router22.use(verifyToken);
router22.use(requireAdmin);
router22.get("/dashboard/stats", admin_controller_default.getDashboardStats);
router22.get("/users", admin_controller_default.getAllUsers);
router22.get("/users/:id", admin_controller_default.getUserById);
router22.put("/users/:id", admin_controller_default.updateUser);
router22.delete("/users/:id", admin_controller_default.deleteUser);
router22.get("/lectures/:lectureId/courses", admin_controller_default.getLectureCourses);
router22.post("/lectures/:lectureId/courses/:courseId", admin_controller_default.assignCourseToLecture);
router22.delete("/lectures/:lectureId/courses/:courseId", admin_controller_default.unassignCourseFromLecture);
router22.get("/courses/:courseId/lectures", admin_controller_default.getLecturesByCourse);
router22.get("/lectures/:lectureId/detail", admin_controller_default.getInstructorDetail);
router22.get("/courses", admin_controller_default.getAllCourses);
router22.get("/courses/:id", admin_controller_default.getCourseById);
router22.post("/courses", admin_controller_default.createCourse);
router22.put("/courses/:id", admin_controller_default.updateCourse);
router22.delete("/courses/:id", admin_controller_default.deleteCourse);
router22.get("/payments", admin_controller_default.getAllPayments);
router22.get("/payments/stats", admin_controller_default.getPaymentStats);
router22.get("/payments/revenue", admin_controller_default.getRevenueByMonth);
router22.patch("/payments/:id/cancel", admin_controller_default.cancelPayment);
router22.get("/activate-codes", admin_controller_default.getAllActivateCodes);
router22.post("/activate-codes", admin_controller_default.createActivateCode);
router22.delete("/activate-codes/:id", admin_controller_default.deleteActivateCode);
router22.get("/enrollments", admin_controller_default.getAllEnrollments);
router22.get("/phases", admin_controller_default.getAllPhases);
router22.get("/phases/:id", admin_controller_default.getPhaseById);
router22.post("/phases", admin_controller_default.createPhase);
router22.put("/phases/:id", admin_controller_default.updatePhase);
router22.delete("/phases/:id", admin_controller_default.deletePhase);
router22.get("/lessons", admin_controller_default.getAllLessons);
router22.get("/lessons/:id", admin_controller_default.getLessonById);
router22.post("/lessons", admin_controller_default.createLesson);
router22.put("/lessons/:id", admin_controller_default.updateLesson);
router22.delete("/lessons/:id", admin_controller_default.deleteLesson);
router22.get("/lessons/:lessonId/testcases", admin_controller_default.getTestcasesByLesson);
router22.post("/lessons/:lessonId/testcases", admin_controller_default.createTestcase);
router22.put("/testcases/:id", admin_controller_default.updateTestcase);
router22.delete("/testcases/:id", admin_controller_default.deleteTestcase);
router22.get("/minitests/stats", admin_controller_default.getMinitestStats);
router22.get("/minitests", admin_controller_default.getAllMinitests);
router22.get("/minitests/:id", admin_controller_default.getMinitestById);
router22.get("/minitests/:minitestId/submissions", admin_controller_default.getMinitestSubmissions);
router22.post("/minitests", admin_controller_default.createMinitest);
router22.put("/minitests/:id", admin_controller_default.updateMinitest);
router22.delete("/minitests/:id", admin_controller_default.deleteMinitest);
router22.get("/problems", admin_controller_default.getAllProblems);
router22.get("/courses/:courseId/problems", admin_controller_default.getProblemsByCourseId);
router22.post("/problems", admin_controller_default.createProblem);
router22.put("/problems/:id", admin_controller_default.updateProblem);
router22.delete("/problems/:id", admin_controller_default.deleteProblem);
router22.post("/hackathons/:hackathonId/problems", admin_controller_default.addProblemToHackathon);
router22.delete("/hackathons/:hackathonId/problems/:problemId", admin_controller_default.removeProblemFromHackathon);
router22.get("/hackathons", admin_controller_default.getAllHackathons);
router22.get("/hackathons/:id", admin_controller_default.getHackathonById);
router22.post("/hackathons", admin_controller_default.createHackathon);
router22.put("/hackathons/:id", admin_controller_default.updateHackathon);
router22.delete("/hackathons/:id", admin_controller_default.deleteHackathon);
router22.get("/projects", admin_controller_default.getAllProjects);
router22.get("/projects/:id", admin_controller_default.getProjectById);
router22.post("/projects", admin_controller_default.createProject);
router22.put("/projects/:id", admin_controller_default.updateProject);
router22.delete("/projects/:id", admin_controller_default.deleteProject);
router22.put("/projects/:id/approve", admin_controller_default.approveProjectSubmission);
router22.put("/projects/:id/reject", admin_controller_default.rejectProjectSubmission);
router22.get("/lesson-requests", admin_controller_default.getAllLessonRequests);
router22.get("/lesson-requests/:id", admin_controller_default.getLessonRequestById);
router22.delete("/lesson-requests/:id", admin_controller_default.deleteLessonRequest);
router22.put("/lesson-requests/:id/approve", admin_controller_default.approveLessonRequest);
router22.put("/lesson-requests/:id/reject", admin_controller_default.rejectLessonRequest);
var admin_routes_default = router22;

// src/modules/lecture/routes/lecture.routes.ts
var import_express23 = require("express");

// src/modules/lecture/repositories/lecture.repository.ts
var import_client28 = require("@prisma/client");
var prisma28 = new import_client28.PrismaClient();
var LectureRepository = class {
  /**
   * Lấy danh sách khóa học của một giảng viên (creator)
   * @param lectureId - ID của giảng viên (user có role = 'lecture')
   * @returns Promise chứa danh sách khóa học với thông tin thống kê
   */
  async findCoursesByLectureId(lectureId) {
    const lectureCourses = await prisma28.lectureCourse.findMany({
      where: { lectureId },
      include: {
        course: {
          include: {
            enrollments: {
              select: {
                id: true,
                userId: true,
                progress: true
              }
            },
            phases: {
              orderBy: { orderIndex: "asc" },
              include: {
                lessons: {
                  select: {
                    id: true
                  }
                },
                minitests: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { assignedAt: "desc" }
    });
    return lectureCourses.map((lc) => ({
      ...lc.course,
      assignedAt: lc.assignedAt,
      totalStudents: lc.course.enrollments.length,
      totalLessons: lc.course.phases.reduce((sum, phase) => sum + phase.lessons.length, 0),
      phases: lc.course.phases.map((phase) => ({
        ...phase,
        totalLessons: phase.lessons.length,
        totalMinitests: phase.minitests.length
      }))
    }));
  }
  /**
   * Lấy chi tiết một khóa học của giảng viên kèm theo phases và lessons
   * @param courseId - ID của khóa học
   * @param lectureId - ID của giảng viên (để verify quyền sở hữu)
   * @returns Promise chứa khóa học với cấu trúc chi tiết
   */
  async findCourseDetailWithPhases(courseId, lectureId) {
    const lectureCourse = await prisma28.lectureCourse.findFirst({
      where: {
        courseId,
        lectureId
      }
    });
    if (!lectureCourse) return null;
    const course = await prisma28.course.findUnique({
      where: {
        id: courseId
      },
      include: {
        enrollments: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                fullName: true
              }
            },
            progress: true,
            createdAt: true
          }
        },
        phases: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                title: true,
                type: true,
                orderIndex: true
              }
            },
            minitests: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });
    if (!course) return null;
    return {
      ...course,
      totalStudents: course.enrollments.length,
      totalLessons: course.phases.reduce((sum, phase) => sum + phase.lessons.length, 0)
    };
  }
  /**
   * Lấy danh sách minitests trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách minitests với thông tin khóa học
   */
  async findMinitestsByLectureId(lectureId) {
    const courses = await prisma28.course.findMany({
      where: { creatorId: lectureId },
      select: { id: true, title: true }
    });
    const courseIds = courses.map((c) => c.id);
    const courseMap = new Map(courses.map((c) => [c.id, c.title]));
    if (courseIds.length === 0) return [];
    const phases = await prisma28.phase.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true, courseId: true }
    });
    const phaseIds = phases.map((p) => p.id);
    const phaseCourseMap = new Map(phases.map((p) => [p.id, p.courseId]));
    if (phaseIds.length === 0) return [];
    const minitests = await prisma28.minitest.findMany({
      where: { phaseId: { in: phaseIds } },
      orderBy: { orderIndex: "asc" }
    });
    const minitestIds = minitests.map((m) => m.id);
    const submissions = await prisma28.minitestSubmission.findMany({
      where: { minitestId: { in: minitestIds } },
      select: {
        minitestId: true,
        score: true
      }
    });
    const submissionsByMinitest = /* @__PURE__ */ new Map();
    submissions.forEach((sub) => {
      const existing = submissionsByMinitest.get(sub.minitestId) || [];
      existing.push(sub);
      submissionsByMinitest.set(sub.minitestId, existing);
    });
    return minitests.map((minitest) => {
      const phaseId = minitest.phaseId;
      const courseId = phaseCourseMap.get(phaseId) || "";
      const courseName = courseMap.get(courseId) || "Unknown";
      const minitestSubmissions = submissionsByMinitest.get(minitest.id) || [];
      const totalAttempts = minitestSubmissions.length;
      const avgScore = totalAttempts > 0 ? Math.round(minitestSubmissions.reduce((sum, s) => sum + s.score, 0) / totalAttempts) : 0;
      return {
        id: minitest.id,
        title: minitest.title,
        courseName,
        totalAttempts,
        avgScore
      };
    });
  }
  /**
   * Lấy danh sách hackathons trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách hackathons với thông tin thống kê
   */
  async findHackathonsByLectureId(lectureId) {
    const hackathons = await prisma28.hackathon.findMany({
      orderBy: { startTime: "desc" },
      take: 20,
      include: {
        participants: {
          select: {
            id: true
          }
        },
        submissions: {
          select: {
            id: true,
            score: true
          }
        }
      }
    });
    return hackathons.map((hackathon) => {
      const isUpcoming = new Date(hackathon.startTime) > /* @__PURE__ */ new Date();
      const isOngoing = new Date(hackathon.startTime) <= /* @__PURE__ */ new Date() && new Date(hackathon.endTime) >= /* @__PURE__ */ new Date();
      let status = "ended";
      if (isUpcoming) status = "upcoming";
      else if (isOngoing) status = "ongoing";
      const avgScore = hackathon.submissions.length > 0 ? Math.round(hackathon.submissions.reduce((sum, s) => sum + s.score, 0) / hackathon.submissions.length) : 0;
      return {
        id: hackathon.id,
        title: hackathon.title,
        description: hackathon.description,
        startTime: hackathon.startTime,
        endTime: hackathon.endTime,
        status,
        totalTeams: hackathon.participants.length,
        avgScore
      };
    });
  }
  /**
   * Lấy thống kê dashboard cho giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa các số liệu thống kê tổng quan
   */
  async getDashboardStats(lectureId) {
    const totalCourses = await prisma28.course.count({
      where: { creatorId: lectureId }
    });
    const enrollments = await prisma28.enrollment.findMany({
      where: {
        course: { creatorId: lectureId }
      },
      select: { userId: true },
      distinct: ["userId"]
    });
    const totalStudents = enrollments.length;
    const totalLessons = await prisma28.lesson.count({
      where: {
        phase: {
          course: {
            creatorId: lectureId
          }
        }
      }
    });
    const totalMinitests = await prisma28.minitest.count({
      where: {
        phase: {
          course: {
            creatorId: lectureId
          }
        }
      }
    });
    return {
      totalCourses,
      totalStudents,
      totalLessons,
      totalMinitests
    };
  }
};
var lecture_repository_default = new LectureRepository();

// src/modules/lecture/services/lecture.service.ts
var LectureService = class extends BaseService {
  constructor() {
    super(lecture_repository_default);
  }
  /**
   * Lấy dashboard stats cho giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa các số liệu thống kê tổng quan
   */
  async getDashboardStats(lectureId) {
    const stats = await lecture_repository_default.getDashboardStats(lectureId);
    return stats;
  }
  /**
   * Lấy danh sách khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách khóa học với thông tin thống kê
   */
  async getMyCourses(lectureId) {
    const courses = await lecture_repository_default.findCoursesByLectureId(lectureId);
    return courses;
  }
  /**
   * Lấy chi tiết một khóa học của giảng viên
   * @param courseId - ID của khóa học
   * @param lectureId - ID của giảng viên (để verify quyền)
   * @returns Promise chứa khóa học với cấu trúc chi tiết
   */
  async getCourseDetail(courseId, lectureId) {
    const course = await lecture_repository_default.findCourseDetailWithPhases(courseId, lectureId);
    if (!course) {
      throw new Error("Course not found or you do not have permission to view this course");
    }
    return course;
  }
  /**
   * Lấy danh sách minitests trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách minitests với thông tin khóa học
   */
  async getMyMinitests(lectureId) {
    const minitests = await lecture_repository_default.findMinitestsByLectureId(lectureId);
    return minitests;
  }
  /**
   * Lấy danh sách hackathons trong các khóa học của giảng viên
   * @param lectureId - ID của giảng viên
   * @returns Promise chứa danh sách hackathons với thông tin thống kê
   */
  async getMyHackathons(lectureId) {
    const hackathons = await lecture_repository_default.findHackathonsByLectureId(lectureId);
    return hackathons;
  }
};
var lecture_service_default = new LectureService();

// src/modules/lessonContent/repositories/lessonContent.repository.ts
var import_client29 = require("@prisma/client");
var prisma29 = new import_client29.PrismaClient();
var LessonContentRepository = class extends BaseRepository {
  model = prisma29.lessonContent;
  async findByLessonId(lessonId) {
    return this.model.findUnique({
      where: { lessonId }
    });
  }
  async findByLessonIdWithDetails(lessonId, userId) {
    const lesson = await prisma29.lesson.findUnique({
      where: { id: lessonId },
      include: {
        lessonContent: true,
        // Include lesson content from separate table
        scoringConfig: true,
        // Include scoring config
        phase: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                unlockLessonsCount: true,
                hackathons: true,
                projects: true
              }
            },
            minitests: {
              include: {
                questions: {
                  include: {
                    problem: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!lesson) {
      return null;
    }
    const allLessonsInCourse = await prisma29.lesson.findMany({
      where: {
        phase: {
          courseId: lesson.phase.courseId
        }
      },
      select: {
        id: true,
        title: true,
        orderIndex: true,
        phaseId: true,
        phase: {
          select: {
            id: true,
            title: true,
            orderIndex: true
          }
        }
      },
      orderBy: [
        { phase: { orderIndex: "asc" } },
        { orderIndex: "asc" }
      ]
    });
    let currentUnlocks = 0;
    let completedLessonIds = [];
    if (userId) {
      const enrollment = await prisma29.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.phase.courseId
          }
        },
        select: {
          currentUnlocks: true
        }
      });
      currentUnlocks = enrollment?.currentUnlocks || 0;
      const completedProgress = await prisma29.lessonProgress.findMany({
        where: {
          userId,
          isCompleted: true,
          lesson: {
            phase: {
              courseId: lesson.phase.courseId
            }
          }
        },
        select: { lessonId: true }
      });
      completedLessonIds = completedProgress.map((p) => p.lessonId);
    }
    const lessons = allLessonsInCourse.map((l, index) => ({
      ...l,
      isUnlocked: index < currentUnlocks,
      isCompleted: completedLessonIds.includes(l.id)
    }));
    let isCompleted = completedLessonIds.includes(lessonId);
    const lessonProgress = await prisma29.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId || "",
          lessonId
        }
      }
    });
    return {
      ...lesson,
      isCompleted,
      lessons,
      currentUnlocks
    };
  }
  async upsert(lessonId, data) {
    return this.model.upsert({
      where: { lessonId },
      create: {
        lessonId,
        content: data.content || "",
        testCases: data.testCases || "[]",
        hints: data.hints || "[]",
        timeLimit: data.timeLimit || null,
        memoryLimit: data.memoryLimit || null,
        starterCode: data.starterCode || null
      },
      update: data
    });
  }
};
var ScoringConfigRepository = class extends BaseRepository {
  model = prisma29.scoringConfig;
  async findByLessonId(lessonId) {
    return this.model.findUnique({
      where: { lessonId }
    });
  }
  async upsert(lessonId, data) {
    return this.model.upsert({
      where: { lessonId },
      create: {
        lessonId,
        baseScore: data.baseScore ?? 100,
        penaltyPerHint: data.penaltyPerHint ?? 10,
        timeBonusEnabled: data.timeBonusEnabled ?? false,
        timeBonusThreshold: data.timeBonusThreshold ?? null,
        timeBonusValue: data.timeBonusValue ?? null
      },
      update: data
    });
  }
};
var lessonContent_repository_default = {
  lessonContent: new LessonContentRepository(),
  scoringConfig: new ScoringConfigRepository()
};

// src/modules/lessonContent/services/lessonContent.service.ts
var LessonContentService = class extends BaseService {
  constructor() {
    super(lessonContent_repository_default.lessonContent);
  }
  async getByLessonId(lessonId, userId) {
    const content = await this.repository.findByLessonIdWithDetails(lessonId, userId);
    if (!content) {
      throw new Error("Lesson content not found");
    }
    return content;
  }
  async updateContent(lessonId, dto) {
    const lesson = await prisma_default.lesson.findUnique({
      where: { id: lessonId },
      include: { lessonRequest: true }
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    if (lesson.lessonRequest && lesson.lessonRequest.lectureId) {
      if (lesson.status === "PUBLISHED") {
        throw new Error("Cannot update published lesson");
      }
    }
    const updateData = {};
    if (dto.content !== void 0) updateData.content = dto.content;
    if (dto.testCases !== void 0) updateData.testCases = JSON.stringify(dto.testCases);
    if (dto.hints !== void 0) updateData.hints = JSON.stringify(dto.hints);
    if (dto.timeLimit !== void 0) updateData.timeLimit = dto.timeLimit;
    if (dto.memoryLimit !== void 0) updateData.memoryLimit = dto.memoryLimit;
    if (dto.starterCode !== void 0) updateData.starterCode = dto.starterCode;
    return this.repository.upsert(lessonId, updateData);
  }
  async updateScoringConfig(lessonId, dto) {
    return lessonContent_repository_default.scoringConfig.upsert(lessonId, dto);
  }
  // Alias methods for consistency with controller
  async updateLessonContent(lessonId, dto) {
    const parsedDto = { ...dto };
    if (dto.testCases && typeof dto.testCases === "string") {
      parsedDto.testCases = JSON.parse(dto.testCases);
    }
    if (dto.hints && typeof dto.hints === "string") {
      parsedDto.hints = JSON.parse(dto.hints);
    }
    return this.updateContent(lessonId, parsedDto);
  }
  async updateScoring(lessonId, dto) {
    return this.updateScoringConfig(lessonId, dto);
  }
  async getScoringConfig(lessonId) {
    const config = await lessonContent_repository_default.scoringConfig.findByLessonId(lessonId);
    if (!config) {
      return {
        lessonId,
        baseScore: 100,
        penaltyPerHint: 10,
        timeBonusEnabled: false,
        timeBonusThreshold: null,
        timeBonusValue: null
      };
    }
    return config;
  }
};
var lessonContent_service_default = new LessonContentService();

// src/modules/lecture/controllers/lecture.controller.ts
var LectureController = class extends BaseController {
  constructor() {
    super(lecture_service_default);
  }
  /**
   * Lấy dashboard stats cho giảng viên
   * GET /api/lecture/dashboard
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getDashboard = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const stats = await lecture_service_default.getDashboardStats(lectureId);
      this.success(res, stats, "Dashboard stats retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách khóa học của giảng viên
   * GET /api/lecture/courses
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getMyCourses = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const courses = await lecture_service_default.getMyCourses(lectureId);
      this.success(res, courses, "Courses retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy chi tiết một khóa học của giảng viên
   * GET /api/lecture/courses/:courseId
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getCourseDetail = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId } = req.params;
      const course = await lecture_service_default.getCourseDetail(Array.isArray(courseId) ? courseId[0] : courseId, lectureId);
      this.success(res, course, "Course detail retrieved successfully");
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      this.error(res, error.message, status);
    }
  };
  /**
   * Lấy danh sách minitests trong các khóa học của giảng viên
   * GET /api/lecture/minitests
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getMyMinitests = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const minitests = await lecture_service_default.getMyMinitests(lectureId);
      this.success(res, minitests, "Minitests retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách hackathons trong các khóa học của giảng viên
   * GET /api/lecture/hackathons
   * Yêu cầu: User đã xác thực với role = 'lecture'
   */
  getMyHackathons = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const hackathons = await lecture_service_default.getMyHackathons(lectureId);
      this.success(res, hackathons, "Hackathons retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Tạo chương mới cho khóa học
   * POST /api/lecture/phases
   */
  createPhase = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { courseId, title } = req.body;
      const lectureCourse = await prisma_default.lectureCourse.findFirst({
        where: { courseId, lectureId }
      });
      if (!lectureCourse) {
        this.error(res, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n t\u1EA1o ch\u01B0\u01A1ng cho kh\xF3a h\u1ECDc n\xE0y", 403);
        return;
      }
      const phase = await phase_service_default.createPhase({ courseId, title });
      this.success(res, phase, "Ch\u01B0\u01A1ng \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Tạo bài học mới trong chương
   * POST /api/lecture/lessons
   */
  createLesson = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { phaseId, title, type } = req.body;
      const phase = await prisma_default.phase.findUnique({
        where: { id: phaseId },
        include: { course: true }
      });
      if (!phase) {
        this.error(res, "Ch\u01B0\u01A1ng kh\xF4ng t\u1ED3n t\u1EA1i", 404);
        return;
      }
      const lectureCourse = await prisma_default.lectureCourse.findFirst({
        where: { courseId: phase.courseId, lectureId }
      });
      if (!lectureCourse) {
        this.error(res, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n t\u1EA1o b\xE0i h\u1ECDc cho kh\xF3a h\u1ECDc n\xE0y", 403);
        return;
      }
      const lesson = await lesson_service_default.createLesson({
        phaseId,
        title,
        type,
        status: "DRAFT"
      });
      const lessonRequest = await prisma_default.lessonRequest.create({
        data: {
          lectureId,
          lessonId: lesson.id,
          status: "IN_PROGRESS"
        }
      });
      this.success(res, { ...lesson, lessonRequestId: lessonRequest.id }, "B\xE0i h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy nội dung bài học để chỉnh sửa
   * GET /api/lecture/lesson-content/:lessonId
   */
  getLessonContent = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId } = req.params;
      const lesson = await prisma_default.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: {
          phase: {
            include: { course: true }
          },
          lessonContent: true,
          lessonRequest: true
        }
      });
      if (!lesson) {
        this.error(res, "B\xE0i h\u1ECDc kh\xF4ng t\u1ED3n t\u1EA1i", 404);
        return;
      }
      const isAdmin = req.user?.roleName === "admin";
      const lectureCourse = isAdmin ? { id: "admin-bypass" } : await prisma_default.lectureCourse.findFirst({
        where: { courseId: lesson.phase.courseId, lectureId }
      });
      if (!lectureCourse) {
        this.error(res, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa b\xE0i h\u1ECDc n\xE0y", 403);
        return;
      }
      this.success(res, lesson, "Lesson content retrieved");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật nội dung bài học
   * PUT /api/lecture/lesson-content/:lessonId/content
   */
  updateLessonContent = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId } = req.params;
      const { content, testCases, hints, starterCode, timeLimit, memoryLimit } = req.body;
      const lesson = await prisma_default.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: {
          phase: { include: { course: true } },
          lessonRequest: true
        }
      });
      if (!lesson) {
        this.error(res, "B\xE0i h\u1ECDc kh\xF4ng t\u1ED3n t\u1EA1i", 404);
        return;
      }
      const lessonRequestData = Array.isArray(lesson.lessonRequest) ? lesson.lessonRequest[0] : lesson.lessonRequest;
      if (lessonRequestData && lessonRequestData.status !== "IN_PROGRESS") {
        this.error(res, "B\xE0i h\u1ECDc kh\xF4ng th\u1EC3 ch\u1EC9nh s\u1EEDa \u1EDF tr\u1EA1ng th\xE1i n\xE0y", 400);
        return;
      }
      const isAdmin = req.user?.roleName === "admin";
      const lectureCourse = isAdmin ? { id: "admin-bypass" } : await prisma_default.lectureCourse.findFirst({
        where: { courseId: lesson.phase?.courseId, lectureId }
      });
      if (!lectureCourse) {
        this.error(res, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa b\xE0i h\u1ECDc n\xE0y", 403);
        return;
      }
      const result = await lessonContent_service_default.updateLessonContent(Array.isArray(lessonId) ? lessonId[0] : lessonId, {
        content,
        testCases: typeof testCases === "string" ? testCases : JSON.stringify(testCases),
        hints: typeof hints === "string" ? hints : JSON.stringify(hints),
        starterCode,
        timeLimit,
        memoryLimit
      });
      this.success(res, result, "N\u1ED9i dung \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật cấu hình chấm điểm
   * PUT /api/lecture/lesson-content/:lessonId/scoring
   */
  updateLessonScoring = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId } = req.params;
      const { baseScore, penaltyPerHint, timeBonusEnabled, timeBonusThreshold, timeBonusValue } = req.body;
      const lesson = await prisma_default.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: { phase: { include: { course: true } } }
      });
      if (!lesson) {
        this.error(res, "B\xE0i h\u1ECDc kh\xF4ng t\u1ED3n t\u1EA1i", 404);
        return;
      }
      const isAdminScoring = req.user?.roleName === "admin";
      const lectureCourseScoring = isAdminScoring ? { id: "admin-bypass" } : await prisma_default.lectureCourse.findFirst({
        where: { courseId: lesson.phase?.courseId, lectureId }
      });
      if (!lectureCourseScoring) {
        this.error(res, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa b\xE0i h\u1ECDc n\xE0y", 403);
        return;
      }
      const result = await lessonContent_service_default.updateScoring(Array.isArray(lessonId) ? lessonId[0] : lessonId, {
        baseScore,
        penaltyPerHint,
        timeBonusEnabled,
        timeBonusThreshold,
        timeBonusValue
      });
      this.success(res, result, "C\u1EA5u h\xECnh ch\u1EA5m \u0111i\u1EC3m \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Nộp bài học để admin duyệt
   * PUT /api/lecture/lessons/:lessonId/submit
   */
  submitLesson = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { lessonId } = req.params;
      const lesson = await prisma_default.lesson.findUnique({
        where: { id: Array.isArray(lessonId) ? lessonId[0] : lessonId },
        include: {
          phase: { include: { course: true } },
          lessonRequest: true,
          lessonContent: true
        }
      });
      if (!lesson) {
        this.error(res, "B\xE0i h\u1ECDc kh\xF4ng t\u1ED3n t\u1EA1i", 404);
        return;
      }
      const lectureCourse = await prisma_default.lectureCourse.findFirst({
        where: { courseId: lesson.phase?.courseId, lectureId }
      });
      if (!lectureCourse) {
        this.error(res, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n n\u1ED9p b\xE0i h\u1ECDc n\xE0y", 403);
        return;
      }
      const lessonIdStr = Array.isArray(lessonId) ? lessonId[0] : lessonId;
      await prisma_default.lesson.update({
        where: { id: lessonIdStr },
        data: { status: "PENDING_REVIEW" }
      });
      const lessonRequestData = Array.isArray(lesson.lessonRequest) ? lesson.lessonRequest[0] : lesson.lessonRequest;
      if (lessonRequestData && lessonRequestData.id) {
        await prisma_default.lessonRequest.update({
          where: { id: lessonRequestData.id },
          data: { status: "PENDING" }
        });
      } else {
        await prisma_default.lessonRequest.create({
          data: {
            lectureId,
            lessonId: lessonIdStr,
            status: "PENDING"
          }
        });
      }
      const admins = await prisma_default.user.findMany({
        where: { role: { name: "admin" } }
      });
      for (const admin of admins) {
        await notification_service_default.createNotification({
          userId: admin.id,
          type: "lesson_submitted",
          title: "B\xE0i h\u1ECDc \u0111\u01B0\u1EE3c n\u1ED9p \u0111\u1EC3 duy\u1EC7t",
          message: `Gi\u1EA3ng vi\xEAn \u0111\xE3 n\u1ED9p b\xE0i h\u1ECDc "${lesson.title}" \u0111\u1EC3 duy\u1EC7t. Vui l\xF2ng ki\u1EC3m tra v\xE0 duy\u1EC7t.`
        });
      }
      this.success(res, null, "B\xE0i h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c n\u1ED9p \u0111\u1EC3 duy\u1EC7t");
    } catch (error) {
      next(error);
    }
  };
};
var lecture_controller_default = new LectureController();

// src/modules/lecture/controllers/lectureSubmission.controller.ts
var LectureSubmissionController = class extends BaseController {
  constructor() {
    super(void 0);
  }
  /**
   * Get all lesson submissions for lessons that this lecture owns
   */
  getSubmissions = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const lessonId = req.query.lessonId;
      const courseId = req.query.courseId;
      const status = req.query.status;
      const page = req.query.page || "1";
      const limit = req.query.limit || "20";
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
      const lectureCourseIds = await prisma_default.lectureCourse.findMany({
        where: { lectureId },
        select: { courseId: true }
      });
      const courseIds = lectureCourseIds.map((lc) => lc.courseId);
      const whereClause = {};
      if (lessonId) {
        whereClause.lessonId = lessonId;
      }
      if (courseId) {
        whereClause.lesson = {
          phase: {
            courseId
          }
        };
      } else if (courseIds.length > 0) {
        whereClause.lesson = {
          phase: {
            courseId: { in: courseIds }
          }
        };
      } else {
        this.success(res, { submissions: [], total: 0, page: pageNum, limit: limitNum }, "No courses assigned");
        return;
      }
      if (status) {
        whereClause.status = status;
      }
      const [submissions, total] = await Promise.all([
        prisma_default.lessonSubmission.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                email: true
              }
            },
            lesson: {
              select: {
                id: true,
                title: true,
                type: true,
                phase: {
                  select: {
                    title: true,
                    course: {
                      select: {
                        id: true,
                        title: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum
        }),
        prisma_default.lessonSubmission.count({ where: whereClause })
      ]);
      this.success(res, { submissions, total, page: pageNum, limit: limitNum }, "Success");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Approve a single submission score
   */
  approveSubmission = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const id = req.params.id;
      const { score } = req.body;
      const submission = await prisma_default.lessonSubmission.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true
            }
          }
        }
      });
      if (!submission) {
        this.error(res, "Submission not found", 404);
        return;
      }
      const lectureCourse = await prisma_default.lectureCourse.findFirst({
        where: {
          lectureId,
          courseId: submission.lesson.phase.courseId
        }
      });
      if (!lectureCourse) {
        this.error(res, "You do not have permission to approve this submission", 403);
        return;
      }
      const updated = await prisma_default.lessonSubmission.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedAt: /* @__PURE__ */ new Date(),
          reviewedBy: lectureId,
          ...score !== void 0 && { score }
        }
      });
      await notification_service_default.createNotification({
        userId: submission.userId,
        type: "submission_approved",
        title: "B\xE0i t\u1EADp \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t",
        message: `B\xE0i t\u1EADp "${submission.lesson.title}" \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3ng vi\xEAn duy\u1EC7t. \u0110i\u1EC3m: ${updated.score || 0}`
      });
      await email_service_default.sendScoreNotification(
        submission.user.email,
        submission.user.fullName || submission.user.username,
        submission.lesson.title,
        submission.lesson.phase.course.title,
        updated.score || 0,
        submission.passedTests || 0,
        submission.totalTests || 0,
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/lessons/${submission.lessonId}`
      );
      this.success(res, updated, "Submission approved successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Reject a single submission
   */
  rejectSubmission = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const id = req.params.id;
      const { feedback } = req.body;
      const submission = await prisma_default.lessonSubmission.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true
            }
          }
        }
      });
      if (!submission) {
        this.error(res, "Submission not found", 404);
        return;
      }
      const lectureCourse = await prisma_default.lectureCourse.findFirst({
        where: {
          lectureId,
          courseId: submission.lesson.phase.courseId
        }
      });
      if (!lectureCourse) {
        this.error(res, "You do not have permission to reject this submission", 403);
        return;
      }
      const updated = await prisma_default.lessonSubmission.update({
        where: { id },
        data: {
          status: "REJECTED",
          reviewedAt: /* @__PURE__ */ new Date(),
          reviewedBy: lectureId
        }
      });
      await notification_service_default.createNotification({
        userId: submission.userId,
        type: "submission_rejected",
        title: "B\xE0i t\u1EADp c\u1EA7n ch\u1EC9nh s\u1EEDa",
        message: `B\xE0i t\u1EADp "${submission.lesson.title}" c\u1EA7n \u0111\u01B0\u1EE3c ch\u1EC9nh s\u1EEDa th\xEAm.${feedback ? ` Ph\u1EA3n h\u1ED3i: ${feedback}` : ""}`
      });
      this.success(res, updated, "Submission rejected");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Bulk approve submissions and send emails
   */
  bulkApprove = async (req, res, next) => {
    try {
      const lectureId = req.user?.userId;
      if (!lectureId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const { submissionIds } = req.body;
      if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
        this.error(res, "submissionIds must be a non-empty array", 400);
        return;
      }
      const submissions = await prisma_default.lessonSubmission.findMany({
        where: { id: { in: submissionIds } },
        include: {
          lesson: {
            include: {
              phase: {
                include: {
                  course: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true
            }
          }
        }
      });
      const lectureCourseIds = await prisma_default.lectureCourse.findMany({
        where: { lectureId },
        select: { courseId: true }
      });
      const allowedCourseIds = lectureCourseIds.map((lc) => lc.courseId);
      const unauthorized = submissions.filter(
        (s) => !allowedCourseIds.includes(s.lesson.phase.courseId)
      );
      if (unauthorized.length > 0) {
        this.error(res, "You do not have permission to approve some submissions", 403);
        return;
      }
      const now = /* @__PURE__ */ new Date();
      await prisma_default.lessonSubmission.updateMany({
        where: { id: { in: submissionIds } },
        data: {
          status: "APPROVED",
          reviewedAt: now,
          reviewedBy: lectureId
        }
      });
      const results = [];
      for (const submission of submissions) {
        await notification_service_default.createNotification({
          userId: submission.userId,
          type: "submission_approved",
          title: "B\xE0i t\u1EADp \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t",
          message: `B\xE0i t\u1EADp "${submission.lesson.title}" \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3ng vi\xEAn duy\u1EC7t. \u0110i\u1EC3m: ${submission.score || 0}`
        });
        await email_service_default.sendScoreNotification(
          submission.user.email,
          submission.user.fullName || submission.user.username,
          submission.lesson.title,
          submission.lesson.phase.course.title,
          submission.score || 0,
          submission.passedTests || 0,
          submission.totalTests || 0,
          `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/lessons/${submission.lessonId}`
        );
        results.push({
          submissionId: submission.id,
          userId: submission.userId,
          email: submission.user.email
        });
      }
      this.success(res, {
        approved: submissionIds.length,
        results
      }, "Bulk approval completed and emails sent");
    } catch (error) {
      next(error);
    }
  };
};
var lectureSubmission_controller_default = new LectureSubmissionController();

// src/modules/lecture/routes/lecture.routes.ts
var router23 = (0, import_express23.Router)();
router23.use(verifyToken);
router23.get("/dashboard", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.getDashboard(req, res, next);
});
router23.get("/courses", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.getMyCourses(req, res, next);
});
router23.get("/courses/:courseId", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.getCourseDetail(req, res, next);
});
router23.get("/minitests", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.getMyMinitests(req, res, next);
});
router23.get("/hackathons", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.getMyHackathons(req, res, next);
});
router23.get("/submissions", requireLectureOrAdmin, (req, res, next) => {
  lectureSubmission_controller_default.getSubmissions(req, res, next);
});
router23.post("/submissions/:id/approve", requireLectureOrAdmin, (req, res, next) => {
  lectureSubmission_controller_default.approveSubmission(req, res, next);
});
router23.post("/submissions/:id/reject", requireLectureOrAdmin, (req, res, next) => {
  lectureSubmission_controller_default.rejectSubmission(req, res, next);
});
router23.post("/submissions/bulk-approve", requireLectureOrAdmin, (req, res, next) => {
  lectureSubmission_controller_default.bulkApprove(req, res, next);
});
router23.post("/phases", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.createPhase(req, res, next);
});
router23.post("/lessons", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.createLesson(req, res, next);
});
router23.get("/lesson-content/:lessonId", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.getLessonContent(req, res, next);
});
router23.put("/lesson-content/:lessonId/content", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.updateLessonContent(req, res, next);
});
router23.put("/lesson-content/:lessonId/scoring", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.updateLessonScoring(req, res, next);
});
router23.put("/lessons/:lessonId/submit", requireLectureOrAdmin, (req, res, next) => {
  lecture_controller_default.submitLesson(req, res, next);
});
var lecture_routes_default = router23;

// src/modules/lessonRequest/routes/lessonRequest.routes.ts
var import_express24 = require("express");

// src/modules/lessonRequest/repositories/lessonRequest.repository.ts
var import_client30 = require("@prisma/client");
var prisma30 = new import_client30.PrismaClient();
var LessonRequestRepository = class extends BaseRepository {
  model = prisma30.lessonRequest;
  async findAllWithDetails() {
    return this.model.findMany({
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  async findByLectureId(lectureId) {
    return this.model.findMany({
      where: { lectureId },
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  async findByIdWithDetails(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            },
            lessonContent: true
          }
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }
  async updateStatus(id, status) {
    return this.model.update({
      where: { id },
      data: { status }
    });
  }
  async findLessonById(id) {
    return prisma30.lesson.findUnique({ where: { id } });
  }
  async findLectureById(id) {
    return prisma30.user.findUnique({
      where: { id },
      include: { role: true }
    });
  }
  async findAdmins() {
    return prisma30.user.findMany({
      where: { role: { name: "admin" } }
    });
  }
  async updateLessonStatus(lessonId, status) {
    return prisma30.lesson.update({
      where: { id: lessonId },
      data: { status }
    });
  }
  async upsertLessonContent(lessonId) {
    return prisma30.lessonContent.upsert({
      where: { lessonId },
      create: {
        lessonId,
        content: "",
        testCases: "[]",
        hints: "[]"
      },
      update: {}
    });
  }
  async upsertScoringConfig(lessonId) {
    return prisma30.scoringConfig.upsert({
      where: { lessonId },
      create: {
        lessonId,
        baseScore: 100,
        penaltyPerHint: 10
      },
      update: {}
    });
  }
  async findPendingByLectureId(lectureId) {
    return this.model.findMany({
      where: {
        lectureId,
        status: { in: ["PENDING", "IN_PROGRESS"] }
      },
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        lecture: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { dueDate: "asc" }
    });
  }
};
var lessonRequest_repository_default = new LessonRequestRepository();

// src/modules/lessonRequest/services/lessonRequest.service.ts
var LessonRequestService = class extends BaseService {
  constructor() {
    super(lessonRequest_repository_default);
  }
  async create(dto) {
    const lesson = await this.repository.findLessonById(dto.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const lecture = await this.repository.findLectureById(dto.lectureId);
    if (!lecture) {
      throw new Error("Lecture user not found");
    }
    if (lecture.role?.name !== "lecture") {
      throw new Error("User is not a lecture");
    }
    const lessonRequest = await this.repository.create({
      lessonId: dto.lessonId,
      lectureId: dto.lectureId,
      status: "PENDING",
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      notes: dto.notes || null
    });
    await notification_service_default.createNotification({
      userId: dto.lectureId,
      type: "lesson_request",
      title: "Y\xEAu c\u1EA7u t\u1EA1o b\xE0i h\u1ECDc m\u1EDBi",
      message: `B\u1EA1n \u0111\u01B0\u1EE3c giao y\xEAu c\u1EA7u t\u1EA1o b\xE0i h\u1ECDc: ${lesson.title}. Vui l\xF2ng ki\u1EC3m tra v\xE0 b\u1EAFt \u0111\u1EA7u l\xE0m vi\u1EC7c.`
    });
    return lessonRequest;
  }
  async getAll() {
    return this.repository.findAllWithDetails();
  }
  async getByLectureId(lectureId) {
    return this.repository.findByLectureId(lectureId);
  }
  async getPendingForLecture(lectureId) {
    return this.repository.findPendingByLectureId(lectureId);
  }
  async getById(id) {
    const request = await this.repository.findByIdWithDetails(id);
    if (!request) {
      throw new Error("Lesson request not found");
    }
    return request;
  }
  async update(id, dto) {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error("Lesson request not found");
    }
    const updateData = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.dueDate !== void 0) updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.notes !== void 0) updateData.notes = dto.notes;
    return this.repository.update(id, updateData);
  }
  async delete(id) {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error("Lesson request not found");
    }
    return this.repository.delete(id);
  }
  async submitForReview(id, lectureId) {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error("Lesson request not found");
    }
    if (request.lectureId !== lectureId) {
      throw new Error("You are not authorized to submit this request");
    }
    if (request.status !== "IN_PROGRESS") {
      throw new Error("Lesson must be in progress before submitting");
    }
    const updated = await this.repository.updateStatus(id, "SUBMITTED");
    await this.repository.updateLessonStatus(request.lessonId, "PENDING_REVIEW");
    const admins = await this.repository.findAdmins();
    for (const admin of admins) {
      await notification_service_default.createNotification({
        userId: admin.id,
        type: "lesson_submitted",
        title: "B\xE0i h\u1ECDc \u0111\u01B0\u1EE3c n\u1ED9p \u0111\u1EC3 duy\u1EC7t",
        message: `Lecture \u0111\xE3 n\u1ED9p b\xE0i h\u1ECDc \u0111\u1EC3 duy\u1EC7t. Vui l\xF2ng ki\u1EC3m tra v\xE0 duy\u1EC7t.`
      });
    }
    return updated;
  }
  async startWorking(id, lectureId) {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error("Lesson request not found");
    }
    if (request.lectureId !== lectureId) {
      throw new Error("You are not authorized to start this request");
    }
    if (request.status === "IN_PROGRESS") {
      return request;
    }
    if (request.status !== "PENDING") {
      throw new Error("Cannot start a lesson that is not pending");
    }
    const updated = await this.repository.updateStatus(id, "IN_PROGRESS");
    await this.repository.upsertLessonContent(request.lessonId);
    await this.repository.upsertScoringConfig(request.lessonId);
    return updated;
  }
  async cancel(id) {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new Error("Lesson request not found");
    }
    if (request.status === "SUBMITTED") {
      throw new Error("Cannot cancel submitted request");
    }
    return this.repository.updateStatus(id, "CANCELLED");
  }
};
var lessonRequest_service_default = new LessonRequestService();

// src/modules/lessonRequest/controllers/lessonRequest.controller.ts
var LessonRequestController = class extends BaseController {
  constructor() {
    super(lessonRequest_service_default);
  }
  // ========== Admin Endpoints ==========
  create = async (req, res, next) => {
    try {
      const { lessonId, lectureId, dueDate, notes } = req.body;
      if (!lessonId || !lectureId) {
        return this.error(res, "lessonId and lectureId are required", 400);
      }
      const lessonRequest = await this.service.create({ lessonId, lectureId, dueDate, notes });
      return this.success(res, lessonRequest, "Lesson request created successfully", 201);
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  getAll = async (req, res, next) => {
    try {
      const requests = await this.service.getAll();
      return this.success(res, requests, "Fetched all lesson requests");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const request = await this.service.getById(id);
      return this.success(res, request, "Fetched lesson request");
    } catch (error) {
      return this.error(res, error.message, 404);
    }
  };
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, dueDate, notes } = req.body;
      const updated = await this.service.update(id, { status, dueDate, notes });
      return this.success(res, updated, "Lesson request updated successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return this.success(res, null, "Lesson request deleted successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // ========== Lecture Endpoints ==========
  getMyRequests = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      const requests = await this.service.getByLectureId(userId);
      return this.success(res, requests, "Fetched your lesson requests");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  getPendingForMe = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      const requests = await this.service.getPendingForLecture(userId);
      return this.success(res, requests, "Fetched pending lesson requests");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  startWorking = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      const result = await this.service.startWorking(id, userId);
      return this.success(res, result, "Started working on lesson");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  submitForReview = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      const result = await this.service.submitForReview(id, userId);
      return this.success(res, result, "Lesson submitted for review");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  cancel = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.service.cancel(id);
      return this.success(res, result, "Lesson request cancelled");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
};
var lessonRequest_controller_default = new LessonRequestController();

// src/modules/lessonRequest/routes/lessonRequest.routes.ts
var router24 = (0, import_express24.Router)();
router24.post("/", verifyToken, requireAdmin, lessonRequest_controller_default.create);
router24.get("/", verifyToken, requireAdmin, lessonRequest_controller_default.getAll);
router24.get("/:id", verifyToken, requireAdmin, lessonRequest_controller_default.getById);
router24.put("/:id", verifyToken, requireAdmin, lessonRequest_controller_default.update);
router24.delete("/:id", verifyToken, requireAdmin, lessonRequest_controller_default.delete);
router24.get("/lecture/my-requests", verifyToken, lessonRequest_controller_default.getMyRequests);
router24.get("/lecture/pending", verifyToken, lessonRequest_controller_default.getPendingForMe);
router24.put("/:id/start", verifyToken, lessonRequest_controller_default.startWorking);
router24.put("/:id/submit", verifyToken, lessonRequest_controller_default.submitForReview);
router24.put("/:id/cancel", verifyToken, lessonRequest_controller_default.cancel);
var lessonRequest_routes_default = router24;

// src/modules/lessonContent/routes/lessonContent.routes.ts
var import_express25 = require("express");

// src/modules/lessonContent/controllers/lessonContent.controller.ts
var LessonContentController = class extends BaseController {
  constructor() {
    super(lessonContent_service_default);
  }
  // Get lesson content by lessonId
  getByLessonId = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const userId = req.user?.userId;
      const content = await this.service.getByLessonId(lessonId, userId);
      return this.success(res, content, "Fetched lesson content");
    } catch (error) {
      return this.error(res, error.message, 404);
    }
  };
  // Update lesson content
  updateContent = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const { content, testCases, hints, timeLimit, memoryLimit, starterCode } = req.body;
      const updated = await this.service.updateContent(lessonId, {
        content,
        testCases,
        hints,
        timeLimit,
        memoryLimit,
        starterCode
      });
      return this.success(res, updated, "Lesson content updated successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Get scoring config
  getScoringConfig = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const config = await this.service.getScoringConfig(lessonId);
      return this.success(res, config, "Fetched scoring config");
    } catch (error) {
      return this.error(res, error.message, 404);
    }
  };
  // Update scoring config
  updateScoringConfig = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const { baseScore, penaltyPerHint, timeBonusEnabled, timeBonusThreshold, timeBonusValue } = req.body;
      const updated = await this.service.updateScoringConfig(lessonId, {
        baseScore,
        penaltyPerHint,
        timeBonusEnabled,
        timeBonusThreshold,
        timeBonusValue
      });
      return this.success(res, updated, "Scoring config updated successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
};
var lessonContent_controller_default = new LessonContentController();

// src/modules/lessonContent/routes/lessonContent.routes.ts
var router25 = (0, import_express25.Router)();
router25.use(verifyToken);
router25.get("/:lessonId", lessonContent_controller_default.getByLessonId);
router25.put("/:lessonId/content", requireLectureOrAdmin, lessonContent_controller_default.updateContent);
router25.get("/:lessonId/scoring", lessonContent_controller_default.getScoringConfig);
router25.put("/:lessonId/scoring", requireLectureOrAdmin, lessonContent_controller_default.updateScoringConfig);
var lessonContent_routes_default = router25;

// src/modules/lessonReview/routes/lessonReview.routes.ts
var import_express26 = require("express");

// src/modules/lessonReview/repositories/lessonReview.repository.ts
var import_client31 = require("@prisma/client");
var prisma31 = new import_client31.PrismaClient();
var LessonReviewRepository = class extends BaseRepository {
  model = prisma31.lessonReview;
  async findByLessonId(lessonId) {
    return this.model.findUnique({
      where: { lessonId }
    });
  }
  async findWithDetails(lessonId) {
    return this.model.findUnique({
      where: { lessonId },
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            },
            lessonContent: true
          }
        },
        admin: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    });
  }
  async findPendingReviews() {
    const lessons = await prisma31.lesson.findMany({
      where: { status: "PENDING_REVIEW" },
      include: {
        phase: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        lessonContent: true,
        lessonRequest: {
          include: {
            lecture: {
              select: {
                id: true,
                username: true,
                fullName: true,
                email: true
              }
            }
          }
        }
      }
    });
    return lessons.map((lesson) => ({
      id: lesson.id,
      lessonId: lesson.id,
      adminId: "",
      status: lesson.status,
      feedback: null,
      reviewedAt: lesson.createdAt,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        status: lesson.status,
        phase: lesson.phase
      },
      lessonContent: lesson.lessonContent ? {
        content: lesson.lessonContent.content,
        testCases: lesson.lessonContent.testCases,
        hints: lesson.lessonContent.hints,
        starterCode: lesson.lessonContent.starterCode
      } : null
    }));
  }
  async createReview(lessonId, adminId, feedback) {
    return this.model.upsert({
      where: { lessonId },
      create: {
        lessonId,
        adminId,
        feedback,
        reviewedAt: /* @__PURE__ */ new Date()
      },
      update: {
        adminId,
        feedback,
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  async findAll() {
    const reviews = await this.model.findMany({
      include: {
        lesson: {
          include: {
            phase: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            },
            lessonContent: true
          }
        },
        admin: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      },
      orderBy: { reviewedAt: "desc" }
    });
    return reviews;
  }
};
var lessonReview_repository_default = new LessonReviewRepository();

// src/modules/lessonReview/services/lessonReview.service.ts
var LessonReviewService = class extends BaseService {
  constructor() {
    super(lessonReview_repository_default);
  }
  async getPendingReviews() {
    return this.repository.findPendingReviews();
  }
  async getReviewDetails(lessonId) {
    const review = await this.repository.findWithDetails(lessonId);
    if (!review) {
      const lesson = await prisma_default.lesson.findUnique({
        where: { id: lessonId },
        include: {
          phase: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          },
          lessonContent: true,
          lessonRequest: {
            include: {
              lecture: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  email: true
                }
              }
            }
          }
        }
      });
      if (!lesson) {
        throw new Error("Lesson not found");
      }
      return {
        id: lesson.id,
        lessonId: lesson.id,
        adminId: "",
        status: lesson.status,
        feedback: null,
        reviewedAt: lesson.createdAt,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        lesson: {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          status: lesson.status,
          phase: lesson.phase
        },
        lessonContent: lesson.lessonContent ? {
          content: lesson.lessonContent.content,
          testCases: lesson.lessonContent.testCases,
          hints: lesson.lessonContent.hints,
          starterCode: lesson.lessonContent.starterCode
        } : null
      };
    }
    return review;
  }
  async approve(lessonId, adminId, feedback) {
    const lesson = await prisma_default.lesson.findUnique({
      where: { id: lessonId }
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const lessonRequest = await prisma_default.lessonRequest.findFirst({
      where: { lessonId },
      include: {
        lecture: {
          select: { id: true, email: true, fullName: true }
        }
      }
    });
    let review;
    if (!lessonRequest) {
      console.log("[LESSON REVIEW] Approve - No lessonRequest found, skipping notification");
    } else {
      if (lessonRequest.lecture) {
        await email_service_default.sendLessonApprovedNotification(
          lessonRequest.lecture.email,
          lessonRequest.lecture.fullName || "Gi\u1EA3ng vi\xEAn",
          lesson.title
        );
        await notification_service_default.createNotification({
          userId: lessonRequest.lecture.id,
          type: "lesson_approved",
          title: "B\xE0i h\u1ECDc \u0111\u01B0\u1EE3c duy\u1EC7t th\xE0nh c\xF4ng!",
          message: `B\xE0i h\u1ECDc "${lesson.title}" \u0111\xE3 \u0111\u01B0\u1EE3c admin duy\u1EC7t. B\u1EA1n c\xF3 th\u1EC3 xu\u1EA5t b\u1EA3n ho\u1EB7c ti\u1EBFp t\u1EE5c ch\u1EC9nh s\u1EEDa.`,
          metadata: {
            lessonId,
            lessonTitle: lesson.title,
            status: "APPROVED",
            feedback: feedback || null,
            actionUrl: `/lecture/lessons/${lessonId}/edit`
          }
        });
      }
    }
    await prisma_default.lesson.update({
      where: { id: lessonId },
      data: { status: "APPROVED" }
    });
    review = await this.repository.createReview(lessonId, adminId, feedback);
    return review;
  }
  async reject(lessonId, adminId, feedback) {
    if (!feedback) {
      throw new Error("Feedback is required when rejecting");
    }
    const lesson = await prisma_default.lesson.findUnique({
      where: { id: lessonId }
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    const lessonRequest = await prisma_default.lessonRequest.findFirst({
      where: { lessonId },
      include: {
        lecture: {
          select: { id: true, email: true, fullName: true }
        }
      }
    });
    await prisma_default.lesson.update({
      where: { id: lessonId },
      data: {
        status: "REJECTED"
      }
    });
    if (lessonRequest && lessonRequest.id) {
      await prisma_default.lessonRequest.update({
        where: { id: lessonRequest.id },
        data: { status: "IN_PROGRESS" }
      });
    }
    const review = await this.repository.createReview(lessonId, adminId, feedback);
    if (lessonRequest?.lecture) {
      await email_service_default.sendLessonRejectedNotification(
        lessonRequest.lecture.email,
        lessonRequest.lecture.fullName || "Gi\u1EA3ng vi\xEAn",
        lesson.title,
        feedback
      );
      await notification_service_default.createNotification({
        userId: lessonRequest.lecture.id,
        type: "lesson_rejected",
        title: "B\xE0i h\u1ECDc b\u1ECB t\u1EEB ch\u1ED1i duy\u1EC7t",
        message: `B\xE0i h\u1ECDc "${lesson.title}" \u0111\xE3 b\u1ECB t\u1EEB ch\u1ED1i. L\xFD do: ${feedback}`,
        metadata: {
          lessonId,
          lessonTitle: lesson.title,
          status: "REJECTED",
          feedback,
          actionUrl: `/lecture/lessons/${lessonId}/edit`
        }
      });
    }
    return review;
  }
  async publish(lessonId, adminId) {
    const lesson = await prisma_default.lesson.findUnique({
      where: { id: lessonId },
      include: {
        phase: {
          include: {
            course: {
              include: {
                enrollments: {
                  select: { userId: true }
                }
              }
            }
          }
        }
      }
    });
    const lessonRequest = await prisma_default.lessonRequest.findFirst({
      where: { lessonId },
      include: {
        lecture: {
          select: { id: true, email: true, fullName: true }
        }
      }
    });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    if (lesson.status !== "APPROVED") {
      throw new Error("Lesson must be approved before publishing");
    }
    await prisma_default.lesson.update({
      where: { id: lessonId },
      data: {
        status: "PUBLISHED",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date()
      }
    });
    if (lessonRequest?.lecture) {
      await email_service_default.sendLessonApprovedNotification(
        lessonRequest.lecture.email,
        lessonRequest.lecture.fullName || "Gi\u1EA3ng vi\xEAn",
        lesson.title
      );
      await notification_service_default.createNotification({
        userId: lessonRequest.lecture.id,
        type: "lesson_published",
        title: "B\xE0i h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c xu\u1EA5t b\u1EA3n!",
        message: `B\xE0i h\u1ECDc "${lesson.title}" \u0111\xE3 \u0111\u01B0\u1EE3c xu\u1EA5t b\u1EA3n th\xE0nh c\xF4ng v\xE0 s\u1EB5n s\xE0ng cho h\u1ECDc vi\xEAn.`,
        metadata: {
          lessonId,
          lessonTitle: lesson.title,
          status: "PUBLISHED",
          courseId: lesson.phase.courseId,
          courseTitle: lesson.phase.course.title,
          actionUrl: `/lecture/lessons/${lessonId}/edit`
        }
      });
    }
    const enrolledUserIds = lesson.phase.course.enrollments.map((e) => e.userId);
    for (const userId of enrolledUserIds) {
      await notification_service_default.createNotification({
        userId,
        type: "new_lesson_available",
        title: "B\xE0i h\u1ECDc m\u1EDBi",
        message: `Kh\xF3a h\u1ECDc "${lesson.phase.course.title}" v\u1EEBa c\xF3 b\xE0i h\u1ECDc m\u1EDBi: "${lesson.title}"`
      });
      const user = await prisma_default.user.findUnique({ where: { id: userId } });
      if (user) {
        const lessonUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/khoa-hoc/${lessonId}`;
        await email_service_default.sendNewLessonNotification(
          user.email,
          user.fullName || user.username,
          lesson.phase.course.title,
          lesson.title,
          lessonUrl
        );
      }
    }
    if (lessonRequest && lessonRequest.id) {
      await prisma_default.lessonRequest.update({
        where: { id: lessonRequest.id },
        data: { status: "SUBMITTED" }
      });
    }
    if (lesson.phase.course.autoEnrollOnApproval) {
      await this.autoEnrollUsers(lesson.phase.course.id, lesson.phase.course.title, lesson.id, lesson.title);
    }
    return lesson;
  }
  /**
   * Auto enroll users who are not enrolled in the course
   */
  async autoEnrollUsers(courseId, courseTitle, lessonId, lessonTitle) {
    const usersToEnroll = await prisma_default.user.findMany({
      where: {
        role: {
          name: "user"
        },
        enrollments: {
          none: {
            courseId
          }
        },
        subscriptions: {
          none: {
            courseId
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true
      }
    });
    if (usersToEnroll.length === 0) {
      console.log(`[LessonReview] No users to auto-enroll for course: ${courseTitle}`);
      return;
    }
    await prisma_default.courseSubscription.createMany({
      data: usersToEnroll.map((user) => ({
        userId: user.id,
        courseId,
        status: "ACTIVE"
      })),
      skipDuplicates: true
    });
    console.log(`[LessonReview] Auto-enrolled ${usersToEnroll.length} users for course: ${courseTitle}`);
    const lessonUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/khoa-hoc/${courseId}`;
    for (const user of usersToEnroll) {
      await notification_service_default.createNotification({
        userId: user.id,
        type: "new_lesson_available",
        title: "B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm v\xE0o kh\xF3a h\u1ECDc",
        message: `B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm v\xE0o kh\xF3a h\u1ECDc "${courseTitle}" v\u1EDBi b\xE0i h\u1ECDc m\u1EDBi: "${lessonTitle}"`
      });
      await email_service_default.sendNewLessonNotification(
        user.email,
        user.fullName || user.username,
        courseTitle,
        lessonTitle,
        lessonUrl
      );
    }
  }
  async batchApprove(lessonIds, adminId) {
    const results = [];
    for (const lessonId of lessonIds) {
      try {
        const result = await this.approve(lessonId, adminId);
        results.push({ lessonId, success: true, result });
      } catch (error) {
        results.push({ lessonId, success: false, error: error.message });
      }
    }
    return results;
  }
  async batchPublish(lessonIds, adminId) {
    const results = [];
    for (const lessonId of lessonIds) {
      try {
        const result = await this.publish(lessonId, adminId);
        results.push({ lessonId, success: true, result });
      } catch (error) {
        results.push({ lessonId, success: false, error: error.message });
      }
    }
    return results;
  }
  async getAllReviews() {
    return this.repository.findAll();
  }
};
var lessonReview_service_default = new LessonReviewService();

// src/modules/lessonReview/controllers/lessonReview.controller.ts
var LessonReviewController = class extends BaseController {
  constructor() {
    super(lessonReview_service_default);
  }
  // Get all pending reviews
  getPendingReviews = async (req, res, next) => {
    try {
      const reviews = await this.service.getPendingReviews();
      return this.success(res, reviews, "Fetched pending reviews");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Get review details for a lesson
  getReviewDetails = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const review = await this.service.getReviewDetails(lessonId);
      return this.success(res, review, "Fetched review details");
    } catch (error) {
      return this.error(res, error.message, 404);
    }
  };
  // Approve a lesson
  approve = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const { feedback } = req.body;
      const adminId = req.user?.userId;
      if (!adminId) {
        return this.error(res, "User not authenticated", 401);
      }
      const result = await this.service.approve(lessonId, adminId, feedback);
      return this.success(res, result, "Lesson approved successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Reject a lesson
  reject = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const { feedback } = req.body;
      const adminId = req.user?.userId;
      if (!adminId) {
        return this.error(res, "User not authenticated", 401);
      }
      if (!feedback) {
        return this.error(res, "Feedback is required when rejecting", 400);
      }
      const result = await this.service.reject(lessonId, adminId, feedback);
      return this.success(res, result, "Lesson rejected");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Publish a lesson
  publish = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const adminId = req.user?.userId;
      if (!adminId) {
        return this.error(res, "User not authenticated", 401);
      }
      const result = await this.service.publish(lessonId, adminId);
      return this.success(res, result, "Lesson published successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Batch approve lessons
  batchApprove = async (req, res, next) => {
    try {
      const { lessonIds } = req.body;
      const adminId = req.user?.userId;
      if (!adminId) {
        return this.error(res, "User not authenticated", 401);
      }
      if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
        return this.error(res, "lessonIds array is required", 400);
      }
      const results = await this.service.batchApprove(lessonIds, adminId);
      return this.success(res, results, "Batch approval completed");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Batch publish lessons
  batchPublish = async (req, res, next) => {
    try {
      const { lessonIds } = req.body;
      const adminId = req.user?.userId;
      if (!adminId) {
        return this.error(res, "User not authenticated", 401);
      }
      if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
        return this.error(res, "lessonIds array is required", 400);
      }
      const results = await this.service.batchPublish(lessonIds, adminId);
      return this.success(res, results, "Batch publish completed");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Get all reviews
  getAllReviews = async (req, res, next) => {
    try {
      const reviews = await this.service.getAllReviews();
      return this.success(res, reviews, "Fetched all reviews");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
};
var lessonReview_controller_default = new LessonReviewController();

// src/modules/lessonReview/routes/lessonReview.routes.ts
var router26 = (0, import_express26.Router)();
router26.use(verifyToken);
router26.use(requireAdmin);
router26.get("/pending", lessonReview_controller_default.getPendingReviews);
router26.get("/", lessonReview_controller_default.getAllReviews);
router26.get("/:lessonId", lessonReview_controller_default.getReviewDetails);
router26.put("/:lessonId/approve", lessonReview_controller_default.approve);
router26.put("/:lessonId/reject", lessonReview_controller_default.reject);
router26.put("/:lessonId/publish", lessonReview_controller_default.publish);
router26.put("/batch/approve", lessonReview_controller_default.batchApprove);
router26.put("/batch/publish", lessonReview_controller_default.batchPublish);
var lessonReview_routes_default = router26;

// src/modules/scoring/routes/scoring.routes.ts
var import_express27 = require("express");

// src/modules/scoring/controllers/scoring.controller.ts
var ScoringController = class extends BaseController {
  constructor() {
    super(scoring_service_default);
  }
  // Run code against test cases (preview, no save)
  run = async (req, res, next) => {
    try {
      const { lessonId, code, language } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      if (!lessonId || !code) {
        return this.error(res, "lessonId and code are required", 400);
      }
      const results = await scoring_service_default.runCode(lessonId, code, language || "javascript");
      return this.success(res, results, "Code run completed");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Submit and calculate score
  submit = async (req, res, next) => {
    try {
      const { lessonId, code, language, hintsUsed, timeUsed } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      if (!lessonId || !code) {
        return this.error(res, "lessonId and code are required", 400);
      }
      const submission = await scoring_service_default.saveSubmission(
        lessonId,
        userId,
        code,
        language || "javascript",
        hintsUsed || 0,
        timeUsed || null
      );
      return this.success(res, submission, "Submission scored successfully");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Get user submissions for a lesson
  getMySubmissions = async (req, res, next) => {
    try {
      const lessonId = req.params.lessonId;
      const userId = req.user?.userId;
      if (!userId) {
        return this.error(res, "User not authenticated", 401);
      }
      const submissions = await scoring_service_default.getUserSubmissions(lessonId, userId);
      return this.success(res, submissions, "Fetched submissions");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
  // Get submission details
  getSubmissionDetails = async (req, res, next) => {
    try {
      const submissionId = req.params.submissionId;
      const submission = await scoring_service_default.getSubmissionById(submissionId);
      if (!submission) {
        return this.error(res, "Submission not found", 404);
      }
      return this.success(res, submission, "Fetched submission details");
    } catch (error) {
      return this.error(res, error.message, 400);
    }
  };
};
var scoring_controller_default = new ScoringController();

// src/modules/scoring/routes/scoring.routes.ts
var router27 = (0, import_express27.Router)();
router27.use(verifyToken);
router27.post("/run", scoring_controller_default.run);
router27.post("/submit", scoring_controller_default.submit);
router27.get("/submissions/:lessonId", scoring_controller_default.getMySubmissions);
router27.get("/submission/:submissionId", scoring_controller_default.getSubmissionDetails);
var scoring_routes_default = router27;

// src/modules/courseAccess/courseAccess.routes.ts
var import_express28 = require("express");

// src/modules/courseAccess/courseAccess.service.ts
var CODE_PREFIX = "CFE-";
var CODE_LENGTH = 20;
var CourseAccessService = class {
  /**
   * Generate code với format CFE-XXXXXXXXXXXXXXXXXXXX
   */
  generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomPart = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${CODE_PREFIX}${randomPart}`;
  }
  /**
   * Tạo access code cho khóa học (1 mã)
   */
  async createAccessCode(courseId, createdBy) {
    const course = await prisma_default.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new Error("Course not found");
    }
    let code = this.generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma_default.activateCode.findUnique({ where: { code } });
      if (!existing) break;
      code = this.generateCode();
      attempts++;
    }
    const accessCode = await prisma_default.activateCode.create({
      data: {
        code,
        courseId,
        createdBy,
        type: "ADMIN_CREATED",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
        // 30 days
      },
      include: {
        course: { select: { id: true, title: true } }
      }
    });
    return accessCode;
  }
  /**
   * Tạo nhiều access codes (bulk)
   */
  async createBulkAccessCodes(courseId, createdBy, count) {
    const course = await prisma_default.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new Error("Course not found");
    }
    const codes = [];
    for (let i = 0; i < count; i++) {
      let code = this.generateCode();
      let attempts = 0;
      while (attempts < 10) {
        const existing = await prisma_default.activateCode.findUnique({ where: { code } });
        if (!existing) break;
        code = this.generateCode();
        attempts++;
      }
      const accessCode = await prisma_default.activateCode.create({
        data: {
          code,
          courseId,
          createdBy,
          type: "BULK_GENERATED",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
        },
        include: {
          course: { select: { id: true, title: true } }
        }
      });
      codes.push(accessCode);
    }
    return codes;
  }
  /**
   * Gán khóa học cho user cụ thể (bằng email)
   */
  async grantAccessToUser(courseId, email, grantedBy) {
    const user = await prisma_default.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const course = await prisma_default.course.findUnique({
      where: { id: courseId },
      include: { creator: true }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const enrollment = await prisma_default.enrollment.upsert({
      where: {
        userId_courseId: { userId: user.id, courseId }
      },
      update: {},
      create: {
        userId: user.id,
        courseId
      }
    });
    await prisma_default.courseSubscription.upsert({
      where: {
        userId_courseId: { userId: user.id, courseId }
      },
      update: {},
      create: {
        userId: user.id,
        courseId,
        status: "ACTIVE"
      }
    });
    await notification_service_default.createNotification({
      userId: user.id,
      type: "course_access_granted",
      title: "B\u1EA1n \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp kh\xF3a h\u1ECDc",
      message: `B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp kh\xF3a h\u1ECDc "${course.title}". B\u1EA1n c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u h\u1ECDc ngay!`,
      metadata: { courseId, type: "course_assigned" }
    });
    const courseUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/courses/${courseId}`;
    await email_service_default.sendCourseAccessGrantedNotification(
      user.email,
      user.fullName || user.username,
      course.title,
      courseUrl
    );
    return enrollment;
  }
  /**
   * Gán khóa học cho nhiều users (bulk assignment)
   */
  async assignToUsers(courseId, userIds, adminId) {
    const course = await prisma_default.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new Error("Course not found");
    }
    const results = [];
    for (const userId of userIds) {
      const user = await prisma_default.user.findUnique({ where: { id: userId } });
      if (!user) continue;
      const enrollment = await prisma_default.enrollment.upsert({
        where: {
          userId_courseId: { userId, courseId }
        },
        update: {},
        create: {
          userId,
          courseId,
          // Progressive unlock: mở khóa unlockLessonsCount bài đầu tiên
          currentUnlocks: course.unlockLessonsCount || 3,
          completedLessons: 0
        }
      });
      await prisma_default.courseSubscription.upsert({
        where: {
          userId_courseId: { userId, courseId }
        },
        update: {},
        create: {
          userId,
          courseId,
          status: "ACTIVE"
        }
      });
      await notification_service_default.createNotification({
        userId,
        type: "course_assigned",
        title: "B\u1EA1n \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp kh\xF3a h\u1ECDc",
        message: `B\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp kh\xF3a h\u1ECDc "${course.title}". B\u1EA1n c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u h\u1ECDc ngay!`,
        metadata: { courseId, type: "course_assigned" }
      });
      const courseUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/user/courses/${courseId}`;
      await email_service_default.sendCourseAccessGrantedNotification(
        user.email,
        user.fullName || user.username,
        course.title,
        courseUrl
      );
      results.push({ userId, userEmail: user.email, userName: user.fullName || user.username, enrollment });
    }
    return {
      courseId,
      courseTitle: course.title,
      assignedCount: results.length,
      results
    };
  }
  /**
   * Lấy danh sách users chưa enroll vào khóa học
   */
  async getUsersNotEnrolled(courseId, search) {
    const enrollments = await prisma_default.enrollment.findMany({
      where: { courseId },
      select: { userId: true }
    });
    const enrolledUserIds = enrollments.map((e) => e.userId);
    const whereClause = {
      isActive: true,
      id: { notIn: enrolledUserIds.length > 0 ? enrolledUserIds : [""] }
    };
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } }
      ];
    }
    const users = await prisma_default.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        school: true
      },
      take: 50,
      orderBy: { createdAt: "desc" }
    });
    return users;
  }
  /**
   * Kích hoạt khóa học bằng code
   */
  async activateByCode(code, userId) {
    const normalizedCode = code.toUpperCase().trim();
    const accessCode = await prisma_default.activateCode.findUnique({
      where: { code: normalizedCode },
      include: { course: true }
    });
    if (!accessCode) {
      throw new Error("M\xE3 k\xEDch ho\u1EA1t kh\xF4ng h\u1EE3p l\u1EC7");
    }
    if (accessCode.isUsed) {
      throw new Error("M\xE3 k\xEDch ho\u1EA1t \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng");
    }
    if (accessCode.expiresAt && accessCode.expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("M\xE3 k\xEDch ho\u1EA1t \u0111\xE3 h\u1EBFt h\u1EA1n");
    }
    const existingEnrollment = await prisma_default.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: accessCode.courseId } }
    });
    if (existingEnrollment) {
      throw new Error("B\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD kh\xF3a h\u1ECDc n\xE0y r\u1ED3i");
    }
    await prisma_default.activateCode.update({
      where: { id: accessCode.id },
      data: {
        isUsed: true,
        usedBy: userId,
        usedAt: /* @__PURE__ */ new Date()
      }
    });
    const enrollment = await prisma_default.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId: accessCode.courseId }
      },
      update: {},
      create: {
        userId,
        courseId: accessCode.courseId,
        // Progressive unlock: mở khóa unlockLessonsCount bài đầu tiên
        currentUnlocks: accessCode.course.unlockLessonsCount || 3,
        completedLessons: 0
      }
    });
    await prisma_default.courseSubscription.upsert({
      where: {
        userId_courseId: { userId, courseId: accessCode.courseId }
      },
      update: {},
      create: {
        userId,
        courseId: accessCode.courseId,
        status: "ACTIVE"
      }
    });
    await notification_service_default.createNotification({
      userId,
      type: "course_access_with_code",
      title: "K\xEDch ho\u1EA1t kh\xF3a h\u1ECDc th\xE0nh c\xF4ng",
      message: `B\u1EA1n \u0111\xE3 k\xEDch ho\u1EA1t th\xE0nh c\xF4ng kh\xF3a h\u1ECDc "${accessCode.course.title}". Ch\xFAc b\u1EA1n h\u1ECDc t\u1ED1t!`,
      metadata: { courseId: accessCode.courseId, type: "course_activated" }
    });
    return {
      enrollment,
      course: accessCode.course,
      unlockConfig: {
        unlockedLessons: accessCode.course.unlockLessonsCount || 3,
        message: `B\u1EA1n \u0111\xE3 m\u1EDF kh\xF3a ${accessCode.course.unlockLessonsCount || 3} b\xE0i h\u1ECDc \u0111\u1EA7u ti\xEAn. Ho\xE0n th\xE0nh \u0111\u1EC3 m\u1EDF th\xEAm!`
      }
    };
  }
  /**
   * Kích hoạt khóa học bằng code (không cần user đăng nhập - qua email link)
   */
  async activateByCodeLink(code) {
    const normalizedCode = code.toUpperCase().trim();
    const accessCode = await prisma_default.activateCode.findUnique({
      where: { code: normalizedCode },
      include: { course: true }
    });
    if (!accessCode) {
      throw new Error("M\xE3 k\xEDch ho\u1EA1t kh\xF4ng h\u1EE3p l\u1EC7");
    }
    if (accessCode.isUsed) {
      throw new Error("M\xE3 k\xEDch ho\u1EA1t \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng");
    }
    if (accessCode.expiresAt && accessCode.expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("M\xE3 k\xEDch ho\u1EA1t \u0111\xE3 h\u1EBFt h\u1EA1n");
    }
    return {
      valid: true,
      code: accessCode.code,
      courseId: accessCode.courseId,
      courseTitle: accessCode.course.title
    };
  }
  /**
   * Lấy danh sách codes của khóa học
   */
  async getCodesByCourse(courseId) {
    return prisma_default.activateCode.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, username: true, email: true, fullName: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  /**
   * Xóa access code
   */
  async deleteCode(codeId) {
    await prisma_default.activateCode.delete({ where: { id: codeId } });
  }
  /**
   * Lấy danh sách enrollments của khóa học với thông tin user và progress
   */
  async getEnrollments(courseId) {
    const course = await prisma_default.course.findUnique({
      where: { id: courseId },
      include: {
        phases: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true }
            }
          }
        }
      }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);
    const enrollments = await prisma_default.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            avatar: true
          }
        },
        coach: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const completedCount = await prisma_default.lessonProgress.count({
          where: {
            userId: enrollment.userId,
            isCompleted: true,
            lesson: {
              phase: {
                courseId
              }
            }
          }
        });
        return {
          ...enrollment,
          totalLessons,
          completedLessons: completedCount,
          unlockedLessons: enrollment.currentUnlocks
        };
      })
    );
    return enrollmentsWithProgress;
  }
  /**
   * Cập nhật số bài đã mở khóa cho user
   */
  async updateUserUnlocks(courseId, userId, currentUnlocks) {
    const course = await prisma_default.course.findUnique({
      where: { id: courseId },
      include: {
        phases: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true }
            }
          }
        }
      }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);
    if (currentUnlocks > totalLessons) {
      throw new Error(`Cannot unlock more than ${totalLessons} lessons`);
    }
    const enrollment = await prisma_default.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });
    if (!enrollment) {
      throw new Error("User is not enrolled in this course");
    }
    const updatedEnrollment = await prisma_default.enrollment.update({
      where: {
        userId_courseId: { userId, courseId }
      },
      data: {
        currentUnlocks
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });
    await notification_service_default.createNotification({
      userId,
      type: "lessons_unlocked",
      title: "B\xE0i h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c m\u1EDF kh\xF3a",
      message: `Admin \u0111\xE3 m\u1EDF kh\xF3a th\xEAm b\xE0i h\u1ECDc cho b\u1EA1n. B\xE2y gi\u1EDD b\u1EA1n c\xF3 th\u1EC3 truy c\u1EADp ${currentUnlocks} b\xE0i h\u1ECDc!`,
      metadata: { courseId, currentUnlocks }
    });
    return {
      enrollment: updatedEnrollment,
      totalLessons,
      previousUnlocks: enrollment.currentUnlocks,
      newUnlocks: currentUnlocks
    };
  }
  /**
   * Mở khóa toàn bộ bài học cho user
   */
  async unlockAllLessonsForUser(courseId, userId) {
    const course = await prisma_default.course.findUnique({
      where: { id: courseId },
      include: {
        phases: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true }
            }
          }
        }
      }
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const totalLessons = course.phases.reduce((acc, p) => acc + p.lessons.length, 0);
    const enrollment = await prisma_default.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });
    if (!enrollment) {
      throw new Error("User is not enrolled in this course");
    }
    const updatedEnrollment = await prisma_default.enrollment.update({
      where: {
        userId_courseId: { userId, courseId }
      },
      data: {
        currentUnlocks: totalLessons
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });
    await notification_service_default.createNotification({
      userId,
      type: "all_lessons_unlocked",
      title: "To\xE0n b\u1ED9 b\xE0i h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c m\u1EDF kh\xF3a!",
      message: `Admin \u0111\xE3 m\u1EDF kh\xF3a to\xE0n b\u1ED9 b\xE0i h\u1ECDc trong kh\xF3a h\u1ECDc "${course.title}". B\u1EA1n c\xF3 th\u1EC3 h\u1ECDc t\u1EA5t c\u1EA3 ngay b\xE2y gi\u1EDD!`,
      metadata: { courseId, currentUnlocks: totalLessons }
    });
    return {
      enrollment: updatedEnrollment,
      totalLessons,
      previousUnlocks: enrollment.currentUnlocks,
      newUnlocks: totalLessons
    };
  }
};
var courseAccess_service_default = new CourseAccessService();

// src/modules/courseAccess/courseAccess.controller.ts
var CourseAccessController = class extends BaseController {
  constructor() {
    super(void 0);
  }
  /**
   * Tạo access code cho khóa học
   * POST /api/course-access/:courseId/codes
   */
  createCode = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const adminId = req.user?.userId;
      const code = await courseAccess_service_default.createAccessCode(Array.isArray(courseId) ? courseId[0] : courseId, adminId || "");
      this.success(res, code, "Access code created", 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Tạo nhiều access codes
   * POST /api/course-access/:courseId/codes/bulk
   */
  createBulkCodes = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { count = 1 } = req.body;
      const adminId = req.user?.userId;
      const codes = await courseAccess_service_default.createBulkAccessCodes(Array.isArray(courseId) ? courseId[0] : courseId, adminId || "", count);
      this.success(res, codes, `${codes.length} codes created`, 201);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Gán quyền cho user bằng email
   * POST /api/course-access/:courseId/grant
   */
  grantAccess = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { email } = req.body;
      const adminId = req.user?.userId;
      const result = await courseAccess_service_default.grantAccessToUser(Array.isArray(courseId) ? courseId[0] : courseId, email, adminId || "");
      this.success(res, result, "Access granted to user");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Gán quyền cho nhiều users
   * POST /api/course-access/:courseId/assign-users
   */
  assignToUsers = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { userIds } = req.body;
      const adminId = req.user?.userId;
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        this.error(res, "userIds is required and must be an array", 400);
        return;
      }
      const result = await courseAccess_service_default.assignToUsers(Array.isArray(courseId) ? courseId[0] : courseId, userIds, adminId || "");
      this.success(res, result, `${result.assignedCount} users assigned`);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách users chưa enroll
   * GET /api/course-access/:courseId/users/not-enrolled
   */
  getUsersNotEnrolled = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { search } = req.query;
      const users = await courseAccess_service_default.getUsersNotEnrolled(Array.isArray(courseId) ? courseId[0] : courseId, search);
      this.success(res, users, "Users retrieved");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Kích hoạt khóa học bằng code (user)
   * POST /api/course-access/activate
   */
  activateByCode = async (req, res, next) => {
    try {
      const { code } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        this.error(res, "Unauthorized", 401);
        return;
      }
      const result = await courseAccess_service_default.activateByCode(code, userId);
      this.success(res, result, "Course activated successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Validate code (không cần đăng nhập - cho email link)
   * GET /api/course-access/activate/:code
   */
  validateCodeLink = async (req, res, next) => {
    try {
      const { code } = req.params;
      const result = await courseAccess_service_default.activateByCodeLink(Array.isArray(code) ? code[0] : code);
      this.success(res, result, "Code is valid");
    } catch (error) {
      this.error(res, error.message, 400);
    }
  };
  /**
   * Lấy danh sách codes của khóa học
   * GET /api/course-access/:courseId/codes
   */
  getCodes = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const codes = await courseAccess_service_default.getCodesByCourse(Array.isArray(courseId) ? courseId[0] : courseId);
      this.success(res, codes, "Codes retrieved");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Xóa access code
   * DELETE /api/course-access/codes/:codeId
   */
  deleteCode = async (req, res, next) => {
    try {
      const { codeId } = req.params;
      await courseAccess_service_default.deleteCode(Array.isArray(codeId) ? codeId[0] : codeId);
      this.success(res, null, "Code deleted");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Lấy danh sách users đã enroll
   * GET /api/course-access/:courseId/enrollments
   */
  getEnrollments = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const enrollments = await courseAccess_service_default.getEnrollments(Array.isArray(courseId) ? courseId[0] : courseId);
      this.success(res, enrollments, "Enrollments retrieved");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Cập nhật số bài đã mở khóa cho user (admin unlock)
   * PUT /api/course-access/:courseId/enrollments/:userId/unlock
   */
  updateUserUnlocks = async (req, res, next) => {
    try {
      const { courseId, userId } = req.params;
      const { currentUnlocks } = req.body;
      if (typeof currentUnlocks !== "number" || currentUnlocks < 0) {
        this.error(res, "currentUnlocks must be a positive number", 400);
        return;
      }
      const result = await courseAccess_service_default.updateUserUnlocks(
        Array.isArray(courseId) ? courseId[0] : courseId,
        Array.isArray(userId) ? userId[0] : userId,
        currentUnlocks
      );
      this.success(res, result, "Unlocks updated successfully");
    } catch (error) {
      next(error);
    }
  };
  /**
   * Mở khóa toàn bộ bài học cho user
   * POST /api/course-access/:courseId/enrollments/:userId/unlock-all
   */
  unlockAllLessons = async (req, res, next) => {
    try {
      const { courseId, userId } = req.params;
      const result = await courseAccess_service_default.unlockAllLessonsForUser(
        Array.isArray(courseId) ? courseId[0] : courseId,
        Array.isArray(userId) ? userId[0] : userId
      );
      this.success(res, result, "All lessons unlocked for user");
    } catch (error) {
      next(error);
    }
  };
};
var courseAccess_controller_default = new CourseAccessController();

// src/modules/courseAccess/courseAccess.routes.ts
var router28 = (0, import_express28.Router)();
router28.post("/:courseId/codes", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.createCode(req, res, next);
});
router28.post("/:courseId/codes/bulk", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.createBulkCodes(req, res, next);
});
router28.post("/:courseId/grant", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.grantAccess(req, res, next);
});
router28.post("/:courseId/assign-users", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.assignToUsers(req, res, next);
});
router28.get("/:courseId/users/not-enrolled", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.getUsersNotEnrolled(req, res, next);
});
router28.post("/activate", verifyToken, (req, res, next) => {
  courseAccess_controller_default.activateByCode(req, res, next);
});
router28.get("/activate/:code", (req, res, next) => {
  courseAccess_controller_default.validateCodeLink(req, res, next);
});
router28.get("/:courseId/codes", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.getCodes(req, res, next);
});
router28.delete("/codes/:codeId", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.deleteCode(req, res, next);
});
router28.get("/:courseId/enrollments", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.getEnrollments(req, res, next);
});
router28.put("/:courseId/enrollments/:userId/unlock", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.updateUserUnlocks(req, res, next);
});
router28.post("/:courseId/enrollments/:userId/unlock-all", verifyToken, requireAdmin, (req, res, next) => {
  courseAccess_controller_default.unlockAllLessons(req, res, next);
});
var courseAccess_routes_default = router28;

// src/modules/ai/routes/ai.routes.ts
var import_express29 = require("express");

// src/services/ai.service.ts
var AIService = class {
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  getApiKey() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    return key;
  }
  async generateHints(request) {
    const { lessonContent, lessonTitle, description, numHints = 3 } = request;
    const prompt = this.buildHintsPrompt(lessonContent, lessonTitle, description, numHints);
    const response = await this.callGemini(prompt);
    return this.parseHintsResponse(response, numHints);
  }
  async chat(request) {
    const { message, context } = request;
    const prompt = this.buildChatPrompt(message, context);
    const response = await this.callGemini(prompt);
    return this.parseChatResponse(response);
  }
  async chatWithHistory(request) {
    const { message, history } = request;
    const historySection = history.length > 0 ? "\nLich su cuoc tro chuyen:\n" + history.map((m) => `${m.role === "user" ? "Nguoi dung" : "Tro ly"}: ${m.parts}`).join("\n") : "";
    const prompt = `Ban la mot tro ly AI thong minh cua nen tang hoc lap trinh Codefit.
Ho ten: Codey - tro ly AI cua Codefit

Khi nguoi dung hoi ve bai hoc hoac bai tap, hay:
1. Giai thich kha chi tiet, dua ra vi du minh hoa
2. Danh ra cac buoc giai quyet (neu la bai tap)
3. Go y cac goi y huong dan (neu can)

Neu nguoi dung hoi ve chu de chung:
1. Tra loi ngan gon, de hieu
2. Neu can, goi y cac bai hoc lien quan tren Codefit

${historySection}

Tin nhan cua nguoi dung: "${message}"

Dinh dang tra loi (chi tra ve JSON, khong giai thich gi them):
\`\`\`json
{
  "response": "Noi dung tra loi cua ban, co the co nhieu dong neu can. Su dung tieng Viet co dau.",
  "suggestions": ["Goi y 1", "Goi y 2", "Goi y 3"]
}
\`\`\`

Luu y:
- suggestions la 3 cau hoi hoac hanh dong nguoi dung co the chon tiep theo
- Neu cau hoi khong lien quan den lap trinh, van tra loi binh thuong nhung giu tin nhan ngan hon
- Phong cach th\xE2n thi\u1EC7n, g\u1EA7n g\u0169i, nh\u01B0 m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n \u0111\u1ED3ng h\xE0nh
- Su dung lich su de hieu ngon ngu va phong cach cua nguoi dung
`;
    const response = await this.callGemini(prompt);
    return this.parseChatResponse(response);
  }
  buildChatPrompt(message, context) {
    let contextSection = "";
    if (context?.lessonTitle) {
      contextSection += `
- Bai hoc hien tai: ${context.lessonTitle}`;
    }
    if (context?.lessonContent) {
      contextSection += `
- Noi dung bai hoc:
${context.lessonContent}`;
    }
    if (context?.minitestTitle) {
      contextSection += `
- Minitest hien tai: ${context.minitestTitle}`;
    }
    return `Ban la mot tro ly AI thong minh cua nen tang hoc lap trinh Codefit.
Ho ten: Codey - tro ly AI cua Codefit

Khi nguoi dung hoi ve bai hoc hoac bai tap, hay:
1. Giai thich kha chi tiet, dua ra vi du minh hoa
2. Danh ra cac buoc giai quyet (neu la bai tap)
3. Go y cac goi y huong dan (neu can)

Neu nguoi dung hoi ve chu de chung:
1. Tra loi ngan gon, de hieu
2. Neu can, goi y cac bai hoc lien quan tren Codefit

${contextSection ? `
Nguyen cuong tro giup (neu co):${contextSection}` : ""}

Tin nhan cua nguoi dung: "${message}"

Dinh dang tra loi (chi tra ve JSON, khong giai thich gi them):
\`\`\`json
{
  "response": "Noi dung tra loi cua ban, co the co nhieu dong neu can. Su dung tieng Viet co dau.",
  "suggestions": ["Goi y 1", "Goi y 2", "Goi y 3"]
}
\`\`\`

Luu y:
- suggestions la 3 cau hoi hoac hanh dong nguoi dung co the chon tiep theo
- Neu cau hoi khong lien quan den lap trinh, van tra loi binh thuong nhung giu tin nhan ngan hon
- Phong cach th\xE2n thi\u1EC7n, g\u1EA7n g\u0169i, nh\u01B0 m\u1ED9t ng\u01B0\u1EDDi b\u1EA1n \u0111\u1ED3ng h\xE0nh
`;
  }
  parseChatResponse(responseText) {
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, responseText.trim()];
    const jsonStr = jsonMatch[1] || responseText.trim();
    try {
      const parsed = JSON.parse(jsonStr);
      return {
        response: parsed.response || "Xin l\u1ED7i, m\xECnh ch\u01B0a hi\u1EC3u \xFD b\u1EA1n. B\u1EA1n c\xF3 th\u1EC3 h\u1ECFi l\u1EA1i \u0111\u01B0\u1EE3c kh\xF4ng?",
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : []
      };
    } catch {
      return {
        response: jsonStr.replace(/```json|```/g, "").trim(),
        suggestions: []
      };
    }
  }
  buildHintsPrompt(content, title, description, numHints) {
    const descSection = description ? `
Mo ta bai hoc: ${description}` : "";
    return `Ban la mot chuyen gia giao duc lap trinh. Hanh dong nhu mot truong pho giao duc (Head of Education).

Nhiem vu: Tao ${numHints} goi y (hints) cho bai hoc lap trinh.

Thong tin bai hoc:
- Tieu de: ${title}
${descSection}
- Noi dung bai hoc:
---
${content}
---

Yeu cau:
1. Tao dung ${numHints} goi y, moi goi y la mot giai thich, goi y hoac dia chi chi tiet de giup hoc sinh giai quyet bai tap.
2. Cac goi y phai xoay quanh noi dung bai hoc va ham tao ra loi giai (khong phai giai phap hoan chinh).
3. Cac goi y phai duoc sap xep theo thu tu tu de den chi tiet (hint 1 la goi y chung nhat, hint cuoi cung la chi tiet nhat).
4. Moi goi y chi nen ngan gon, 1-3 cau.
5. Khong tra loi truc tiep bai tap ma chi danh hoac goi y huong dan.

Dinh dang tra loi (chi tra ve JSON, khong giai thich gi them):
\`\`\`json
{
  "hints": [
    { "content": "Noi dung goi y 1", "order": 1 },
    { "content": "Noi dung goi y 2", "order": 2 },
    { "content": "Noi dung goi y 3", "order": 3 }
  ]
}
\`\`\`
`;
  }
  async callGemini(prompt) {
    const apiKey = this.getApiKey();
    const url = `${this.GEMINI_API_URL}?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        const errorMsg = errorData?.error?.message || errorData?.error?.details?.[0]?.description || errorData?.error?.status || `Gemini API error: ${response.status}`;
        throw new Error(errorMsg);
      } catch (parseErr) {
        if (parseErr.message.includes("Gemini API")) {
          throw parseErr;
        }
        throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`);
      }
    }
    const data = await response.json();
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
    }
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error("No response from Gemini API");
    }
    return candidate.content.parts[0].text;
  }
  parseHintsResponse(responseText, expectedCount) {
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, responseText.trim()];
    const jsonStr = jsonMatch[1] || responseText.trim();
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      const objMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try {
          parsed = JSON.parse(objMatch[0]);
        } catch {
          throw new Error("Failed to parse AI response as JSON");
        }
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }
    const hints = parsed.hints || parsed.hint || [];
    if (!Array.isArray(hints) || hints.length === 0) {
      throw new Error("AI response does not contain valid hints");
    }
    return hints.slice(0, expectedCount).map((h, index) => ({
      content: String(h.content || h.text || h.hint || "").trim(),
      order: index + 1,
      // Penalty is intentionally left as 0 here — lecture must manually enter it
      penalty: 0
    }));
  }
};
var ai_service_default = new AIService();

// src/modules/ai/controllers/ai.controller.ts
var AIController = class {
  // Generate hints using AI
  generateHints = async (req, res, next) => {
    try {
      const { lessonId, numHints } = req.body;
      if (!lessonId) {
        return res.status(400).json({ success: false, message: "lessonId is required" });
      }
      const lesson = await prisma_default.lesson.findUnique({
        where: { id: lessonId }
      });
      if (!lesson) {
        return res.status(404).json({ success: false, message: "Lesson not found" });
      }
      const lessonContent = await prisma_default.lessonContent.findUnique({
        where: { lessonId }
      });
      const content = lessonContent?.content || "";
      const lessonRequests = await prisma_default.lessonRequest.findMany({
        where: { lessonId },
        select: { notes: true },
        take: 1,
        orderBy: { createdAt: "desc" }
      });
      const description = lessonRequests[0]?.notes || void 0;
      if (!content || content.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: "No lesson content available to generate hints from. Please write some lesson content first."
        });
      }
      const hints = await ai_service_default.generateHints({
        lessonContent: content,
        lessonTitle: lesson.title,
        description,
        numHints: Math.min(Math.max(parseInt(numHints) || 3, 1), 5)
      });
      await prisma_default.aIRequest.create({
        data: {
          userId: req.user?.userId || "unknown",
          prompt: `Generate ${numHints || 3} hints for lesson: ${lesson.title}`,
          response: JSON.stringify(hints)
        }
      });
      return res.status(200).json({
        success: true,
        data: hints,
        message: `Generated ${hints.length} hints successfully`
      });
    } catch (error) {
      console.error("AI generate hints error:", error.message);
      const statusCode = error.message.includes("not found") ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to generate hints"
      });
    }
  };
  // Chat with AI
  chat = async (req, res, next) => {
    try {
      const { message, context } = req.body;
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "message is required" });
      }
      let fullContext = context;
      if (context?.lessonId) {
        const lesson = await prisma_default.lesson.findUnique({
          where: { id: context.lessonId }
        });
        if (lesson) {
          const lessonContent = await prisma_default.lessonContent.findUnique({
            where: { lessonId: context.lessonId }
          });
          fullContext = {
            ...context,
            lessonTitle: lesson.title,
            lessonContent: lessonContent?.content || ""
          };
        }
      }
      const result = await ai_service_default.chat({ message, context: fullContext });
      await prisma_default.aIRequest.create({
        data: {
          userId: req.user?.userId || "unknown",
          prompt: message,
          response: result.response
        }
      });
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error("AI chat error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to chat with AI"
      });
    }
  };
  // Get all conversations for current user
  getConversations = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const conversations = await prisma_default.conversation.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true }
          },
          _count: {
            select: { messages: true }
          }
        },
        orderBy: { updatedAt: "desc" }
      });
      const formatted = conversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messageCount: conv._count.messages,
        lastMessage: conv.messages[0]?.content?.substring(0, 50) || null
      }));
      return res.status(200).json({ success: true, data: formatted });
    } catch (error) {
      console.error("Get conversations error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get conversations"
      });
    }
  };
  // Get single conversation with messages
  getConversation = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const conversation = await prisma_default.conversation.findFirst({
        where: { id: req.params.id, userId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" }
          }
        }
      });
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
      }
      const messages = conversation.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        suggestions: msg.suggestions ? JSON.parse(msg.suggestions) : null,
        timestamp: msg.createdAt
      }));
      return res.status(200).json({
        success: true,
        data: {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          messages
        }
      });
    } catch (error) {
      console.error("Get conversation error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get conversation"
      });
    }
  };
  // Create new conversation
  createConversation = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const conversation = await prisma_default.conversation.create({
        data: {
          userId,
          title: "Cu\u1ED9c tr\xF2 chuy\u1EC7n m\u1EDBi"
        }
      });
      return res.status(201).json({
        success: true,
        data: {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt
        }
      });
    } catch (error) {
      console.error("Create conversation error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create conversation"
      });
    }
  };
  // Update conversation title
  updateConversation = async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const userId = req.user?.userId;
      if (!title || typeof title !== "string") {
        return res.status(400).json({ success: false, message: "title is required" });
      }
      const conversation = await prisma_default.conversation.findFirst({
        where: { id: req.params.id, userId }
      });
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
      }
      await prisma_default.conversation.update({
        where: { id: req.params.id },
        data: { title }
      });
      return res.status(200).json({ success: true, message: "Conversation updated" });
    } catch (error) {
      console.error("Update conversation error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update conversation"
      });
    }
  };
  // Delete conversation
  deleteConversation = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const conversation = await prisma_default.conversation.findFirst({
        where: { id: req.params.id, userId }
      });
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
      }
      await prisma_default.conversation.delete({ where: { id: req.params.id } });
      return res.status(200).json({ success: true, message: "Conversation deleted" });
    } catch (error) {
      console.error("Delete conversation error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete conversation"
      });
    }
  };
  // Send message in conversation (with history context)
  sendMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const userId = req.user?.userId;
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "message is required" });
      }
      const conversation = await prisma_default.conversation.findFirst({
        where: { id: req.params.id, userId },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 20
          }
        }
      });
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found" });
      }
      const userMsg = await prisma_default.conversationMessage.create({
        data: {
          conversationId: req.params.id,
          role: "user",
          content: message
        }
      });
      await prisma_default.conversation.update({
        where: { id: req.params.id },
        data: { updatedAt: /* @__PURE__ */ new Date() }
      });
      const historyMessages = conversation.messages.reverse().map((m) => ({
        role: m.role,
        parts: m.content
      }));
      const result = await ai_service_default.chatWithHistory({
        message,
        history: historyMessages
      });
      const assistantMsg = await prisma_default.conversationMessage.create({
        data: {
          conversationId: req.params.id,
          role: "assistant",
          content: result.response,
          suggestions: JSON.stringify(result.suggestions || [])
        }
      });
      if (conversation.title === "Cu\u1ED9c tr\xF2 chuy\u1EC7n m\u1EDBi" && message.trim().length > 0) {
        const newTitle = message.trim().substring(0, 50) + (message.length > 50 ? "..." : "");
        await prisma_default.conversation.update({
          where: { id: req.params.id },
          data: { title: newTitle }
        });
      }
      await prisma_default.aIRequest.create({
        data: {
          userId: userId || "unknown",
          prompt: message,
          response: result.response
        }
      });
      return res.status(200).json({
        success: true,
        data: {
          message: {
            id: assistantMsg.id,
            role: "assistant",
            content: assistantMsg.content,
            suggestions: result.suggestions || [],
            timestamp: assistantMsg.createdAt
          }
        }
      });
    } catch (error) {
      console.error("Send message error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to send message"
      });
    }
  };
};
var ai_controller_default = new AIController();

// src/modules/ai/routes/ai.routes.ts
var router29 = (0, import_express29.Router)();
router29.use(verifyToken);
router29.get("/conversations", ai_controller_default.getConversations);
router29.get("/conversations/:id", ai_controller_default.getConversation);
router29.post("/conversations", ai_controller_default.createConversation);
router29.put("/conversations/:id", ai_controller_default.updateConversation);
router29.delete("/conversations/:id", ai_controller_default.deleteConversation);
router29.post("/conversations/:id/messages", ai_controller_default.sendMessage);
router29.post("/generate-hints", requireLectureOrAdmin, ai_controller_default.generateHints);
router29.post("/chat", ai_controller_default.chat);
var ai_routes_default = router29;

// server.ts
var envPath = import_path.default.join(process.cwd(), ".env");
if (import_fs.default.existsSync(envPath)) {
  const envContent = import_fs.default.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}
console.log("[DEBUG] PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID ? `${process.env.PAYOS_CLIENT_ID.substring(0, 8)}...` : "NOT SET");
console.log("[DEBUG] PAYOS_API_KEY:", process.env.PAYOS_API_KEY ? `${process.env.PAYOS_API_KEY.substring(0, 8)}...` : "NOT SET");
console.log("[DEBUG] PAYOS_CHECKSUM_KEY:", process.env.PAYOS_CHECKSUM_KEY ? `${process.env.PAYOS_CHECKSUM_KEY.substring(0, 8)}...` : "NOT SET");
console.log("[DEBUG] FRONTEND_URL:", process.env.FRONTEND_URL || "NOT SET");
var app = (0, import_express30.default)();
app.use((0, import_cors.default)({
  origin: [
    "http://localhost:5173",
    "http://localhost:8000",
    "http://localhost:8001",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(import_express30.default.json({ limit: "50mb" }));
app.use(import_express30.default.urlencoded({ limit: "50mb", extended: true }));
app.get("/", (req, res) => {
  res.send("CodeFit API running");
});
app.get("/api/health", async (req, res) => {
  try {
    await prisma_default.$queryRaw`SELECT 1`;
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  } catch {
    res.status(503).json({ status: "error", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  }
});
app.post("/api/test-email", async (req, res) => {
  try {
    const { to, userName, courseTitle, lessonTitle } = req.body;
    if (!to) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }
    const lessonUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/lessons/${lessonTitle}`;
    await email_service_default.sendNewLessonNotification(
      to,
      userName || "Test User",
      courseTitle || "Test Course",
      lessonTitle || "Test Lesson",
      lessonUrl
    );
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to send email" });
  }
});
app.use("/api/auth", auth_routes_default);
app.use("/api/submissions", submission_routes_default);
app.use("/api/users", user_routes_default);
app.use("/api/courses", course_routes_default);
app.use("/api/phases", phase_routes_default);
app.use("/api/lessons", lesson_routes_default);
app.use("/api/enrollments", enrollment_routes_default);
app.use("/api/problems", problem_routes_default);
app.use("/api/testcases", testcase_routes_default);
app.use("/api/progress", progress_routes_default);
app.use("/api/lesson-progress", lessonProgress_routes_default);
app.use("/api/notifications", notification_routes_default);
app.use("/api/minitests", minitest_routes_default);
app.use("/api/hackathons", hackathon_routes_default);
app.use("/api/leaderboard", leaderboard_routes_default);
app.use("/api/projects", project_routes_default);
app.use("/api/certificates", certificate_routes_default);
app.use("/api/feedback", feedback_routes_default);
app.use("/api/stats", stats_routes_default);
app.use("/api/upload", upload_routes_default);
app.use("/api/payment", payment_routes_default);
app.use("/api/admin", admin_routes_default);
app.use("/api/lecture", lecture_routes_default);
app.use("/api/lesson-requests", lessonRequest_routes_default);
app.use("/api/lesson-content", lessonContent_routes_default);
app.use("/api/lesson-reviews", lessonReview_routes_default);
app.use("/api/scoring", scoring_routes_default);
app.use("/api/course-access", courseAccess_routes_default);
app.use("/api/ai", ai_routes_default);
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});
var PORT = process.env.PORT || 5e3;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
var server_default = app;
//# sourceMappingURL=server.js.map
