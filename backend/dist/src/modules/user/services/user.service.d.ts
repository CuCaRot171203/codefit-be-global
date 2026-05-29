/**
 * @fileoverview User Service
 * @description Service xu ly business logic lien quan den User.
 */
import { BaseService } from '../../../base/base.service';
import userRepository from '../repositories/user.repository';
import { UpdateProfileDto, ChangePasswordDto } from '../types';
declare class UserService extends BaseService<typeof userRepository> {
    constructor();
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<any>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map