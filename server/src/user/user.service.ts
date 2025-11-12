import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async Create(walletAddress: string) {
    let user = await this.userModel.findOne({ walletAddress });
    if (!user) {
      user = new this.userModel({
        walletAddress,
        nonce: randomBytes(16).toString('hex'), // new random nonce
      });
      await user.save();
    }
    return user;
  }

  async updateNonce(walletAddress: string) {
    const nonce = randomBytes(16).toString('hex');
    return this.userModel.findOneAndUpdate(
      { walletAddress },
      { nonce },
      { new: true }
    );
  }
}
