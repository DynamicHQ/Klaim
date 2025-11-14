import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as crypto from 'crypto';

// Helper function to generate a secure, unique nonce
const generateNonce = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

async findOrCreateAndSetNonce(wallet: string): Promise<string> {
    const newNonce = generateNonce();
    const lowerCaseWallet = wallet.toLowerCase();

    try {
      // 1. TRY TO FIND THE USER
      let user = await this.userModel.findOne({ wallet: lowerCaseWallet }).exec();

      if (user) {
        // 2a. USER FOUND: Update the existing user's nonce
        user.nonce = newNonce;
        await user.save();
      } else {
        // 2b. USER NOT FOUND: Create the new user ("sign-up")
        user = await this.userModel.create({
          wallet: lowerCaseWallet,
          nonce: newNonce,
          profileName: 'Klaimit User',
        });
      }

      // 3. Return the new nonce
      return user.nonce;
      
    } catch (error) {
      // Catch any database or save errors (e.g., connection issues)
      console.error('Database error during nonce generation:', error);
      
      // Throw a standard NestJS exception for the controller to handle
      throw new InternalServerErrorException('Could not process user request due to a server error.');
    }
  }

  // async updateNonce(walletAddress: string) {
  //   const nonce = randomBytes(16).toString('hex');
  //   return this.userModel.findOneAndUpdate(
  //     { walletAddress },
  //     { nonce },
  //     { new: true }
  //   );
  // }]

async findUserById(id: string) {
    return this.userModel.findById(id).lean().exec(); 
    }
  
}
