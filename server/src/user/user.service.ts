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
    const lowerCaseWallet = wallet.toLowerCase();

    try {
      // 1. TRY TO FIND THE USER
      let user = await this.userModel.findOne({ walletAddress: lowerCaseWallet }).exec();

      if (!user) {
        // 2. USER NOT FOUND: Create the new user ("sign-up")
        user = await this.userModel.create({
          walletAddress: lowerCaseWallet,
          username: 'Klaimit User',
        });
      }

      // 3. Return a simple nonce (in production, you'd want to store and manage this properly)
      return generateNonce();
      
    } catch (error) {
      // Catch any database or save errors (e.g., connection issues)
      console.error('Database error during nonce generation:', error);
      
      // Throw a standard NestJS exception for the controller to handle
      throw new InternalServerErrorException('Could not process user request due to a server error.');
    }
  }

  async findUserById(id: string) {
    // Use lean() for faster read-only access
    return this.userModel.findById(id).lean().exec(); 
  }

  async findUserByWallet(wallet: string): Promise<User | null> {
    const lowerCaseWallet = wallet.toLowerCase();
    return this.userModel.findOne({ walletAddress: lowerCaseWallet }).exec();
  }

  async syncWallet(walletAddress: string): Promise<any> {
    if (!walletAddress || walletAddress.trim() === '') {
      return { success: true, message: 'Wallet disconnected' };
    }

    const lowerCaseWallet = walletAddress.toLowerCase();
    
    try {
      let user = await this.userModel.findOne({ walletAddress: lowerCaseWallet }).exec();

      if (!user) {
        // Create new user
        user = await this.userModel.create({
          walletAddress: lowerCaseWallet,
          username: 'Klaimit User',
        });
      }

      return {
        success: true,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
        },
      };
    } catch (error) {
      console.error('Error syncing wallet:', error);
      throw new InternalServerErrorException('Failed to sync wallet');
    }
  }

  async createUser(username: string, walletAddress: string): Promise<any> {
    const lowerCaseWallet = walletAddress.toLowerCase();
    
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ walletAddress: lowerCaseWallet }).exec();
      if (existingUser) {
        throw new InternalServerErrorException('User already exists with this wallet');
      }

      // Create new user
      const user = await this.userModel.create({
        walletAddress: lowerCaseWallet,
        username: username || 'Klaimit User',
      });

      return {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
        },
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async loginUser(username: string, walletAddress: string): Promise<any> {
    const lowerCaseWallet = walletAddress.toLowerCase();
    
    try {
      const user = await this.userModel.findOne({ walletAddress: lowerCaseWallet }).exec();
      
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }

      // Update username if provided
      if (username && username !== user.username) {
        user.username = username;
        await user.save();
      }

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
        },
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw new InternalServerErrorException('Failed to login user');
    }
  }
}
