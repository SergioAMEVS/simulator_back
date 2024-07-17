import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreateUser(profile: any): Promise<User> {
    if (!profile) {
      throw new Error('Profile is null');
    }
    const nameID = profile.nameID || 'default';

    let user = await this.userRepository.findOne({ where: { nameID: nameID } });
    if (!user) {
      user = new User();
      user.nameID = nameID;
      user.creation_date = new Date().toISOString();
    } else if (!user.nameID) {
      user.nameID = nameID;
    }

    user = await this.userRepository.save(user);

    return user;
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findUserByNameID(userNameID: string): Promise<User> {
    return this.userRepository.findOne({ where: { nameID: userNameID } });
  }
}
