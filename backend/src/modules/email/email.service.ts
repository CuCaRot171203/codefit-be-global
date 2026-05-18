/**
 * Email Service - Gửi email thông báo
 * Sử dụng nodemailer hoặc dịch vụ email khác
 */

import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      console.log('[EmailService] Initializing transporter...');
      console.log('[EmailService] SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPass: !!process.env.SMTP_PASS
      });
      
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      });
    }
    return this.transporter;
  }

  /**
   * Gửi email thông báo bài học mới cho user
   */
  async sendNewLessonNotification(
    to: string,
    userName: string,
    courseTitle: string,
    lessonTitle: string,
    lessonUrl: string
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${userName},</h2>
        <p>Khóa học <strong>"${courseTitle}"</strong> vừa có bài học mới!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0B3C5D; margin: 0 0 10px 0;">${lessonTitle}</h3>
          <p style="color: #666; margin: 0;">Có bài học mới đang chờ bạn khám phá!</p>
        </div>
        <a href="${lessonUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem bài học
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Bài học mới: ${lessonTitle} - ${courseTitle}`,
        html,
      });
      console.log(`Email sent to ${to} for new lesson: ${lessonTitle}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Không throw error để không ảnh hưởng flow chính
    }
  }

  /**
   * Gửi email thông báo bài học được duyệt cho lecture
   */
  async sendLessonApprovedNotification(
    to: string,
    lectureName: string,
    lessonTitle: string
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${lectureName},</h2>
        <p>Chúc mừng! Bài học của bạn đã được duyệt!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin: 0;">${lessonTitle}</h3>
          <p style="color: #10b981; margin: 10px 0 0 0;">✓ Đã được phê duyệt</p>
        </div>
        <p>Cảm ơn bạn đã đóng góp nội dung cho CodeFit!</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Bài học được duyệt: ${lessonTitle}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  }

  /**
   * Gửi email thông báo bài học bị từ chối cho lecture
   */
  async sendLessonRejectedNotification(
    to: string,
    lectureName: string,
    lessonTitle: string,
    feedback: string
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${lectureName},</h2>
        <p>Bài học của bạn cần được chỉnh sửa thêm.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #dc2626; margin: 0 0 10px 0;">${lessonTitle}</h3>
          <p style="color: #666; margin: 0 0 10px 0;"><strong>Phản hồi từ Admin:</strong></p>
          <p style="color: #333; margin: 0;">${feedback}</p>
        </div>
        <p>Vui lòng chỉnh sửa bài học theo phản hồi và nộp lại.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Bài học cần chỉnh sửa: ${lessonTitle}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send rejection email:', error);
    }
  }

  /**
   * Gửi email thông báo điểm bài tập cho user
   */
  async sendScoreNotification(
    to: string,
    userName: string,
    lessonTitle: string,
    courseTitle: string,
    score: number,
    passedTests: number,
    totalTests: number,
    lessonUrl: string
  ): Promise<void> {
    const percentage = Math.round((passedTests / totalTests) * 100);
    const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${userName},</h2>
        <p>Kết quả bài tập của bạn đã được cập nhật!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin: 0 0 5px 0;">Khóa học: <strong>${courseTitle}</strong></p>
          <h3 style="color: #0B3C5D; margin: 0 0 15px 0;">${lessonTitle}</h3>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: ${scoreColor};">${score}</div>
              <div style="color: #666; font-size: 12px;">Điểm</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: #0B3C5D;">${passedTests}/${totalTests}</div>
              <div style="color: #666; font-size: 12px;">Test passed (${percentage}%)</div>
            </div>
          </div>
        </div>
        <a href="${lessonUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem chi tiết
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Kết quả bài tập: ${lessonTitle} - ${score} điểm`,
        html,
      });
      console.log(`Score email sent to ${to} for lesson: ${lessonTitle}`);
    } catch (error) {
      console.error('Failed to send score email:', error);
    }
  }

  /**
   * Gửi email thông báo được cấp quyền truy cập khóa học
   */
  async sendCourseAccessGrantedNotification(
    to: string,
    userName: string,
    courseTitle: string,
    courseUrl?: string
  ): Promise<void> {
    const cUrl = courseUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${userName},</h2>
        <p>Chúc mừng! Bạn đã được cấp quyền truy cập khóa học!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin: 0;">${courseTitle}</h3>
          <p style="color: #666; margin: 10px 0 0 0;">✓ Bạn có thể bắt đầu học ngay</p>
        </div>
        <a href="${cUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
          Bắt đầu học ngay
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Bạn được cấp quyền truy cập: ${courseTitle}`,
        html,
      });
      console.log(`Course access granted email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send course access email:', error);
    }
  }

  /**
   * Gửi email kèm mã kích hoạt khóa học
   */
  async sendCourseAccessWithCode(
    to: string,
    userName: string,
    courseTitle: string,
    activationCode: string,
    courseUrl?: string
  ): Promise<void> {
    const cUrl = courseUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${userName},</h2>
        <p>Chúc mừng! Bạn đã được cấp quyền truy cập khóa học!</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin: 0;">${courseTitle}</h3>
          <p style="color: #666; margin: 10px 0 0 0;">✓ Bạn có thể bắt đầu học ngay</p>
        </div>
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #f59e0b;">
          <p style="color: #666; margin: 0 0 5px 0; font-size: 12px;">Mã kích hoạt của bạn:</p>
          <p style="color: #0B3C5D; font-size: 20px; font-weight: bold; margin: 0; letter-spacing: 2px; font-family: monospace;">${activationCode}</p>
        </div>
        <p style="color: #666; margin: 0 0 20px 0;">Sử dụng mã trên để kích hoạt khóa học hoặc bấm nút bên dưới:</p>
        <a href="${cUrl}" style="display: inline-block; background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
          Kích hoạt ngay
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Mã kích hoạt khóa học: ${courseTitle}`,
        html,
      });
      console.log(`Course access with code email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send course access with code email:', error);
    }
  }

  /**
   * Gửi email nhắc nhở hackathon sắp bắt đầu
   */
  async sendHackathonReminder(
    to: string,
    userName: string,
    hackathonTitle: string,
    startTime: Date,
    hackathonUrl?: string
  ): Promise<void> {
    const hUrl = hackathonUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/hackathon`;
    const startDate = new Date(startTime);
    const formattedDate = startDate.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${userName},</h2>
        <p>Cuộc thi hackathon bạn đã đăng ký sắp bắt đầu!</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #0B3C5D; margin: 0 0 10px 0;">${hackathonTitle}</h3>
          <p style="color: #666; margin: 0;"><strong>Thời gian bắt đầu:</strong> ${formattedDate}</p>
        </div>
        <p style="color: #666; margin: 0 0 20px 0;">Hãy chuẩn bị sẵn sàng và tham gia ngay khi cuộc thi bắt đầu!</p>
        <a href="${hUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem chi tiết cuộc thi
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `[Nhắc nhở] "${hackathonTitle}" sắp bắt đầu!`,
        html,
      });
      console.log(`Hackathon reminder email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send hackathon reminder email:', error);
    }
  }

  /**
   * Gửi email xác nhận đã đăng ký hackathon
   */
  async sendHackathonJoined(
    to: string,
    userName: string,
    hackathonTitle: string,
    hackathonUrl?: string
  ): Promise<void> {
    const hUrl = hackathonUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/hackathon`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B3C5D;">Xin chào ${userName},</h2>
        <p>Bạn đã đăng ký tham gia hackathon thành công!</p>
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="color: #10b981; margin: 0 0 10px 0;">✓ ${hackathonTitle}</h3>
          <p style="color: #666; margin: 0;">Bạn đã đăng ký thành công. Chúc bạn có một cuộc thi thú vị!</p>
        </div>
        <a href="${hUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Xem cuộc thi
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Email này được gửi tự động từ CodeFit. Vui lòng không trả lời email này.
        </p>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `Đăng ký thành công: ${hackathonTitle}`,
        html,
      });
      console.log(`Hackathon joined email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send hackathon joined email:', error);
    }
  }

  async sendProjectSubmittedEmail(
    to: string,
    userName: string,
    projectTitle: string,
    courseTitle: string,
    projectUrl: string
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0B3C5D 0%, #1e40af 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📦 Dự án đã được nộp!</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0 0;">Chúng tôi đã nhận được bài nộp của bạn</p>
        </div>

        <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0B3C5D; margin: 0 0 20px 0;">Xin chào ${userName},</h2>

          <p style="color: #374151; line-height: 1.6;">Chúc mừng bạn đã hoàn thành khóa học! Dự án của bạn đã được ghi nhận.</p>

          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">📁 ${projectTitle}</h3>
            <p style="color: #78350f; margin: 0; font-size: 14px;">Khóa học: <strong>${courseTitle}</strong></p>
          </div>

          <p style="color: #374151; line-height: 1.6;">Giảng viên sẽ chấm điểm và phản hồi trong thời gian sớm nhất. Bạn sẽ nhận được thông báo khi có kết quả.</p>

          <a href="${projectUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 24px 0;">
            Xem chi tiết bài nộp
          </a>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Email này được gửi tự động từ <strong>CodeFit</strong>.<br/>
            Cảm ơn bạn đã tham gia học tập cùng chúng tôi!
          </p>
        </div>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `📦 Đã nhận bài nộp: ${projectTitle}`,
        html,
      });
      console.log(`Project submitted email sent to ${to} for project: ${projectTitle}`);
    } catch (error) {
      console.error('Failed to send project submitted email:', error);
    }
  }

  /**
   * Gửi email chứng chỉ hoàn thành khóa học
   */
  async sendCertificateEmail(
    to: string,
    userName: string,
    courseTitle: string,
    certificateUrl: string,
    certificateId: string
  ): Promise<void> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificateId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0B3C5D 0%, #1e40af 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 Chúc mừng bạn!</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0 0;">Bạn đã hoàn thành khóa học</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0B3C5D; margin: 0 0 20px 0;">Xin chào ${userName},</h2>
          
          <p style="color: #374151; line-height: 1.6;">Chúc mừng bạn đã hoàn thành xuất sắc khóa học!</p>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 18px;">📜 Chứng chỉ hoàn thành</h3>
            <p style="color: #78350f; margin: 0; font-size: 16px; font-weight: bold;">${courseTitle}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">Chứng chỉ của bạn đã được phát hành và có giá trị vĩnh viễn. Bạn có thể:</p>
          
          <div style="margin: 24px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
              🔗 Xem & Chia sẻ chứng chỉ
            </a>
          </div>
          
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              <strong>Mã xác thực:</strong> ${certificateId.substring(0, 8).toUpperCase()}<br/>
              <strong>Link xác thực:</strong> <a href="${verifyUrl}" style="color: #3b82f6;">${verifyUrl}</a>
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">Chứng chỉ này có thể được xác minh bởi bất kỳ ai thông qua link trên. Hãy chia sẻ thành tích của bạn trên LinkedIn hoặc CV!</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Email này được gửi tự động từ <strong>CodeFit</strong>.<br/>
            Cảm ơn bạn đã tham gia học tập cùng chúng tôi!
          </p>
        </div>
      </div>
    `;

    try {
      await this.getTransporter().sendMail({
        from: process.env.SMTP_FROM || 'CodeFit <noreply@codefit.edu.vn>',
        to,
        subject: `🎓 Chứng chỉ hoàn thành: ${courseTitle}`,
        html,
      });
      console.log(`Certificate email sent to ${to} for course: ${courseTitle}`);
    } catch (error) {
      console.error('Failed to send certificate email:', error);
    }
  }
}

export default new EmailService();
