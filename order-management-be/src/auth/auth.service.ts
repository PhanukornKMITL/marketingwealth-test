import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match!');
        }

        const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
        if (existing) {
            throw new BadRequestException('Username already exists');
        }

        console.log('dto',dto);
        
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.usersRepository.create({ username: dto.username, password: hashed });
        await this.usersRepository.save(user);
        return { message: 'User registered successfully' };
    }

    async login(dto: LoginDto) {
        const user = await this.usersRepository.findOne({ where: { username: dto.username } });
        if (!user) throw new UnauthorizedException({message: 'User not exist'});

        const isMatch = await bcrypt.compare(dto.password, user.password);
        
        if (!isMatch) throw new UnauthorizedException({message: 'Username or Password incorrect'});

        const payload = { sub: user.id, username: user.username };
        return { token: this.jwtService.sign(payload) };
    }
}
